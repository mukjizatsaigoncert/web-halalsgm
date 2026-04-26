import { cleanRichText, sanitizeFields } from '../../../../utils/sanitize';
import { vietnameseSlugify } from '../../../../utils/slugify';

const sanitizeBlocks = (blocks: any[]) => {
  if (!Array.isArray(blocks)) return;
  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue;
    if (block.__component === 'shared.rich-text' && typeof block.body === 'string') {
      block.body = cleanRichText(block.body);
    }
    if (block.__component === 'shared.quote') {
      if (typeof block.title === 'string') block.title = cleanRichText(block.title);
      if (typeof block.body === 'string') block.body = cleanRichText(block.body);
    }
  }
};

const applyAll = (data: any) => {
  if (!data) return;
  sanitizeFields(data, { plain: ['title', 'description'] });
  // Always re-generate slug from title to ensure Vietnamese characters are correctly transliterated.
  // This overrides whatever Strapi's built-in UID generator may have produced.
  if (data.title) {
    data.slug = vietnameseSlugify(data.title);
  } else if (!data.slug) {
    // fallback: if no title and no slug, leave as-is
  }
  if (Array.isArray(data.blocks)) sanitizeBlocks(data.blocks);
};

export default {
  beforeCreate(event: any) {
    applyAll(event.params.data);
  },
  beforeUpdate(event: any) {
    applyAll(event.params.data);
  },
};
