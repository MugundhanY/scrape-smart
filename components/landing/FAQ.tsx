"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { HelpCircle, FileText, CreditCard } from "lucide-react";

export default function FAQ() {
  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, amount: 0.2 });
  // Organized FAQ items by category for better user experience
  const faqCategories = [
    {
      name: "Getting Started",
      icon: <HelpCircle className="h-4 w-4 mr-2" />,
      items: [
        {
          question: "What is ScrapeSmart?",
          answer: "ScrapeSmart is an intelligent web scraping platform that helps you automate data extraction from websites without coding. Our AI-powered tools make it easy to build, schedule and manage web scraping workflows with visual builders and templates."
        },
        {
          question: "Do I need technical knowledge to use ScrapeSmart?",
          answer: "No technical knowledge is required. Our visual workflow builder lets you create powerful web scrapers using a simple drag-and-drop interface. Advanced users can customize and extend functionality with custom scripts and API integrations if needed."
        },
        {
          question: "How quickly can I start collecting data?",
          answer: "You can start collecting data within minutes. Simply sign up, create a workflow using our visual builder, and run it immediately. For common use cases, our template gallery provides ready-to-use solutions that can be deployed with just a few clicks."
        }
      ]
    },    {
      name: "Technical & Legal",
      icon: <FileText className="h-4 w-4 mr-2" />,
      items: [
        {
          question: "Is web scraping legal?",
          answer: "Web scraping is legal when done ethically and in compliance with websites' terms of service. ScrapeSmart helps you follow best practices such as respecting robots.txt files, implementing reasonable rate limits, and avoiding overloading target websites. Our built-in ethical scraping guidelines help you stay compliant."
        },
        {
          question: "What happens if I encounter blocked websites?",
          answer: "ScrapeSmart includes built-in mechanisms to handle common blocking scenarios, including IP rotation, browser fingerprint randomization, and smart request scheduling to help you access the data you need while respecting website limitations. Our advanced proxy management system automatically adapts to website security measures."
        },
        {
          question: "How does ScrapeSmart handle website structure changes?",
          answer: "Our AI-powered extraction engine can adapt to minor website changes automatically. For significant redesigns, our smart alerts notify you when extraction patterns need updating, and our visual workflow editor makes it easy to adjust your scrapers without starting from scratch."
        }
      ]
    },    {
      name: "Billing & Data",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      items: [
        {
          question: "How does billing work?",
          answer: "We use a credit-based system where you pay only for what you use. Credits are consumed based on the complexity and volume of your scraping tasks. Check our pricing section for current packages and custom enterprise options. Unused credits roll over for up to 12 months."
        },
        {
          question: "Can I export the data I collect?",
          answer: "Yes, you can export scraped data in multiple formats including CSV, JSON, Excel, and SQL. We also offer direct integration with popular storage services like AWS S3, Google Drive, and databases including MongoDB, PostgreSQL, and MySQL. Our API allows you to programmatically access your collected data."
        },
        {
          question: "Is there a limit on how much data I can scrape?",
          answer: "There are no arbitrary limits on the amount of data you can scrape. Your usage is limited only by the number of credits in your account. Enterprise plans include options for high-volume data extraction with priority access to our infrastructure."
        }
      ]
    }
  ];
  
  // Flattened items for easier reference
  const faqItems = faqCategories.flatMap(category => category.items);
  // Import necessary icons from lucide-react
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section 
      id="faq" 
      ref={faqRef}
      className="py-24 md:py-32 bg-black relative overflow-hidden"
    >
      {/* Enhanced background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[500px] left-1/2 transform -translate-x-1/2 w-[1000px] h-[1000px] opacity-15">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-400/30 rounded-full blur-[120px]"></div>
        </div>
        
        {/* Additional decorative elements */}
        <motion.div 
          className="absolute top-60 left-10 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"
          animate={{
            y: [0, 15, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-40 right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span 
            className="block text-primary font-medium mb-4 uppercase tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-8"
          >
            Everything you need to know about ScrapeSmart and how it can help you extract web data.
          </motion.p>

          {/* Category selector */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {faqCategories.map((category, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveCategory(index)}                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 flex items-center ${
                  activeCategory === index 
                    ? 'bg-primary/20 border-primary/40 text-primary' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {category.icon}
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >          {/* Category heading with subtle indicator */}
          <motion.div 
            className="flex items-center justify-center mb-6 bg-gradient-to-r from-transparent via-white/5 to-transparent py-2 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center">
              {faqCategories[activeCategory].icon}
              <h3 className="text-white font-medium">
                {faqCategories[activeCategory].name}
              </h3>
              <span className="ml-3 bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full">
                {faqCategories[activeCategory].items.length} questions
              </span>
            </div>
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Accordion type="single" collapsible className="w-full">
                {faqCategories[activeCategory].items.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`} 
                    className="border-b border-white/10 mb-4 overflow-hidden"
                  >
                    <motion.div
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                      className="rounded-lg"
                    >
                      <AccordionTrigger className="text-left text-lg font-medium py-6 px-4 text-white hover:text-primary transition-colors rounded-t-lg">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 py-6 px-4 text-base bg-white/[0.02] rounded-b-lg">
                        {item.answer}
                      </AccordionContent>
                    </motion.div>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-3">Still have questions?</h3>
            <p className="text-white/70 mb-5">
              Our support team is ready to help you get started with ScrapeSmart
            </p>
            <motion.a 
              href="#contact" 
              className="inline-flex items-center px-6 py-3 bg-primary/80 hover:bg-primary rounded-full text-white font-medium transition-all"
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(var(--primary-rgb), 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Support
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}