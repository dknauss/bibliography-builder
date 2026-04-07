---
created: 2026-04-04T23:59:00Z
title: Optimize editor-side CSL formatting
area: performance
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/formatting/csl.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/manual-entry.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/formatting/csl.test.js
---

## Problem

Actual Xdebug/profile review showed no meaningful PHP bottleneck in plugin business logic. The more important cost center is editor-side bibliography formatting, where `new Cite(csl)` and per-entry formatting still sit on hot paths for import, manual entry, edit save, and style switching.

## Solution

Introduce a focused performance pass on CSL formatting. Expand or reorganize memoization so repeated formatting requests hit cache consistently, and add a batch-aware path for operations like style switching where many entries are reformatted in one pass. Preserve output correctness, `displayOverride` behavior, and style-specific numbering/list semantics.

## Acceptance targets

- repeated formatting requests for identical `(style, csl)` inputs avoid redundant `new Cite()` work
- style switching across larger citation sets performs fewer formatter instantiations
- existing formatter output and tests remain valid
- benchmark notes capture before/after results for a representative large bibliography
