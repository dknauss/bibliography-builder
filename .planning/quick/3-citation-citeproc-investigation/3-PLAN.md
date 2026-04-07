# Plan: Citation-citeproc investigation and load-strategy reduction

## Goal

Decide whether the remaining `citation-citeproc.js` chunk can be reduced through load-strategy tuning alone, or whether the plugin would need a deeper formatter architecture change.

## Scope

- Build a module inventory for `citation-citeproc.js`
- Document every runtime path that triggers citeproc loading
- Identify opportunities to defer citeproc later
- Identify opportunities to avoid citeproc for non-final interactions
- Produce a decision memo on whether load-strategy tuning is enough

## Step 1 — Build a module inventory

Use build-artifact inspection to capture:

- the chunk id/name mapping that leads to `citation-citeproc.js`
- the modules included in that chunk
- whether any non-citeproc or nonessential helper modules are bundled with it
- whether citeproc is referenced by more than one async route

Expected outputs:

- a short inventory document in `.planning/quick/3-citation-citeproc-investigation/`
- a concise list of modules grouped by responsibility

## Step 2 — Document runtime trigger paths

Trace every current path that can trigger citeproc loading, including at least:

- paste/import add flow
- manual entry add flow
- style switching
- structured field edit save
- plain text edit confirm if relevant
- any future-facing or benchmark-only path

For each path, record:

- the initiating UI action
- the import chain that pulls citeproc in
- whether the interaction requires final formatted output immediately
- whether the user would accept delayed or background formatting there

Expected outputs:

- a path inventory table: `path -> import chain -> must be final? -> deferable?`

## Step 3 — Defer/avoidance analysis

For each trigger path, evaluate whether it can:

### Defer citeproc later

Examples to test conceptually:

- parse/import could persist raw CSL first and format after the entry is visible
- manual entry could create a temporary title-first shell before full formatting
- style switching could update progressively or lazy-format only visible entries

### Avoid citeproc for non-final interactions

Examples to test conceptually:

- reusing cached formatted text longer
- showing lightweight interim display text in edit-only states
- using stored `displayOverride` or title fallbacks without forcing full citeproc output

Guardrails:

- no degradation of saved static output correctness
- no silent format mismatch between editor and frontend final saved markup
- no regression in supported style behavior

## Step 4 — Decision point

After the inventory and path analysis, decide between:

### Option A — Load-strategy tuning only

Use if:

- citeproc is intrinsically large but only a few paths truly need it
- there are real opportunities to delay or narrow its loading window
- final correctness can remain unchanged

### Option B — Deeper formatter architecture changes

Use only if:

- citeproc is unavoidable across too many interactions
- load-strategy tuning yields only marginal benefit
- a credible alternative can preserve multi-style scholarly correctness

## Deliverables

1. Module inventory note
2. Runtime trigger-path note
3. Recommendation memo:
   - keep current architecture + tune loading
   - or investigate deeper formatter changes
4. Follow-up todo(s) only after the recommendation is clear

## Validation expectations

If implementation work follows the investigation, validate with:

- `npm run build`
- `npm test -- --runInBand --silent`
- `npm run benchmark:perf`
- comparison of emitted asset sizes before/after

## Assumptions

- `citation-citeproc.js` is the final large asset worth investigating after style-template reductions
- the preferred first move is investigation, not immediate formatter replacement
- correctness of final scholarly formatting remains the top constraint
