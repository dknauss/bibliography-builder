# Project State

## Current Focus

1. Prepare the approved WordPress.org release/deploy path and keep the GitHub release asset aligned.
2. Keep `main` green after the repository/release naming cleanup and new Multisite runtime lane.
3. Run the v1.1 code-quality sweep and interoperability backlog.
4. Plan future frontend Cite/Export affordances, BibLaTeX/PMID support, and translation expansion.

## Current Priority Order

1. WordPress.org approval and deploy readiness
    - WordPress.org reviewers have approved the plugin; next release work is deployment/publication rather than review response
    - keep plugin headers, `readme.txt`, GitHub release assets, and Playground download URLs aligned with the approved WordPress.org slug (`borges-bibliography-builder`)
    - rebuild and validate `output/release/borges-bibliography-builder.zip` after any final release-prep change
    - keep the `v1.0.0` GitHub Release concise and pointing at the canonical Borges-branded zip asset
2. CI and runtime compatibility hygiene
    - monitor the `main` workflows after the repo rename/multisite-lane changes land
    - keep the Apache/Nginx, PHP 7.4-8.4, WordPress 6.4-latest, SQLite, and Multisite runtime lanes healthy
3. Code quality and maintainability sweep
    - consolidate `getPrimaryIdentifierValue`
    - upgrade the formatting cache from FIFO to LRU
    - clarify or rename the two `getYear` helpers with different sentinel semantics
    - continue module-scope i18n and prop-drilling cleanup where it buys testability or clarity
4. Interoperability backlog
    - design optional frontend Cite/Export affordances for readers who need direct BibTeX/RIS/CSL-JSON access
    - prioritize BibLaTeX support first, then PMID resolution before NBIB
    - keep EndNote XML, NBIB export, and CIW demand-gated; keep ENL out of scope
5. Translation expansion backlog
    - shipped interface locale files: French, German, Dutch, Swedish, Spanish, Italian, Portuguese, Polish, Russian, Japanese, Simplified Chinese, Korean, Serbian, Croatian, Brazilian Portuguese, Hindi, Bengali, Tamil, and Telugu
    - next recommended backlog locales: Arabic, Turkish, Indonesian, Hebrew, Vietnamese, Ukrainian, Romanian, and Czech
6. Low-priority UX follow-up
    - periodically re-check row-interaction accessibility
    - reconsider global snackbars for pure success-only cases if it ever improves clarity

## Last activity

Recent work completed or in final verification includes:

-   `main` CI was restored to green after the branding/changelog cleanup.
-   repository-facing URLs, badges, Plugin URI, security reporting URL, Playground blueprint, and language bug-report headers were normalized around `dknauss/borges-bibliography-builder` and the approved `borges-bibliography-builder` slug.
-   the release package name is standardized on `borges-bibliography-builder.zip`; no transition zip is needed because this is the first public WordPress.org release.
-   a new Apache/PHP 8.3/latest-WordPress Multisite runtime smoke lane was added and validated locally with network activation.
-   PHP utility-function coverage was expanded, including plain-text/export helper behavior and ABNT normalization edge cases.
-   Claude bug-sweep follow-up landed: `outputJsonLd` REST defaults now honor the block attribute default when the key is absent, structured-edit cancellation now guards stale post-format commits, thesis COinS and chapter/review JSON-LD mappings were corrected, and 25 additional regression tests now cover those paths plus focus helper behavior.
-   docs/spec/checklist sync across `README.md`, `SPEC.md`, and QA worksheets.
-   reduced persisted citation payload for new entries by dropping `inputRaw`, `parsedAt`, and `parseConfidence`.
-   bounded-concurrency DOI parsing with stable result ordering.
-   tighter CSL validation for additional structured fields.
-   JSON-LD corporate-author typing improvements (`Organization` for literal-only institutional authors).
-   metadata output controls verified live on the front end.
-   additional spec-strength tests for sorting, `lang`, and review DOI fixtures.
-   spec clarification that focus-management behavior is already implemented and tested.
-   manual-entry v1 shipped with a second add mode, curated 6-type selector, and the current 8 structured fields plus Publication Type.
-   Harvard, Vancouver, IEEE, MLA 9, OSCOLA, and ABNT are now enabled selectable styles, with formatter and save-path coverage.
-   manual-entry formatting moved behind async loading so the main editor entrypoint stays small.
-   Xdebug trace/profile capture confirms PHP runtime cost is mostly WordPress/theme bootstrap; plugin-specific PHP cost is concentrated in `build/index.asset.php`.
-   editor-side CSL formatting now batches duplicate work, paste/import defers formatting until the editor actually needs it, and a repeatable local benchmark harness now records cold-cache timings.
-   `parsePastedInput()` is now parse-first by default; callers must opt in explicitly if they want parser-owned formatting, and lint/tests/benchmarks/build all passed after the change.
-   native notification follow-up landed: Gutenberg `Notice`/`Snackbar` primitives now handle block-local feedback with success-only snackbars and inline mixed-result validation notices.
-   submission-readiness packaging landed: `npm run package:release` creates a clean artifact and Plugin Check passed against the staged release directory with no errors.
-   CSL-JSON, BibTeX, and RIS exports now ship in the editor as practical downloadable bibliography-data formats.
-   a per-entry copy-citation action now ships in the editor for reusing visible citation text.
-   a Copy bibliography action now ships in the editor for copying the current bibliography as plain text.
-   read-only REST endpoints now expose bibliography block data at `/wp-json/bibliography/v1/posts/<post_id>/bibliographies` and `/wp-json/bibliography/v1/posts/<post_id>/bibliographies/<index>`.
-   GitHub Actions runtime coverage now spans additional Apache/Nginx/PHP/WordPress combinations and includes SQLite and Multisite smoke lanes.
-   interface translation files now ship for French, German, Dutch, Swedish, Spanish, Italian, Portuguese, Polish, Russian, Japanese, Simplified Chinese, Korean, Serbian, Croatian, Brazilian Portuguese, Hindi, Bengali, Tamil, and Telugu.

## Active Concerns

-   **WordPress.org approval** — reviewers have approved the plugin. Next operational step is the public deploy/SVN release path, while keeping the GitHub `v1.0.0` release asset and WordPress.org package aligned.
-   **Release baseline vs. head** — `v1.0.0` has been retagged to the current `main` release baseline after the release-action Node 24 update and coverage-test follow-up. Avoid further retagging unless a real release blocker or WordPress.org deployment correction requires it.
-   **GitHub repository rename fallout** — after the rename to `dknauss/borges-bibliography-builder`, confirm badges, release links, Codecov, Playground, and GitHub Actions redirects resolve from the canonical path.
-   **Dependabot alerts #31/#32** — leave open for upstream tracking unless the warning noise becomes unacceptable. Both are transitive npm development dependencies only, not bundled in the WordPress.org release zip or static plugin build output, and the plugin does not directly import or execute the vulnerable code paths. `showdown` currently has no patched release and is pulled through `@wordpress/blocks`; `uuid@14` would require upstream WordPress/webpack dependency support because current `@wordpress/*`, `sockjs`, and `webpack-dev-server` dependency ranges still resolve to `uuid@8/9`. If dismissing later, use “vulnerable code is not actually used” with this rationale.
-   **Codecov threshold** — current coverage around the high-70s is acceptable for a first WordPress.org submission because it covers the security-sensitive parser/output/export paths, but the v1.1 sweep should keep raising coverage through targeted tests rather than chasing a vanity number.
-   Export-format groundwork is now in place, and copy citation, Copy bibliography, plus the read-only bibliography REST endpoints now provide practical next-layer interoperability. Follow-up todos track optional frontend Cite / Export affordances modeled on Google Scholar's visible citation/export workflow. Mendeley testing showed DOI-only auto-detection is likely for non-page-head metadata, so the frontend export path should make RIS/BibTeX/CSL-JSON available to readers without depending on hidden COinS discovery. Format-expansion priority remains: BibLaTeX first, PMID before NBIB, EndNote XML only if testing proves RIS/BibTeX insufficient, CIW demand-gated, and ENL out of scope.
-   Build remains healthy, with `citation-citeproc.js` now the only oversized deferred asset after the style-template reduction pass.
-   The citeproc investigation confirmed that `citation-citeproc.js` is effectively `citeproc_commonjs.js`; narrower load responsibility has now landed, so the remaining question is whether future work should target load strategy only or leave citeproc architecture alone.

## Pending Todos

-   3 pending todos in `.planning/todos/pending`
    - WordPress.org approval/deploy follow-up
    - Add frontend Cite and Export affordances
    - Prioritize BibLaTeX and PMID interoperability

## Roadmap Alignment

**1.0.0 shipped 2026-04-08; WordPress.org reviewers have approved the plugin.** The project is in a short publication/deployment window before broader v1.1 work.

Proposed next-task sequence:

1. **Publish the approved WordPress.org release** — complete the deploy/SVN path from the canonical `borges-bibliography-builder.zip` package
2. **Monitor CI/runtime coverage** — confirm the new Multisite smoke lane stays green on `main`
3. **Keep Dependabot #31/#32 open with rationale** — revisit when upstream WordPress/webpack packages move off the vulnerable transitive versions
4. **Code quality sweep** — consolidate helpers/cache semantics cleanup
5. **Interoperability enhancements** — frontend Cite/Export controls, then BibLaTeX/PMID
6. **Translation expansion** — Arabic, Turkish, Indonesian, Hebrew, Vietnamese, Ukrainian, Romanian, Czech

Run `/gsd:new-milestone` when ready to formalize v1.1 once the approved WordPress.org release is publicly deployed and the immediate launch window settles.
