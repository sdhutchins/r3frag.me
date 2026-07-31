import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

function lazyImagePlugin() {
  return function addLazyLoading(tree) {
    walkTree(tree);
  };
}

function walkTree(node) {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (node.type === 'element' && node.tagName === 'img') {
    node.properties ??= {};
    node.properties.loading ??= 'lazy';
    node.properties.decoding = 'async';
  }

  if (Array.isArray(node.children)) {
    node.children.forEach(walkTree);
  }
}

export default defineConfig({
  site: 'https://r3frag.me',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [lazyImagePlugin],
  },
});
