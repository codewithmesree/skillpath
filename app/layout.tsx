import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#2D1B69",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SkillPath | Brutalist EdTech & Creative Engineering Platform",
    template: "%s | SkillPath",
  },
  description:
    "Master high-demand tech, engineering, and design skills with hands-on labs, authentic projects, interactive quizzes, and verified credentials.",
  keywords: [
    "EdTech",
    "SkillPath",
    "Learn Programming",
    "Web Development",
    "Brutalist UI/UX",
    "Next.js Courses",
    "Interactive Coding",
    "Software Engineering Career",
    "Design Engineering",
  ],
  authors: [{ name: "SkillPath Team" }],
  creator: "SkillPath",
  publisher: "SkillPath",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SkillPath | Brutalist EdTech & Creative Engineering Platform",
    description:
      "A tactile, brutalist learning journey with production-ready projects, real-time code challenges, and verified career credentials.",
    url: siteUrl,
    siteName: "SkillPath",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillPath | Brutalist EdTech Platform",
    description:
      "Production-ready projects, interactive coding challenges, and verified credentials for modern creators.",
    creator: "@skillpath",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "SkillPath",
      "description": "Tactile brutalist learning platform for creators and developers.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/courses?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${siteUrl}/#organization`,
      "name": "SkillPath",
      "url": siteUrl,
      "logo": `${siteUrl}/favicon.ico`,
      "sameAs": [
        "https://twitter.com/skillpath",
        "https://github.com/skillpath",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${hankenGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
