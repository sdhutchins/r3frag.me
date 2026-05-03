import { z } from 'astro:content';

const shortSingleLine = z
  .string()
  .trim()
  .max(60, 'Origin must be 60 characters or fewer.')
  .refine((value) => !/[\r\n]/.test(value), 'Origin must stay on a single line.');

const isoDateField = z
  .string()
  .refine(looksLikeIsoDate, 'Date must be an ISO string.')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Date must be valid.');

export const fragmentFrontmatterSchema = z.object({
  title: z.string().trim().optional(),
  date: isoDateField,
  mode: z.enum(['science', 'art', 'thread']),
  origin: shortSingleLine.optional(),
  image: z.string().trim().optional(),
  imageAlt: z.string().trim().optional(),
});

function looksLikeIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(value);
}
