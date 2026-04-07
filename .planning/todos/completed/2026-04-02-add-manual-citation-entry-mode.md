# Manual citation entry mode

Priority: High, next major UX feature.

---
created: 2026-04-02T16:59:01Z
title: Add manual citation entry mode
area: ui
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-citation-editor-state.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/components/structured-citation-editor.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/manual-entry.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/manual-entry.test.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/save.test.js
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.test.js
---

## Problem

The block currently requires users to add citations through paste/import flows first and only then correct them through structured editing. That is fast when DOI, BibTeX, or supported free-text parsing succeeds, but it creates friction when parsing fails, metadata is incomplete, or the user already has the citation details and wants to enter them directly.

## Approved v1 direction

Implement manual citation entry as a second add mode in the existing add area.

### UX

- keep **Paste / Import** as the default add mode
- expose **Manual Entry** as the alternate add mode (implemented via toolbar toggle plus inline fallback link)
- treat manual entry as an alternate add path, not a replacement for paste/import
- keep users in manual mode after a successful manual add
- use the existing inline notices and focus-management behavior

### Manual-entry form

Use the current 8 structured fields plus a required Publication Type selector:

- Publication Type
- Author(s)
- Title
- Container
- Publisher
- Year
- Pages
- DOI
- URL

### Curated v1 type list

Expose this short scholarly core list in the UI:

- Book
- Journal article
- Chapter
- Edited collection
- Thesis / dissertation
- Webpage

Map these to exact CSL types internally:

- Book → `book`
- Journal article → `article-journal`
- Chapter → `chapter`
- Edited collection → `collection`
- Thesis / dissertation → `thesis`
- Webpage → `webpage`

### Validation

Require only:

- Publication Type
- Title

All other fields remain optional in v1.

### Behavior

- create CSL directly from the manual form
- reuse existing author parsing logic where possible
- format the new citation with the currently selected bibliography style
- insert into the citation list and sort normally
- focus the new entry after a successful add
- focus the notice after validation failure

## Out of scope for v1

- review as a first-class manual type
- advanced/type-specific fields
- replacing the current paste/import flow
- new save-format behavior beyond existing citation rendering

## Acceptance targets

- second add mode is available and Paste / Import remains default
- manual mode shows the curated Publication Type selector and current 8 fields
- type + title are sufficient to create a citation
- manual entries format, sort, save, and reformat on style change like imported entries
- existing metadata layer toggles and save output work unchanged with manually entered citations


## Status

Completed in v1 implementation on 2026-04-04.
