// JSON-LD для поисковиков и ИИ-ассистентов (ТЗ 6.4).
import { site, pageDescription } from './site';

export function buildJsonLd() {
  const personId = `${site.siteUrl}/#person`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: site.name,
        jobTitle: 'Разработчик сайтов, приложений и ИИ-агентов',
        url: site.siteUrl,
        email: `mailto:${site.email}`,
        sameAs: [site.github, site.telegramUrl],
      },
      {
        '@type': 'ProfessionalService',
        name: `${site.name} — сайты, приложения и ИИ-агенты`,
        url: site.siteUrl,
        description: pageDescription,
        founder: { '@id': personId },
        areaServed: 'RU',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Услуги',
          itemListElement: site.services.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s.title, description: s.text },
          })),
        },
      },
    ],
  };
}
