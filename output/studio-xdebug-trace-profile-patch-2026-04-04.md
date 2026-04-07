# Local Studio Xdebug trace/profile patch

Date: 2026-04-04
Machine: local only

## Purpose
Enable Xdebug trace/profile modes in WordPress Studio's bundled PHP/WASM runtime.

## Patched files
- `/Applications/Studio.app/Contents/Resources/cli/node_modules/@php-wasm/node/index.js`
- `/Applications/Studio.app/Contents/Resources/cli/node_modules/@php-wasm/node/index.cjs`

## Original line
- `xdebug.mode=debug,develop`

## Patched line
- `xdebug.mode=debug,develop,trace,profile`

## Backups created
- `/Applications/Studio.app/Contents/Resources/cli/node_modules/@php-wasm/node/index.js.bak-2026-04-04`
- `/Applications/Studio.app/Contents/Resources/cli/node_modules/@php-wasm/node/index.cjs.bak-2026-04-04`

## How to apply
Already applied locally by editing the bundled Studio CLI resources.

## Required restart
1. Quit Studio completely.
2. Reopen Studio.
3. Restart the target site.
4. Re-enable Xdebug for the site if needed.

## How to verify
Run a temporary REST diagnostic and confirm `xdebug_mode` includes:
- `trace`
- `profile`

Expected value:
- `debug,develop,trace,profile`

## Rollback
Restore the backups:

```bash
cp /Applications/Studio.app/Contents/Resources/cli/node_modules/@php-wasm/node/index.js.bak-2026-04-04 \
   /Applications/Studio.app/Contents/Resources/cli/node_modules/@php-wasm/node/index.js
cp /Applications/Studio.app/Contents/Resources/cli/node_modules/@php-wasm/node/index.cjs.bak-2026-04-04 \
   /Applications/Studio.app/Contents/Resources/cli/node_modules/@php-wasm/node/index.cjs
```

Then quit and reopen Studio.

## Caveats
- This is a local app-bundle patch, not a project setting.
- A Studio update may overwrite it.
- It may affect all Studio sites that enable Xdebug.
