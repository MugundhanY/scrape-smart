import { Metadata } from "next";

export const homeMetadata: Metadata = {
  title: "ScrapeSmart | Intelligent Web Data Extraction Platform",
  description: "Transform your data collection workflow with ScrapeSmart. Extract web data with precision, reliability and unprecedented ease.",
  keywords: ["web scraping", "data extraction", "workflow automation", "data collection", "AI extraction", "web data"],
  alternates: {
    canonical: "https://scrapesmart.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scrapesmart.com",
    siteName: "ScrapeSmart",
    title: "ScrapeSmart - The Ultimate Web Data Extraction Platform",
    description: "Join thousands of data professionals using ScrapeSmart to extract web data with precision, reliability, and unprecedented ease.",
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
    description: "Join thousands of data professionals using ScrapeSmart to extract web data with precision, reliability, and unprecedented ease.",
    images: ["/images/twitter-image.png"],
    creator: "@scrapesmart",
  },
};

export const signInMetadata: Metadata = {
  title: "Sign In | ScrapeSmart",
  description: "Sign in to your ScrapeSmart account to access your data extraction workflows.",
  robots: {
    index: false,
    follow: true,
  },
};

export const signUpMetadata: Metadata = {
  title: "Create Account | ScrapeSmart",
  description: "Create your ScrapeSmart account and start extracting web data with precision and ease.",
  robots: {
    index: false,
    follow: true,
  },
};

export const dashboardMetadata: Metadata = {
  title: "Dashboard | ScrapeSmart",
  description: "Manage your data extraction workflows and monitor your ScrapeSmart usage.",
  robots: {
    index: false,
    follow: false,
  },
};
