/**
 * i18n configuration.
 * Enables Vietnamese (vi) as the primary locale.
 */
export default ({ env }: { env: any }) => ({
  config: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
  },
});