---
created: 2026-04-02T17:00:00Z
title: Revisit native Gutenberg notification pattern
area: ui
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-block-notices.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/components/editor-canvas-notices.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.test.js
---

## Problem

The current feedback fix keeps notices reliable by storing the active message in local React state and rendering it through a custom top-of-canvas host. This is acceptable as a stabilization workaround, but it is not the most native Gutenberg pattern and may diverge from standard WordPress notice behavior over time.

## Solution

Track a follow-up to move back toward a more native WordPress implementation once live-editor reliability is understood. Evaluate two preferred directions: (1) use the notices store/components successfully without custom host tricks, or (2) render block-scoped inline notices fully inside the block using standard WordPress components. Preserve the current requirements: reliable failure feedback, top-of-canvas or clearly block-scoped placement, focus management, and consistent behavior for duplicate-only and unsupported-input states.
