describe('formatting runtime behavior', () => {
	afterEach(() => {
		jest.resetModules();
		jest.restoreAllMocks();
	});

	function loadFormattingModule(mockCite) {
		const add = jest.fn();
		const has = jest.fn(() => true);

		jest.doMock('@citation-js/core', () => ({
			Cite: mockCite,
			plugins: {
				config: {
					get: () => ({
						templates: {
							has,
							add,
						},
					}),
				},
			},
		}));
		jest.doMock('@citation-js/plugin-csl', () => ({}));

		let formattingModule;
		jest.isolateModules(() => {
			formattingModule = require('./csl');
		});

		return formattingModule;
	}

	it('falls back to raw title and continues the batch when citation-js throws', async () => {
		const mockCite = jest
			.fn()
			.mockImplementationOnce(() => ({
				format: () => 'Alpha formatted',
			}))
			.mockImplementationOnce(() => {
				throw new Error('citeproc failed');
			});
		const warnSpy = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => {});
		const { formatBibliographyEntries } = loadFormattingModule(mockCite);

		const results = await formatBibliographyEntries(
			[
				{
					type: 'book',
					title: 'Alpha title',
				},
				{
					type: 'book',
					title: 'Broken title',
				},
			],
			'apa-7'
		);

		expect(results).toEqual(['Alpha formatted', 'Broken title']);
		expect(warnSpy).toHaveBeenCalled();
	});

	it('uses a stable cache key for equivalent CSL objects with different key order', async () => {
		const mockCite = jest.fn().mockImplementation(() => ({
			format: () => 'Stable cache output',
		}));
		const { clearFormattingCache, formatBibliographyEntry } =
			loadFormattingModule(mockCite);

		clearFormattingCache();
		await formatBibliographyEntry(
			{
				type: 'book',
				title: 'Stable object',
				issued: { 'date-parts': [[2024]] },
			},
			'apa-7'
		);
		await formatBibliographyEntry(
			{
				issued: { 'date-parts': [[2024]] },
				title: 'Stable object',
				type: 'book',
			},
			'apa-7'
		);

		expect(mockCite).toHaveBeenCalledTimes(1);
	});

	it('evicts the oldest cache entry instead of clearing the entire cache', async () => {
		const mockCite = jest.fn().mockImplementation((csl) => ({
			format: () => csl.title,
		}));
		const { clearFormattingCache, formatBibliographyEntry } =
			loadFormattingModule(mockCite);

		clearFormattingCache();

		for (let index = 0; index < 501; index += 1) {
			await formatBibliographyEntry(
				{
					type: 'book',
					title: `Title ${index}`,
				},
				'apa-7'
			);
		}

		expect(mockCite).toHaveBeenCalledTimes(501);

		await formatBibliographyEntry(
			{
				type: 'book',
				title: 'Title 500',
			},
			'apa-7'
		);

		expect(mockCite).toHaveBeenCalledTimes(501);
	});

	it('uses the style locale when formatting ABNT citations', async () => {
		const formatSpy = jest.fn(() => 'ABNT output');
		const mockCite = jest.fn().mockImplementation(() => ({
			format: formatSpy,
		}));
		const { formatBibliographyEntry } = loadFormattingModule(mockCite);

		await formatBibliographyEntry(
			{
				type: 'book',
				title: 'Referências',
			},
			'abnt'
		);

		expect(formatSpy).toHaveBeenCalledWith(
			'bibliography',
			expect.objectContaining({
				lang: 'pt-BR',
				template: 'abnt',
			})
		);
	});
});
