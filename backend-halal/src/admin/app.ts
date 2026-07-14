import vi from './translations/vi';

/**
 * Strapi Admin panel customization.
 *
 * This is separate from the content i18n plugin: it enables Vietnamese in
 * the administration interface's language selector.
 */
export default {
  config: {
    locales: ['vi'],
    translations: { vi },
  },
  bootstrap() {},
};
