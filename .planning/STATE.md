# Project State

## Current Focus

1. Restore `main` CI to fully green after the 2026-04-20 branding/slug updates.
2. Keep WordPress.org submission readiness high while awaiting plugin review response.
3. Add multisite runtime smoke coverage.
4. Run the v1.1 code-quality sweep and translation-expansion backlog.

## Current Priority Order

1. Immediate CI hygiene (blocking)
    - fix Prettier lint failures currently breaking `CI` on `main`
    - rerun CI and confirm Node 20/22 quality lanes are green
    - keep `v1.0.0` release tag unchanged until a deliberate release update decision is made
2. WordPress.org review-response readiness
    - monitor wp.org plugin-review inbox and respond quickly to reviewer requests
    - keep release artifact and plugin headers/readme aligned with current approved naming (`bibliography-block`)
3. Runtime compatibility coverage
    - add a multisite smoke lane to the runtime matrix
    - keep SQLite and existing Apache/Nginx/PHP/WordPress lanes healthy
4. Code quality and maintainability sweep
    - consolidate `getPrimaryIdentifierValue`
    - upgrade the formatting cache from FIFO to LRU
    - clarify or rename the two `getYear` helpers with different sentinel semantics
    - continue module-scope i18n and prop-drilling cleanup where it buys testability or clarity
5. Translation expansion backlog
    - shipped interface locale files: French, German, Dutch, Swedish, Spanish, Italian, Portuguese, Polish, Russian, Japanese, Simplified Chinese, Korean, Serbian, Croatian, Brazilian Portuguese, Hindi, Bengali, Tamil, and Telugu
    - next recommended backlog locales: Arabic, Turkish, Indonesian, Hebrew, Vietnamese, Ukrainian, Romanian, and Czech
6. Low-priority UX follow-up
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

-   **Current release baseline vs. head** — `v1.0.0` points to `ac53d1d` while `main` is ahead at `409f249`. Plugin-directory submission is in review (submitted 2026-04-11), and the latest `main` CI is currently failing only due Prettier formatting on three JS files after the branding update.
-   The remaining style-expansion focus has shifted away from core bibliography styles now that OSCOLA and ABNT both shipped.
-   The benchmark harness makes it easier to watch regression risk in editor-side formatting and deferred citation chunks over time.
-   Notification behavior is now intentionally split between block-local inline notices for contextual validation and block-local snackbars for pure success messages.
-   Low-priority backlog: periodically re-check row-interaction accessibility and reconsider snackbar-only handling for pure success states if it improves clarity without losing local validation context.
-   Export-format groundwork is now in place, and copy citation, Copy bibliography, plus the read-only bibliography REST endpoints now provide practical next-layer interoperability. Follow-up todos now track optional frontend Cite / Export affordances modeled on Google Scholar's visible citation/export workflow. Mendeley testing showed DOI-only auto-detection is likely for non-page-head metadata, so the frontend export path should make RIS/BibTeX/CSL-JSON available to readers without depending on hidden COinS discovery. Format-expansion priority remains: BibLaTeX first, PMID before NBIB, EndNote XML only if testing proves RIS/BibTeX insufficient, CIW demand-gated, and ENL out of scope.
-   Build remains healthy, with `citation-citeproc.js` now the only oversized deferred asset after the style-template reduction pass.
-   The citeproc investigation confirmed that `citation-citeproc.js` is effectively `citeproc_commonjs.js`; narrower load responsibility has now landed, so the remaining question is whether future work should target load strategy only or leave citeproc architecture alone.

## Pending Todos

-   6 pending todos in `.planning/todos/pending`
    - Restore `main` CI to green after branding update
    - WordPress.org review-response readiness and submission follow-up
    - Add multisite runtime smoke coverage
    - Add frontend Cite and Export affordances
    - Prioritize BibLaTeX and PMID interoperability
    - Normalize repository and release naming

## Roadmap Alignment

**1.0.0 shipped 2026-04-08; submission is in wp.org review.** The project is in a short stabilization window before broader v1.1 work.

Proposed next-task sequence:

1. **Fix `main` CI** — clear current Prettier lint failures and restore all required checks
2. **Maintain submission readiness** — stay ready for wp.org reviewer feedback and patch requests
3. **CI/runtime coverage** — add multisite smoke lane
4. **Code quality sweep** — consolidate helpers/cache semantics cleanup
5. **Translation expansion** — Arabic, Turkish, Indonesian, Hebrew, Vietnamese, Ukrainian, Romanian, Czech

Run `/gsd:new-milestone` when ready to formalize v1.1 once CI is back to stable green.
