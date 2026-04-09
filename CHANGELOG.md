# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No changes yet.

## [1.0.0] - 2026-04-07

### Added

- DOI and BibTeX input parsing via citation-js.
- Supported formatted citation input for books, articles, chapters, webpages, reviews, and theses.
- Manual entry with structured fields and per-type validation.
- Nine citation styles: Chicago Notes-Bibliography (default), Chicago Author-Date, APA 7, MLA 9, Harvard, Vancouver, IEEE, OSCOLA, and ABNT.
- Automatic alphabetical sorting per style rules.
- Duplicate detection across paste and manual entry.
- Static save with semantic HTML (DPUB-ARIA roles, `<cite>` wrappers, `lang` attributes).
- Schema.org JSON-LD structured data output (on by default).
- Optional CSL-JSON machine-readable output.
- Optional COinS metadata for citation manager detection.
- Export: Download CSL-JSON, BibTeX, RIS; copy per-entry or full bibliography.
- Read-only REST API for programmatic bibliography access.
- Editor UI with paste zone, manual entry, per-entry edit/delete, and keyboard accessibility.
- Block-local Gutenberg notices with focus management.
- Structured per-field editing for heuristic or warning-marked citations.
- Lazy-loaded CSL style templates.
- XSS prevention: HTML escaping for citation text, `</` escaping in script blocks, HTML tag stripping from CrossRef metadata.
- Input caps: 50 entries per paste, 1 MB max input size.
- GitHub Actions CI: lint, test, build, PHPUnit, Psalm, CodeQL, Codecov, Playwright Playground smoke tests, runtime matrix.
- Release workflow with tag-triggered GitHub Release and zip artifact.
- WordPress Playground blueprint for instant evaluation.
- Lifecycle end-to-end tests for activate, deactivate, and delete flows.
- Lifecycle CI coverage.
- Refined WordPress.org branding assets, including updated banner and icon artwork.
- Bundled interface locale files for French, German, Dutch, Swedish, Spanish, Italian, Portuguese, Polish, Russian, Japanese, Simplified Chinese, Korean, Serbian, Croatian, Brazilian Portuguese, Hindi, Bengali, Tamil, and Telugu.

### Changed

- Improved reset icon from minus to counterclockwise arrow for clarity.
- `aria-label` on bibliography section now matches custom heading text when set.
- Added an accessible name to citation entry buttons.
- Added `role="region"` and `aria-label` to the editor notice container.
- Added `prefers-reduced-motion` override for action button transitions.
- Added `focus-visible` outline to bibliography list entries.
- Removed the redundant `aria-label` from the inline edit input.
- Aligned the plugin slug-facing identifiers around `bibliography`, including the text domain, release package folder, Playground install target, export filenames, and REST namespace.

### Security

- Overrode the vulnerable transitive development dependency `basic-ftp` to the patched release.
