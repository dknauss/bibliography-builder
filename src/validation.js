/**
 * Optional Block Accessibility Checks (BAC) integration.
 *
 * Registers authoring-time accessibility checks for the bibliography block
 * when Troy Chaplin's Block Accessibility Checks plugin is active. This is a
 * soft dependency: the script is only enqueued when the BAC framework is
 * present, and the filter is a no-op if the framework never calls it.
 *
 * Checks registered:
 *   - empty_bibliography  (error)   — block has no citations
 *   - heading_missing     (warning) — headingText is blank; no heading visible
 *
 * @see https://github.com/troychaplin/block-accessibility-checks
 * @since 1.1.0
 */
import { addFilter } from '@wordpress/hooks';

const BLOCK_TYPE = 'bibliography-builder/bibliography';
const NAMESPACE = 'borges-bibliography-builder/bac-validation';

/**
 * Pure validation logic — exported for unit testing.
 *
 * @param {Object} attributes Block attributes.
 * @param {string} checkName  BAC check identifier.
 * @return {boolean} True if the check passes; false if it fails.
 */
export function validateBibliographyBlock( attributes, checkName ) {
	if ( checkName === 'empty_bibliography' ) {
		return (
			Array.isArray( attributes.citations ) &&
			attributes.citations.length > 0
		);
	}

	if ( checkName === 'heading_missing' ) {
		return (
			typeof attributes.headingText === 'string' &&
			attributes.headingText.trim().length > 0
		);
	}

	// Unknown checks pass through unchanged.
	return true;
}

/**
 * BAC filter: validate bibliography block attributes.
 *
 * @param {boolean} isValid    Current validity state from previous filters.
 * @param {string}  blockType  Block name.
 * @param {Object}  attributes Block attributes.
 * @param {string}  checkName  BAC check identifier.
 * @return {boolean} Validity result.
 */
function bacValidateBlock( isValid, blockType, attributes, checkName ) {
	if ( blockType !== BLOCK_TYPE ) {
		return isValid;
	}

	return validateBibliographyBlock( attributes, checkName );
}

addFilter( 'ba11yc_validate_block', NAMESPACE, bacValidateBlock );
