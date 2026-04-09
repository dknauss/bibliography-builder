# Bibliography 1.0.0 release notes

Bibliography 1.0.0 is the first public release of the block plugin for building semantically rich, automatically sorted bibliographies in WordPress.

## Highlights

- DOI and BibTeX input parsing via citation-js
- Manual entry with per-type validation
- Nine citation styles: Chicago Notes-Bibliography, Chicago Author-Date, APA 7, MLA 9, Harvard, Vancouver, IEEE, OSCOLA, and ABNT
- Automatic sorting per style rules
- Static save with semantic HTML and accessibility support
- JSON-LD output enabled by default, with optional CSL-JSON and COinS
- Export support for CSL-JSON, BibTeX, and RIS, plus copy actions
- Read-only REST API for bibliography access
- WordPress Playground support
- CI, runtime matrix, CodeQL, Psalm, PHPUnit, and Playwright coverage

## Included in the final 1.0.0 tag

- Lifecycle end-to-end tests for activate, deactivate, and delete flows
- Lifecycle CI coverage
- Updated WordPress.org banner and icon branding assets
- Aligned slug-facing identifiers around `bibliography`, including the text domain, package folder, Playground target, export filenames, and REST namespace
- Accessibility refinements for labels, notice regions, focus-visible states, and reduced-motion behavior
- Patched vulnerable transitive development dependency `basic-ftp`
