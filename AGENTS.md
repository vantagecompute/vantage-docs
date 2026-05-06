# AGENTS.md — Vantage Docs (Docusaurus)

## Build & Dev Commands

- **Always use `just`**, never bare `yarn build` or `yarn start`.
  - `just build` — sync CLI docs from submodule, then production build
  - `just dev` — sync CLI docs, then start dev server
  - `just clean` — remove `build/` and `.docusaurus/`
- `just build` runs `node scripts/sync-cli-docs.js /reference/cli/` before building. Running `yarn build` directly skips this and produces a broken site (missing CLI docs).
- Spell check: `yarn spellcheck` (uses cspell, dictionary: `.cspell/vantage-dictionary.txt`, scopes to `docs/**/*.md`)

## Repo Structure (verified)

```
docs/                    # Main content (Markdown)
  concepts/ get-started/ platform/ reference/ superpowers/
  reference/
    cli/                 # Gitignored — synced from external/vantage-cli/ at build time
    api/ sdk/            # Maintained directly in docs/
src/                     # Custom React components, theme overrides, CSS
  theme/Root.js          # Site wrapper — mounts FloatingAskWidget
scripts/
  sync-cli-docs.js       # Copies + rewrites links from external/vantage-cli/ → docs/reference/cli/
external/vantage-cli/    # Private git submodule (requires PAT in CI)
```

## Key Quirks

- **Private submodule**: `external/vantage-cli/` is private. CI rewrites SSH→HTTPS with `VANTAGE_CLI_RO_GITHUB_PAT`. Locally, `just install` handles recursive submodule init.
- **No test suite**: No tests are defined. Do not look for or invent a test command.
- **Node >= 22** required (engines field in package.json).
- **CLI docs are ephemeral**: `docs/reference/cli/` is gitignored and regenerated at build time by `scripts/sync-cli-docs.js`. Do not manually edit files in that directory.
- **`search-insights`** is installed but only activated by `insights: true` in `docusaurus.config.js` algolia config (now set).

## Deploy

- Push to `main` triggers GitHub Actions → GitHub Pages.
- Also triggered by `repository_dispatch` (type: `cli-docs-updated`) from the CLI repo.
- Never deploy locally without team agreement (see README.md warning).

## Docs Conventions

- Kebab-case filenames, `.md` extension, MDX-compatible.
- Frontmatter: `title` and `description` required.
- cspell dictionary at `.cspell/vantage-dictionary.txt` — add project terms there, not by disabling checks.
