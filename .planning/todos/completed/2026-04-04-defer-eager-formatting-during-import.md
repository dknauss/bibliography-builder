---
created: 2026-04-04T23:59:10Z
title: Defer eager formatting during import
area: performance
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.test.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.test.js
---

## Problem

Large paste/import flows still pay parse + sanitize + format in the same critical path. That keeps the user waiting for formatting work before the import can finish, even when parsing itself has already succeeded.

## Solution

Refactor import flow so parsing completes first, then formatting is performed in a deferred or batched step. Keep stable ordering, duplicate handling, failed-item retention, and notice/focus behavior unchanged.

## Acceptance targets

- successful imports complete with less synchronous formatting work in the parser path
- citation ordering and notice text remain correct
- newly added citations still render with the current selected style
- tests cover mixed success/failure imports after the refactor
