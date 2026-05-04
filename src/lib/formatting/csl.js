import apiFetch from '@wordpress/api-fetch';

const FORMAT_CACHE = new Map();
const MAX_FORMAT_CACHE_ENTRIES = 500;
const FORMAT_ENDPOINT = 'bibliography/v1/format';

function emitFormattingWarning(...args) {
	// eslint-disable-next-line no-console
	console?.warn?.(...args);
}

function getFormatCacheKey(csl, styleKey) {
	return `${styleKey}::${stableStringify(csl)}`;
}

function getCachedFormat(cacheKey) {
	if (!FORMAT_CACHE.has(cacheKey)) {
		return undefined;
	}

	const formatted = FORMAT_CACHE.get(cacheKey);

	// Refresh insertion order on access so Map behaves as a simple LRU cache.
	FORMAT_CACHE.delete(cacheKey);
	FORMAT_CACHE.set(cacheKey, formatted);

	return formatted;
}

function setCachedFormat(cacheKey, formatted) {
	if (FORMAT_CACHE.has(cacheKey)) {
		FORMAT_CACHE.delete(cacheKey);
	}

	while (FORMAT_CACHE.size >= MAX_FORMAT_CACHE_ENTRIES) {
		const leastRecentlyUsedCacheKey = FORMAT_CACHE.keys().next().value;

		if (!leastRecentlyUsedCacheKey) {
			break;
		}

		FORMAT_CACHE.delete(leastRecentlyUsedCacheKey);
	}

	FORMAT_CACHE.set(cacheKey, formatted);
	return formatted;
}

function getFallbackText(csl) {
	return csl?.title || csl?.['container-title'] || '';
}

async function requestFormattedEntries(cslItems, styleKey) {
	if (typeof apiFetch !== 'function') {
		throw new Error('WordPress API fetch is unavailable.');
	}

	const data = await apiFetch({
		path: `/${FORMAT_ENDPOINT}`,
		method: 'POST',
		data: {
			style: styleKey,
			cslItems,
		},
	});

	if (!Array.isArray(data?.entries)) {
		throw new Error('Formatter response did not include entries.');
	}

	return data.entries.map((entry) => String(entry?.text || ''));
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
 * @param {Object} options  Formatting options.
 * @return {string[]} Array of formatted bibliography strings.
 *
 * @since 0.1.0
 */
export async function formatBibliographyEntries(
	cslItems,
	styleKey,
	options = {}
) {
	if (!Array.isArray(cslItems) || !cslItems.length) {
		return [];
	}

	const results = new Array(cslItems.length);
	const uncachedItems = new Map();

	cslItems.forEach((csl, index) => {
		const cacheKey = getFormatCacheKey(csl, styleKey);

		const cachedFormat = getCachedFormat(cacheKey);

		if (cachedFormat !== undefined) {
			results[index] = cachedFormat;
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

	const uncachedEntries = Array.from(uncachedItems.entries());

	if (uncachedEntries.length) {
		let formattedTexts;

		try {
			formattedTexts = await requestFormattedEntries(
				uncachedEntries.map(([, { csl }]) => csl),
				styleKey
			);
		} catch (error) {
			emitFormattingWarning(
				`Falling back to raw citation text for style "${styleKey}".`,
				error
			);
			options.onFallback?.(error);
			formattedTexts = uncachedEntries.map(([, { csl }]) =>
				getFallbackText(csl)
			);
		}

		uncachedEntries.forEach(([cacheKey, { indices }], batchIndex) => {
			const formatted = setCachedFormat(
				cacheKey,
				formattedTexts[batchIndex] || ''
			);

			for (const index of indices) {
				results[index] = formatted;
			}
		});
	}

	return results;
}

/**
 * Format a single CSL-JSON item as a bibliography entry.
 *
 * @param {Object} csl      CSL-JSON object.
 * @param {string} styleKey Citation style key.
 * @param {Object} options  Formatting options.
 * @return {string} Formatted bibliography string.
 *
 * @since 0.1.0
 */
export async function formatBibliographyEntry(csl, styleKey, options = {}) {
	const results = await formatBibliographyEntries([csl], styleKey, options);
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
