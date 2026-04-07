# Recommendation: citation-citeproc load strategy

Date: 2026-04-05

## Decision

Pursue **load-strategy tuning first**. Do **not** plan a deeper formatter architecture change yet.

## Why

The investigation shows that:

1. `citation-citeproc.js` is effectively the citeproc engine itself, not duplicated local code.
2. The easiest plugin-owned bundle bloat has already been removed by prior style-template chunk reduction.
3. Most remaining citeproc loads correspond to interactions where the user expects immediate, authoritative final bibliography formatting.

That means a library swap or formatter rewrite would be high-risk and premature.

## Recommendation by priority

### 1. Narrow parser responsibility further

Most promising next step:

- make `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.js` parse-only by default
- treat formatting as caller-owned behavior
- keep formatter imports in the editor/manual-entry/style-switch layers that truly need final formatting

This reduces the generic surface area that can accidentally trigger citeproc and makes future load control easier.

### 2. Keep immediate citeproc on final-format interactions

Retain current behavior for:

- style switching
- structured field save

These are explicitly final-format actions and should remain authoritative.

### 3. Do not defer successful add flows without a product decision

Successful paste/import and manual-entry add could be deferred further only by changing UX expectations, for example by:

- inserting provisional entries first
- rendering lightweight placeholders
- reformatting after insertion

That would introduce temporary mismatch or resorting churn in the editor. There is not yet enough evidence that this tradeoff is worth it.

## Concrete follow-up

### Recommended next todo

Add a small hardening task to:

- narrow `parsePastedInput()` so formatting is opt-in/caller-owned
- rerun:
  - `npm run build`
  - `npm test -- --runInBand --silent`
  - `npm run benchmark:perf`
- confirm whether the citeproc trigger surface is smaller and easier to reason about

### Not recommended yet

- replacing citeproc
- maintaining two parallel formatting engines
- introducing provisional bibliography rendering just to avoid citeproc on add flows

## Final judgment

**Load-strategy tuning is enough for the next step.**

The project should continue treating citeproc as the authoritative formatter and only revisit deeper formatter architecture changes if:

- citeproc still dominates perceived editor latency after narrower loading,
- benchmark results show meaningful remaining pain,
- and there is a credible replacement path that preserves multi-style scholarly correctness.
