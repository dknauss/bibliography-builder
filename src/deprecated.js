import { sortCitations } from './lib/sorter';
import { renderBibliographySave } from './save-markup';

function migrateSortedAttributes(attributes) {
	return {
		...attributes,
		citations: sortCitations(
			attributes.citations || [],
			attributes.citationStyle
		),
	};
}

export const deprecated = [
	{
		save: ({ attributes }) =>
			renderBibliographySave(attributes, {
				sortEntries: true,
				headingTag: 'p',
				entryTag: 'cite',
				linkVisibleUrls: false,
			}),
	},
	{
		migrate: migrateSortedAttributes,
		save: ({ attributes }) =>
			renderBibliographySave(attributes, {
				sortEntries: false,
				headingTag: 'p',
				entryTag: 'cite',
				linkVisibleUrls: false,
			}),
	},
	{
		migrate: migrateSortedAttributes,
		save: ({ attributes }) =>
			renderBibliographySave(attributes, {
				sortEntries: false,
				headingTag: 'h2',
				entryTag: 'span',
				linkVisibleUrls: false,
			}),
	},
];
