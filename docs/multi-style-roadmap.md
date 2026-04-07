# Multi-Style Roadmap

## Purpose

This roadmap updates the project direction from a single-style MVP assumption to a **multi-style bibliography platform** with a clear default-style migration path.

It is intended to guide the next work **before continuing the default-style migration**.

## Key decision

The intended default Chicago style is:

-   **Chicago Notes-Bibliography**

The plugin should still support:

-   **Chicago Author-Date**

This means the project must stop treating Chicago Author-Date as the baseline assumption across copy, tests, sorting language, and formatter defaults.

## Why a phased roadmap is useful now

A phased plan is now worthwhile because the target styles are not all the same family.

The roadmap must accommodate:

-   **notes-based styles**
    -   Chicago Notes-Bibliography
    -   OSCOLA
-   **author-date styles**
    -   Chicago Author-Date
    -   APA 7
    -   Harvard
-   **numeric styles**
    -   Vancouver
    -   IEEE
-   **regional/specialized styles**
    -   ABNT

These differences affect more than bibliography text:

-   sort behavior
-   list semantics
-   future inline citation mode
-   source-type edge cases
-   test fixtures and acceptance criteria

## Phase 3: Multi-style foundation and Chicago default realignment

### Goal

Make the codebase and docs consistent with **Chicago Notes-Bibliography as the default** while preserving the style-registry architecture already in place.

### Scope

-   change the default `citationStyle` baseline to `chicago-notes-bibliography`
-   keep `chicago-author-date` supported
-   update style labels and selectable style ordering
-   update docs, README, and spec language
-   update tests/fixtures so they no longer assume Author-Date by default
-   verify bundled CSL template coverage for both Chicago variants
-   verify sorting behavior by style family

### Acceptance criteria

-   block default style is Chicago Notes-Bibliography
-   editor UI shows Chicago Notes-Bibliography as the primary default Chicago option
-   Chicago Author-Date remains selectable
-   bibliography formatting and tests reflect the new default
-   no stale docs claim Author-Date is the only or default Chicago mode

## Phase 4: Core multi-style bibliography support

### Goal

Ship a solid first set of broadly useful styles with stable bibliography behavior.

### Core styles

1. Chicago Notes-Bibliography
2. Chicago Author-Date
3. APA 7
4. Harvard
5. Vancouver
6. IEEE

### Scope

-   enable selectable style support for all core styles
-   implement and validate style-family-specific behavior
-   support:
    -   notes
    -   author-date
    -   numeric
-   keep static-save output valid for all shipped styles
-   ensure style switching preserves `displayOverride`
-   broaden style coverage with:
    -   Harvard
    -   Vancouver
    -   IEEE
-   add remaining spec-strength tests, especially around:
    -   corporate-author sorting edge cases
    -   lang omission/save behavior in more combinations
    -   review-record DOI fixtures
-   document the current supported input/style matrix so expectations are clear while multi-style support expands

### Acceptance criteria

-   each core style produces deterministic bibliography output
-   numeric styles render ordered lists
-   non-numeric bibliography styles render unordered lists
-   style switching re-renders non-overridden entries
-   save output remains stable and valid

## Phase 5: Remaining specialized style support

### Goal

Add styles that need more style-specific handling, fixtures, or edge-case review.

### Remaining specialized styles

1. OSCOLA
2. ABNT

### Why these are separate

-   **OSCOLA** likely needs extra legal-source validation and note-style assumptions
-   **ABNT** brings regional conventions that deserve dedicated fixture coverage

### Acceptance criteria

-   each remaining specialized style has dedicated fixture coverage
-   legal/regional edge cases are explicitly tested
-   no regression in the core-style matrix

## Style family guidance

### Notes family

-   Chicago Notes-Bibliography
-   OSCOLA

Needs:

-   note-oriented future inline citation model
-   bibliography conventions appropriate to note systems

### Author-date family

-   Chicago Author-Date
-   APA 7
-   Harvard

Needs:

-   author/date-oriented bibliography output
-   year-sensitive sorting

### Numeric family

-   Vancouver
-   IEEE

Needs:

-   ordered-list bibliography output
-   later numeric inline citation support

## Recommended execution order

1. **Realign the default** to Chicago Notes-Bibliography
2. **Stabilize the two Chicago variants**
3. **Keep APA available and validated**
4. **Add Harvard, Vancouver, IEEE, MLA 9**
5. **Then add OSCOLA and ABNT**

## Immediate next step

Before any more UI or parser work, complete the **default-style migration audit**:

-   block attribute default
-   style registry default
-   formatter template availability
-   save/edit tests
-   sorter assumptions
-   README and SPEC text

That creates a clean base for the broader multi-style rollout.

## Backlog note: Option B child-block architecture

A future architecture option is to model each citation as its own child block rather than storing all citations in one parent block attribute.

Why it is worth tracking:

-   would make citation-level selection behave more like native Gutenberg list items
-   could improve how item-level edit/delete actions fit with block toolbars and editor history
-   may produce a cleaner long-term model for citation-level UX

Why it is not the current recommendation:

-   it is a substantial re-architecture, not a UI cleanup
-   the parent block currently owns canonical CSL data, sorting, deduplication, and static-save metadata output
-   moving to child blocks would require a dedicated migration strategy for existing content and save behavior

Recommended handling:

-   keep this as a backlog architecture investigation
-   revisit only after the current single-block model is stable for multi-style bibliography editing

## Backlog note: maintainability follow-ups

These are worth tracking, but should not block current stabilization and style work:

-   revisit module-scope i18n label definitions that call `__()` during import time
-   reduce `CitationEntryBody` prop drilling as editing/state features continue to grow
-   audit corporate-author sorting edge cases where upstream metadata includes both `family` and `literal`
-   evaluate a later semantic enhancement to wrap visible bibliography authors individually in HTML; JSON-LD and CSL-JSON already preserve separate author objects, while COinS currently flattens to first-author fields only
