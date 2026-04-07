---
created: 2026-04-03T00:00:00Z
title: Sync spec, README, and QA docs with current behavior
area: docs
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/SPEC.md
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/README.md
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/docs/manual-test-checklist.md
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/docs/bug-bash-worksheet.md
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/docs/release-readiness-checklist.md
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/docs/qa-matrix-checklist.md
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/docs/free-text-samples.md
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/docs/free-text-unsupported-samples.md
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/docs/supported-input-style-matrix.md
---

## Problem

The project’s docs now lag behind the implementation. Several files still describe removed or changed behavior, including visible Undo after deletion, older notice placement and wording, earlier placeholder/help copy, and narrower raw-citation support than the parser currently handles. This creates release risk because QA and roadmap work can be executed against stale expectations instead of the current block behavior.

## Solution

Do a docs-first synchronization pass against the current implementation. Update the spec, README, and QA/checklist docs so they accurately reflect: current notice behavior, no visible delete Undo UI, click-to-edit row behavior, current heading styling/defaults, current supported input scope, and the present multi-style baseline (Chicago Notes-Bibliography default, Chicago Author-Date and APA 7 enabled). Treat this as a prerequisite to release-readiness work and to any future contributor onboarding.
