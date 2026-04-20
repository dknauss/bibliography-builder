---
created: 2026-04-20T00:00:00Z
title: Restore `main` CI to green after branding update
area: ci
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/components/editor-canvas-notices.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/components/structured-citation-editor.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/.github/workflows/ci.yml
---

## Problem

The latest `main` CI run fails in lint with Prettier formatting errors after the branding/slug update commits.

## Solution

Apply formatting fixes, run local lint/tests, and push so all required GitHub checks return green.

## Acceptance targets

- `npm run lint:js` passes locally
- `CI` workflow passes on `main`
- no regression in runtime matrix or CodeQL workflows
