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

The product/plugin branding is now centered on **Borges Bibliography Builder**, and the approved WordPress.org slug/text domain/package name is confirmed as `borges-bibliography-builder`, but GitHub and release naming were mixed before completion. The repository still used `dknauss/Bibliography-Builder`; docs and metadata used a mix of `bibliography-builder`, `Bibliography-Builder`, and `borges-bibliography-builder`; and the Playground/release links needed to point at the canonical first-release artifact, `borges-bibliography-builder.zip`. This could confuse contributors, break Playground/release links after a repo rename, and make the public brand look inconsistent.

Do **not** treat this as a block/content migration. The existing block namespace and saved-output classes are content/theme compatibility surfaces and should remain stable:

- `bibliography-builder/bibliography`
- `wp-block-bibliography-builder-bibliography`
- `bibliography-builder-*`
- `Z3988` for COinS metadata spans

## Solution

Completed a focused repository/docs/release cleanup around the canonical GitHub repository name `dknauss/borges-bibliography-builder`. Renamed the GitHub repo, updated README badges, Playground raw URLs, `readme.txt`, `SECURITY.md`, `CONTRIBUTING.md`, Plugin URI, language file bug-report headers, GitHub repository metadata, and release/download URLs. Because this is still pre-first public WordPress.org release, no transition asset is needed: use `borges-bibliography-builder.zip` as the single canonical release asset and update Playground/download links to that asset before launch.

## Acceptance targets

- GitHub repository is renamed or an explicit decision records why it remains unchanged.
- All repository URLs and badges use the canonical repo path.
- Playground blueprint downloads an asset that exists on the latest GitHub Release.
- Release workflow/package script use `borges-bibliography-builder.zip` as the single canonical first-release asset.
- WordPress.org readme/header metadata and GitHub metadata use the approved `borges-bibliography-builder` slug and consistent Borges branding.
- Block namespace, saved frontend classes, and COinS `Z3988` marker remain unchanged for compatibility.

## Completed

Completed 2026-05-04. Repository renamed to `dknauss/borges-bibliography-builder`; local `origin` now uses `https://github.com/dknauss/borges-bibliography-builder.git`; canonical package remains `borges-bibliography-builder.zip`.
