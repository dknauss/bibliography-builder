import metadata from '../block.json';
import { sortCitations } from './lib/sorter';
import { renderBibliographySave } from './save-markup';

const deprecatedAttributes = metadata.attributes;

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
		attributes: deprecatedAttributes,
		save: ({ attributes }) =>
			renderBibliographySave(attributes, {
				sortEntries: true,
				headingTag: 'p',
				entryTag: 'cite',
				linkVisibleUrls: true,
				includeDeprecatedBiblioEntryRole: true,
			}),
	},
	{
		attributes: deprecatedAttributes,
		save: ({ attributes }) =>
			renderBibliographySave(attributes, {
				sortEntries: true,
				headingTag: 'p',
				entryTag: 'cite',
				linkVisibleUrls: true,
				ariaLabel: 'Bibliography',
				includeDeprecatedBiblioEntryRole: true,
			}),
	},
	{
		attributes: deprecatedAttributes,
		save: ({ attributes }) =>
			renderBibliographySave(attributes, {
				sortEntries: true,
				headingTag: 'p',
				entryTag: 'cite',
				linkVisibleUrls: false,
				includeDeprecatedBiblioEntryRole: true,
			}),
	},
	{
		attributes: deprecatedAttributes,
		migrate: migrateSortedAttributes,
		save: ({ attributes }) =>
			renderBibliographySave(attributes, {
				sortEntries: false,
				headingTag: 'p',
				entryTag: 'cite',
				linkVisibleUrls: false,
				includeDeprecatedBiblioEntryRole: true,
			}),
	},
	{
		attributes: deprecatedAttributes,
		migrate: migrateSortedAttributes,
		save: ({ attributes }) =>
			renderBibliographySave(attributes, {
				sortEntries: false,
				headingTag: 'h2',
				entryTag: 'span',
				linkVisibleUrls: false,
				includeDeprecatedBiblioEntryRole: true,
			}),
	},
];
