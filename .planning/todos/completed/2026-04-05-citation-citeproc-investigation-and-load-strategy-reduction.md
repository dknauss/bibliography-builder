---
created: 2026-04-05T16:20:00Z
title: Citation-citeproc investigation and load-strategy reduction
area: performance
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/webpack.config.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/formatting/csl.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-citation-editor-state.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/manual-entry.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/output/benchmarks/latest.md
---

## Problem

After the style-template chunk reductions, `citation-citeproc.js` remains the only oversized deferred asset. It is likely core formatter infrastructure rather than accidental duplication, so the next step should be an investigation and load-strategy pass instead of immediate architectural churn.

## Solution

Plan a focused investigation phase that first establishes exactly what lives inside `citation-citeproc.js`, which runtime interactions trigger it, and whether any current UI paths load it earlier than necessary. Only after that inventory should the project decide between a narrower load-strategy tuning pass and deeper formatter architecture changes.

## Questions to answer

1. What concrete modules and transitive dependencies make up `citation-citeproc.js`?
2. Which runtime paths trigger citeproc loading today?
3. Which of those paths are truly final-format interactions, and which are intermediate/editor-only interactions?
4. Can any current path defer citeproc later or avoid it altogether for non-final interactions?
5. Is load-strategy tuning sufficient, or is a deeper formatter split/replacement worth considering?
