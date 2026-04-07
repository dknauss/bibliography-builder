import { parseFreeTextCitation } from './free-text-parser';

describe('parseFreeTextCitation', () => {
	it('returns null for empty or whitespace-only input', () => {
		expect(parseFreeTextCitation('')).toBeNull();
		expect(parseFreeTextCitation('   \n\t')).toBeNull();
	});

	it('parses supported free-text book citations into CSL-JSON', () => {
		const citation = parseFreeTextCitation(
			'Amy J. Binder and Jeffrey L. Kidder, The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today (University of Chicago Press, 2022), 117–18.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'book',
				title: 'The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today',
				publisher: 'University of Chicago Press',
				issued: {
					'date-parts': [[2022]],
				},
				page: '117–18',
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
			confidence: 'medium',
		});
	});

	it('parses sentence-style book citations with publisher and year', () => {
		const citation = parseFreeTextCitation(
			'Binder, Amy J., and Jeffrey L. Kidder. The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today. University of Chicago Press, 2022.'
		);

		expect(citation).toEqual({
			csl: {
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
			confidence: 'medium',
		});
	});

	it('parses supported free-text journal article citations into CSL-JSON', () => {
		const citation = parseFreeTextCitation(
			'Ada Smith, "Learning Blocks," Journal of WordPress Studies 12, no. 3 (2024): 117-134. https://doi.org/10.1234/example-doi'
		);

		expect(citation).toEqual({
			csl: {
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
			confidence: 'medium',
		});
	});

	it('parses sentence-style Chicago journal citations with inverted first author and inline DOI', () => {
		const citation = parseFreeTextCitation(
			'Dittmar, Emily L., and Douglas W. Schemske. “Temporal Variation in Selection Influences Microgeographic Local Adaptation.” American Naturalist 202, no. 4 (2023): 471–85. https://doi.org/10.1086/725865.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'article-journal',
				title: 'Temporal Variation in Selection Influences Microgeographic Local Adaptation',
				'container-title': 'American Naturalist',
				volume: '202',
				issue: '4',
				page: '471–85',
				DOI: '10.1086/725865',
				issued: {
					'date-parts': [[2023]],
				},
				author: [
					{
						given: 'Emily L.',
						family: 'Dittmar',
					},
					{
						given: 'Douglas W.',
						family: 'Schemske',
					},
				],
			},
			confidence: 'medium',
		});
	});

	it('parses sentence-style Chicago journal citations without a DOI', () => {
		const citation = parseFreeTextCitation(
			'Dittmar, Emily L., and Douglas W. Schemske. “Temporal Variation in Selection Influences Microgeographic Local Adaptation.” American Naturalist 202, no. 4 (2023): 471–85.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'article-journal',
				title: 'Temporal Variation in Selection Influences Microgeographic Local Adaptation',
				'container-title': 'American Naturalist',
				volume: '202',
				issue: '4',
				page: '471–85',
				issued: {
					'date-parts': [[2023]],
				},
				author: [
					{
						given: 'Emily L.',
						family: 'Dittmar',
					},
					{
						given: 'Douglas W.',
						family: 'Schemske',
					},
				],
			},
			confidence: 'medium',
		});
	});

	it('parses listed co-authors in comma-separated Chicago journal citations with et al.', () => {
		const citation = parseFreeTextCitation(
			'Snyder, Carl D., Manuel Bedrossian, Casey Barr, et al. “Extant Life Detection Using Label-Free Video Microscopy in Analog Aquatic Environments.” PLOS ONE 20, no. 3 (2025): e0318239. https://doi.org/10.1371/journal.pone.0318239.'
		);

		expect(citation).toEqual({
			csl: {
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
			confidence: 'low',
		});
	});

	it('parses APA journal citations with multiple inverted authors and a doi: URL form', () => {
		const citation = parseFreeTextCitation(
			'Ginsberg, J. P., Ayers, E., Burriss, L., & Powell, D. A. (2008). Discriminative delay Pavlovian eye-blink conditioning in veterans with and without post-traumatic stress disorder. Journal of Anxiety Disorders, 22, 809-823. https://doi:10.1016/j.janxdis.2007.08.009'
		);

		expect(citation).toEqual({
			csl: {
				type: 'article-journal',
				title: 'Discriminative delay Pavlovian eye-blink conditioning in veterans with and without post-traumatic stress disorder',
				'container-title': 'Journal of Anxiety Disorders',
				volume: '22',
				page: '809-823',
				DOI: '10.1016/j.janxdis.2007.08.009',
				issued: {
					'date-parts': [[2008]],
				},
				author: [
					{
						family: 'Ginsberg',
						given: 'J. P.',
					},
					{
						family: 'Ayers',
						given: 'E.',
					},
					{
						family: 'Burriss',
						given: 'L.',
					},
					{
						family: 'Powell',
						given: 'D. A',
					},
				],
			},
			confidence: 'low',
		});
	});

	it('parses APA-style book citations with publisher-only tails', () => {
		const citation = parseFreeTextCitation(
			"Ginsberg, J. P. (2009). The war comes home: Washington's battle against America's veterans. University of California Press."
		);

		expect(citation).toEqual({
			csl: {
				type: 'book',
				title: "The war comes home: Washington's battle against America's veterans",
				publisher: 'University of California Press',
				issued: {
					'date-parts': [[2009]],
				},
				author: [
					{
						family: 'Ginsberg',
						given: 'J. P',
					},
				],
			},
			confidence: 'low',
		});
	});

	it('parses APA-style corporate-author book citations with perioded publishers', () => {
		const citation = parseFreeTextCitation(
			'United States. Congress. House Committee on Foreign Affairs. Subcommittee on the Middle East and South Asia. (2007). Working in a war zone: Post traumatic stress disorder in civilians returning from Iraq. G.P.O.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'book',
				title: 'Working in a war zone: Post traumatic stress disorder in civilians returning from Iraq',
				publisher: 'G.P.O',
				issued: {
					'date-parts': [[2007]],
				},
				author: [
					{
						literal:
							'United States. Congress. House Committee on Foreign Affairs. Subcommittee on the Middle East and South Asia',
					},
				],
			},
			confidence: 'low',
		});
	});

	it('parses Chicago-style dissertation citations with institutional and database tails', () => {
		const citation = parseFreeTextCitation(
			'Blajer de la Garza, Yuna. “A House Is Not a Home: Citizenship and Belonging in Contemporary Democracies.” PhD diss., University of Chicago, 2019. ProQuest (13865986).'
		);

		expect(citation).toEqual({
			csl: {
				type: 'thesis',
				title: 'A House Is Not a Home: Citizenship and Belonging in Contemporary Democracies',
				genre: 'PhD diss',
				publisher: 'University of Chicago',
				issued: {
					'date-parts': [[2019]],
				},
				medium: 'ProQuest (13865986)',
				author: [
					{
						family: 'Blajer de la Garza',
						given: 'Yuna',
					},
				],
			},
			confidence: 'medium',
		});
	});

	it('returns null for unsupported free-text citations', () => {
		expect(
			parseFreeTextCitation('This input is not a parseable citation.')
		).toBeNull();
	});

	it('parses semicolon-delimited journal authors as a lower-confidence heuristic match', () => {
		const citation = parseFreeTextCitation(
			'Ada Smith; Jane Scholar; Chris Editor, "Learning Blocks," Journal of WordPress Studies 12, no. 3 (2024): 117-134.'
		);

		expect(citation).toEqual({
			csl: {
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
					{
						given: 'Jane',
						family: 'Scholar',
					},
					{
						given: 'Chris',
						family: 'Editor',
					},
				],
			},
			confidence: 'low',
		});
	});

	it('parses simple webpage citations as a lower-confidence heuristic match', () => {
		const citation = parseFreeTextCitation(
			'OpenAI, “Responses API,” https://platform.openai.com/docs/api-reference/responses.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'webpage',
				title: 'Responses API',
				URL: 'https://platform.openai.com/docs/api-reference/responses',
				author: [
					{
						literal: 'OpenAI',
					},
				],
			},
			confidence: 'low',
		});
	});

	it('parses organization-authored webpage citations with site names and effective dates', () => {
		const citation = parseFreeTextCitation(
			'Google. “Privacy Policy.” Privacy & Terms. Effective November 15, 2023. https://policies.google.com/privacy.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'webpage',
				title: 'Privacy Policy',
				'container-title': 'Privacy & Terms',
				URL: 'https://policies.google.com/privacy',
				issued: {
					'date-parts': [[2023, 11, 15]],
				},
				author: [
					{
						literal: 'Google',
					},
				],
			},
			confidence: 'low',
		});
	});

	it('parses organization-authored webpage citations with last-modified dates', () => {
		const citation = parseFreeTextCitation(
			'Wikimedia Foundation. “Wikipedia: Manual of Style.” Last modified December 19, 2023, at 21:54 (UTC). https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'webpage',
				title: 'Wikipedia: Manual of Style',
				URL: 'https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style',
				issued: {
					'date-parts': [[2023, 12, 19]],
				},
				author: [
					{
						literal: 'Wikimedia Foundation',
					},
				],
			},
			confidence: 'low',
		});
	});

	it('parses organization-authored webpage citations with accessed dates', () => {
		const citation = parseFreeTextCitation(
			'Yale University. “About Yale: Yale Facts.” Accessed March 8, 2022. https://www.yale.edu/about-yale/yale-facts.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'webpage',
				title: 'About Yale: Yale Facts',
				URL: 'https://www.yale.edu/about-yale/yale-facts',
				accessed: {
					'date-parts': [[2022, 3, 8]],
				},
				author: [
					{
						literal: 'Yale University',
					},
				],
			},
			confidence: 'low',
		});
	});

	it('parses organization-authored social media citations as webpages with literal authors', () => {
		const citation = parseFreeTextCitation(
			'Chicago Manual of Style. “Is the world ready for singular they? We thought so back in 1993.” Facebook, April 17, 2015. https://www.facebook.com/ChicagoManual/posts/10152906193679151.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'webpage',
				title: 'Is the world ready for singular they? We thought so back in 1993',
				'container-title': 'Facebook',
				URL: 'https://www.facebook.com/ChicagoManual/posts/10152906193679151',
				issued: {
					'date-parts': [[2015, 4, 17]],
				},
				author: [
					{
						literal: 'Chicago Manual of Style',
					},
				],
			},
			confidence: 'low',
		});
	});

	it('parses Chicago-style review citations', () => {
		const citation = parseFreeTextCitation(
			'Jacobs, Alexandra. “The Muchness of Madonna.” Review of Madonna: A Rebel Life, by Mary Gabriel. New York Times, October 8, 2023.'
		);

		expect(citation).toEqual({
			csl: {
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
			confidence: 'medium',
		});
	});

	it('treats APA-like volume/page citations as journal articles, not generic articles', () => {
		expect(
			parseFreeTextCitation(
				'Einstein, A. (1905). the true about tree (Vol. 322, pp. 891–921).'
			)
		).toMatchObject({
			csl: {
				type: 'article-journal',
				title: 'the true about tree',
				volume: '322',
				page: '891–921',
			},
			confidence: 'low',
		});
	});

	it('parses simple chapter citations as a lower-confidence heuristic match', () => {
		const citation = parseFreeTextCitation(
			'Amy J. Binder and Jeffrey L. Kidder, “Student Politics and Institutional Change,” in The Channels of Student Activism, ed. Carla Reyes (University of Chicago Press, 2022), 117–18.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'chapter',
				title: 'Student Politics and Institutional Change',
				'container-title': 'The Channels of Student Activism',
				editor: [
					{
						given: 'Carla',
						family: 'Reyes',
					},
				],
				publisher: 'University of Chicago Press',
				page: '117–18',
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
			confidence: 'low',
		});
	});

	it('parses sentence-style chapter citations with edited by phrasing', () => {
		const citation = parseFreeTextCitation(
			'Doyle, Kathleen. “The Queen Mary Psalter.” In The Book by Design: The Remarkable Story of the World’s Greatest Invention, edited by P. J. M. Marks and Stephen Parkin. University of Chicago Press, 2023.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'chapter',
				title: 'The Queen Mary Psalter',
				'container-title':
					'The Book by Design: The Remarkable Story of the World’s Greatest Invention',
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
			},
			confidence: 'low',
		});
	});

	it('parses sentence-style edited book citations into editor-based CSL', () => {
		const citation = parseFreeTextCitation(
			'Marks, P. J. M., and Stephen Parkin, eds. The Book by Design: The Remarkable Story of the World’s Greatest Invention. University of Chicago Press, 2023.'
		);

		expect(citation).toEqual({
			csl: {
				type: 'collection',
				title: 'The Book by Design: The Remarkable Story of the World’s Greatest Invention',
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
				publisher: 'University of Chicago Press',
				issued: {
					'date-parts': [[2023]],
				},
			},
			confidence: 'medium',
		});
	});

	it('parses sentence-style books with editions and database/platform tails', () => {
		expect(
			parseFreeTextCitation(
				'Borel, Brooke. The Chicago Guide to Fact-Checking. 2nd ed. University of Chicago Press, 2023. EBSCOhost.'
			)
		).toEqual({
			csl: {
				type: 'book',
				title: 'The Chicago Guide to Fact-Checking',
				edition: '2',
				publisher: 'University of Chicago Press',
				issued: {
					'date-parts': [[2023]],
				},
				medium: 'EBSCOhost',
				author: [
					{
						given: 'Brooke',
						family: 'Borel',
					},
				],
			},
			confidence: 'medium',
		});

		expect(
			parseFreeTextCitation(
				'Roy, Arundhati. The God of Small Things. Random House, 2008. Kindle.'
			)
		).toEqual({
			csl: {
				type: 'book',
				title: 'The God of Small Things',
				publisher: 'Random House',
				issued: {
					'date-parts': [[2008]],
				},
				medium: 'Kindle',
				author: [
					{
						given: 'Arundhati',
						family: 'Roy',
					},
				],
			},
			confidence: 'medium',
		});
	});

	it('parses sentence-style books with URL tails and place-year publication data', () => {
		expect(
			parseFreeTextCitation(
				'Kurland, Philip B., and Ralph Lerner, eds. The Founders’ Constitution. University of Chicago Press, 1987. https://press-pubs.uchicago.edu/founders/.'
			)
		).toEqual({
			csl: {
				type: 'collection',
				title: 'The Founders’ Constitution',
				editor: [
					{
						given: 'Philip B.',
						family: 'Kurland',
					},
					{
						given: 'Ralph',
						family: 'Lerner',
					},
				],
				publisher: 'University of Chicago Press',
				issued: {
					'date-parts': [[1987]],
				},
				URL: 'https://press-pubs.uchicago.edu/founders/',
			},
			confidence: 'medium',
		});

		expect(
			parseFreeTextCitation(
				'Melville, Herman. Moby-Dick; or, The Whale. New York, 1851. https://melville.electroniclibrary.org/moby-dick-side-by-side.'
			)
		).toEqual({
			csl: {
				type: 'book',
				title: 'Moby-Dick; or, The Whale',
				'publisher-place': 'New York',
				issued: {
					'date-parts': [[1851]],
				},
				URL: 'https://melville.electroniclibrary.org/moby-dick-side-by-side',
				author: [
					{
						given: 'Herman',
						family: 'Melville',
					},
				],
			},
			confidence: 'medium',
		});
	});

	it('parses APA-like journal review citations with volume, issue, and DOI', () => {
		const citation = parseFreeTextCitation(
			'King, B. G. (2025). Amy J. Binder and Jeffrey L. Kidder. The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today BinderAmy J.KidderJeffrey L.The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today. University of Chicago Press, 2022. 224 pp. $25, paper. Administrative Science Quarterly, 71(1). https://doi.org/10.1177/00018392251368878'
		);

		expect(citation).toEqual({
			csl: {
				type: 'article-journal',
				title: 'Amy J. Binder and Jeffrey L. Kidder. The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today BinderAmy J.KidderJeffrey L.The Channels of Student Activism: How the Left and Right Are Winning (and Losing) in Campus Politics Today. University of Chicago Press, 2022. 224 pp. $25, paper',
				'container-title': 'Administrative Science Quarterly',
				volume: '71',
				issue: '1',
				DOI: '10.1177/00018392251368878',
				issued: {
					'date-parts': [[2025]],
				},
				author: [
					{
						given: 'B. G',
						family: 'King',
					},
				],
			},
			confidence: 'low',
		});
	});

	it('parses low-confidence APA-like citations with only title, volume, and pages', () => {
		const citation = parseFreeTextCitation(
			'Einstein, A. (1905). the true about tree (Vol. 322, pp. 891–921).'
		);

		expect(citation).toEqual({
			csl: {
				type: 'article-journal',
				title: 'the true about tree',
				volume: '322',
				page: '891–921',
				issued: {
					'date-parts': [[1905]],
				},
				author: [
					{
						given: 'A',
						family: 'Einstein',
					},
				],
			},
			confidence: 'low',
		});
	});
});
