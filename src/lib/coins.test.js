import { buildCoins } from './coins';

describe('buildCoins', () => {
	it('encodes journal article metadata including DOI and page ranges', () => {
		const title = buildCoins({
			type: 'article-journal',
			title: 'Learning <Blocks>',
			'container-title': 'Journal of WordPress Studies',
			volume: '12',
			issue: '3',
			page: '117–134',
			DOI: '10.1234/example-doi',
			author: [
				{
					given: 'Ada',
					family: 'Smith',
				},
			],
			issued: {
				'date-parts': [[2024]],
			},
		});
		const params = new URLSearchParams(title);

		expect(params.get('rft.atitle')).toBe('Learning <Blocks>');
		expect(params.get('rft.jtitle')).toBe('Journal of WordPress Studies');
		expect(params.get('rft.volume')).toBe('12');
		expect(params.get('rft.issue')).toBe('3');
		expect(params.get('rft.spage')).toBe('117');
		expect(params.get('rft.epage')).toBe('134');
		expect(params.get('rft.date')).toBe('2024');
		expect(params.get('rft_id')).toBe('info:doi/10.1234/example-doi');
	});

	it('includes both chapter and container titles for book chapters', () => {
		const title = buildCoins({
			type: 'chapter',
			title: 'A Chapter Title',
			'container-title': 'The Collected Book',
			publisher: 'Example Press',
		});
		const params = new URLSearchParams(title);

		expect(params.get('rft.atitle')).toBe('A Chapter Title');
		expect(params.get('rft.btitle')).toBe('The Collected Book');
		expect(params.get('rft.pub')).toBe('Example Press');
	});

	it('percent-encodes dangerous characters to prevent attribute injection', () => {
		const title = buildCoins({
			type: 'article-journal',
			title: '"><script>alert(1)</script>',
			author: [
				{
					family: 'O"Neil',
					given: 'Ada & Co',
				},
			],
		});

		expect(title).toContain(
			'rft.atitle=%22%3E%3Cscript%3Ealert(1)%3C%2Fscript%3E'
		);
		expect(title).toContain('rft.aulast=O%22Neil');
		expect(title).toContain('rft.aufirst=Ada%20%26%20Co');
		expect(title).not.toContain('<script>');
		expect(title).not.toContain('"');
	});
});
