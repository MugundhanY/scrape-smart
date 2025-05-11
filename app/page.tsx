"use client";

import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import CallToAction from "@/components/landing/CallToAction";
import FooterSection from "@/components/landing/FooterSection";
import FAQ from "@/components/landing/FAQ";
import ContactForm from "@/components/landing/ContactForm";
import VisualEditorSection from "@/components/landing/VisualEditorSection";


import { HomeStructuredData, BusinessStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";

// FAQ data for structured data
const faqData = [
  {
    question: "What is ScrapeSmart?",
    answer: "ScrapeSmart is an intelligent web data extraction platform that helps businesses gather data from websites with precision and reliability."
  },
  {
    question: "Do I need coding knowledge to use ScrapeSmart?",
    answer: "No, ScrapeSmart features a visual editor that allows you to extract data without writing any code."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, ScrapeSmart offers 5,000 free credits to get started with no credit card required."
  },
  {
    question: "What makes ScrapeSmart different from other web scraping tools?",
    answer: "ScrapeSmart combines AI-powered extraction with a user-friendly interface and powerful workflow automation capabilities."
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* SEO Structured Data */}
      <HomeStructuredData />
      <BusinessStructuredData />
      <FAQStructuredData faqs={faqData} />
      
      {/* Page Components */}
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <VisualEditorSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQ />
      <ContactForm />
      <CallToAction />
      <FooterSection />
    </main>
  );
}