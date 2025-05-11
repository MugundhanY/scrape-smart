"use client";

import { useEffect } from 'react';

export function HomeStructuredData() {
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://scrapesmart.com/",
      "name": "ScrapeSmart",
      "description": "Intelligent Web Data Extraction Platform",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://scrapesmart.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
    
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return null;
}

export function BusinessStructuredData() {
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ScrapeSmart",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "0",
          "priceCurrency": "USD",
          "unitText": "month",
          "priceType": "https://schema.org/MinimumPrice"
        }
      },
      "description": "Transform your data collection workflow with ScrapeSmart. Extract web data with precision, reliability and unprecedented ease.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "245",
        "bestRating": "5",
        "worstRating": "1"
      }
    };
    
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return null;
}

export function FAQStructuredData({ faqs }: { faqs: {question: string, answer: string}[] }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [faqs]);
  
  return null;
}
