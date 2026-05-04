# WordPress.org SVN Deploy Checklist

This repository uses Git for development and WordPress.org SVN for release publication.

## Checklist

1. **Keep Git as the source of truth**
   - Develop in GitHub.
   - Use SVN only for WordPress.org release publication.

2. **Use the correct WordPress.org SVN identity**
   - SVN username must be the WordPress.org username used for the plugin.
   - The username is case-sensitive.
   - Use the SVN-specific password from WordPress.org account settings, not the normal account password.

3. **Update `trunk/` with release-ready code**
   - `trunk/` should contain the current release baseline.
   - Do not place the main plugin file inside a nested subfolder under `trunk/`.

4. **Keep assets in `/assets/`**
   - Screenshots, banners, and icons belong in `assets/`.
   - Do not commit development-only files there.

5. **Tag releases from `trunk/`**
   - Create release tags by copying `trunk/` into `tags/<version>/` using SVN copy.
   - Update `Stable tag:` in `trunk/readme.txt` when tagging.

6. **Do not upload zip files to SVN**
   - Commit individual files only.
   - Keep the packaged GitHub release zip separate from SVN.

7. **Treat SVN as a public release repository**
   - Only commit finished changes that are safe for WordPress.org users.
   - Anything committed to SVN should be ready to ship.

8. **If authentication fails, check these first**
   - Username capitalization/case.
   - Whether the account is listed as a plugin committer.

## Repository workflow summary

- **GitHub release zip**: packaged artifact for GitHub Releases and Playground.
- **WordPress.org SVN `trunk/`**: public release source.
- **WordPress.org `assets/`**: directory screenshots, banner, and icon assets.
- **WordPress.org `tags/<version>/`**: release snapshot.

## Sources

- [Using Subversion – Plugin Handbook](https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/)
- [Subversion Access – Make WordPress.org](https://make.wordpress.org/meta/handbook/tutorials-guides/svn-access/)
