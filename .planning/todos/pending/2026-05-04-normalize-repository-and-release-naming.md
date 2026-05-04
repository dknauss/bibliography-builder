---
created: 2026-05-04T04:15:49.157Z
title: Normalize repository and release naming
area: release
files:
  - README.md
  - readme.txt
  - SECURITY.md
  - CONTRIBUTING.md
  - bibliography-builder.php
  - playground/blueprint.json
  - scripts/package-release.sh
  - .github/workflows/release.yml
  - languages/borges-bibliography-builder*.po
  - languages/borges-bibliography-builder.pot
---

## Problem

The product/plugin branding is now centered on **Borges Bibliography Builder** and the WordPress.org-facing slug/text domain/package name is `borges-bibliography-builder`, but GitHub and release naming are still mixed. The live GitHub repository is `dknauss/Bibliography-Builder`; some docs and metadata point to `github.com/dknauss/bibliography-builder`; README badges and Playground URLs still reference `Bibliography-Builder`; and `playground/blueprint.json` still downloads `bibliography-builder.zip` while the current release packaging script creates `borges-bibliography-builder.zip`. This can confuse contributors, break Playground/release links after a repo rename, and make the public brand look inconsistent.

Do **not** treat this as a block/content migration. The existing block namespace and saved-output classes are content/theme compatibility surfaces and should remain stable:

- `bibliography-builder/bibliography`
- `wp-block-bibliography-builder-bibliography`
- `bibliography-builder-*`
- `Z3988` for COinS metadata spans

## Solution

Plan a focused repository/docs/release cleanup around the canonical GitHub repository name `dknauss/borges-bibliography-builder`. Rename the GitHub repo when ready, then update README badges, Playground raw URLs, `readme.txt`, `SECURITY.md`, `CONTRIBUTING.md`, Plugin URI, language file bug-report headers, GitHub repository metadata, and release/download URLs. Reconcile the release asset transition by either publishing both `bibliography-builder.zip` and `borges-bibliography-builder.zip` for one release cycle or updating Playground only after the latest release actually provides the new asset name.

## Acceptance targets

- GitHub repository is renamed or an explicit decision records why it remains unchanged.
- All repository URLs and badges use the canonical repo path.
- Playground blueprint downloads an asset that exists on the latest GitHub Release.
- Release workflow/package script asset names are intentional and documented.
- WordPress.org readme/header metadata and GitHub metadata use consistent Borges branding.
- Block namespace, saved frontend classes, and COinS `Z3988` marker remain unchanged for compatibility.
