import { formatBibliographyEntries, formatBibliographyEntry } from './csl';

describe('formatBibliographyEntry', () => {
	it('formats book citations in Chicago notes-bibliography style by default', async () => {
		expect(
			await formatBibliographyEntry({
				type: 'book',
				title: 'The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today',
				publisher: 'University of Chicago Press',
				issued: {
					'date-parts': [[2022]],
				},
				author: [
					{
						given: 'Amy J.',
						family: 'Binder',
					},
					{
						given: 'Jeffrey L.',
						family: 'Kidder',
					},
				],
			})
		).toBe(
			'Binder, Amy J., and Jeffrey L. Kidder. The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today. University of Chicago Press, 2022.'
		);
	});

	it('formats book citations in Chicago author-date style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'book',
					title: 'The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today',
					publisher: 'University of Chicago Press',
					issued: {
						'date-parts': [[2022]],
					},
					author: [
						{
							given: 'Amy J.',
							family: 'Binder',
						},
						{
							given: 'Jeffrey L.',
							family: 'Kidder',
						},
					],
				},
				'chicago-author-date'
			)
		).toBe(
			'Binder, Amy J., and Jeffrey L. Kidder. 2022. The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today. University of Chicago Press.'
		);
	});

	it('formats journal citations in Chicago author-date style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'article-journal',
					title: 'Learning Blocks',
					'container-title': 'Journal of WordPress Studies',
					volume: '12',
					issue: '3',
					page: '117-134',
					DOI: '10.1234/example-doi',
					issued: {
						'date-parts': [[2024]],
					},
					author: [
						{
							given: 'Ada',
							family: 'Smith',
						},
					],
				},
				'chicago-author-date'
			)
		).toBe(
			'Smith, Ada. 2024. “Learning Blocks.” Journal of WordPress Studies 12 (3): 117–34. https://doi.org/10.1234/example-doi.'
		);
	});

	it('formats cleaned review records in Chicago author-date style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'article-journal',
					title: 'Amy J. Binder and Jeffrey L. Kidder. The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today',
					'container-title': 'Administrative Science Quarterly',
					volume: '71',
					issue: '1',
					DOI: '10.1177/00018392251368878',
					issued: {
						'date-parts': [[2025]],
					},
					author: [
						{
							given: 'Brayden G',
							family: 'King',
						},
					],
				},
				'chicago-author-date'
			)
		).toBe(
			'King, Brayden G. 2025. “Amy J. Binder and Jeffrey L. Kidder. The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today.” Administrative Science Quarterly 71 (1). https://doi.org/10.1177/00018392251368878.'
		);
	});

	it('formats book review citations in Chicago notes-bibliography style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'review-book',
					title: 'The Muchness of Madonna',
					'reviewed-title': 'Madonna: A Rebel Life',
					'reviewed-author': [
						{
							given: 'Mary',
							family: 'Gabriel',
						},
					],
					'container-title': 'New York Times',
					issued: {
						'date-parts': [[2023, 10, 8]],
					},
					author: [
						{
							given: 'Alexandra',
							family: 'Jacobs',
						},
					],
				},
				'chicago-notes-bibliography'
			)
		).toBe(
			'Jacobs, Alexandra. “The Muchness of Madonna.” Review of Madonna: A Rebel Life, by Mary Gabriel. New York Times, October 8, 2023.'
		);
	});

	it('formats chapter citations in Chicago author-date style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'chapter',
					title: 'The Queen Mary Psalter',
					'container-title':
						'The Book by Design: The Remarkable Story of the World’s Greatest Invention',
					publisher: 'University of Chicago Press',
					issued: {
						'date-parts': [[2023]],
					},
					author: [
						{
							given: 'Kathleen',
							family: 'Doyle',
						},
					],
					editor: [
						{
							given: 'P. J. M.',
							family: 'Marks',
						},
						{
							given: 'Stephen',
							family: 'Parkin',
						},
					],
				},
				'chicago-author-date'
			)
		).toBe(
			'Doyle, Kathleen. 2023. “The Queen Mary Psalter.” In The Book by Design: The Remarkable Story of the World’s Greatest Invention, edited by P. J. M. Marks and Stephen Parkin. University of Chicago Press.'
		);
	});

	it('formats chapter citations in Chicago notes-bibliography style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'chapter',
					title: 'The Queen Mary Psalter',
					'container-title':
						'The Book by Design: The Remarkable Story of the World’s Greatest Invention',
					publisher: 'University of Chicago Press',
					issued: {
						'date-parts': [[2023]],
					},
					author: [
						{
							given: 'Kathleen',
							family: 'Doyle',
						},
					],
					editor: [
						{
							given: 'P. J. M.',
							family: 'Marks',
						},
						{
							given: 'Stephen',
							family: 'Parkin',
						},
					],
				},
				'chicago-notes-bibliography'
			)
		).toBe(
			'Doyle, Kathleen. “The Queen Mary Psalter.” In The Book by Design: The Remarkable Story of the World’s Greatest Invention, edited by P. J. M. Marks and Stephen Parkin. University of Chicago Press, 2023.'
		);
	});

	it('formats edited books in Chicago notes-bibliography style with editors as the lead names', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'collection',
					title: 'The Book by Design: The Remarkable Story of the World’s Greatest Invention',
					publisher: 'University of Chicago Press',
					issued: {
						'date-parts': [[2023]],
					},
					editor: [
						{
							given: 'P. J. M.',
							family: 'Marks',
						},
						{
							given: 'Stephen',
							family: 'Parkin',
						},
					],
				},
				'chicago-notes-bibliography'
			)
		).toBe(
			'Marks, P. J. M., and Stephen Parkin, eds. The Book by Design: The Remarkable Story of the World’s Greatest Invention. University of Chicago Press, 2023.'
		);
	});

	it('does not label low-information journal-like heuristics as preprints in Chicago notes-bibliography style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'article-journal',
					title: 'the true about tree',
					volume: '322',
					page: '891–921',
					issued: {
						'date-parts': [[1905]],
					},
					author: [
						{
							given: 'A.',
							family: 'Einstein',
						},
					],
				},
				'chicago-notes-bibliography'
			)
		).not.toMatch(/preprint/iu);
	});

	it('preserves et al. without inserting "and" before it', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'article-journal',
					title: 'Extant Life Detection Using Label-Free Video Microscopy in Analog Aquatic Environments',
					'container-title': 'PLOS ONE',
					volume: '20',
					issue: '3',
					page: 'e0318239',
					DOI: '10.1371/journal.pone.0318239',
					issued: {
						'date-parts': [[2025]],
					},
					author: [
						{
							given: 'Carl D',
							family: 'Snyder',
						},
						{
							given: 'Manuel',
							family: 'Bedrossian',
						},
						{
							given: 'Casey',
							family: 'Barr',
						},
						{
							literal: 'et al.',
						},
					],
				},
				'chicago-notes-bibliography'
			)
		).toContain('Snyder, Carl D., Manuel Bedrossian, Casey Barr, et al.');
	});
});

describe('additional citation styles', () => {
	it('formats journal citations in Harvard style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'article-journal',
					title: 'Learning Blocks',
					'container-title': 'Journal of WordPress Studies',
					volume: '12',
					issue: '3',
					page: '117-134',
					DOI: '10.1234/example-doi',
					issued: {
						'date-parts': [[2024]],
					},
					author: [
						{
							given: 'Ada',
							family: 'Smith',
						},
					],
				},
				'harvard'
			)
		).toBe(
			'Smith, A. (2024) “Learning Blocks,” Journal of WordPress Studies, 12(3), pp. 117–134. doi:10.1234/example-doi.'
		);
	});

	it('formats journal citations in IEEE style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'article-journal',
					title: 'Learning Blocks',
					'container-title': 'Journal of WordPress Studies',
					volume: '12',
					issue: '3',
					page: '117-134',
					DOI: '10.1234/example-doi',
					issued: {
						'date-parts': [[2024]],
					},
					author: [
						{
							given: 'Ada',
							family: 'Smith',
						},
					],
				},
				'ieee'
			)
		).toBe(
			'A. Smith, “Learning Blocks,” Journal of WordPress Studies, vol. 12, no. 3, pp. 117–134, 2024, doi: 10.1234/example-doi.'
		);
	});

	it('formats journal citations in Vancouver style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'article-journal',
					title: 'Learning Blocks',
					'container-title': 'Journal of WordPress Studies',
					volume: '12',
					issue: '3',
					page: '117-134',
					issued: {
						'date-parts': [[2024]],
					},
					author: [
						{
							given: 'Ada',
							family: 'Smith',
						},
					],
				},
				'vancouver'
			)
		).toBe(
			'Smith A. Learning Blocks. Journal of WordPress Studies. 2024;12(3):117–34.'
		);
	});

	it('formats book citations in MLA 9 style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'book',
					title: "The War Comes Home: Washington's Battle against America's Veterans",
					publisher: 'University of California Press',
					issued: {
						'date-parts': [[2009]],
					},
					author: [
						{
							given: 'Alexandra',
							family: 'Glantz',
						},
					],
				},
				'mla-9'
			)
		).toBe(
			'Glantz, Alexandra. The War Comes Home: Washington’s Battle against America’s Veterans. University of California Press, 2009.'
		);
	});

	it('formats book citations in OSCOLA style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'book',
					title: 'The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today',
					publisher: 'University of Chicago Press',
					issued: {
						'date-parts': [[2022]],
					},
					author: [
						{
							given: 'Amy J.',
							family: 'Binder',
						},
						{
							given: 'Jeffrey L.',
							family: 'Kidder',
						},
					],
				},
				'oscola'
			)
		).toBe(
			'Binder AJ and Kidder JL, The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today (University of Chicago Press 2022)'
		);
	});

	it('formats webpage citations in OSCOLA style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'webpage',
					title: 'Responses API',
					URL: 'https://platform.openai.com/docs/api-reference/responses',
					accessed: {
						'date-parts': [[2026, 4, 5]],
					},
					author: [
						{
							literal: 'OpenAI',
						},
					],
				},
				'oscola'
			)
		).toBe(
			'OpenAI, “Responses API” <https://platform.openai.com/docs/api-reference/responses> accessed April 5, 2026'
		);
	});

	it('formats book citations in ABNT style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'book',
					title: 'The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today',
					publisher: 'University of Chicago Press',
					issued: {
						'date-parts': [[2022]],
					},
					author: [
						{
							given: 'Amy J.',
							family: 'Binder',
						},
						{
							given: 'Jeffrey L.',
							family: 'Kidder',
						},
					],
				},
				'abnt'
			)
		).toBe(
			'BINDER, Amy J.; KIDDER, Jeffrey L. The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today. [S.l.]: University of Chicago Press, 2022.'
		);
	});

	it('formats webpage citations in ABNT style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'webpage',
					title: 'Responses API',
					URL: 'https://platform.openai.com/docs/api-reference/responses',
					accessed: {
						'date-parts': [[2026, 4, 5]],
					},
					author: [
						{
							literal: 'OpenAI',
						},
					],
				},
				'abnt'
			)
		).toBe(
			'OPENAI. Responses API. Disponível em: <https://platform.openai.com/docs/api-reference/responses>. Acesso em: 5 abr. 2026.'
		);
	});

	it('normalizes duplicated volume, issue, and page labels in ABNT style', async () => {
		expect(
			await formatBibliographyEntry(
				{
					type: 'article-journal',
					title: 'Learning Blocks',
					'container-title': 'Journal of WordPress Studies',
					volume: '12',
					issue: '3',
					page: '117-134',
					issued: {
						'date-parts': [[2024]],
					},
					author: [
						{
							given: 'Ada',
							family: 'Smith',
						},
					],
				},
				'abnt'
			)
		).toBe(
			'SMITH, Ada. Learning Blocks. Journal of WordPress Studies, v. 12, n. 3, p. 117-134, 2024.'
		);
	});

	it('formats batches while preserving duplicate results and order', async () => {
		const cslItems = [
			{
				type: 'book',
				title: 'Duplicate Example',
				publisher: 'Example Press',
				issued: {
					'date-parts': [[2024]],
				},
				author: [
					{
						given: 'Ada',
						family: 'Smith',
					},
				],
			},
			{
				type: 'book',
				title: 'Unique Example',
				publisher: 'Example Press',
				issued: {
					'date-parts': [[2025]],
				},
				author: [
					{
						given: 'Grace',
						family: 'Hopper',
					},
				],
			},
			{
				type: 'book',
				title: 'Duplicate Example',
				publisher: 'Example Press',
				issued: {
					'date-parts': [[2024]],
				},
				author: [
					{
						given: 'Ada',
						family: 'Smith',
					},
				],
			},
		];

		expect(
			await formatBibliographyEntries(
				cslItems,
				'chicago-notes-bibliography'
			)
		).toEqual([
			'Smith, Ada. Duplicate Example. Example Press, 2024.',
			'Hopper, Grace. Unique Example. Example Press, 2025.',
			'Smith, Ada. Duplicate Example. Example Press, 2024.',
		]);
	});
});
