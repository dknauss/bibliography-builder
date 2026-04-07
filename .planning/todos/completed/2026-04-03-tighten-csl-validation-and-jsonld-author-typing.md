---
created: 2026-04-03T00:00:00Z
title: Tighten CSL validation and JSON-LD author typing
area: security
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/jsonld.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.test.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/jsonld.test.js
---

## Problem

The current parser does a good job of structural sanitation, prototype-pollution defense, and validating key fields like `title`, `author`, and `issued`, but validation for many common scalar CSL fields remains comparatively loose. Separately, literal-only authors are always emitted to JSON-LD as `Person`, even when they clearly represent institutions or corporate authors. These are not current exploit paths, but they are worth tightening as part of secure-by-default and semantic-quality hardening.

## Solution

Expand validation to cover a broader allowlist of common CSL scalar fields and their expected types (for example `URL`, `DOI`, `publisher`, `container-title`, `page`, `volume`, `issue`, `medium`, and `genre`). At the same time, improve JSON-LD author mapping so clearly corporate/literal authors can emit `Organization` where appropriate instead of always defaulting to `Person`. Add targeted tests for invalid field shapes, retained sanitation guarantees, and improved JSON-LD output for institutional authors.
