import { getStyleDefinition } from './formatting';

/**
 * Chicago-family sort comparator.
 *
 * Notes-bibliography sort order:
 * 1. First author last name (alphabetical, case-insensitive)
 * 2. Title (alphabetical, case-insensitive, ignoring leading articles)
 * 3. Publication year (ascending, no-date sorts last)
 *
 * Author-date sort order:
 * 1. First author last name (alphabetical, case-insensitive)
 * 2. Publication year (ascending, no-date sorts last)
 * 3. Title (alphabetical, case-insensitive, ignoring leading articles)
 */

const LEADING_ARTICLES = /^(a|an|the)\s+/i;

/**
 * Get the sortable author string from a CSL-JSON object.
 *
 * @param {Object} csl CSL-JSON object.
 * @return {string} Lowercase author string for sorting.
 */
function getAuthorSort(csl) {
	const primaryContributors =
		(csl.author && csl.author.length && csl.author) ||
		(csl.editor && csl.editor.length && csl.editor);

	if (!primaryContributors) {
		return csl.title ? stripArticles(csl.title).toLowerCase() : '\uffff';
	}
	const first = primaryContributors[0];
	return (first.family || first.literal || '').toLowerCase();
}

/**
 * Get the publication year from a CSL-JSON object.
 *
 * @param {Object} csl CSL-JSON object.
 * @return {number} Year or Infinity if not present.
 */
function getYear(csl) {
	if (
		csl.issued &&
		csl.issued['date-parts'] &&
		csl.issued['date-parts'][0] &&
		csl.issued['date-parts'][0][0]
	) {
		return csl.issued['date-parts'][0][0];
	}
	return Infinity;
}

/**
 * Strip leading articles from a title for sort purposes.
 *
 * @param {string} title The title string.
 * @return {string} Title without leading article.
 */
function stripArticles(title) {
	return (title || '').replace(LEADING_ARTICLES, '');
}

/**
 * Get the sortable title string from a CSL-JSON object.
 *
 * @param {Object} csl CSL-JSON object.
 * @return {string} Lowercase title without leading articles.
 */
function getTitleSort(csl) {
	return stripArticles(csl.title || '').toLowerCase();
}

/**
 * Sort an array of citation objects by style family rules.
 *
 * @param {Array}  citations Array of citation objects.
 * @param {string} styleKey  Citation style key.
 * @return {Array} Sorted citation array.
 *
 * @since 0.1.0
 */
export function sortCitations(citations, styleKey) {
	const style = getStyleDefinition(styleKey);
	const titleBeforeYear = style.family === 'notes';

	return [...citations].sort((a, b) => {
		// Primary: author last name.
		const authorA = getAuthorSort(a.csl);
		const authorB = getAuthorSort(b.csl);
		const authorCmp = authorA.localeCompare(authorB, undefined, {
			sensitivity: 'base',
		});
		if (authorCmp !== 0) {
			return authorCmp;
		}

		if (titleBeforeYear) {
			const titleA = getTitleSort(a.csl);
			const titleB = getTitleSort(b.csl);
			const titleCmp = titleA.localeCompare(titleB, undefined, {
				sensitivity: 'base',
			});

			if (titleCmp !== 0) {
				return titleCmp;
			}

			const yearA = getYear(a.csl);
			const yearB = getYear(b.csl);
			if (yearA !== yearB) {
				return yearA - yearB;
			}

			return 0;
		}

		// Secondary: year ascending.
		const yearA = getYear(a.csl);
		const yearB = getYear(b.csl);
		if (yearA !== yearB) {
			return yearA - yearB;
		}

		// Tertiary: title.
		const titleA = getTitleSort(a.csl);
		const titleB = getTitleSort(b.csl);
		const titleCmp = titleA.localeCompare(titleB, undefined, {
			sensitivity: 'base',
		});
		return titleCmp;
	});
}
