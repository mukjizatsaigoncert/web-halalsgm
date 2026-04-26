/**
 * Vietnamese-aware slugify utility.
 * Converts accented Vietnamese characters to their ASCII equivalents
 * then produces a URL-safe slug.
 *
 * Example:
 *   vietnameseSlugify('Báo Mới Hôm Nay') => 'bao-moi-hom-nay'
 */

const VIETNAMESE_MAP: [RegExp, string][] = [
  // a
  [/[àáâãäåăắặẵấầẩẫậ]/gi, 'a'],
  // e
  [/[èéêëẻẽẹếềểễệ]/gi, 'e'],
  // i
  [/[ìíîïỉĩị]/gi, 'i'],
  // o
  [/[òóôõöøốồổỗộớờởỡợ]/gi, 'o'],
  // u
  [/[ùúûüủũụứừửữự]/gi, 'u'],
  // y
  [/[ỳýỷỹỵ]/gi, 'y'],
  // d
  [/[đ]/gi, 'd'],
];

export function vietnameseSlugify(input: string): string {
  let str = input.trim().toLowerCase();

  // Replace Vietnamese characters
  for (const [pattern, replacement] of VIETNAMESE_MAP) {
    str = str.replace(pattern, replacement);
  }

  return str
    .normalize('NFD')                      // decompose remaining accented chars
    .replace(/[\u0300-\u036f]/g, '')       // strip combining diacritics
    .replace(/[^a-z0-9\s-]/g, '')         // keep alphanumeric, spaces, hyphens
    .replace(/\s+/g, '-')                  // spaces → hyphens
    .replace(/-+/g, '-')                   // collapse multiple hyphens
    .replace(/^-|-$/g, '');               // trim leading/trailing hyphens
}

