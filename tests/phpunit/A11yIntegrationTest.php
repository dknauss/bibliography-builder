<?php

use PHPUnit\Framework\TestCase;

final class BibliographyBuilderFakeA11yRegistry {
	public $checks = array();

	public function register_block_check( $block_name, $check_name, $args ) {
		$this->checks[] = array(
			'block_name' => $block_name,
			'check_name' => $check_name,
			'args'       => $args,
		);
	}
}

final class A11yIntegrationTest extends TestCase {

	protected function setUp(): void {
		parent::setUp();
		bibliography_builder_test_reset_state();
	}

	public function test_register_a11y_checks_ignores_invalid_registry(): void {
		$this->assertNull( bibliography_builder_register_a11y_checks( null ) );

		$result = bibliography_builder_register_a11y_checks( new stdClass() );

		$this->assertNull( $result );
	}

	public function test_register_a11y_checks_registers_bibliography_checks(): void {
		$registry = new BibliographyBuilderFakeA11yRegistry();

		bibliography_builder_register_a11y_checks( $registry );

		$this->assertCount( 2, $registry->checks );
		$this->assertSame( 'bibliography-builder/bibliography', $registry->checks[0]['block_name'] );
		$this->assertSame( 'empty_bibliography', $registry->checks[0]['check_name'] );
		$this->assertSame( 'error', $registry->checks[0]['args']['type'] );
		$this->assertSame( 'accessibility', $registry->checks[0]['args']['category'] );
		$this->assertSame( 'bibliography-builder/bibliography', $registry->checks[1]['block_name'] );
		$this->assertSame( 'heading_missing', $registry->checks[1]['check_name'] );
		$this->assertSame( 'warning', $registry->checks[1]['args']['type'] );
		$this->assertSame( 'accessibility', $registry->checks[1]['args']['category'] );
	}

	public function test_enqueue_a11y_validation_is_noop_when_bac_script_is_absent(): void {
		bibliography_builder_enqueue_a11y_validation();

		$this->assertSame( array(), $GLOBALS['bibliography_builder_test_enqueued_scripts'] );
	}

	public function test_enqueue_a11y_validation_is_noop_when_asset_file_is_missing(): void {
		$asset_file     = BIBLIOGRAPHY_BUILDER_PLUGIN_DIR . 'build/validation.asset.php';
		$had_asset_file = file_exists( $asset_file );
		$original_asset = $had_asset_file ? file_get_contents( $asset_file ) : null;

		if ( $had_asset_file ) {
			unlink( $asset_file );
		}

		try {
			$GLOBALS['bibliography_builder_test_registered_scripts']['block-accessibility-script']['registered'] = true;

			bibliography_builder_enqueue_a11y_validation();

			$this->assertSame( array(), $GLOBALS['bibliography_builder_test_enqueued_scripts'] );
		} finally {
			if ( $had_asset_file ) {
				file_put_contents( $asset_file, $original_asset );
			}
		}
	}

	public function test_enqueue_a11y_validation_enqueues_when_bac_script_is_registered(): void {
		$asset_file     = BIBLIOGRAPHY_BUILDER_PLUGIN_DIR . 'build/validation.asset.php';
		$asset_dir      = dirname( $asset_file );
		$had_asset_file = file_exists( $asset_file );
		$original_asset = $had_asset_file ? file_get_contents( $asset_file ) : null;

		if ( ! is_dir( $asset_dir ) ) {
			mkdir( $asset_dir, 0777, true );
		}

		file_put_contents(
			$asset_file,
			"<?php\nreturn array( 'dependencies' => array( 'wp-hooks' ), 'version' => 'test-version' );\n"
		);

		try {
			$GLOBALS['bibliography_builder_test_registered_scripts']['block-accessibility-script']['registered'] = true;

			bibliography_builder_enqueue_a11y_validation();

			$this->assertArrayHasKey(
				'borges-bibliography-builder-a11y-validation',
				$GLOBALS['bibliography_builder_test_enqueued_scripts']
			);

			$script = $GLOBALS['bibliography_builder_test_enqueued_scripts']['borges-bibliography-builder-a11y-validation'];

			$this->assertStringEndsWith( '/build/validation.js', $script['src'] );
			$this->assertSame( 'test-version', $script['ver'] );
			$this->assertContains( 'wp-hooks', $script['deps'] );
			$this->assertContains( 'block-accessibility-script', $script['deps'] );
			$this->assertTrue( $script['args'] );
		} finally {
			if ( $had_asset_file ) {
				file_put_contents( $asset_file, $original_asset );
			} elseif ( file_exists( $asset_file ) ) {
				unlink( $asset_file );
			}
		}
	}

	public function test_block_init_registers_block_metadata_directory(): void {
		bibliography_builder_block_init();

		$this->assertSame(
			array( rtrim( BIBLIOGRAPHY_BUILDER_PLUGIN_DIR, '/' ) ),
			$GLOBALS['bibliography_builder_test_registered_block_types']
		);
	}
}
