import type { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    await connectDB();
    const courses = await Course.find({ status: 'approved' })
      .select('_id updatedAt')
      .lean();

    const courseEntries: MetadataRoute.Sitemap = courses.map((course: any) => ({
      url: `${siteUrl}/courses/${course._id}`,
      lastModified: course.updatedAt ? new Date(course.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticEntries, ...courseEntries];
  } catch (error) {
    console.warn('Sitemap dynamic courses fallback:', error);
    return staticEntries;
  }
}
