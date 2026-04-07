import {
	getAutoFormattedText,
	getDisplaySegments,
	getDisplayText,
	splitTextIntoLinkParts,
} from './index';

function createCitation(overrides = {}) {
	return {
		csl: {
			type: 'article-journal',
			title: 'Example Article',
			'container-title': 'Journal of Examples',
			...overrides.csl,
		},
		formattedText:
			'Smith, Ada. “Example Article.” Journal of Examples 12 (3): 117–34.',
		displayOverride: null,
		...overrides,
	};
}

describe('formatting helpers', () => {
	it('returns the auto-formatted text when no override is present', () => {
		const citation = createCitation({
			formattedText: 'Auto formatted citation',
		});

		expect(getAutoFormattedText(citation)).toBe('Auto formatted citation');
		expect(getDisplayText(citation)).toBe('Auto formatted citation');
	});

	it('keeps a quoted article title plain and italicizes the journal title', () => {
		const citation = createCitation();

		expect(getDisplaySegments(citation)).toEqual([
			{
				text: 'Smith, Ada. “Example Article.” ',
				italic: false,
			},
			{
				text: 'Journal of Examples',
				italic: true,
			},
			{
				text: ' 12 (3): 117–34.',
				italic: false,
			},
		]);
	});

	it('chooses the last matching title range when the same text appears earlier', () => {
		const citation = createCitation({
			csl: {
				type: 'book',
				title: 'Data',
			},
			formattedText: 'Data Research Group. Data. Press, 2024.',
		});

		expect(getDisplaySegments(citation)).toEqual([
			{
				text: 'Data Research Group. ',
				italic: false,
			},
			{
				text: 'Data',
				italic: true,
			},
			{
				text: '. Press, 2024.',
				italic: false,
			},
		]);
	});

	it('treats mixed straight and curly quotes as quoted text', () => {
		const citation = createCitation({
			formattedText:
				'Smith, Ada. “Example Article". Journal of Examples 12 (3): 117–34.',
		});

		expect(getDisplaySegments(citation)[0]).toEqual({
			text: 'Smith, Ada. “Example Article". ',
			italic: false,
		});
	});

	it('splits visible URLs into linked parts and leaves trailing punctuation outside the link', () => {
		expect(
			splitTextIntoLinkParts(
				'Available at https://example.com/path/to/resource.'
			)
		).toEqual([
			{
				text: 'Available at ',
				link: false,
			},
			{
				text: 'https://example.com/path/to/resource',
				href: 'https://example.com/path/to/resource',
				link: true,
			},
			{
				text: '.',
				link: false,
			},
		]);
	});

	it('preserves balanced parentheses inside linked URLs', () => {
		expect(
			splitTextIntoLinkParts('See https://example.com/path_(alpha).')
		).toEqual([
			{
				text: 'See ',
				link: false,
			},
			{
				text: 'https://example.com/path_(alpha)',
				href: 'https://example.com/path_(alpha)',
				link: true,
			},
			{
				text: '.',
				link: false,
			},
		]);
	});
});
