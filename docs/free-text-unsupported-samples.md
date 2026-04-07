# Free-Text Unsupported Citation Samples

Known unsupported or intentionally out-of-scope sample inputs for the current heuristic free-text parser.

Use these to confirm the parser fails closed with a clear message instead of producing unreliable metadata.

## Unsupported samples

### Short-note / footnote style

```text
Binder and Kidder, The Channels of Student Activism, 117–18.
```

Why unsupported right now:

- abbreviated author names
- missing publication year and publisher
- note-style shorthand rather than full bibliography format

### Newspaper-style article with full date

```text
Ada Smith, “Learning Blocks Reach the Mainstream,” WordPress Daily, March 3, 2024, https://example.com/learning-blocks.
```

Why unsupported right now:

- full calendar dates instead of the supported year/season heuristics
- newspaper/news article metadata is not yet modeled separately

### Annotated bibliography entry

```text
Jane Q. Scholar, "Metadata and Meaning," Digital Humanities Review 8, no. 2 (2021): 55-72. Useful overview for classroom discussion.
```

Why unsupported right now:

- annotation text after the citation body
- current heuristics expect a clean citation string only

### Bare URL / titleless webpage reference

```text
OpenAI Docs, https://platform.openai.com/docs/api-reference/responses.
```

Why unsupported right now:

- webpage parsing currently requires a quoted page title
- source-only URL references are too ambiguous to normalize safely

## Expected behavior

These inputs should currently:

- fail to parse
- show the limited-support message
- avoid storing partial or guessed CSL data
