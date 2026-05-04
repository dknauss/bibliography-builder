import { clearFormattingCache, formatBibliographyEntry } from './csl';

describe('formatting runtime cache behavior', () => {
	beforeEach(() => {
		clearFormattingCache();
		window.wpApiSettings = { root: '/wp-json/' };
		global.fetch = jest.fn(({ body } = {}) => {
			const parsed = body ? JSON.parse(body) : { cslItems: [] };
			return Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve({
						entries: parsed.cslItems.map((item, index) => ({
							index,
							text: item.title,
						})),
					}),
			});
		});
	});

	afterEach(() => {
		delete window.wpApiSettings;
		delete global.fetch;
	});

	it('evicts the least recently used cache entry instead of clearing the entire cache', async () => {
		for (let index = 0; index < 500; index += 1) {
			await formatBibliographyEntry(
				{
					type: 'book',
					title: `Title ${index}`,
				},
				'apa-7'
			);
		}

		expect(fetch).toHaveBeenCalledTimes(500);

		await formatBibliographyEntry(
			{
				type: 'book',
				title: 'Title 0',
			},
			'apa-7'
		);

		expect(fetch).toHaveBeenCalledTimes(500);

		await formatBibliographyEntry(
			{
				type: 'book',
				title: 'Title 500',
			},
			'apa-7'
		);

		expect(fetch).toHaveBeenCalledTimes(501);

		await formatBibliographyEntry(
			{
				type: 'book',
				title: 'Title 0',
			},
			'apa-7'
		);
		await formatBibliographyEntry(
			{
				type: 'book',
				title: 'Title 1',
			},
			'apa-7'
		);

		expect(fetch).toHaveBeenCalledTimes(502);
	});
});
