# r3frag.me

r3frag is a static archive of fragments.
An ongoing refragmenting of a life expressed through science and art.

## Development

```bash
npm install
npm run dev
```

## Content

Fragments live in `src/content/fragments/` as Markdown files with required frontmatter:

```yaml
---
title: optional
date: 2026-04-22T12:00:00Z
mode: science
---
```

Valid `mode` values are `science` and `art`.

Optional fields:

```yaml
image: sample.jpg
imageAlt: Brief description
```

If `image` is used, place the asset in `src/assets/fragments/`.
