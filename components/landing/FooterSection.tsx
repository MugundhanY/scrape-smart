"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  ArrowUp, 
  Twitter, 
  Linkedin, 
  Github, 
  Youtube, 
  Mail, 
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FooterSection() {
  const [emailValue, setEmailValue] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Handle back to top button
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValue.trim()) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmailValue("");
    }
  };
  
  // Define social media icons
  const socialIcons = {
    twitter: <Twitter size={18} />,
    linkedin: <Linkedin size={18} />,
    github: <Github size={18} />,
    youtube: <Youtube size={18} />
  };

  return (
    <footer className="py-16 bg-gradient-to-b from-slate-950 to-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl"></div>
      
      {/* Back to top button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute right-6 bottom-8 h-12 w-12 rounded-full bg-gradient-to-br from-primary/80 to-blue-500/80 flex items-center justify-center text-white shadow-lg shadow-primary/20 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ArrowUp size={20} />
      </motion.button>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Logo and company info section */}
          <div className="md:col-span-3">
            <motion.div 
              className="flex items-center gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Logo href="/" iconSize={24} />
            </motion.div>
            
            <motion.p 
              className="text-white/60 text-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              The ultimate platform for intelligent web data extraction and workflow automation.
            </motion.p>
            
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {Object.entries(socialIcons).map(([social, icon]) => (
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  key={social}
                >
                  <Link 
                    href={`https://${social}.com`} 
                    className="h-10 w-10 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-primary/30 hover:to-blue-500/30 flex items-center justify-center transition-all"
                    aria-label={`Follow us on ${social}`}
                  >
                    {icon}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
            {/* Footer links sections */}
          <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Product",
                links: ["Features", "Workflow Editor", "AI Extraction", "Automation", "Integrations", "API"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Guides", "API Reference", "Community", "Examples", "Blog"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Contact", "Press", "Terms of Service", "Privacy Policy"]
              }
            ].map((column, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              >
                <h4 className="text-white font-medium mb-5 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link, i) => (
                    <motion.li 
                      key={link}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) + (i * 0.05) }}
                    >
                      <Link 
                        href="#" 
                        className="text-white/60 hover:text-primary transition-colors text-sm flex items-center group"
                      >
                        <ChevronRight size={14} className="mr-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                        {link}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>          {/* Newsletter section */}
          <motion.div 
            className="md:col-span-3 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-2xl"></div>
              
              <h4 className="text-white font-medium mb-3">Stay updated</h4>
              <p className="text-white/60 text-sm mb-4">
                Subscribe to our newsletter for the latest features, tips, and industry news.
              </p>
              
              <form onSubmit={handleSubscribe} className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pr-12"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-1 top-1 h-8 w-8 bg-primary hover:bg-primary/90 rounded-md"
                >
                  {isSubscribed ? <Zap size={16} /> : <ChevronRight size={16} />}
                </Button>
              </form>
              
              {isSubscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-primary text-xs mt-2"
                >
                  Thanks for subscribing!
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Footer bottom section with copyright and links */}
        <motion.div 
          className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} ScrapeSmart. All rights reserved.
            </p>
            <span className="hidden md:inline text-white/20">•</span>
            <p className="text-white/40 text-sm">
              Made with <span className="text-primary">♥</span> globally
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="#" className="text-white/40 hover:text-primary transition-all text-sm hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-white/40 hover:text-primary transition-all text-sm hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-white/40 hover:text-primary transition-all text-sm hover:underline underline-offset-4">
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}