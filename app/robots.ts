import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/admin/', '/(auth)/'],
    },
    sitemap: 'https://scrapesmart.com/sitemap.xml',
    host: 'https://scrapesmart.com',
  };
}
