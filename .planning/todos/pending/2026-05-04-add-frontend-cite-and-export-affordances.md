---
created: 2026-05-04T03:40:50.322Z
title: Add frontend Cite and Export affordances
area: ui
files:
  - src/save-markup.js
  - src/lib/export.js
  - src/edit.js
  - bibliography-builder.php
  - .planning/ROADMAP.md
---

## Problem

Manual interoperability testing with Zotero and Mendeley showed that bibliography pages benefit from visible, Scholar-like citation affordances in addition to invisible metadata. Google Scholar search results are not primarily relying on generic page-level JSON-LD/COinS; their result rows expose predictable IDs and a "Cite" action that opens formatted citations plus BibTeX, EndNote, RIS/RefMan, and RefWorks export links. Zotero has a dedicated Google Scholar translator that follows those cite/export endpoints. Borges already outputs COinS/JSON-LD/CSL-JSON and editor-side CSL-JSON/BibTeX/RIS downloads, but the public frontend does not yet provide a human-visible "Cite / Export" affordance for bibliography data.

Follow-up Mendeley testing on `http://localhost:8881/2026/04/01/scholarly-bibliography-test/` showed the same practical gap: the Mendeley Chrome/Web Importer picked up the DOI-bearing journal article but did not see the non-DOI thesis, even though the page contains COinS for both entries plus JSON-LD and CSL-JSON script metadata. Mendeley's publisher guidance treats DOI/header metadata as preferred and COinS as a legacy fallback, so do not assume COinS alone is enough for non-DOI, multi-entry bibliography pages.

## Solution

Add a future enhancement that exposes optional frontend Cite / Export controls for a bibliography and/or individual entries. The design should preserve the static-save requirement and avoid a PHP render callback. Explore a progressive-enhancement pattern that reuses existing CSL-JSON/BibTeX/RIS export logic where practical, keeps no-JS bibliography text readable, and gives users direct access to copy/download BibTeX, RIS, and CSL-JSON data. Consider whether existing read-only REST bibliography endpoints should gain export-format variants, and document how this helps Zotero/Mendeley workflows without implying generic auto-detection parity with Google Scholar's site-specific translators.

Treat Mendeley compatibility as a manual acceptance target: a reader who cannot rely on automatic extension detection should still be able to copy/download a clean RIS or UTF-8 BibTeX record for every visible entry. Consider Highwire-style `citation_*` head metadata only for future single-work pages; it is page-level metadata and should not be forced into multi-entry bibliography block output.
