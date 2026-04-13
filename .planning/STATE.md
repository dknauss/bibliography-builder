# Project State

## Current Focus

1. v1.1 code-quality and maintainability sweep.
2. Multisite runtime smoke coverage.
3. Translation expansion backlog beyond the shipped interface locales.
4. Longer-horizon architecture and API follow-up.

## Current Priority Order

1. Code quality and maintainability sweep
    - consolidate `getPrimaryIdentifierValue`
    - upgrade the formatting cache from FIFO to LRU
    - clarify or rename the two `getYear` helpers with different sentinel semantics
    - continue module-scope i18n and prop-drilling cleanup where it buys testability or clarity
2. Runtime compatibility coverage
    - add a multisite smoke lane to the runtime matrix
    - keep SQLite and existing Apache/Nginx/PHP/WordPress lanes healthy
3. Translation expansion backlog
    - shipped interface locale files: French, German, Dutch, Swedish, Spanish, Italian, Portuguese, Polish, Russian, Japanese, Simplified Chinese, Korean, Serbian, Croatian, Brazilian Portuguese, Hindi, Bengali, Tamil, and Telugu
    - next recommended backlog locales: Arabic, Turkish, Indonesian, Hebrew, Vietnamese, Ukrainian, Romanian, and Czech
4. Longer-horizon product and architecture follow-up
    - citation child-block architecture option
    - inline citation integration
    - richer API fields, discovery, or collection-level endpoints
5. Low-priority UX follow-up
    - periodically re-check row-interaction accessibility
    - reconsider global snackbars for pure success-only cases if it ever improves clarity

## Last activity

Recent work completed in the working tree includes:

-   Claude bug-sweep follow-up landed: `outputJsonLd` REST defaults now honor the block attribute default when the key is absent, structured-edit cancellation now guards stale post-format commits, thesis COinS and chapter/review JSON-LD mappings were corrected, and 25 additional regression tests now cover those paths plus focus helper behavior
-   docs/spec/checklist sync across `README.md`, `SPEC.md`, and QA worksheets
-   reduced persisted citation payload for new entries by dropping `inputRaw`, `parsedAt`, and `parseConfidence`
-   bounded-concurrency DOI parsing with stable result ordering
-   tighter CSL validation for additional structured fields
-   JSON-LD corporate-author typing improvements (`Organization` for literal-only institutional authors)
-   metadata output controls verified live on the front end
-   additional spec-strength tests for sorting, `lang`, and review DOI fixtures
-   spec clarification that focus-management behavior is already implemented and tested
-   manual-entry v1 shipped with a second add mode, curated 6-type selector, and the current 8 structured fields plus Publication Type
-   Harvard, Vancouver, IEEE, MLA 9, OSCOLA, and ABNT are now enabled selectable styles, with formatter and save-path coverage
-   manual-entry formatting moved behind async loading so the main editor entrypoint stays small
-   Xdebug trace/profile capture confirms PHP runtime cost is mostly WordPress/theme bootstrap; plugin-specific PHP cost is concentrated in `build/index.asset.php`
-   editor-side CSL formatting now batches duplicate work, paste/import defers formatting until the editor actually needs it, and a repeatable local benchmark harness now records cold-cache timings
-   `parsePastedInput()` is now parse-first by default; callers must opt in explicitly if they want parser-owned formatting, and lint/tests/benchmarks/build all passed after the change
-   native notification follow-up landed: Gutenberg `Notice`/`Snackbar` primitives now handle block-local feedback with success-only snackbars and inline mixed-result validation notices
-   submission-readiness packaging landed: `npm run package:release` creates a clean artifact and Plugin Check passed against the staged release directory with no errors
-   CSL-JSON, BibTeX, and RIS exports now ship in the editor as practical downloadable bibliography-data formats
-   a per-entry copy-citation action now ships in the editor for reusing visible citation text
-   a Copy bibliography action now ships in the editor for copying the current bibliography as plain text
-   read-only REST endpoints now expose bibliography block data at `/wp-json/bibliography/v1/posts/<post_id>/bibliographies` and `/wp-json/bibliography/v1/posts/<post_id>/bibliographies/<index>`
-   GitHub Actions runtime coverage now spans additional Apache/Nginx/PHP/WordPress combinations and includes a SQLite smoke lane
-   interface translation files now ship for French, German, Dutch, Swedish, Spanish, Italian, Portuguese, Polish, Russian, Japanese, Simplified Chinese, Korean, Serbian, Croatian, Brazilian Portuguese, Hindi, Bengali, Tamil, and Telugu

## Active Concerns

-   **1.0.0 release state is healthy** — `main`, `v1.0.0`, CI, CodeQL, runtime matrix, and the release workflow are green. WordPress.org assets, screenshots, Playground link, and release packaging are in place. Plugin submitted to WordPress.org on 2026-04-11; awaiting review response.
-   The remaining style-expansion focus has shifted away from core bibliography styles now that OSCOLA and ABNT both shipped.
-   The benchmark harness makes it easier to watch regression risk in editor-side formatting and deferred citation chunks over time.
-   Notification behavior is now intentionally split between block-local inline notices for contextual validation and block-local snackbars for pure success messages.
-   Low-priority backlog: periodically re-check row-interaction accessibility and reconsider snackbar-only handling for pure success states if it improves clarity without losing local validation context.
-   Export-format groundwork is now in place, and copy citation, Copy bibliography, plus the read-only bibliography REST endpoints now provide practical next-layer interoperability.
-   Build remains healthy, with `citation-citeproc.js` now the only oversized deferred asset after the style-template reduction pass.
-   The citeproc investigation confirmed that `citation-citeproc.js` is effectively `citeproc_commonjs.js`; narrower load responsibility has now landed, so the remaining question is whether future work should target load strategy only or leave citeproc architecture alone.

## Pending Todos

-   1 pending todo in `.planning/todos/pending`
    - Add multisite runtime smoke coverage

## Roadmap Alignment

**1.0.0 shipped 2026-04-08 and is now cleanly green.** The project is ready to plan v1.1 around post-release hardening and follow-on improvements.

Proposed v1.1 focus areas (in priority order):

1. **Code quality sweep** — consolidate `getPrimaryIdentifierValue`, LRU format cache, `getYear` naming
2. **CI/runtime coverage** — multisite smoke lane
3. **Translation expansion** — Arabic, Turkish, Indonesian, Hebrew, Vietnamese, Ukrainian, Romanian, Czech
4. **Longer-horizon** — citation child blocks investigation, inline citation integration, API enhancements

Run `/gsd:new-milestone` to kick off v1.1 planning.
