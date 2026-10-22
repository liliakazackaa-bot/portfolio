// JSON-LD для поисковиков и ИИ-ассистентов (ТЗ 6.4). Сайт обезличен: только мастерская, без Person.
import { site, pageDescription } from './site';

export function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.siteUrl}/#service`,
    name: site.name,
    url: site.siteUrl,
    email: `mailto:${site.email}`,
    description: pageDescription,
    sameAs: [site.github, site.telegramUrl].filter(Boolean),
    areaServed: 'RU',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги',
      itemListElement: site.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.text },
      })),
    },
  };
}
