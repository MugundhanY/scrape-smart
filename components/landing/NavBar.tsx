"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Menu, 
  X,
  Search,
  LayoutGrid,
  BarChart,
  Bot,
  Shield,
  BookOpen,
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo"; // Import the Logo component

type SubMenuItem = {
  name: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
};

type NavItem = {
  name: string;
  href: string;
  submenu?: SubMenuItem[];
}

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  
  // Handle scroll for navbar transparency and hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled for background
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveItem(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigation items
  const navItems: NavItem[] = [
    {
      name: "Features",
      href: "#features",
      submenu: [
        { 
          name: "Data Extraction", 
          href: "#features",
          description: "Advanced scraping capabilities",
          icon: <BarChart className="w-4 h-4" />
        },
        { 
          name: "Visual Editor", 
          href: "#visual-editor",
          description: "Intuitive drag-and-drop interface",
          icon: <LayoutGrid className="w-4 h-4" />
        },
      ]
    },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];
  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="flex items-center justify-between h-12 md:h-[60px]">
          {/* Logo with hover animation */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <Logo href="/" fontSize="text-base" iconSize={24} />
            
            {/* Subtle glow behind logo on hover */}
            <motion.div 
              className="absolute -inset-2 bg-primary/10 rounded-full blur-md z-[-1]"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </motion.div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center" ref={navRef}>
            <ul className="flex gap-8">
              {navItems.map((item, i) => (                <li key={i} className="relative">
                  {item.submenu ? (
                    <div 
                      className="py-2 cursor-pointer"
                      onClick={() => setActiveItem(activeItem === item.name ? null : item.name)}
                    >
                      <div 
                        className={cn(
                          "text-white/80 hover:text-white transition-colors text-[13px] font-medium flex items-center gap-1",
                          activeItem === item.name && "text-white"
                        )}
                      >
                        {item.name}
                        <ChevronDown 
                          className={cn(
                            "h-3.5 w-3.5 text-white/50 transition-transform duration-200",
                            activeItem === item.name && "rotate-180 text-white"
                          )} 
                        />
                      </div>
                      
                      {/* Bottom indicator line */}
                      <motion.div 
                        className="h-[2px] bg-primary rounded-full w-full mt-0.5"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ 
                          scaleX: activeItem === item.name ? 1 : 0,
                          opacity: activeItem === item.name ? 1 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <Link href={item.href}>
                      <div className="py-2 cursor-pointer">
                        <div 
                          className="text-white/80 hover:text-white transition-colors text-[13px] font-medium flex items-center gap-1"
                        >
                          {item.name}
                        </div>
                        
                        {/* Hover indicator line */}
                        <motion.div 
                          className="h-[2px] bg-primary rounded-full w-full mt-0.5"
                          initial={{ scaleX: 0, opacity: 0 }}
                          whileHover={{ scaleX: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </Link>
                  )}
                  
                  {/* Enhanced submenu with animations and descriptions */}
                  {item.submenu && (
                    <AnimatePresence>
                      {activeItem === item.name && (
                        <motion.div 
                          className="absolute top-full left-0 pt-1"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="bg-black/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-white/10 w-60 py-2">
                            {item.submenu.map((subitem, j) => (
                              <Link 
                                key={j}
                                href={subitem.href}
                                onClick={() => setActiveItem(null)}
                              >
                                <div className="px-4 py-2.5 hover:bg-white/5 transition-colors group">
                                  <div className="flex items-center gap-2">
                                    {subitem.icon && (
                                      <div className="p-1 bg-primary/10 rounded-md text-primary group-hover:bg-primary/20 transition-colors">
                                        {subitem.icon}
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-white text-[13px] font-medium">{subitem.name}</div>
                                      {subitem.description && (
                                        <p className="text-white/50 text-xs mt-0.5 group-hover:text-white/70">
                                          {subitem.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>
          </nav>          {/* Right actions with enhanced styling */}
          <div className="flex items-center gap-3">
            {/* Github button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <Link 
                href="https://github.com/MugundhanY/scrape-smart" 
                target="_blank"
                className="flex items-center text-white/70 hover:text-white gap-1.5 text-[12px] font-medium"
              >
                <Github className="h-4 w-4" />
                <span className="hidden lg:inline">Star us</span>
              </Link>
            </motion.div>

            {/* Search button with animation */}
            <motion.button 
              className="text-white/70 hover:text-white p-1.5 rounded-full transition-colors hidden md:flex bg-white/5 hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="h-3.5 w-3.5" />
            </motion.button>
            
            {/* Docs button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <Link href="/docs">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-[13px] font-medium text-white/70 hover:text-white transition-colors py-1 px-3 h-auto flex items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-full"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Docs</span>
                </Button>
              </Link>
            </motion.div>
            
            <div className="hidden md:block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/signin">
                  <Button 
                    variant="ghost" 
                    className="text-[13px] font-medium text-white/80 hover:text-white transition-colors py-1.5 px-4 h-auto rounded-full"
                  >
                    Sign in
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/signup">
                <Button 
                  className="bg-gradient-to-r from-primary to-blue-400 hover:brightness-110 text-white text-[13px] rounded-full py-1.5 px-4 h-auto font-medium flex items-center gap-1.5 shadow-lg shadow-primary/20"
                  size="sm"
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
            
            {/* Mobile menu button with animations */}
            <motion.button 
              className="md:hidden text-white p-2 bg-white/5 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>      {/* Enhanced mobile menu with animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-xl z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="h-full flex flex-col"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="py-16 px-6 flex-1 overflow-y-auto">
                <ul className="space-y-6">
                  {navItems.map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="py-2 border-b border-white/10 pb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                    >
                      <Link 
                        href={item.href}
                        className="text-white hover:text-primary transition-colors text-xl font-medium flex justify-between items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                        {item.submenu && <ChevronDown className="h-4 w-4 text-white/50" />}
                      </Link>
                      
                      {item.submenu && (
                        <div className="mt-4 space-y-3 pl-3 border-l border-white/10">
                          {item.submenu.map((subitem, j) => (
                            <motion.div 
                              key={j}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + (i * 0.1) + (j * 0.05) }}
                            >
                              <Link 
                                href={subitem.href}
                                className="flex items-start gap-3 group"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subitem.icon && (
                                  <div className="mt-0.5 p-1.5 bg-primary/10 rounded-md text-primary flex-shrink-0">
                                    {subitem.icon}
                                  </div>
                                )}
                                <div>
                                  <div className="text-white/90 group-hover:text-white text-base font-medium transition-colors">
                                    {subitem.name}
                                  </div>
                                  {subitem.description && (
                                    <p className="text-white/40 group-hover:text-white/60 text-sm mt-1">
                                      {subitem.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.li>
                  ))}
                </ul>
                
                <motion.div 
                  className="mt-8 flex flex-col gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-4">
                    <Link href="https://github.com" className="text-white/70 hover:text-white" target="_blank">
                      <Github className="h-5 w-5" />
                    </Link>
                    <Link href="/docs" className="text-white/70 hover:text-white flex items-center gap-1.5">
                      <BookOpen className="h-5 w-5" />
                      <span>Docs</span>
                    </Link>
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    <Link 
                      href="/signin"
                      className="w-full px-4 py-2.5 border border-white/20 rounded-lg text-center text-white font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    
                    <Link 
                      href="/signup"
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-primary to-blue-400 rounded-lg text-center text-white font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}