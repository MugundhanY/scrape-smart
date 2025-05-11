import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScrapeSmart | Intelligent Web Data Extraction Platform",
  description: "Transform your data collection workflow with ScrapeSmart. Extract web data with precision, reliability and unprecedented ease.",
  keywords: ["web scraping", "data extraction", "workflow automation", "data collection", "AI extraction"],
  authors: [{ name: "ScrapeSmart Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scrapesmart.com",
    siteName: "ScrapeSmart",
    title: "ScrapeSmart - The Ultimate Web Data Extraction Platform",
    description: "Transform your data collection workflow with precision, reliability and unprecedented ease.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ScrapeSmart - Web Data Extraction Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ScrapeSmart - Intelligent Web Data Extraction",
    description: "Transform your data collection workflow with precision, reliability and unprecedented ease.",
    images: ["/images/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://scrapesmart.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://scrapesmart.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="verification_code_here" />
        {/* Structured data for rich search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ScrapeSmart",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Transform your data collection workflow with ScrapeSmart. Extract web data with precision, reliability and unprecedented ease."
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
        <Toaster richColors />
      </body>
    </html>
  );
}
