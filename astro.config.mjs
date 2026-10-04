import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Адрес сайта: замените вместе с siteUrl в src/content/site.ts и строкой Sitemap в public/robots.txt.
export default defineConfig({
  site: 'https://example.com', // ЗАГЛУШКА
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
