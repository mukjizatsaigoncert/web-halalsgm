import sanitizeHtml, { IOptions } from 'sanitize-html';

// Strip all HTML, keeping only text. Used for fields that should never
// contain markup (names, titles, phone numbers, single-line descriptions).
const STRIP_ALL: IOptions = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: 'discard',
};

// Allow a safe subset of HTML for richtext fields.
const RICH: IOptions = {
  allowedTags: [
    'p', 'br', 'hr', 'strong', 'em', 'u', 's', 'del', 'ins', 'mark',
    'sub', 'sup', 'code', 'pre', 'blockquote', 'q',
    'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'span', 'div',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    '*': ['class', 'id'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
  },
};

export const stripHtml = (input: unknown): string =>
  typeof input === 'string' ? sanitizeHtml(input, STRIP_ALL).trim() : (input as string);

export const cleanRichText = (input: unknown): string =>
  typeof input === 'string' ? sanitizeHtml(input, RICH) : (input as string);

// Apply sanitisers to a set of fields on an object in place.
// Returns the same object for chaining.
export const sanitizeFields = <T extends Record<string, any>>(
  data: T | undefined,
  opts: { plain?: (keyof T)[]; rich?: (keyof T)[] }
): T | undefined => {
  if (!data) return data;
  for (const key of opts.plain ?? []) {
    if (data[key] != null) (data as any)[key] = stripHtml(data[key]);
  }
  for (const key of opts.rich ?? []) {
    if (data[key] != null) (data as any)[key] = cleanRichText(data[key]);
  }
  return data;
};
