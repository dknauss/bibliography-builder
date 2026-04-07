---
created: 2026-04-03T00:00:00Z
title: Parallelize DOI parsing with bounded concurrency
area: performance
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.test.js
---

## Problem

`parsePastedInput()` currently resolves DOI entries sequentially. For larger batches, that stacks latency and makes the add/import workflow noticeably slower than it needs to be, even though the parser already caps input at 50 entries. This is the clearest current runtime performance bottleneck in the import path.

## Solution

Refactor the DOI/BibTeX/free-text resolution loop so DOI lookups can run in parallel with a small bounded concurrency limit. Preserve deterministic final ordering, existing error handling, truncation behavior, and duplicate detection. Add tests that verify mixed batches still return entries in the expected order while allowing the implementation to overlap network-bound DOI resolution work.
