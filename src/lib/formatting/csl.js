import { Cite, plugins } from '@citation-js/core';
import '@citation-js/plugin-csl';
import { getStyleDefinition } from './style-registry';
import chicagoAuthorDateTemplate from './styles/chicago-author-date';
import chicagoNotesBibliographyTemplate from './styles/chicago-notes-bibliography';
import ieeeTemplate from './styles/ieee';
import mla9Template from './styles/mla-9';
import oscolaTemplate from './styles/oscola';
import abntTemplate from './styles/abnt';

let templatesRegistered = false;
const FORMAT_CACHE = new Map();
const MAX_FORMAT_CACHE_ENTRIES = 500;

function ensureBuiltinTemplatesRegistered() {
	if (templatesRegistered) {
		return;
	}

	const cslConfig = plugins.config.get('@csl');

	if (!cslConfig.templates.has('chicago-author-date')) {
		cslConfig.templates.add(
			'chicago-author-date',
			chicagoAuthorDateTemplate
		);
	}

	if (!cslConfig.templates.has('chicago-notes-bibliography')) {
		cslConfig.templates.add(
			'chicago-notes-bibliography',
			chicagoNotesBibliographyTemplate
		);
	}

	if (!cslConfig.templates.has('ieee')) {
		cslConfig.templates.add('ieee', ieeeTemplate);
	}

	if (!cslConfig.templates.has('modern-language-association')) {
		cslConfig.templates.add('modern-language-association', mla9Template);
	}

	if (!cslConfig.templates.has('oscola')) {
		cslConfig.templates.add('oscola', oscolaTemplate);
	}

	if (!cslConfig.templates.has('abnt')) {
		cslConfig.templates.add('abnt', abntTemplate);
	}

	templatesRegistered = true;
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
	return `${styleKey}::${JSON.stringify(csl)}`;
}

function setCachedFormat(cacheKey, formatted) {
	if (FORMAT_CACHE.size >= MAX_FORMAT_CACHE_ENTRIES) {
		FORMAT_CACHE.clear();
	}

	FORMAT_CACHE.set(cacheKey, formatted);
	return formatted;
}

function formatBibliographyEntryUncached(csl, style, cacheKey) {
	const cite = new Cite(csl);
	const output = cite.format('bibliography', {
		format: 'text',
		template: style.cslTemplate,
		lang: 'en-US',
	});

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

export function clearFormattingCache() {
	FORMAT_CACHE.clear();
}

export function formatBibliographyEntries(cslItems, styleKey) {
	if (!Array.isArray(cslItems) || !cslItems.length) {
		return [];
	}

	const style = getStyleDefinition(styleKey);
	const resolvedStyleKey = style.key || styleKey;
	const results = new Array(cslItems.length);
	const uncachedItems = new Map();

	ensureBuiltinTemplatesRegistered();

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

export function formatBibliographyEntry(csl, styleKey) {
	return formatBibliographyEntries([csl], styleKey)[0];
}
