# Quick Task 1 Summary

## Completed

- Added a new free-text parser path alongside DOI and BibTeX parsing.
- Introduced narrow heuristic support for:
  - formatted book citations
  - formatted journal article citations
- Kept CSL-JSON as the canonical stored citation shape.
- Preserved the lazy-loaded parser path so the editor entry bundle stays small.
- Updated editor guidance to reflect limited free-text support.

## Validation

- `npm test -- --runInBand`
- `npm run lint:js`
- `npm run lint:css`
- `npm run build`

## Notes

- Free-text parsing is intentionally heuristic and conservative.
- Unsupported free-text still fails closed with a clearer message.
- The remaining webpack warning is still the deferred `citation-citeproc.js` chunk.

