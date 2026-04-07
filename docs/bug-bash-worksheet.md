# Bug Bash Worksheet

Use this during live manual testing.

## Test environment

-   Admin: [http://127.0.0.1:8881/wp-admin/](http://127.0.0.1:8881/wp-admin/)
-   Supported samples: `post=12`
-   Unsupported samples: `post=14`
-   DOI/BibTeX samples: `post=15`
-   Test target: `post=13`

## Session info

-   Tester:
-   Date:
-   Browser:
-   WordPress user:
-   Build/branch:

## Scenarios

| Area              | Scenario                                    | Result        | Notes |
| ----------------- | ------------------------------------------- | ------------- | ----- |
| Inserter          | Bibliography block appears and inserts      | ☐ Pass ☐ Fail |       |
| Add form          | Form is open by default                     | ☐ Pass ☐ Fail |       |
| Supported input   | Book sample parses                          | ☐ Pass ☐ Fail |       |
| Supported input   | Journal sample parses                       | ☐ Pass ☐ Fail |       |
| Supported input   | Webpage/review/thesis sample parses         | ☐ Pass ☐ Fail |       |
| Unsupported input | Unsupported sample fails closed with notice | ☐ Pass ☐ Fail |       |
| DOI               | Raw DOI resolves                            | ☐ Pass ☐ Fail |       |
| DOI               | DOI URL resolves                            | ☐ Pass ☐ Fail |       |
| BibTeX            | Book entry parses                           | ☐ Pass ☐ Fail |       |
| BibTeX            | Article entry parses                        | ☐ Pass ☐ Fail |       |
| Editing           | Escape exits edit mode cleanly              | ☐ Pass ☐ Fail |       |
| Notices           | Success/info notice auto-dismisses          | ☐ Pass ☐ Fail |       |
| Notices           | Warning/error notice can be dismissed       | ☐ Pass ☐ Fail |       |
| Save/reload       | Block stays valid after save                | ☐ Pass ☐ Fail |       |
| Frontend          | Bibliography renders correctly              | ☐ Pass ☐ Fail |       |

## Bugs found

| ID  | Summary | Severity | Repro steps | Expected | Actual |
| --- | ------- | -------- | ----------- | -------- | ------ |
| 1   |         |          |             |          |        |
| 2   |         |          |             |          |        |
| 3   |         |          |             |          |        |

## Severity guide

-   **P0** — data loss, block corruption, major security issue
-   **P1** — key feature broken
-   **P2** — degraded but usable
-   **P3** — polish / minor UX issue
