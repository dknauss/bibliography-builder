import { Cite, plugins } from '@citation-js/core';
import '@citation-js/plugin-csl';
import { getStyleDefinition } from './style-registry';

const FORMAT_CACHE = new Map();
const MAX_FORMAT_CACHE_ENTRIES = 500;

const TEMPLATE_LOADERS = {
	'chicago-author-date': () =>
		import('./styles/chicago-author-date').then((m) => m.default),
	'chicago-notes-bibliography': () =>
		import('./styles/chicago-notes-bibliography').then((m) => m.default),
	ieee: () => import('./styles/ieee').then((m) => m.default),
	'modern-language-association': () =>
		import('./styles/mla-9').then((m) => m.default),
	oscola: () => import('./styles/oscola').then((m) => m.default),
	abnt: () => import('./styles/abnt').then((m) => m.default),
	apa: () => import('./styles/apa').then((m) => m.default),
	harvard1: () => import('./styles/harvard1').then((m) => m.default),
	vancouver: () => import('./styles/vancouver').then((m) => m.default),
};

function emitFormattingWarning(...args) {
	// eslint-disable-next-line no-console
	console?.warn?.(...args);
}

async function ensureTemplateRegistered(templateName) {
	const cslConfig = plugins.config.get('@csl');

	if (cslConfig.templates.has(templateName)) {
		return;
	}

	const loader = TEMPLATE_LOADERS[templateName];

	if (!loader) {
		emitFormattingWarning(`No template loader for "${templateName}".`);
		return;
	}

	const xml = await loader();
	cslConfig.templates.add(templateName, xml);
}

function hasTrailingEtAlAuthor(csl) {
	const authors = csl?.author;

	if (!Array.isArray(authors) || !authors.length) {
		return false;
	}

	const lastAuthor = authors.at(-1);
	return lastAuthor?.literal === 'et al.';
}

function normalizeEtAlOutput(output, csl) {
	if (!hasTrailingEtAlAuthor(csl)) {
		return output;
	}

	return output.replace(/\band et al\./u, 'et al.');
}

function normalizeNumericOutput(output, style) {
	if (style?.family !== 'numeric') {
		return output;
	}

	return output.replace(/^(?:\[\d+\]|\d+\.)\s+/u, '');
}

function normalizeAbntOutput(output, style) {
	if (style?.key !== 'abnt') {
		return output;
	}

	return output
		.replace(/\bv\.\s+vol\.\s+/gu, 'v. ')
		.replace(/\bn\.\s+no\.\s+/gu, 'n. ')
		.replace(/\bp\.\s+p\.p?\.\s+/gu, 'p. ');
}

function normalizeReviewOutput(output, csl) {
	if (
		csl?.type !== 'review-book' ||
		!csl['reviewed-title'] ||
		/\bReview of\b/u.test(output)
	) {
		return output;
	}

	return output.replace(
		csl['reviewed-title'],
		`Review of ${csl['reviewed-title']}`
	);
}

function getFormatCacheKey(csl, styleKey) {
	return `${styleKey}::${stableStringify(csl)}`;
}

function setCachedFormat(cacheKey, formatted) {
	if (FORMAT_CACHE.size >= MAX_FORMAT_CACHE_ENTRIES) {
		const oldestCacheKey = FORMAT_CACHE.keys().next().value;

		if (oldestCacheKey) {
			FORMAT_CACHE.delete(oldestCacheKey);
		}
	}

	FORMAT_CACHE.set(cacheKey, formatted);
	return formatted;
}

function formatBibliographyEntryUncached(csl, style, cacheKey) {
	const fallbackText = csl?.title || csl?.['container-title'] || '';
	let output = fallbackText;

	try {
		const cite = new Cite(csl);
		output = cite.format('bibliography', {
			format: 'text',
			template: style.cslTemplate,
			lang: style.locale || 'en-US',
		});
	} catch (error) {
		emitFormattingWarning(
			`Falling back to raw citation text for style "${style.key}".`,
			error
		);
	}

	return setCachedFormat(
		cacheKey,
		normalizeAbntOutput(
			normalizeNumericOutput(
				normalizeReviewOutput(
					normalizeEtAlOutput(output.trim(), csl),
					csl
				),
				style
			),
			style
		)
	);
}

/**
 * Clear the citation formatting cache.
 *
 * @since 0.1.0
 */
export function clearFormattingCache() {
	FORMAT_CACHE.clear();
}

/**
 * Format multiple CSL-JSON items as bibliography entries.
 *
 * @param {Array}  cslItems Array of CSL-JSON objects.
 * @param {string} styleKey Citation style key.
 * @return {string[]} Array of formatted bibliography strings.
 *
 * @since 0.1.0
 */
export async function formatBibliographyEntries(cslItems, styleKey) {
	if (!Array.isArray(cslItems) || !cslItems.length) {
		return [];
	}

	const style = getStyleDefinition(styleKey);
	const resolvedStyleKey = style.key || styleKey;
	const results = new Array(cslItems.length);
	const uncachedItems = new Map();

	await ensureTemplateRegistered(style.cslTemplate);

	cslItems.forEach((csl, index) => {
		const cacheKey = getFormatCacheKey(csl, resolvedStyleKey);

		if (FORMAT_CACHE.has(cacheKey)) {
			results[index] = FORMAT_CACHE.get(cacheKey);
			return;
		}

		const pendingItem = uncachedItems.get(cacheKey);

		if (pendingItem) {
			pendingItem.indices.push(index);
			return;
		}

		uncachedItems.set(cacheKey, {
			csl,
			indices: [index],
		});
	});

	for (const [cacheKey, { csl, indices }] of uncachedItems) {
		const formatted = formatBibliographyEntryUncached(csl, style, cacheKey);

		for (const index of indices) {
			results[index] = formatted;
		}
	}

	return results;
}

/**
 * Format a single CSL-JSON item as a bibliography entry.
 *
 * @param {Object} csl      CSL-JSON object.
 * @param {string} styleKey Citation style key.
 * @return {string} Formatted bibliography string.
 *
 * @since 0.1.0
 */
export async function formatBibliographyEntry(csl, styleKey) {
	const results = await formatBibliographyEntries([csl], styleKey);
	return results[0];
}

function stableStringify(value) {
	return JSON.stringify(sortObjectKeys(value));
}

function sortObjectKeys(value) {
	if (Array.isArray(value)) {
		return value.map(sortObjectKeys);
	}

	if (value && typeof value === 'object') {
		return Object.keys(value)
			.sort()
			.reduce((accumulator, key) => {
				accumulator[key] = sortObjectKeys(value[key]);
				return accumulator;
			}, {});
	}

	return value;
}
