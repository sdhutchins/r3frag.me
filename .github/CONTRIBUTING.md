# Contributing

`r3frag` is a static archive of fragments, not a blog, portfolio, or application platform. Contributions should increase clarity without increasing ceremony.

## Local Setup

```bash
npm install
npm run dev
```

## Checks

Run the full local check before opening a pull request:

```bash
npm test
```

`npm test` validates fragment frontmatter and builds the Astro site. Use `npm run test:lint` when you only need the faster fragment validation pass.

## Content Rules

- Put fragments in `src/content/fragments/`.
- Use Markdown with `date` and `mode` frontmatter.
- Set `mode` to `science`, `art`, or `thread`.
- Keep science fragments to 6 sentences or fewer.
- Keep art fragments image-only or 3 sentences or fewer.
- Keep thread fragments to 5 sentences or fewer.
- Put image assets in `src/assets/fragments/` and provide useful `imageAlt` text when an image needs context.

## Change Scope

- Preserve the single chronological stream.
- Preserve the responsive masonry behavior.
- Avoid TypeScript, UI frameworks, backend code, databases, or heavy client-side JavaScript.
- Prefer proportion, typography, spacing, and tone over new visual features.
- Do not add generic blog, portfolio, social, comment, pagination, or CMS behavior.

## Pull Requests

- Keep each pull request focused on one coherent change.
- Explain why the change belongs in a minimal static archive.
- Include testing notes, especially when content validation, build behavior, deployment, or image handling changes.
- Request review from @sdhutchins before merging.
