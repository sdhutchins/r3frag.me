# r3frag.me

r3frag is a static archive of fragments.

It is built with Astro as a minimal, content-driven site for short scientific and artistic thoughts arranged in a single chronological stream.

## Table of Contents

- [Install & Setup](#install--setup)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

## Install & Setup

- Node.js
- npm
- Astro 6 (installed through local dependencies)0

### Instructions

```bash
npm install
npm run dev
```

Run the validation and production build locally with:

```bash
npm test
```

## Usage

Add new fragments in `src/content/fragments/` using Markdown with frontmatter like:

```yaml
---
title: optional
date: 2026-04-22T12:00:00Z
mode: science
origin: optional short note or URL
image: optional filename
imageAlt: optional image description
---
```

Fragment notes:

- Valid `mode` values are `science` and `art`.
- `science` fragments should stay concise and conditional.
- `art` fragments can be image-only or brief text.
- If `image` is used, place the asset in `src/assets/fragments/`.

Site copy and metadata live in:

- `src/data/site.json` for site-wide metadata and navigation
- `src/data/pages.json` for page titles, descriptions, and intro copy

## Contributing

See [Contributing](.github/CONTRIBUTING.md).

## License

View the [LICENSE](LICENSE) for this project.

## Authors

- Shaurita D. Hutchins
