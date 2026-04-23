/**
 * Standalone frontmatter validation for fragment markdown files.
 * Runs without Astro so it can serve as a fast pre-build check.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const FRAGMENTS_DIR = join(import.meta.dirname, '..', 'src', 'content', 'fragments');
const REQUIRED_FIELDS = ['date', 'mode'];
const VALID_MODES = ['science', 'art'];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?)?$/;

let errors = 0;

function fail(file, message) {
  console.error(`  FAIL  ${file}: ${message}`);
  errors++;
}

function pass(file) {
  console.log(`  ok    ${file}`);
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const fields = {};
  for (const line of match[1].split('\n')) {
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim().replace(/^["']|["']$/g, '');
    fields[key] = value;
  }
  return fields;
}

const files = (await readdir(FRAGMENTS_DIR)).filter((f) => f.endsWith('.md')).sort();

if (files.length === 0) {
  console.error('No fragment files found.');
  process.exit(1);
}

console.log(`Validating ${files.length} fragment(s)…\n`);

for (const file of files) {
  const content = await readFile(join(FRAGMENTS_DIR, file), 'utf-8');
  const fm = parseFrontmatter(content);

  if (!fm) {
    fail(file, 'missing frontmatter block');
    continue;
  }

  let fileOk = true;

  for (const field of REQUIRED_FIELDS) {
    if (!fm[field]) {
      fail(file, `missing required field "${field}"`);
      fileOk = false;
    }
  }

  if (fm.date && !ISO_DATE.test(fm.date)) {
    fail(file, `date "${fm.date}" is not a valid ISO string`);
    fileOk = false;
  }

  if (fm.mode && !VALID_MODES.includes(fm.mode)) {
    fail(file, `mode "${fm.mode}" must be "science" or "art"`);
    fileOk = false;
  }

  if (fileOk) pass(file);
}

console.log(`\n${files.length - errors} passed, ${errors} failed.`);
process.exit(errors > 0 ? 1 : 0);
