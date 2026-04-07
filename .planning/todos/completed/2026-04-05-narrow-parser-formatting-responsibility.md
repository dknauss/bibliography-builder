---
created: 2026-04-05T19:10:00Z
title: Narrow parser formatting responsibility after citeproc investigation
area: performance
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/manual-entry.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-citation-editor-state.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/.planning/quick/3-citation-citeproc-investigation/3-RECOMMENDATION.md
---

## Problem

The citeproc investigation showed that `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.js` still has a built-in formatter branch when `deferFormatting` is false. That keeps citeproc formatting as part of the parser contract even though the editor now generally prefers caller-owned formatting decisions.

## Solution

Make parser behavior parse-first by default and require callers that need authoritative formatted bibliography output to opt in explicitly. Keep citeproc formatting in the UI flows that truly need final output immediately, then rerun the build and local benchmark harness to confirm the smaller trigger surface remains correct.

## Acceptance

1. `parsePastedInput()` no longer implicitly owns formatting for the default case.
2. Existing editor/manual-entry/style-switch flows still produce correct final formatted output.
3. Tests, build, and `npm run benchmark:perf` pass after the change.
