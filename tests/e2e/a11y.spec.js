/**
 * Accessibility spec: automated WCAG audit + key authoring-time behavioral checks.
 *
 * Runs axe-core WCAG 2.1 AA scans on:
 *   1. The bibliography block in the Gutenberg editor.
 *   2. The published frontend output.
 *
 * Also verifies core keyboard / ARIA patterns so regressions are caught by CI
 * rather than only discovered via manual audits.
 *
 * Prerequisites:
 *   - WordPress Playground (or a local install) running at PLAYWRIGHT_BASE_URL.
 *   - The Bibliography Builder plugin is active.
 *
 * Run:
 *   npm run test:e2e -- tests/e2e/a11y.spec.js
 */
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// Sample BibTeX entry — no network required (avoids CrossRef dependency).
const SAMPLE_BIBTEX = `@article{a11y2026,
  author = {Audit, Avery},
  title  = {Keyboard Accessible Bibliographies},
  journal = {Journal of Block Testing},
  year   = {2026},
  volume = {1},
  number = {1},
  pages  = {1--9},
  url    = {https://example.com/a11y}
}`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Dismiss Gutenberg welcome / tour dialogs.
 */
async function dismissEditorOverlays( page ) {
	for ( let i = 0; i < 3; i++ ) {
		const dialog = page.getByRole( 'dialog' ).first();
		if ( await dialog.isVisible().catch( () => false ) ) {
			const close = dialog
				.getByRole( 'button', {
					name: /Close|Dismiss|Got it|Okay|OK|Done|Skip/i,
				} )
				.first();
			if ( await close.isVisible().catch( () => false ) ) {
				await close.click( { force: true } );
				await page.waitForTimeout( 400 );
				continue;
			}
		}
		await page.keyboard.press( 'Escape' );
		await page.waitForTimeout( 300 );
	}
}

/**
 * Return the editor frame (handles the optional editor-canvas iframe in WP 6.x+).
 */
async function getEditorFrame( page ) {
	const iframeLocator = page.frameLocator( 'iframe[name="editor-canvas"]' );
	if (
		await iframeLocator
			.locator( 'body' )
			.isVisible( { timeout: 3000 } )
			.catch( () => false )
	) {
		return iframeLocator;
	}
	return page;
}

/**
 * Insert the Bibliography block via the block inserter.
 * Returns true on success.
 */
async function insertBibliographyBlock( page ) {
	const inserterBtn = page.getByRole( 'button', {
		name: /Block Inserter|Toggle block inserter/i,
	} );
	if ( await inserterBtn.isVisible().catch( () => false ) ) {
		await inserterBtn.click();
		await page.waitForTimeout( 800 );
	}

	const search = page.getByRole( 'searchbox', { name: /Search/i } ).first();
	if ( await search.isVisible( { timeout: 3000 } ).catch( () => false ) ) {
		await search.fill( 'bibliography' );
		await page.waitForTimeout( 800 );
	}

	const blockItem = page
		.locator( '.block-editor-block-types-list__item' )
		.filter( { hasText: 'Bibliography' } )
		.first();

	await blockItem.waitFor( { state: 'visible', timeout: 10000 } );
	await blockItem.click();
	await page.waitForTimeout( 1000 );
	return true;
}

/**
 * Add a BibTeX citation to the already-inserted block and wait for the entry.
 */
async function addBibtexCitation( page, editorFrame ) {
	const textarea = editorFrame.locator( 'textarea' ).first();
	await textarea.waitFor( { state: 'visible', timeout: 8000 } );
	await textarea.fill( SAMPLE_BIBTEX );
	await page.waitForTimeout( 300 );

	const addBtn = editorFrame
		.getByRole( 'button', { name: /^Add$/i } )
		.first();
	await addBtn.click();

	await editorFrame
		.locator( '.bibliography-builder-entry' )
		.first()
		.waitFor( { state: 'visible', timeout: 15000 } );
}

/**
 * Publish the current post and return its frontend URL.
 */
async function publishPost( page ) {
	return page.evaluate( async () => {
		const { data } = window.wp || {};
		if ( ! data ) throw new Error( 'wp.data not available.' );

		const dispatch = data.dispatch( 'core/editor' );
		const select = data.select( 'core/editor' );

		dispatch.editPost( {
			title: `A11y Spec ${ Date.now() }`,
			status: 'publish',
		} );
		await dispatch.savePost();

		const post = select.getCurrentPost();
		if ( post?.link ) return post.link;

		const postId = post?.id || select.getCurrentPostId();
		if ( ! postId ) throw new Error( 'No post ID after save.' );

		const nonce = window.wpApiSettings?.nonce;
		const res = await fetch( `/wp-json/wp/v2/posts/${ postId }?context=edit`, {
			headers: nonce ? { 'X-WP-Nonce': nonce } : {},
		} );
		if ( ! res.ok ) throw new Error( `Failed fetching post ${ postId }.` );
		const json = await res.json();
		return json?.link || '';
	} );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe( 'Bibliography block — accessibility', () => {
	let editorFrame;

	test.beforeEach( async ( { page } ) => {
		await page.goto( '/wp-admin/post-new.php' );
		await page.waitForLoadState( 'domcontentloaded' );
		await page.waitForTimeout( 2000 );
		await dismissEditorOverlays( page );
		await insertBibliographyBlock( page );
		editorFrame = await getEditorFrame( page );
	} );

	// -------------------------------------------------------------------------
	// Keyboard / ARIA checks
	// -------------------------------------------------------------------------

	test( 'toolbar mode buttons have role=button and aria-pressed', async ( {
		page,
	} ) => {
		const pasteBtn = page
			.getByRole( 'button', { name: /Paste.*Import/i } )
			.first();
		const manualBtn = page
			.getByRole( 'button', { name: /Manual Entry/i } )
			.first();

		await expect( pasteBtn ).toBeVisible();
		await expect( manualBtn ).toBeVisible();

		// Default mode: Paste/Import pressed
		await expect( pasteBtn ).toHaveAttribute( 'aria-pressed', 'true' );
	} );

	test( 'toolbar mode can be switched via keyboard', async ( { page } ) => {
		const manualBtn = page
			.getByRole( 'button', { name: /Manual Entry/i } )
			.first();
		await manualBtn.focus();
		await page.keyboard.press( 'Enter' );
		await page.waitForTimeout( 500 );

		await expect( manualBtn ).toHaveAttribute( 'aria-pressed', 'true' );

		// Manual entry form should now be visible
		const typeSelect = editorFrame.getByLabel( 'Publication Type' );
		await expect( typeSelect ).toBeVisible( { timeout: 3000 } );
	} );

	test( 'citation textarea has accessible label', async ( { page } ) => {
		const textarea = editorFrame.locator( 'textarea' ).first();
		await expect( textarea ).toBeVisible();
		const ariaLabel = await textarea.getAttribute( 'aria-label' );
		const associatedLabelId = await textarea.getAttribute( 'aria-labelledby' );
		// Must have either aria-label or aria-labelledby
		expect( ariaLabel || associatedLabelId ).toBeTruthy();
	} );

	test( 'citation entries are reachable by keyboard', async ( { page } ) => {
		await addBibtexCitation( page, editorFrame );

		const entry = editorFrame
			.locator( '.bibliography-builder-entry' )
			.first();
		const tabindex = await entry.getAttribute( 'tabindex' );
		// Entries should be focusable (tabindex="0" or "-1" with programmatic focus)
		expect( tabindex ).not.toBeNull();
	} );

	test( 'bibliography list uses semantic list markup', async ( { page } ) => {
		await addBibtexCitation( page, editorFrame );

		const list = editorFrame.locator( '.bibliography-builder-list' ).first();
		await expect( list ).toBeVisible();
		const tag = await list.evaluate( ( el ) => el.tagName.toLowerCase() );
		expect( [ 'ul', 'ol' ] ).toContain( tag );
	} );

	// -------------------------------------------------------------------------
	// Axe WCAG scans
	// -------------------------------------------------------------------------

	test( 'editor block has no automated WCAG 2.1 AA axe violations', async ( {
		page,
	} ) => {
		await addBibtexCitation( page, editorFrame );

		// Scope axe to the block itself; whole-editor scans flag WP Core issues.
		const usesIframe = page
			.frames()
			.some( ( f ) => f.name() === 'editor-canvas' );

		const axeResults = await new AxeBuilder( { page } )
			.withTags( WCAG_TAGS )
			.include(
				usesIframe
					? [
							'iframe[name="editor-canvas"]',
							'.wp-block-bibliography-builder-bibliography',
					  ]
					: '.wp-block-bibliography-builder-bibliography'
			)
			.analyze();

		if ( axeResults.violations.length > 0 ) {
			const summary = axeResults.violations
				.map(
					( v ) =>
						`${ v.id } (${ v.impact }): ${ v.help } — ${ v.nodes
							.slice( 0, 2 )
							.map( ( n ) => n.target.join( ' ' ) )
							.join( '; ' ) }`
				)
				.join( '\n' );
			throw new Error(
				`axe found ${ axeResults.violations.length } violation(s):\n${ summary }`
			);
		}
	} );

	test( 'published frontend output has no automated WCAG 2.1 AA axe violations', async ( {
		page,
	} ) => {
		await addBibtexCitation( page, editorFrame );

		const frontendUrl = await publishPost( page );
		expect( frontendUrl ).toBeTruthy();

		await page.goto( frontendUrl );
		await page.waitForLoadState( 'networkidle' );

		await expect(
			page.locator( '.wp-block-bibliography-builder-bibliography' ).first()
		).toBeVisible( { timeout: 10000 } );

		const axeResults = await new AxeBuilder( { page } )
			.withTags( WCAG_TAGS )
			.include( '.wp-block-bibliography-builder-bibliography' )
			.analyze();

		if ( axeResults.violations.length > 0 ) {
			const summary = axeResults.violations
				.map(
					( v ) =>
						`${ v.id } (${ v.impact }): ${ v.help } — ${ v.nodes
							.slice( 0, 2 )
							.map( ( n ) => n.target.join( ' ' ) )
							.join( '; ' ) }`
				)
				.join( '\n' );
			throw new Error(
				`axe found ${ axeResults.violations.length } violation(s):\n${ summary }`
			);
		}
	} );
} );
