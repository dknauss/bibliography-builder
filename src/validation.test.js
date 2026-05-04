/**
 * Unit tests for the Block Accessibility Checks validation logic.
 */
import { validateBibliographyBlock } from './validation';

describe('validateBibliographyBlock', () => {
	describe('empty_bibliography check', () => {
		it('passes when citations array has at least one entry', () => {
			expect(
				validateBibliographyBlock(
					{ citations: [{ id: '1' }] },
					'empty_bibliography'
				)
			).toBe(true);
		});

		it('fails when citations array is empty', () => {
			expect(
				validateBibliographyBlock(
					{ citations: [] },
					'empty_bibliography'
				)
			).toBe(false);
		});

		it('fails when citations attribute is missing', () => {
			expect(validateBibliographyBlock({}, 'empty_bibliography')).toBe(
				false
			);
		});

		it('fails when citations is null', () => {
			expect(
				validateBibliographyBlock(
					{ citations: null },
					'empty_bibliography'
				)
			).toBe(false);
		});

		it('fails when citations is not an array', () => {
			expect(
				validateBibliographyBlock(
					{ citations: 'bad' },
					'empty_bibliography'
				)
			).toBe(false);
		});
	});

	describe('heading_missing check', () => {
		it('passes when headingText is a non-empty string', () => {
			expect(
				validateBibliographyBlock(
					{ headingText: 'References' },
					'heading_missing'
				)
			).toBe(true);
		});

		it('fails when headingText is an empty string', () => {
			expect(
				validateBibliographyBlock(
					{ headingText: '' },
					'heading_missing'
				)
			).toBe(false);
		});

		it('fails when headingText is missing', () => {
			expect(validateBibliographyBlock({}, 'heading_missing')).toBe(
				false
			);
		});

		it('fails when headingText is whitespace-only', () => {
			expect(
				validateBibliographyBlock(
					{ headingText: '   ' },
					'heading_missing'
				)
			).toBe(false);
		});
	});

	describe('unknown check name', () => {
		it('returns true (passes) for unrecognised check names', () => {
			expect(validateBibliographyBlock({}, 'some_future_check')).toBe(
				true
			);
		});
	});
});
