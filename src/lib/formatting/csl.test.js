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

	it('returns an empty batch without calling the formatter endpoint', async () => {
		await expect(
			formatBibliographyEntries([], 'chicago-author-date')
		).resolves.toEqual([]);

		expect(fetch).not.toHaveBeenCalled();
	});

	it('uses the default REST root and omits the nonce when API settings are absent', async () => {
		delete window.wpApiSettings;
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({
					entries: [{ index: 0, text: 'Default root formatted' }],
				}),
		});

		await expect(
			formatBibliographyEntry(
				{ type: 'book', title: 'Default Root' },
				'apa-7'
			)
		).resolves.toBe('Default root formatted');

		expect(fetch).toHaveBeenCalledWith(
			'/wp-json/bibliography/v1/format',
			expect.objectContaining({
				headers: {
					'Content-Type': 'application/json',
				},
			})
		);
	});

	it('deduplicates equivalent uncached CSL items within a single formatter request', async () => {
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({
					entries: [{ index: 0, text: 'Shared formatted' }],
				}),
		});

		const results = await formatBibliographyEntries(
			[
				{
					type: 'book',
					title: 'Shared',
					issued: { 'date-parts': [[2024]] },
				},
				{
					issued: { 'date-parts': [[2024]] },
					title: 'Shared',
					type: 'book',
				},
			],
			'apa-7'
		);

		expect(results).toEqual(['Shared formatted', 'Shared formatted']);
		expect(JSON.parse(fetch.mock.calls[0][1].body).cslItems).toHaveLength(
			1
		);
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

	it('falls back to inert title text when fetch is unavailable', async () => {
		const warnSpy = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => {});
		delete global.fetch;

		await expect(
			formatBibliographyEntry(
				{ type: 'book', title: 'Fetchless fallback' },
				'apa-7'
			)
		).resolves.toBe('Fetchless fallback');

		expect(warnSpy).toHaveBeenCalled();
	});

	it('falls back when the formatter response does not include an entries array', async () => {
		const warnSpy = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => {});
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ entries: null }),
		});

		await expect(
			formatBibliographyEntry(
				{
					type: 'article-journal',
					'container-title': 'Fallback Journal',
				},
				'apa-7'
			)
		).resolves.toBe('Fallback Journal');

		expect(warnSpy).toHaveBeenCalled();
	});
});
