---
created: 2026-04-03T00:00:00Z
title: Reduce persisted citation payload
area: data
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/save-markup.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.test.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/save.test.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.test.js
---

## Problem

Each citation object currently persists more state than may be necessary, including `inputRaw`, `formattedText`, and `parsedAt`. This increases saved block attribute size, editor state weight, and post content serialization overhead. It also weakens data minimization by retaining raw pasted input even when canonical CSL data and rendered output no longer need it.

## Solution

Audit which citation fields are truly required at rest versus derivable at runtime. Prefer storing only canonical CSL data, user-facing overrides, and any minimal parse-state data that still materially affects the UI. Remove or demote fields like `inputRaw`, `formattedText`, and `parsedAt` if they are not necessary for save output, style switching, or editing workflows. Add regression tests to confirm save output, style switching, duplicate detection, and editing flows continue to work with the reduced citation object shape.
