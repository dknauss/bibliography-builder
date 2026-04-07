import { buildCslJsonString, buildJsonLdString, cslToJsonLd } from './jsonld';

describe('cslToJsonLd', () => {
	it('maps journal articles to ScholarlyArticle with Periodical context and DOI URL', () => {
		expect(
			cslToJsonLd({
				type: 'article-journal',
				title: 'Learning Blocks',
				'container-title': 'Journal of WordPress Studies',
				ISSN: ['1234-5678'],
				DOI: '10.1234/example-doi',
				issued: {
					'date-parts': [[2024, 3, 1]],
				},
				author: [
					{
						given: 'Ada',
						family: 'Smith',
					},
				],
			})
		).toEqual({
			'@context': 'https://schema.org',
			'@type': 'ScholarlyArticle',
			name: 'Learning Blocks',
			author: [
				{
					'@type': 'Person',
					name: 'Ada Smith',
					familyName: 'Smith',
					givenName: 'Ada',
				},
			],
			datePublished: '2024-03-01',
			isPartOf: {
				'@type': 'Periodical',
				name: 'Journal of WordPress Studies',
				issn: '1234-5678',
			},
			identifier: {
				'@type': 'PropertyValue',
				propertyID: 'DOI',
				value: '10.1234/example-doi',
			},
			url: 'https://doi.org/10.1234/example-doi',
		});
	});

	it('keeps year-only dates unchanged when month and day are absent', () => {
		expect(
			cslToJsonLd({
				type: 'book',
				title: 'Year Only Example',
				issued: {
					'date-parts': [[2024]],
				},
			})
		).toMatchObject({
			datePublished: '2024',
		});
	});

	it('normalizes ORCID values and maps publishers for books', () => {
		expect(
			cslToJsonLd({
				type: 'book',
				title: 'The Channels of Student Activism',
				publisher: 'University of Chicago Press',
				ISBN: '9780226819909',
				author: [
					{
						given: 'Amy J.',
						family: 'Binder',
						ORCID: '0000-0001-2345-6789',
					},
				],
			})
		).toEqual({
			'@context': 'https://schema.org',
			'@type': 'Book',
			name: 'The Channels of Student Activism',
			author: [
				{
					'@type': 'Person',
					name: 'Amy J. Binder',
					familyName: 'Binder',
					givenName: 'Amy J.',
					sameAs: 'https://orcid.org/0000-0001-2345-6789',
				},
			],
			publisher: {
				'@type': 'Organization',
				name: 'University of Chicago Press',
			},
			isbn: '9780226819909',
		});
	});

	it('maps conference papers to Event containers and keeps explicit URLs', () => {
		expect(
			cslToJsonLd({
				type: 'paper-conference',
				title: 'Block Interactivity',
				'container-title': 'Gutenberg Summit',
				URL: 'https://example.com/slides',
				author: [
					{
						literal: 'OpenAI',
					},
				],
			})
		).toEqual({
			'@context': 'https://schema.org',
			'@type': 'ScholarlyArticle',
			name: 'Block Interactivity',
			author: [
				{
					'@type': 'Organization',
					name: 'OpenAI',
				},
			],
			isPartOf: {
				'@type': 'Event',
				name: 'Gutenberg Summit',
			},
			url: 'https://example.com/slides',
		});
	});

	it('maps literal-only corporate authors to Organization instead of Person', () => {
		expect(
			cslToJsonLd({
				type: 'webpage',
				title: 'Privacy Policy',
				author: [
					{
						literal: 'Google',
					},
				],
			})
		).toMatchObject({
			author: [
				{
					'@type': 'Organization',
					name: 'Google',
				},
			],
		});
	});
});

describe('buildJsonLdString', () => {
	it('escapes script breakouts in JSON-LD output', () => {
		const json = buildJsonLdString([
			{
				type: 'webpage',
				title: '</script><script>alert(1)</script>',
			},
		]);

		expect(json).toContain(
			'\\u003c/script>\\u003cscript>alert(1)\\u003c/script>'
		);
		expect(json).not.toContain('</script><script>');
	});
});

describe('buildCslJsonString', () => {
	it('escapes script breakouts in serialized CSL-JSON output', () => {
		const json = buildCslJsonString([
			{
				type: 'book',
				title: '</script><script>alert(1)</script>',
			},
		]);

		expect(json).toContain(
			'\\u003c/script>\\u003cscript>alert(1)\\u003c/script>'
		);
		expect(json).not.toContain('</script><script>');
	});
});
