import { getDisplayText } from './formatting';
import { sortCitations } from './sorter';

export const CSL_JSON_EXPORT_FILENAME = 'scholarly-bibliography.csl.json';
export const CSL_JSON_EXPORT_MIME_TYPE =
	'application/vnd.citationstyles.csl+json;charset=utf-8';
export const BIBTEX_EXPORT_FILENAME = 'scholarly-bibliography.bib';
export const BIBTEX_EXPORT_MIME_TYPE = 'text/x-bibtex;charset=utf-8';
export const RIS_EXPORT_FILENAME = 'scholarly-bibliography.ris';
export const RIS_EXPORT_MIME_TYPE =
	'application/x-research-info-systems;charset=utf-8';

async function getCiteConstructor() {
	const [{ Cite }] = await Promise.all([
		import('@citation-js/core'),
		import('@citation-js/plugin-bibtex'),
		import('@citation-js/plugin-csl'),
	]);

	return Cite;
}

const RIS_TYPE_MAP = {
	'article-journal': 'JOUR',
	'article-magazine': 'MGZN',
	'article-newspaper': 'NEWS',
	book: 'BOOK',
	chapter: 'CHAP',
	collection: 'BOOK',
	thesis: 'THES',
	report: 'RPRT',
	'paper-conference': 'CONF',
	webpage: 'ELEC',
	review: 'GEN',
	'review-book': 'GEN',
};

function getRisType(csl) {
	return RIS_TYPE_MAP[csl.type] || 'GEN';
}

function appendRisLine(lines, tag, value) {
	if (value === undefined || value === null || value === '') {
		return;
	}

	lines.push(`${tag}  - ${value}`);
}

function getYear(csl) {
	return csl.issued?.['date-parts']?.[0]?.[0];
}

function splitPageRange(page = '') {
	const [start, end] = String(page).split(/\s*[-–—]\s*/u);

	return {
		start: start || '',
		end: end || '',
	};
}

function getPrimaryIdentifierValue(value) {
	if (Array.isArray(value)) {
		return value.find((item) => typeof item === 'string' && item) || '';
	}

	return value;
}

function formatRisAuthor(author) {
	if (author.literal) {
		return author.literal;
	}

	if (author.family && author.given) {
		return `${author.family}, ${author.given}`;
	}

	return author.family || author.given || '';
}

function cslToRisEntry(csl) {
	const lines = [];
	const { start, end } = splitPageRange(csl.page);

	appendRisLine(lines, 'TY', getRisType(csl));

	for (const author of csl.author || []) {
		appendRisLine(lines, 'AU', formatRisAuthor(author));
	}

	for (const editor of csl.editor || []) {
		appendRisLine(lines, 'A2', formatRisAuthor(editor));
	}

	appendRisLine(lines, 'TI', csl.title);
	appendRisLine(
		lines,
		csl.type === 'book' ? 'BT' : 'T2',
		csl['container-title']
	);
	appendRisLine(lines, 'PB', csl.publisher);
	appendRisLine(lines, 'PY', getYear(csl));
	appendRisLine(lines, 'DA', getYear(csl));
	appendRisLine(lines, 'VL', csl.volume);
	appendRisLine(lines, 'IS', csl.issue);
	appendRisLine(lines, 'SP', start);
	appendRisLine(lines, 'EP', end);
	appendRisLine(lines, 'DO', csl.DOI);
	appendRisLine(lines, 'UR', csl.URL);
	appendRisLine(lines, 'LA', csl.language);
	appendRisLine(
		lines,
		'SN',
		getPrimaryIdentifierValue(csl.ISBN) ||
			getPrimaryIdentifierValue(csl.ISSN)
	);

	lines.push('ER  - ');

	return lines.join('\n');
}

export function buildPlainTextBibliographyContent(citations, citationStyle) {
	const sortedCitations = sortCitations(citations, citationStyle);

	return `${sortedCitations
		.map((citation) => getDisplayText(citation))
		.join('\n')}\n`;
}

export function buildCslJsonExportContent(citations, citationStyle) {
	const sortedCitations = sortCitations(citations, citationStyle);
	const cslArray = sortedCitations.map((citation) => citation.csl);

	return `${JSON.stringify(cslArray, null, 2)}\n`;
}

export function downloadTextExport(
	{ content, filename, mimeType },
	{ documentRef = document, urlRef = URL, BlobCtor = Blob } = {}
) {
	if (
		!documentRef?.createElement ||
		!documentRef?.body ||
		!urlRef?.createObjectURL ||
		!BlobCtor
	) {
		throw new Error('Download API unavailable');
	}

	const fileBlob = new BlobCtor([content], {
		type: mimeType,
	});
	const downloadUrl = urlRef.createObjectURL(fileBlob);
	const link = documentRef.createElement('a');

	link.href = downloadUrl;
	link.download = filename;
	link.rel = 'noopener';
	documentRef.body.appendChild(link);
	link.click();
	link.remove();
	urlRef.revokeObjectURL?.(downloadUrl);

	return undefined;
}

export function downloadCslJsonExport(citations, citationStyle, dependencies) {
	return downloadTextExport(
		{
			content: buildCslJsonExportContent(citations, citationStyle),
			filename: CSL_JSON_EXPORT_FILENAME,
			mimeType: CSL_JSON_EXPORT_MIME_TYPE,
		},
		dependencies
	);
}

export async function buildBibtexExportContent(
	citations,
	citationStyle,
	{ CiteCtor } = {}
) {
	const sortedCitations = sortCitations(citations, citationStyle);
	const cslArray = sortedCitations.map((citation) => citation.csl);
	const CiteClass = CiteCtor || (await getCiteConstructor());
	const cite = new CiteClass(cslArray);

	return `${cite.format('bibtex')}\n`;
}

export async function downloadBibtexExport(
	citations,
	citationStyle,
	dependencies
) {
	const { CiteCtor, ...downloadDependencies } = dependencies || {};

	return downloadTextExport(
		{
			content: await buildBibtexExportContent(citations, citationStyle, {
				CiteCtor,
			}),
			filename: BIBTEX_EXPORT_FILENAME,
			mimeType: BIBTEX_EXPORT_MIME_TYPE,
		},
		downloadDependencies
	);
}

export function buildRisExportContent(citations, citationStyle) {
	const sortedCitations = sortCitations(citations, citationStyle);
	const cslArray = sortedCitations.map((citation) => citation.csl);

	return `${cslArray.map(cslToRisEntry).join('\n\n')}\n`;
}

export function downloadRisExport(citations, citationStyle, dependencies) {
	return downloadTextExport(
		{
			content: buildRisExportContent(citations, citationStyle),
			filename: RIS_EXPORT_FILENAME,
			mimeType: RIS_EXPORT_MIME_TYPE,
		},
		dependencies
	);
}
