import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Course Library & Learning Tracks',
  description:
    'Explore hands-on tech and creative tracks in UI/UX architecture, full-stack systems, security, and indie engineering.',
  alternates: {
    canonical: '/courses',
  },
  openGraph: {
    title: 'Course Library & Learning Tracks | SkillPath',
    description:
      'Explore hands-on tech and creative tracks in UI/UX architecture, full-stack systems, security, and indie engineering.',
    url: '/courses',
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
