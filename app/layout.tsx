import type { Metadata, Viewport } from "next";
import { profile } from "@/content/profile";
import { fontVariables } from "./fonts";
import "./globals.css";

const siteUrl = "https://lucasreydman.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lucas Reydman, Software Developer",
  /*
    Keep this in step with `profile.hero` and `profile.contact`,
    which set the same claim on the page. Metadata is where a site goes stale:
    nobody reads it, so nobody notices when it stops being true.
  */
  description:
    "Software developer working in sports analytics and AI: projection models, betting models and fantasy tools, from the math to the product. Product engineering lead at FBI Basketball.",
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: profile.name,
    title: "Lucas Reydman, Software Developer",
    description:
      "Projection models, betting models and fantasy tools, from the math to the product.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas Reydman, Software Developer",
    description:
      "Projection models, betting models and fantasy tools, from the math to the product.",
  },
  alternates: { canonical: siteUrl },
};

/*
  The browser chrome around the page. Without a theme colour, mobile Safari and
  Chrome paint their toolbars and the overscroll area in their own light grey,
  so the first thing a phone shows is a pale band above a dark page.
*/
export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  email: profile.email,
  jobTitle: "Software Developer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Dalhousie University",
  },
  sameAs: profile.links.map((link) => link.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontVariables} h-full`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:font-sans focus:text-ground"
        >
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
