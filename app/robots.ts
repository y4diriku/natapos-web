import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.natapos.web.id';
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/docs'],
      disallow: ['/superadmin', '/superadmin/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
