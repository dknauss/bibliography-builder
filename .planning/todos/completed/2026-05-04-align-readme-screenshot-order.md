---
created: 2026-05-04T10:05:00Z
title: Align screenshot order across GitHub and WordPress.org readmes
area: documentation
phase: 01-post-launch-cleanup-and-documentation-polish
files:
  - README.md
  - readme.txt
  - .wordpress-org/
---

## Problem

The GitHub `README.md` and WordPress.org `readme.txt` should present plugin screenshots in the same order so the project page and plugin directory tell the same visual story. This is an easy, low-priority polish task for the next documentation pass.

## Solution

Use the same screenshot sequence in both readmes. The first screenshots should be:

1. Front-end bibliography output.
2. Editor view with citations.

Keep later screenshots in a consistent order as well, matching the WordPress.org screenshot filenames/descriptions where practical.

## Acceptance targets

- `README.md` and `readme.txt` show screenshots in matching order.
- Front-end output screenshot appears first in both readmes.
- Editor with citations screenshot appears second in both readmes.
- WordPress.org screenshot captions remain accurate after reordering.

## Completion

Completed in the 2026-05-04 post-launch cleanup. `README.md` and `readme.txt` now use matching screenshot order: front-end output first, editor-with-citations second, then block inserter, empty-state form, and manual entry. `.wordpress-org/screenshot-*.png` files were reordered to keep WordPress.org captions accurate.
