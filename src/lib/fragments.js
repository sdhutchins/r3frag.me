import { fragmentFrontmatterSchema } from '../content/schema.js';

const fragmentModules = import.meta.glob('../content/fragments/*.md', { eager: true });
const imageModules = import.meta.glob('../assets/fragments/*.{avif,gif,jpeg,jpg,png,svg,webp}', {
  eager: true,
  import: 'default',
});

export function getFragments(filters = {}) {
  const fragments = Object.entries(fragmentModules)
    .map(([filePath, module]) => toFragment(filePath, module))
    .sort((left, right) => right.dateValue - left.dateValue);

  if (!filters.mode) {
    return fragments;
  }

  return fragments.filter((fragment) => fragment.mode === filters.mode);
}

function toFragment(filePath, module) {
  const { Content } = module;
  const rawBody = typeof module.rawContent === 'function' ? module.rawContent() : '';
  const frontmatter = validateFrontmatter(filePath, module.frontmatter);
  const normalizedText = stripMarkdown(rawBody).trim();
  validateBody(filePath, frontmatter, rawBody);

  return {
    id: filePath,
    title: frontmatter.title || '',
    date: frontmatter.date,
    dateValue: new Date(frontmatter.date),
    mode: frontmatter.mode,
    origin: frontmatter.origin || '',
    originHref: resolveOriginHref(frontmatter.origin),
    textLength: normalizedText.length,
    image: resolveImage(filePath, frontmatter),
    Content,
  };
}

function validateFrontmatter(filePath, frontmatter) {
  const parsed = fragmentFrontmatterSchema.safeParse(frontmatter);

  if (parsed.success) {
    return parsed.data;
  }

  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'frontmatter'}: ${issue.message}`)
    .join(' ');

  throw new Error(`[fragments] ${filePath} has invalid frontmatter. ${details}`);
}

function validateBody(filePath, frontmatter, rawBody) {
  const normalizedText = stripMarkdown(rawBody).trim();
  const sentenceCount = countSentences(normalizedText);
  const hasInlineImage = /!\[[^\]]*]\([^)]+\)/.test(rawBody);
  const hasFrontmatterImage = Boolean(frontmatter.image);

  if (frontmatter.mode === 'science' && sentenceCount > 6) {
    throw new Error(`[fragments] ${filePath} exceeds the science limit of 6 sentences.`);
  }

  if (frontmatter.mode === 'art') {
    if (sentenceCount > 3) {
      throw new Error(`[fragments] ${filePath} exceeds the art limit of 3 sentences.`);
    }

    if (sentenceCount === 0 && !hasInlineImage && !hasFrontmatterImage) {
      throw new Error(`[fragments] ${filePath} is empty. Art fragments should contain an image or brief text.`);
    }
  }
}

function resolveImage(filePath, frontmatter) {
  if (!frontmatter.image) {
    return null;
  }

  const imagePath = Object.keys(imageModules).find((candidatePath) =>
    candidatePath.endsWith(`/${frontmatter.image}`),
  );

  if (!imagePath) {
    throw new Error(`[fragments] ${filePath} references a missing image asset: ${frontmatter.image}`);
  }

  return {
    src: imageModules[imagePath],
    alt: frontmatter.imageAlt || frontmatter.title || '',
  };
}

function resolveOriginHref(origin) {
  if (!origin) {
    return '';
  }

  try {
    const url = new URL(origin);

    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.href;
    }
  } catch {
    return '';
  }

  return '';
}

function stripMarkdown(rawBody) {
  return rawBody
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, ' $1 ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ');
}

function countSentences(text) {
  if (!text) {
    return 0;
  }

  const matches = text.match(/[^.!?]+[.!?](?=\s|$)/g);

  if (matches) {
    return matches.length;
  }

  return 1;
}
