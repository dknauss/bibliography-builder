import { renderToStaticMarkup } from 'react-dom/server';
import { deprecated } from './deprecated';

jest.mock(
	'@wordpress/block-editor',
	() => ({
		useBlockProps: {
			save: () => ({
				className: 'wp-block-scholarly-bibliography',
			}),
		},
	}),
	{ virtual: true }
);

function createCitation({ id, family, title }) {
	return {
		id,
		csl: {
			type: 'book',
			title,
			author: [{ family }],
		},
		formattedText: `${family} citation`,
		displayOverride: null,
	};
}

describe('deprecated block versions', () => {
	it('supports the immediate prior save markup variant without linked visible URLs', () => {
		const markup = renderToStaticMarkup(
			deprecated[0].save({
				attributes: {
					citationStyle: 'chicago-notes-bibliography',
					citations: [
						{
							...createCitation({
								id: 'url-entry',
								family: 'Smith',
								title: 'Example Resource',
							}),
							csl: {
								type: 'webpage',
								title: 'Example Resource',
								URL: 'https://example.com/resource',
								author: [{ family: 'Smith' }],
							},
							formattedText:
								'Smith. Example Resource. https://example.com/resource.',
						},
					],
				},
			})
		);

		expect(markup).toContain('https://example.com/resource.');
		expect(markup).not.toContain('<a href=');
	});

	it('supports the prior unsorted save markup variant', () => {
		const markup = renderToStaticMarkup(
			deprecated[1].save({
				attributes: {
					citationStyle: 'chicago-notes-bibliography',
					citations: [
						createCitation({
							id: 'marks',
							family: 'Marks',
							title: 'The Book by Design',
						}),
						createCitation({
							id: 'borel',
							family: 'Borel',
							title: 'The Chicago Guide to Fact-Checking',
						}),
					],
				},
			})
		);

		expect(markup.indexOf('Marks citation')).toBeLessThan(
			markup.indexOf('Borel citation')
		);
	});
});
