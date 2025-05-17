"use client";

import Head from 'next/head';
import { usePathname } from 'next/navigation';

type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  date?: string;
  updatedAt?: string;
  tags?: string[];
  children?: React.ReactNode;
};

export function SocialMetaTags({
  title = "ScrapeSmart - Intelligent Web Data Extraction Platform",
  description = "Transform your data collection workflow with ScrapeSmart. Extract web data with precision, reliability and unprecedented ease.",
  image = "/images/logo.svg",
  type = "website",
  date,
  updatedAt,
  tags = [],
}: SeoProps) {
  const pathname = usePathname();
  const url = `https://scrapesmart.com${pathname}`;

  return (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@scrapesmart" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://scrapesmart.com${image}`} />
      
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://scrapesmart.com${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ScrapeSmart" />
      
      {date && <meta property="article:published_time" content={date} />}
      {updatedAt && <meta property="article:modified_time" content={updatedAt} />}
      {tags && tags.map((tag, i) => (
        <meta key={i} property="article:tag" content={tag} />
      ))}
    </>
  );
}
