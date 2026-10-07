import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/courses', '/login', '/register'],
        disallow: ['/admin/', '/dashboard/', '/instructor/', '/api/', '/payment/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
