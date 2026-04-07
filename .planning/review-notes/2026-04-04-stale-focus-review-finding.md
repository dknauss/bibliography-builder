# Review note: stale focus-management finding

Date: 2026-04-04
Last reviewed: 2026-04-05
Status: resolved / stale

## Finding

> Required focus transitions are missing after add/delete/edit actions.

## Disposition

This finding no longer matches the current implementation.

The bibliography block already performs deliberate focus transitions for the key keyboard and screen-reader flows:

- successful parse → focus the first newly added entry
- partial parse / duplicate-only / unsupported input → focus the notice
- delete → focus next sibling, previous sibling, or the add-citations textarea when the list becomes empty
- plain edit confirm/cancel → focus the edited entry container
- structured edit confirm/cancel → focus the edited entry container

## Source of truth

- `/Users/danknauss/Developer/GitHub/wp-bibliography-block/SPEC.md`
  - Accessibility / Focus Management section explicitly documents the implemented behavior
- `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js`
- `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-entry-focus.js`
- `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-citation-editor-state.js`
- `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-block-notices.js`
- `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.test.js`

## Test coverage note

Existing Jest coverage includes:

- focus to first new entry after successful parse
- focus to notice after partial/failure states
- focus to next entry and to add-citations textarea after delete
- focus restoration after plain and structured edit save/cancel

## Suggested review response

Resolved/stale. Current code already moves focus after parse, delete, and edit confirm/cancel, and this behavior is documented in `SPEC.md` and covered in `src/edit.test.js`.

## Clearing note

This finding is not stored in the repository, so it must be cleared in the external review system using the response above.

Repetition of this same finding should be treated as reviewer-context drift, not as evidence of a new regression, unless the implementation or the cited tests have changed.
