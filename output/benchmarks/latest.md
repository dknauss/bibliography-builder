# Performance benchmark report

Generated: 2026-04-05T20:26:19.472Z

## Import fixtures

| Fixture | Entries | Parse deferred avg (ms) | Batch format avg (ms) | Combined editor path avg (ms) |
| --- | ---: | ---: | ---: | ---: |
| import-freetext-10.txt | 10 | 1 | 147.84 | 148.84 |
| import-freetext-25.txt | 25 | 0.43 | 39.54 | 39.97 |
| import-freetext-50.txt | 50 | 0.69 | 71.69 | 72.38 |

## Style switch batch formatting

| Style | Avg (ms) | Median (ms) | Min (ms) | Max (ms) |
| --- | ---: | ---: | ---: | ---: |
| ieee | 18.32 | 15.56 | 14.79 | 29.89 |
| vancouver | 18.2 | 17.51 | 14.88 | 24.29 |
| mla-9 | 62.9 | 61.47 | 49.37 | 83.71 |

## Manual entry

- Average add time: 2.13 ms
- Median add time: 1.7 ms
