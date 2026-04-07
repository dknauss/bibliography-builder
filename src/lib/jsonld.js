/**
 * CSL-JSON to Schema.org JSON-LD mapper.
 */

const TYPE_MAP = {
	'article-journal': 'ScholarlyArticle',
	book: 'Book',
	chapter: 'Chapter',
	thesis: 'Thesis',
	report: 'Report',
	'paper-conference': 'ScholarlyArticle',
	webpage: 'WebPage',
};

function isLikelyOrganizationAuthor(author) {
	return Boolean(author?.literal && !author.family && !author.given);
}

function getPrimaryIdentifierValue(value) {
	if (Array.isArray(value)) {
		return value.find((item) => typeof item === 'string' && item) || '';
	}

	return typeof value === 'string' ? value : '';
}

/**
 * Map a single CSL-JSON object to a Schema.org JSON-LD object.
 *
 * @param {Object} csl CSL-JSON object.
 * @return {Object} Schema.org typed object.
 *
 * @since 0.1.0
 */
export function cslToJsonLd(csl) {
	const schemaType = TYPE_MAP[csl.type] || 'CreativeWork';

	const result = {
		'@context': 'https://schema.org',
		'@type': schemaType,
		name: csl.title || '',
	};

	// Authors.
	if (csl.author && csl.author.length) {
		result.author = csl.author.map((a) => {
			if (isLikelyOrganizationAuthor(a)) {
				return {
					'@type': 'Organization',
					name: a.literal,
				};
			}

			const person = {
				'@type': 'Person',
				name:
					a.literal || [a.given, a.family].filter(Boolean).join(' '),
			};
			if (a.family) {
				person.familyName = a.family;
			}
			if (a.given) {
				person.givenName = a.given;
			}
			if (a.ORCID) {
				person.sameAs = a.ORCID.startsWith('http')
					? a.ORCID
					: 'https://orcid.org/' + a.ORCID;
			}
			return person;
		});
	}

	// Date.
	if (csl.issued && csl.issued['date-parts'] && csl.issued['date-parts'][0]) {
		const parts = csl.issued['date-parts'][0];
		result.datePublished = parts
			.map((part, index) =>
				index === 0 ? String(part) : String(part).padStart(2, '0')
			)
			.join('-');
	}

	// Publication context.
	if (csl['container-title']) {
		if (csl.type === 'article-journal') {
			result.isPartOf = {
				'@type': 'Periodical',
				name: csl['container-title'],
			};
			if (csl.ISSN) {
				result.isPartOf.issn = Array.isArray(csl.ISSN)
					? csl.ISSN[0]
					: csl.ISSN;
			}
		} else if (csl.type === 'paper-conference') {
			result.isPartOf = {
				'@type': 'Event',
				name: csl['container-title'],
			};
		}
	}

	if (csl.publisher) {
		result.publisher = {
			'@type': 'Organization',
			name: csl.publisher,
		};
	}

	// Identifiers.
	if (csl.DOI) {
		result.identifier = {
			'@type': 'PropertyValue',
			propertyID: 'DOI',
			value: csl.DOI,
		};
		// Note: Uses https://doi.org/ for Schema.org JSON-LD compatibility.
		// COinS output (coins.js) uses info:doi/ per OpenURL convention.
		result.url = 'https://doi.org/' + encodeURIComponent(csl.DOI);
	}

	const isbn = getPrimaryIdentifierValue(csl.ISBN);
	if (isbn) {
		result.isbn = isbn;
	}

	if (csl.URL && !result.url) {
		result.url = csl.URL;
	}

	return result;
}

/**
 * Convert an array of CSL-JSON objects to a JSON-LD array and serialize.
 * Escapes </ sequences to prevent script tag breakout.
 *
 * @param {Array} cslArray Array of CSL-JSON objects.
 * @return {string} Safe JSON string for embedding in a <script> tag.
 *
 * @since 0.1.0
 */
export function buildJsonLdString(cslArray) {
	const data = cslArray.map(cslToJsonLd);
	return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * Serialize a CSL-JSON array for the CSL-JSON script block.
 * Escapes </ sequences to prevent script tag breakout.
 *
 * @param {Array} cslArray Array of CSL-JSON objects.
 * @return {string} Safe JSON string.
 *
 * @since 0.1.0
 */
export function buildCslJsonString(cslArray) {
	return JSON.stringify(cslArray).replace(/</g, '\\u003c');
}
