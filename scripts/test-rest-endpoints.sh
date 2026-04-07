#!/bin/sh
set -eu

WP_BIBLIO_WP_PATH="${WP_BIBLIO_WP_PATH:-/Users/danknauss/Studio/single-instance}"
wp eval-file "$(dirname "$0")/rest-endpoint-smoke-test.php" --path="$WP_BIBLIO_WP_PATH"
