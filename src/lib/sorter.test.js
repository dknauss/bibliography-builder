import { sortCitations } from './sorter';

function createCitation({ id, title, family, literal, year }) {
	return {
		id,
		csl: {
			title,
			...(family || literal
				? {
						author: [
							{
								...(family ? { family } : {}),
								...(literal ? { literal } : {}),
							},
						],
				  }
				: {}),
			...(year
				? {
						issued: {
							'date-parts': [[year]],
						},
				  }
				: {}),
		},
	};
}

describe('sortCitations', () => {
	it('sorts notes-bibliography entries by author, then title, then year', () => {
		const citations = [
			createCitation({
				id: 'c',
				family: 'Smith',
				year: 2024,
				title: 'Zeta',
			}),
			createCitation({
				id: 'a',
				family: 'Binder',
				year: 2025,
				title: 'Zeta',
			}),
			createCitation({
				id: 'b',
				family: 'Binder',
				year: 2024,
				title: 'Omega',
			}),
		];

		expect(sortCitations(citations).map((citation) => citation.id)).toEqual(
			['b', 'a', 'c']
		);
	});

	it('sorts author-date entries by author, then year, then title', () => {
		const citations = [
			createCitation({
				id: 'c',
				family: 'Smith',
				year: 2024,
				title: 'Zeta',
			}),
			createCitation({
				id: 'a',
				family: 'Binder',
				year: 2025,
				title: 'Gamma',
			}),
			createCitation({
				id: 'b',
				family: 'Binder',
				year: 2024,
				title: 'Omega',
			}),
		];

		expect(
			sortCitations(citations, 'chicago-author-date').map(
				(citation) => citation.id
			)
		).toEqual(['b', 'a', 'c']);
	});

	it('sorts author-date entries without dates after dated works by the same author', () => {
		const citations = [
			createCitation({
				id: 'dated',
				family: 'Binder',
				year: 2022,
				title: 'Title A',
			}),
			createCitation({
				id: 'undated',
				family: 'Binder',
				title: 'Title B',
			}),
		];

		expect(
			sortCitations(citations, 'chicago-author-date').map(
				(citation) => citation.id
			)
		).toEqual(['dated', 'undated']);
	});

	it('ignores leading articles and case in title sorting', () => {
		const citations = [
			createCitation({
				id: 'b',
				family: 'Smith',
				year: 2024,
				title: 'The Zebra Handbook',
			}),
			createCitation({
				id: 'a',
				family: 'Smith',
				year: 2024,
				title: 'an aardvark study',
			}),
		];

		expect(sortCitations(citations).map((citation) => citation.id)).toEqual(
			['a', 'b']
		);
	});

	it('falls back to title sorting when author data is absent', () => {
		const citations = [
			createCitation({
				id: 'no-author-b',
				title: 'The Zebra Handbook',
			}),
			createCitation({
				id: 'no-author-a',
				title: 'An Assistant Handbook',
			}),
		];

		expect(sortCitations(citations).map((citation) => citation.id)).toEqual(
			['no-author-a', 'no-author-b']
		);
	});

	it('sorts corporate authors from literal names instead of falling back to title order', () => {
		const citations = [
			createCitation({
				id: 'title-only',
				title: 'Zebra Institutions',
			}),
			createCitation({
				id: 'literal-author',
				literal: 'World Health Organization',
				title: 'Alpha Report',
			}),
		];

		expect(sortCitations(citations).map((citation) => citation.id)).toEqual(
			['literal-author', 'title-only']
		);
	});

	it('sorts edited collections by editor surname before title fallback', () => {
		const citations = [
			{
				id: 'marks',
				csl: {
					title: 'The Book by Design',
					editor: [
						{
							family: 'Marks',
							given: 'P. J. M.',
						},
					],
				},
			},
			createCitation({
				id: 'borel',
				family: 'Borel',
				year: 2023,
				title: 'The Chicago Guide to Fact-Checking',
			}),
		];

		expect(sortCitations(citations).map((citation) => citation.id)).toEqual(
			['borel', 'marks']
		);
	});

	it('sorts author names case-insensitively with locale-aware comparison', () => {
		const citations = [
			createCitation({
				id: 'z',
				family: 'Zulu',
				year: 2024,
				title: 'Alpha',
			}),
			createCitation({
				id: 'a-umlaut',
				family: 'Ångström',
				year: 2024,
				title: 'Beta',
			}),
			createCitation({
				id: 'a-lower',
				family: 'anderson',
				year: 2024,
				title: 'Gamma',
			}),
		];

		expect(sortCitations(citations).map((citation) => citation.id)).toEqual(
			['a-lower', 'a-umlaut', 'z']
		);
	});

	it('sorts accented and particle surnames in a stable locale-aware order', () => {
		const citations = [
			createCitation({
				id: 'garcia',
				family: 'García',
				year: 2024,
				title: 'Alpha',
			}),
			createCitation({
				id: 'de-beauvoir-upper',
				family: 'De Beauvoir',
				year: 2024,
				title: 'Beta',
			}),
			createCitation({
				id: 'de-beauvoir-lower',
				family: 'de Beauvoir',
				year: 2024,
				title: 'Alpha',
			}),
		];

		expect(sortCitations(citations).map((citation) => citation.id)).toEqual(
			['de-beauvoir-lower', 'de-beauvoir-upper', 'garcia']
		);
	});

	it('returns single-entry and empty citation arrays unchanged', () => {
		const single = [
			createCitation({
				id: 'single',
				family: 'Smith',
				title: 'Only Entry',
				year: 2024,
			}),
		];

		expect(sortCitations(single)).toEqual(single);
		expect(sortCitations([])).toEqual([]);
	});
});
