import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillPath | Brutalist EdTech Platform",
  description: "A playful, bold, and modern LMS for the next generation of learners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
