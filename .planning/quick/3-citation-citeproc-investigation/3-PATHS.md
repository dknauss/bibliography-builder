# Citation-citeproc runtime trigger paths

Date: 2026-04-05

## Summary

The citeproc chunk is loaded through `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/formatting/csl.js`, which imports:

- `@citation-js/core`
- `@citation-js/plugin-csl`
- bundled built-in style templates

Any interaction that dynamically imports `formatting/csl` can trigger `citation-citeproc.js`.

## Trigger-path table

| UI / runtime path | Source path | Current import chain | Needs final formatting immediately? | Can defer later? | Can avoid for non-final interactions? | Notes |
|---|---|---|---|---|---|---|
| Paste / Import add flow | `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js` `handleParse()` | `edit.js` → dynamic import `./lib/parser` → parse with `{ deferFormatting: true }` → if unique entries exist, dynamic import `./lib/formatting/csl` → `formatBibliographyEntries()` | Mostly yes | Maybe | No for current UX | Failed/duplicate-only pastes already avoid citeproc. Successful adds load citeproc only after parse completes. |
| Structured field edit save | `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-citation-editor-state.js` `handleStructuredEditSave()` | dynamic import `../lib/formatting/csl` → `formatBibliographyEntry()` | Yes | Low-confidence maybe | No | Save currently implies authoritative reformatting. Delaying would create an odd post-save mismatch. |
| Citation style switch | `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-citation-editor-state.js` `handleCitationStyleChange()` | dynamic import `../lib/formatting/csl` → `formatBibliographyEntries()` | Yes | No | No | This interaction is explicitly “reformat all citations in the chosen style.” |
| Manual entry add | `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/manual-entry.js` `createManualCitation()` | dynamic import `./formatting/csl` → `formatBibliographyEntry()` | Mostly yes | Maybe | Maybe, but only with UX changes | Could theoretically insert a provisional record, but current UX expectation is immediate final formatted entry. |
| Parser fallback formatting path | `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.js` `parsePastedInput()` | parse path → if `deferFormatting === false`, dynamic import `./formatting/csl` → `formatBibliographyEntries()` | No | Yes | Yes | Strongest candidate for narrowing. Parser can remain parse-only and let callers opt in to formatting. |
| Plain text displayOverride edit | `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-citation-editor-state.js` | none | No | N/A | Yes | Does not load citeproc today. |
| Reset auto-format | `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-citation-editor-state.js` | none | No new formatting | N/A | Yes | Reuses stored `formattedText`; does not load citeproc today. |
| Parse-only failure / duplicate-only flows | `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js` | parser only; no later formatter import if nothing unique was added | No | N/A | Yes | Already optimized. |

## Concrete source references

### Paste / Import add flow

In `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js`, `handleParse()`:

- imports `./lib/parser`
- calls `parsePastedInput(inputValue, citationStyle, { deferFormatting: true })`
- later imports `./lib/formatting/csl` only when there are unique entries to add

This is already a meaningful improvement over formatting during parsing.

### Structured edit save

In `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-citation-editor-state.js`, `handleStructuredEditSave()` dynamically imports `../lib/formatting/csl` before rewriting `formattedText`.

### Style switching

In the same hook, `handleCitationStyleChange()` batch-formats citations after importing `../lib/formatting/csl`.

### Manual entry add

In `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/manual-entry.js`, `createManualCitation()` dynamically imports `./formatting/csl` to create the first persisted `formattedText`.

### Parser fallback path

In `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/parser.js`, `parsePastedInput()` still supports a built-in formatting branch when `deferFormatting` is false.

That makes parser formatting part of the generic parser contract, even though the editor now prefers caller-owned formatting.

## Path conclusions

### Already in a good state

- failed parse paths
- duplicate-only import attempts
- plain text override editing
- reset auto-format

These already avoid citeproc unless final authoritative formatting is actually needed.

### Best low-risk candidate for further reduction

- make `parsePastedInput()` parse-only by default, or at least treat formatting as an explicitly caller-owned concern everywhere

### Paths that probably should keep immediate citeproc

- citation style switching
- structured field edit save

### Paths that are only worth changing with deliberate UX changes

- manual entry add
- successful paste/import add flow

Those could defer visible final formatting further, but only by accepting temporary editor mismatch, placeholder rendering, or post-insert reflow. That is probably not worth it unless measurements still show citeproc load as a severe interaction problem.
