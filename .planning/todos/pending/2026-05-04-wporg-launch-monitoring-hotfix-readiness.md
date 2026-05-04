---
created: 2026-05-04T10:15:00Z
title: Maintain WordPress.org launch monitoring and hotfix readiness
area: release
phase: 01-post-launch-cleanup-and-documentation-polish
files:
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/readme.txt
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/bibliography-builder.php
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/.github/workflows/wp-deploy.yml
  - /Users/danknauss/Developer/GitHub/wp-bibliography-block/output/release/
---

## Problem

Borges Bibliography Builder is now live on WordPress.org. The project still needs a lightweight launch-monitoring and hotfix posture so public listing metadata, GitHub release assets, the WordPress.org SVN package, and any reviewer/user follow-up remain aligned.

## Solution

Keep release artifacts reproducible, monitor the WordPress.org listing/support surface after launch, and make the deploy workflow easy to rerun safely for patch releases or asset/readme-only updates.

## Acceptance targets

- ready-to-rebuild `borges-bibliography-builder.zip` artifact
- WordPress.org plugin page, `readme.txt`, GitHub README, and GitHub release metadata stay consistent
- reviewer or early-user requests can be addressed and redeployed in one patch cycle
- deploy workflow can be rerun manually without republishing a GitHub Release when appropriate
