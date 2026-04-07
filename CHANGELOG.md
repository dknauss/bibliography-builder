# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Documented that focus-management transitions after parse, delete, and edit confirm/cancel are already implemented and covered by tests; clarified the stale review finding in `.planning/review-notes/2026-04-04-stale-focus-review-finding.md`.

### Added

- Initial project scaffold.
- DOI and BibTeX input parsing via citation-js.
- Chicago Author-Date formatting (17th edition).
- Automatic alphabetical sorting (author, year, title).
- Static save with semantic HTML (DPUB-ARIA roles, `<cite>`, `lang` attributes).
- Schema.org JSON-LD structured data output.
- CSL-JSON machine-readable output.
- COinS metadata for citation manager detection.
- Editor UI with paste zone, per-entry edit/delete, and keyboard accessibility.
- XSS prevention: HTML escaping for citation text, `</` escaping in script blocks.
- Input caps: 50 entries per paste, 1MB max input size.
