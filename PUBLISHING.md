# Publishing Arcalink Sync

The Obsidian Community directory requires `manifest.json`, `README.md`, and `LICENSE` at the root of the submitted GitHub repository. The current product repository is a GitLab monorepo, so the plugin must be published to a separate GitHub repository whose root is the contents of this directory.

## One-time GitHub setup

1. Create an empty public GitHub repository named `arcalink-sync`. Do not initialize it with a README, license, or `.gitignore`.
2. Add that repository as a second remote from the monorepo root:

   ```bash
   git remote add github-plugin git@github.com:GITHUB_OWNER/arcalink-sync.git
   ```

3. Publish the plugin directory as the root of the GitHub repository:

   ```bash
   git subtree split --prefix=plugin/obsidian-http-sync -b arcalink-sync-publish
   git push github-plugin arcalink-sync-publish:main
   ```

For later source updates, repeat the split with a fresh temporary branch, or use a dedicated export workflow after the repository layout is finalized.

## Before the first Community directory submission

- Verify that `LICENSE`, `COPYRIGHT.md`, the `GPL-3.0-only` package metadata, and `THIRD_PARTY_NOTICES.md` are included in the public repository and release source.
- Remove the plugin's built-in update downloader and installer. Community plugins must be updated through Obsidian and GitHub Releases.
- Confirm the public privacy-policy and terms URLs for the Arcalink service.
- Decide whether the directory listing should be marked **Paid** or **Optional payment**.
- Test the plugin on desktop and mobile because `isDesktopOnly` is `false`.
- Run the official Obsidian ESLint rules and resolve all errors.
- Publish a GitHub release whose tag exactly matches `manifest.json.version`.

## Create a release

After the source is on GitHub and all publication blockers are resolved:

```bash
git tag -a 0.1.41 -m "0.1.41"
git push github-plugin 0.1.41
```

The GitHub Actions workflow creates a draft release containing `main.js` and `manifest.json`. Review the generated notes and publish the draft from GitHub.

## Submit to Obsidian

1. Sign in at <https://community.obsidian.md>.
2. Connect the GitHub account that owns the repository.
3. Open **Plugins → New plugin**.
4. Enter the public repository URL.
5. Select the owner, accept the developer policies, and submit the plugin.
6. Resolve scanner errors by publishing a new version and requesting another review.
