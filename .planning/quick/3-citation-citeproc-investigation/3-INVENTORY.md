# Citation-citeproc chunk inventory

Date: 2026-04-05

## Summary

The remaining oversized deferred formatter asset is structurally simple: `/Users/danknauss/Developer/GitHub/wp-bibliography-block/build/citation-citeproc.js` is almost entirely the upstream citeproc engine, not duplicated project code.

That means the main remaining opportunity is **load-strategy tuning**, not another webpack-only split pass.

## Evidence source

Generated webpack stats:

- `/Users/danknauss/Developer/GitHub/wp-bibliography-block/output/benchmarks/webpack-stats-citeproc.json`

Build command used:

```bash
./node_modules/.bin/webpack --config webpack.config.js --profile --json > output/benchmarks/webpack-stats-citeproc.json
```

## Chunk summary

- chunk name: `citation-citeproc`
- emitted file: `citation-citeproc.js`
- reported chunk size: `967493`
- current built asset size warning: about `364 KiB` emitted/minified

Related formatter chunks in the same family:

- `citation-plugin-csl` — `174509`
- `citation-core` — `85296`
- `citation-style-chicago-notes-bibliography` — `151759`
- `citation-style-chicago-author-date` — `104914`
- `citation-style-mla-9` — `28886`
- `citation-style-ieee` — `13172`

## Module inventory

Modules found inside the `citation-citeproc` chunk:

1. `./node_modules/citeproc/citeproc_commonjs.js` — `967493`

No meaningful plugin-local helper modules were bundled into this chunk. After the prior style-template reduction work, the remaining large payload is effectively the citeproc engine itself.

## Import/origin summary

Webpack origins for the chunk point back to these plugin entry paths:

- `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/edit.js`
- `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/hooks/use-citation-editor-state.js`
- `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/manual-entry.js`

Those origins do not mean each file directly imports citeproc; they resolve through the formatter path in `/Users/danknauss/Developer/GitHub/wp-bibliography-block/src/lib/formatting/csl.js`.

## Interpretation

### What this rules out

- Another simple split-chunk pass is unlikely to produce a meaningful reduction in `citation-citeproc.js`.
- There is no obvious accidental duplication left inside the citeproc chunk itself.
- The previous style-template minification/splitting work already removed the easiest plugin-owned bloat.

### What remains plausible

- Narrow the number of user interactions that load citeproc.
- Defer citeproc slightly later in flows that do not need final formatting immediately.
- Keep full citeproc formatting only on interactions where the user expects authoritative final style output.

## Recommendation from inventory alone

Treat `citation-citeproc.js` as a **library-sized runtime dependency**, not as accidental bundle waste. The next step should be trigger-path reduction and caller ownership of formatting decisions, not a speculative formatter rewrite.
