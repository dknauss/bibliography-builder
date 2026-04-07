---
created: 2026-04-04T23:59:20Z
title: Add performance benchmark harness
area: performance
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/output/
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/docs/
---

## Problem

The project now has real Xdebug evidence, but no repeatable benchmark harness for before/after comparisons. Without that, performance work risks being anecdotal.

## Solution

Add a lightweight benchmark workflow with fixed fixtures and documented measurements for import and style-switch scenarios. It does not need to be a full CI benchmark suite initially, but it should make regressions and improvements measurable.

## Acceptance targets

- fixed representative bibliography fixtures exist
- benchmark steps are documented
- import and style-switch timings for at least 10, 25, and 50 entries can be recorded consistently
- future performance refactors can cite before/after numbers
