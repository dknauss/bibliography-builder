import {
	clearFormattingCache,
	formatBibliographyEntries,
	formatBibliographyEntry,
} from './csl';

describe('REST-backed citation formatting', () => {
	beforeEach(() => {
		clearFormattingCache();
		window.wpApiSettings = {
			root: 'https://example.test/wp-json/',
			nonce: 'nonce-123',
		};
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve({
						entries: [
							{ index: 0, text: 'Alpha formatted' },
							{ index: 1, text: 'Beta formatted' },
						],
					}),
			})
		);
	});

	afterEach(() => {
		delete window.wpApiSettings;
		delete global.fetch;
		jest.restoreAllMocks();
	});

	it('formats a batch through the local WordPress REST formatter endpoint', async () => {
		const results = await formatBibliographyEntries(
			[
				{ type: 'book', title: 'Alpha' },
				{ type: 'book', title: 'Beta' },
			],
			'chicago-author-date'
		);

		expect(results).toEqual(['Alpha formatted', 'Beta formatted']);
		expect(fetch).toHaveBeenCalledWith(
			'https://example.test/wp-json/bibliography/v1/format',
			expect.objectContaining({
				method: 'POST',
				credentials: 'same-origin',
				headers: expect.objectContaining({
					'Content-Type': 'application/json',
					'X-WP-Nonce': 'nonce-123',
				}),
			})
		);
		expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
			style: 'chicago-author-date',
			cslItems: [
				{ type: 'book', title: 'Alpha' },
				{ type: 'book', title: 'Beta' },
			],
		});
	});

	it('formats a single entry through the same batch boundary', async () => {
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({
					entries: [{ index: 0, text: 'Single formatted' }],
				}),
		});

		await expect(
			formatBibliographyEntry({ type: 'book', title: 'Single' }, 'apa-7')
		).resolves.toBe('Single formatted');
	});

	it('caches equivalent CSL objects with stable key order', async () => {
		global.fetch.mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					entries: [{ index: 0, text: 'Cached formatted' }],
				}),
		});

		await formatBibliographyEntry(
			{
				type: 'book',
				title: 'Stable',
				issued: { 'date-parts': [[2024]] },
			},
			'apa-7'
		);
		await formatBibliographyEntry(
			{
				issued: { 'date-parts': [[2024]] },
				title: 'Stable',
				type: 'book',
			},
			'apa-7'
		);

		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it('falls back to inert title text if the formatter request fails', async () => {
		const warnSpy = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => {});
		const onFallback = jest.fn();
		global.fetch.mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: () => Promise.resolve({}),
		});

		await expect(
			formatBibliographyEntries(
				[
					{ type: 'book', title: 'Fallback title' },
					{ type: 'book', 'container-title': 'Fallback container' },
				],
				'apa-7',
				{ onFallback }
			)
		).resolves.toEqual(['Fallback title', 'Fallback container']);
		expect(warnSpy).toHaveBeenCalled();
		expect(onFallback).toHaveBeenCalledWith(expect.any(Error));
	});
});
