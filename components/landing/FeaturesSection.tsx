"use client";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight, MousePointer, Code, FileJson, BrainCircuit, CheckIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
// Import the AI model icons
import OpenAI from '@lobehub/icons/es/OpenAI/components/Mono';
import Claude from '@lobehub/icons/es/Claude/components/Color';
import Gemini from '@lobehub/icons/es/Gemini/components/Color';

// Define proper TypeScript interfaces
interface FeatureCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  inView: boolean;
  index?: number;
  className?: string;
  size?: "small" | "medium" | "large" | "extraLarge";
  textColor?: "dark" | "light";
  showArrow?: boolean;
  children?: React.ReactNode;
}

interface AIModelIllustrationProps {
  model: "claude" | "gemini" | "chatgpt";
  color: "blue" | "purple" | "green" | "orange";
}

// Feature Card component styled like Apple's bento grid items
const FeatureCard = ({
  title,
  description,
  imageUrl,
  inView,
  index = 0,
  className = "",
  size = "medium",
  textColor = "dark",
  showArrow = true,
  children,
}: FeatureCardProps) => {
  const sizesMap = {
    small: "h-[280px] md:h-[320px]",
    medium: "h-[320px] md:h-[380px]",
    large: "h-[400px] md:h-[480px]",
    extraLarge: "h-[480px] md:h-[540px]",
  };

  const textColorMap = {
    dark: "text-black dark:text-white",
    light: "text-white",
  };

  const descColorMap = {
    dark: "text-[#86868b] dark:text-[#a1a1a6]",
    light: "text-[#f5f5f7]/80",
  };
  
  // Track touch interactions for mobile devices
  const [isTouched, setIsTouched] = useState(false);
  
  // Reset touch state after delay
  useEffect(() => {
    if (isTouched) {
      const timer = setTimeout(() => {
        setIsTouched(false);
      }, 3000); // Reset after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isTouched]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      className={cn(
        "group relative overflow-hidden rounded-3xl", 
        sizesMap[size], 
        isTouched ? "ring-2 ring-primary ring-offset-1 ring-offset-black" : "",
        className
      )}
      onTouchStart={() => setIsTouched(true)}
    >
      {/* Background image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className={cn(
            "object-cover object-center transition-transform duration-700 will-change-transform",
            (isTouched || "group-hover:scale-[1.02]")
          )}
          quality={90}
          priority={index < 2}
        />
      )}

      {/* Custom content */}
      {children || (
        /* Default content overlay */
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
          <h3 className={cn(
            "font-semibold tracking-tight text-3xl md:text-4xl mb-3",
            textColorMap[textColor]
          )}>
            {title}
          </h3>
          
          <p className={cn(
            "text-base md:text-lg leading-relaxed",
            descColorMap[textColor]
          )}>
            {description}
          </p>
          
          {showArrow && (
            <div className={cn(
              "mt-5 flex items-center font-medium",
              textColor === "dark" ? "text-[#0066cc] dark:text-[#2997ff]" : "text-white"
            )}>
              Learn more
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Simple feature navigation component (non-sticky)
const FeatureNavigation = () => {
  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="flex justify-center gap-4 md:gap-8 flex-wrap mb-12">
      <a 
        onClick={() => scrollToSection("data-collection")} 
        className="group cursor-pointer"
      >
        <div className="py-2 px-4 md:py-3 md:px-6 rounded-full bg-gradient-to-r from-white/5 to-white/10 border border-white/10 flex items-center gap-2 transition-all hover:from-white/10 hover:to-white/15">
          <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
          <span className="text-sm md:text-base font-medium text-white/80 group-hover:text-white">Data Collection</span>
        </div>
      </a>
      <a 
        onClick={() => scrollToSection("data-processing")} 
        className="group cursor-pointer"
      >
        <div className="py-2 px-4 md:py-3 md:px-6 rounded-full bg-gradient-to-r from-white/5 to-white/10 border border-white/10 flex items-center gap-2 transition-all hover:from-white/10 hover:to-white/15">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-400"></span>
          <span className="text-sm md:text-base font-medium text-white/80 group-hover:text-white">Data Processing</span>
        </div>
      </a>
      <a 
        onClick={() => scrollToSection("data-export")} 
        className="group cursor-pointer"
      >
        <div className="py-2 px-4 md:py-3 md:px-6 rounded-full bg-gradient-to-r from-white/5 to-white/10 border border-white/10 flex items-center gap-2 transition-all hover:from-white/10 hover:to-white/15">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400"></span>
          <span className="text-sm md:text-base font-medium text-white/80 group-hover:text-white">Data Export</span>
        </div>
      </a>
    </div>
  );
};

// Feature Comparison Table component
const FeatureComparisonTable = ({ isVisible }: { isVisible: boolean }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'collection' | 'processing' | 'export'>('all');
  const [expanded, setExpanded] = useState<boolean>(false);
  
  // Define feature comparison data
  const featureComparison = {
    collection: [
      { name: "Visual Workflow Builder", starter: true, professional: true, enterprise: true },
      { name: "Browser Automation", starter: true, professional: true, enterprise: true },
      { name: "Form Filling & Navigation", starter: true, professional: true, enterprise: true },
      { name: "Javascript Rendering", starter: true, professional: true, enterprise: true },
      { name: "Captcha Handling", starter: false, professional: true, enterprise: true },
      { name: "IP Rotation", starter: false, professional: true, enterprise: true },
      { name: "Global Proxy Network", starter: false, professional: true, enterprise: true }
    ],
    processing: [
      { name: "Basic Data Extraction", starter: true, professional: true, enterprise: true },
      { name: "AI-Powered Extraction", starter: true, professional: true, enterprise: true },
      { name: "Advanced AI Models", starter: false, professional: true, enterprise: true },
      { name: "Custom Extraction Rules", starter: false, professional: true, enterprise: true },
      { name: "Data Cleaning Tools", starter: false, professional: true, enterprise: true },
      { name: "Data Validation", starter: false, professional: true, enterprise: true }
    ],
    export: [
      { name: "JSON Export", starter: true, professional: true, enterprise: true },
      { name: "CSV Export", starter: true, professional: true, enterprise: true },
      { name: "Excel Export", starter: false, professional: true, enterprise: true },
      { name: "Database Integration", starter: false, professional: true, enterprise: true },
      { name: "API Access", starter: false, professional: false, enterprise: true },
      { name: "Custom Webhooks", starter: false, professional: true, enterprise: true }
    ]
  };
  
  // Get active features based on selected tab
  const getActiveFeatures = () => {
    if (activeTab === 'all') {
      return [
        ...featureComparison.collection,
        ...featureComparison.processing,
        ...featureComparison.export,
      ];
    }
    return featureComparison[activeTab];
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        height: isVisible ? 'auto' : 0,
      }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-hidden"
    >      
      <div className="rounded-2xl border border-white/10 backdrop-blur-md bg-black/30 p-6">
        <div className="flex justify-between mb-6">
          <div className="inline-flex p-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <button 
              className={`px-4 py-2 rounded-full text-sm ${activeTab === 'all' ? 'bg-white text-black' : 'text-white/80'}`}
              onClick={() => setActiveTab('all')}
            >
              All Features
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm ${activeTab === 'collection' ? 'bg-white text-black' : 'text-white/80'}`}
              onClick={() => setActiveTab('collection')}
            >
              Collection
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm ${activeTab === 'processing' ? 'bg-white text-black' : 'text-white/80'}`}
              onClick={() => setActiveTab('processing')}
            >
              Processing
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm ${activeTab === 'export' ? 'bg-white text-black' : 'text-white/80'}`}
              onClick={() => setActiveTab('export')}
            >
              Export
            </button>
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
          >
            {expanded ? (
              <>
                <span>Show Less</span>
                <ChevronUpIcon className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span>Show All</span>
                <ChevronDownIcon className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr>
                <th className="py-4 px-4 text-sm text-white/70 font-medium">Features</th>
                <th className="py-4 px-4 text-sm text-white/70 font-medium text-center">Starter</th>
                <th className="py-4 px-4 text-sm text-white/70 font-medium text-center">Professional</th>
                <th className="py-4 px-4 text-sm text-white/70 font-medium text-center">Enterprise</th>
              </tr>
            </thead>            
            <tbody>
              {getActiveFeatures()
                .slice(0, expanded ? getActiveFeatures().length : Math.min(6, getActiveFeatures().length))
                .map((feature, i) => (
                  <motion.tr 
                    key={i} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <td className="py-3 px-4 text-sm text-white">{feature.name}</td>
                    <td className="py-3 px-4 text-center">
                      {feature.starter ? 
                        <CheckIcon className="h-5 w-5 mx-auto text-primary" /> : 
                        <div className="h-5 w-5 mx-auto"></div>
                      }
                    </td>
                    <td className="py-3 px-4 text-center">
                      {feature.professional ? 
                        <CheckIcon className="h-5 w-5 mx-auto text-primary" /> : 
                        <div className="h-5 w-5 mx-auto"></div>
                      }
                    </td>
                    <td className="py-3 px-4 text-center">
                      {feature.enterprise ? 
                        <CheckIcon className="h-5 w-5 mx-auto text-primary" /> : 
                        <div className="h-5 w-5 mx-auto"></div>
                      }
                    </td>
                  </motion.tr>
                ))}
              {!expanded && getActiveFeatures().length > 6 && (
                <tr className="border-b border-white/5">
                  <td colSpan={4} className="py-3 px-4 text-center">
                    <button 
                      onClick={() => setExpanded(true)}
                      className="text-primary text-sm hover:underline flex items-center justify-center mx-auto"
                    >
                      Show {getActiveFeatures().length - 6} more features...
                      <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-center">
          <a href="#pricing" className="text-primary inline-flex items-center hover:underline">
            See pricing details
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// Clean, premium AI workflow illustration featuring major AI tools
const AnimatedAIWorkflow = () => {
  return (
    <div className="w-full h-full flex items-center justify-center py-8">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1000 600" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-full mx-auto scale-125" 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1C1C21" />
            <stop offset="100%" stopColor="#15151B" />
          </linearGradient>
          
          <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066CC" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#004999" stopOpacity="0" />
          </linearGradient>
          
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feOffset dx="0" dy="4" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.18" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor="#0066CC" floodOpacity="0.6" />
            <feComposite in2="blur" operator="in" />
            <feComposite in="SourceGraphic" />
          </filter>
          
          <linearGradient id="flowPath" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0066CC" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0066CC" stopOpacity="1" />
            <stop offset="100%" stopColor="#0066CC" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Clean background with subtle gradient */}
        <rect width="1000" height="600" fill="#111115" opacity="0.3" rx="16" />
        
        {/* Source Section */}
        <motion.g 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Webpage Source */}
          <rect x="100" y="150" width="220" height="80" rx="12" fill="url(#cardGradient)" filter="url(#dropShadow)" />
          <text x="210" y="180" textAnchor="middle" fill="white" fontFamily="Inter, system-ui, sans-serif" fontSize="16" fontWeight="500">Web Sources</text>
          <g transform="translate(160, 205)">
            <svg width="100" height="26" viewBox="0 0 100 26">
              <rect width="40" height="4" rx="2" fill="#0066CC" />
              <rect y="8" width="100" height="3" rx="1.5" fill="#444" />
              <rect y="15" width="80" height="3" rx="1.5" fill="#444" />
              <rect y="22" width="60" height="3" rx="1.5" fill="#444" />
            </svg>
          </g>
          
          {/* API Source */}
          <rect x="100" y="260" width="220" height="80" rx="12" fill="url(#cardGradient)" filter="url(#dropShadow)" />
          <text x="210" y="290" textAnchor="middle" fill="white" fontFamily="Inter, system-ui, sans-serif" fontSize="16" fontWeight="500">API Endpoints</text>
          <g transform="translate(160, 315)">
            <svg width="100" height="26" viewBox="0 0 100 26">
              <path d="M0 0L100 0M0 10L60 10M0 20L80 20" stroke="#0066CC" strokeWidth="3" strokeLinecap="round" />
              <circle cx="75" cy="10" r="4" fill="#0066CC" />
              <circle cx="90" cy="20" r="4" fill="#0066CC" />
            </svg>
          </g>
          
          {/* Data Source */}
          <rect x="100" y="370" width="220" height="80" rx="12" fill="url(#cardGradient)" filter="url(#dropShadow)" />
          <text x="210" y="400" textAnchor="middle" fill="white" fontFamily="Inter, system-ui, sans-serif" fontSize="16" fontWeight="500">Document Sources</text>
          <g transform="translate(160, 425)">
            <svg width="100" height="26" viewBox="0 0 100 26">
              <rect width="80" height="26" rx="3" stroke="#444" fill="none" />
              <rect x="5" y="5" width="70" height="2" rx="1" fill="#444" />
              <rect x="5" y="11" width="70" height="2" rx="1" fill="#444" />
              <rect x="5" y="17" width="40" height="2" rx="1" fill="#444" />
            </svg>
          </g>
        </motion.g>
        
        {/* Flow connections - clean and minimal */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Connections from sources to AI hub */}
          <motion.path
            d="M320 190 C380 190, 420 210, 450 300"
            stroke="url(#flowPath)"
            strokeWidth="2.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          />
          
          <motion.path
            d="M320 300 C380 300, 420 300, 450 300"
            stroke="url(#flowPath)"
            strokeWidth="2.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
          />
          
          <motion.path
            d="M320 410 C380 410, 420 390, 450 300"
            stroke="url(#flowPath)"
            strokeWidth="2.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.9 }}
          />
          
          {/* Connection from AI hub to output */}
          <motion.path
            d="M550 300 C600 300, 650 300, 700 300"
            stroke="url(#flowPath)"
            strokeWidth="2.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 1.1 }}
          />
        </motion.g>
        
        {/* Animated data particles */}
        <motion.g>
          <motion.circle
            cx="0" cy="0" r="5" fill="#0066CC" filter="url(#glow)"
            initial={{ opacity: 0, x: 320, y: 190 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              x: [320, 380, 420, 450], 
              y: [190, 240, 270, 300]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatDelay: 1,
              ease: "easeInOut" 
            }}
          />
          
          <motion.circle
            cx="0" cy="0" r="5" fill="#0066CC" filter="url(#glow)"
            initial={{ opacity: 0, x: 320, y: 300 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              x: [320, 380, 420, 450], 
              y: [300, 300, 300, 300]
            }}
            transition={{ 
              duration: 3, 
              delay: 1.5,
              repeat: Infinity, 
              repeatDelay: 1,
              ease: "easeInOut" 
            }}
          />
          
          <motion.circle
            cx="0" cy="0" r="5" fill="#0066CC" filter="url(#glow)"
            initial={{ opacity: 0, x: 320, y: 410 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              x: [320, 380, 420, 450], 
              y: [410, 370, 330, 300]
            }}
            transition={{ 
              duration: 3, 
              delay: 3,
              repeat: Infinity, 
              repeatDelay: 1,
              ease: "easeInOut" 
            }}
          />
          
          <motion.circle
            cx="0" cy="0" r="5" fill="#0066CC" filter="url(#glow)"
            initial={{ opacity: 0, x: 550, y: 300 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              x: [550, 600, 650, 700], 
              y: [300, 300, 300, 300]
            }}
            transition={{ 
              duration: 3, 
              delay: 4.5,
              repeat: Infinity, 
              repeatDelay: 1,
              ease: "easeInOut" 
            }}
          />
        </motion.g>
        
        {/* AI Hub - Center element with clean design */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Main Hub Circle */}
          <circle cx="500" cy="300" r="120" fill="url(#blueGlow)" />
          <circle cx="500" cy="300" r="100" fill="url(#cardGradient)" stroke="#0066CC" strokeWidth="2" filter="url(#dropShadow)" />
          
          {/* Hub Name */}
          <text x="500" y="300" textAnchor="middle" fill="white" fontFamily="Inter, system-ui, sans-serif" fontSize="20" fontWeight="600">AI Processing Hub</text>
          
          {/* ChatGPT icon */}
          <motion.g 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            filter="url(#dropShadow)"
          >
            <circle cx="500" cy="230" r="34" fill="#222" stroke="#10A37F" strokeWidth="2" />
            <image href="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" x="470" y="200" width="60" height="60" />
            <text x="500" y="280" textAnchor="middle" fill="white" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="700">ChatGPT</text>
          </motion.g>
          
          {/* Gemini icon */}
          <motion.g 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            filter="url(#dropShadow)"
          >
            <circle cx="440" cy="300" r="34" fill="#222" stroke="#8E45CA" strokeWidth="2" />
            <svg x="410" y="270" width="60" height="60" viewBox="0 0 24 24" fill="#8E45CA">
              <path d="M8.0734 0.591553L5.94199 4.47357C5.29436 5.67295 5.76506 7.16946 6.96444 7.81708L18.4124 14.0846C19.6118 14.7322 21.1083 14.2615 21.756 13.0621L23.8874 9.18005C24.535 7.98067 24.0643 6.48416 22.8649 5.83653L11.4169 -0.434123C10.2175 -1.08175 8.72101 -0.611046 8.0734 0.591553ZM1.88579 5.67295L-0.248835 9.55497C-0.899142 10.7543 -0.428444 12.2509 0.770939 12.8985L12.2189 19.166C13.4183 19.8136 14.9148 19.3429 15.5624 18.1435L17.6944 14.2615C18.3392 13.0621 17.8713 11.5656 16.6721 10.915L5.22422 4.64728C4.02169 4.00282 2.5251 4.4764 1.88579 5.67295ZM6.96444 14.9716L0.176089 19.166C-1.02329 19.8136 -1.49399 21.3101 -0.846354 22.5095L1.28231 23.9028C2.48169 24.5505 3.9782 24.0797 4.6258 22.8803L11.4169 18.6859C12.6163 18.0383 13.087 16.5418 12.4394 15.3424L10.219 13.9463C9.01958 13.2987 7.52306 13.7694 6.87544 14.9688L6.96444 14.9716Z" />
            </svg>
            <text x="440" y="350" textAnchor="middle" fill="white" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="700">Gemini</text>
          </motion.g>
          
          {/* Claude icon */}
          <motion.g 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            filter="url(#dropShadow)"
          >
            <circle cx="560" cy="300" r="34" fill="#222" stroke="#6A45BE" strokeWidth="2" />
            <svg x="530" y="270" width="60" height="60" viewBox="0 0 24 24" fill="#6A45BE">
              <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm-1.354 4.705a1.745 1.745 0 012.708 0l.002-.003 5.51 6.317a1.745 1.745 0 010 2.315l-5.51 6.317-.003-.002a1.745 1.745 0 01-2.707 0l-.003.002-5.51-6.317a1.745 1.745 0 010-2.315l5.51-6.317.003.003zm1.354.608a.855.855 0 00-.644.292l-5.51 6.318a.856.856 0 000 1.134l5.51 6.317a.86.86 0 001.288 0l5.51-6.317a.856.856 0 000-1.134l-5.51-6.317a.86.86 0 00-.644-.293z" />
            </svg>
            <text x="560" y="350" textAnchor="middle" fill="white" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="700">Claude</text>
          </motion.g>
          
          {/* Pulse animations around the AI hub */}
          <motion.circle
            cx="500" 
            cy="300" 
            r="120"
            fill="none"
            stroke="#0066CC"
            strokeOpacity="0.4"
            strokeWidth="1"
            initial={{ scale: 0.8, opacity: 0.4 }}
            animate={{ scale: 1.05, opacity: 0 }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          
          <motion.circle
            cx="500" 
            cy="300" 
            r="110"
            fill="none"
            stroke="#0066CC"
            strokeOpacity="0.3"
            strokeWidth="0.8"
            initial={{ scale: 0.85, opacity: 0.3 }}
            animate={{ scale: 1.1, opacity: 0 }}
            transition={{ 
              duration: 4, 
              delay: 1,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.g>
        
        {/* Output Section - Clean JSON result */}
        <motion.g
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <rect x="700" y="200" width="200" height="200" rx="12" fill="url(#cardGradient)" filter="url(#dropShadow)" />
          <text x="800" y="230" textAnchor="middle" fill="white" fontFamily="Inter, system-ui, sans-serif" fontSize="16" fontWeight="500">Structured Data Output</text>
          
          {/* Clean JSON Display using SVG text elements */}
          <rect x="720" y="250" width="160" height="130" rx="8" fill="rgba(0,0,0,0.2)" />
          
          <text x="730" y="270" fill="#64D2FF" fontFamily="SF Mono, monospace" fontSize="13">&#123;</text>
          <text x="740" y="290" fill="#FF9500" fontFamily="SF Mono, monospace" fontSize="13">&quot;products&quot;: [</text>
          <text x="750" y="310" fill="#CCCCCC" fontFamily="SF Mono, monospace" fontSize="13">&#123;</text>
          <text x="760" y="330" fill="#4CAF50" fontFamily="SF Mono, monospace" fontSize="13">&quot;title&quot;:</text>
          <text x="805" y="330" fill="#64D2FF" fontFamily="SF Mono, monospace" fontSize="13">&quot;Product 1&quot;,</text>
          <text x="760" y="350" fill="#4CAF50" fontFamily="SF Mono, monospace" fontSize="13">&quot;price&quot;:</text>
          <text x="805" y="350" fill="#FF9500" fontFamily="SF Mono, monospace" fontSize="13">129.99</text>
          <text x="750" y="370" fill="#CCCCCC" fontFamily="SF Mono, monospace" fontSize="13">&#125;, ...</text>
          <text x="740" y="390" fill="#FF9500" fontFamily="SF Mono, monospace" fontSize="13">]</text>
          <text x="730" y="410" fill="#64D2FF" fontFamily="SF Mono, monospace" fontSize="13">&#125;</text>
          
          {/* Animated cursor */}
          <motion.rect 
            x="800" 
            y="380" 
            width="3" 
            height="12" 
            fill="white" 
            animate={{ opacity: [1, 0, 1] }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              repeatDelay: 0.3 
            }}
          />
        </motion.g>
      </svg>
    </div>
  );
};

// This component has been removed as requested

export default function FeaturesSection() {
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, amount: 0.1 });

  return (
    <section
      id="features"
      ref={featuresRef}
      className="pt-20 md:pt-32 pb-24 md:pb-40 bg-white dark:bg-black"
    >      {/* Header - Consistent across sections */}
      <div className="container mx-auto px-6 mb-16 md:mb-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="block text-primary font-medium mb-4 uppercase tracking-wide"
        >
          FEATURES
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black dark:text-white mb-6"
        >
          Powerful tools for web data extraction
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-[#86868b] dark:text-[#a1a1a6] max-w-3xl mx-auto"
        >
          Everything you need to extract web data with precision and efficiency
        </motion.p>
      </div>
  
        {/* Apple-style bento grid with balanced feature presentation */}
      <div className="container mx-auto px-4">
        {/* Data Collection Category - Section Header */}
        <motion.div 
          id="data-collection"
          className="mb-8 flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-4">
            <MousePointer className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-white">Data Collection</h3>
          <div className="ml-4 h-[1px] flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
        </motion.div>
        
        <div className="grid grid-cols-12 gap-4">
          {/* Visual Workflow Builder - Promoted to hero feature with enhanced hover effect */}
          <div className="col-span-12 mb-8 group">            <div className="relative overflow-hidden rounded-3xl">
              <FeatureCard
                title="Visual Workflow Builder"
                description="Design and automate your data extraction workflows with our intuitive drag-and-drop interface. No coding required."
                imageUrl="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1600&auto=format&fit=crop"
                inView={isInView}
                index={0}
                size="large"
                textColor="light"
              >
                <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10">
                  <div className="relative z-10">
                    <h3 className="font-semibold tracking-tight text-3xl md:text-5xl mb-3 text-white group-hover:text-white transition-all">
                      Visual Workflow Builder
                    </h3>
                    <p className="text-base md:text-xl leading-relaxed text-white/80 max-w-2xl mb-4 transition-all">
                      Design and automate your data extraction workflows with our intuitive drag-and-drop interface. No coding required.
                    </p>
                    {/* Testimonial quote */}
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl max-w-lg border border-white/20 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <p className="text-white/90 text-sm italic">
                        &quot;We&apos;ve tried many scraping tools, but the visual workflow builder makes it accessible to our entire team, not just developers.&quot;
                      </p>
                      <p className="text-white/70 text-xs mt-2">— Emily R., Marketing Director</p>
                    </div>
                  </div>
                </div>
              </FeatureCard>
            </div>
          </div>
          
          {/* First row with AI-powered extraction and Browser Automation */}
          <div className="col-span-12 md:col-span-5 mb-4 group relative">
            <FeatureCard
              title="AI-Powered Extraction"
              description="Extract structured data using ChatGPT, Gemini, or Claude AI models with precision and efficiency."
              inView={isInView}
              index={1}
              className="bg-gradient-to-br from-[#f5f5f7] to-[#edf0f1] dark:from-[#1d1d1f] dark:to-[#131314] transition-all duration-300 group-hover:shadow-lg dark:group-hover:shadow-primary/20"
              textColor="dark"
            >
              <div className="absolute inset-0 flex flex-col p-8 md:p-10">
                <div className="mb-2">
                  <h3 className="font-semibold tracking-tight text-2xl md:text-3xl text-black dark:text-white">
                    AI-Powered Extraction
                  </h3>
                  
                  <p className="text-base md:text-lg text-[#86868b] dark:text-[#a1a1a6] leading-relaxed mt-2">
                    Extract structured data with leading AI models
                  </p>
                </div>
                  {/* AI illustration with @lobehub/icons */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex space-x-6 items-center">
                    <div className="flex flex-col items-center">                      <div className="h-16 w-16 flex items-center justify-center">
                        <OpenAI size={48} />
                      </div>
                      <span className="text-xs mt-2 text-[#86868b] dark:text-[#a1a1a6]">ChatGPT</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 flex items-center justify-center">
                        <Gemini size={48} />
                      </div>
                      <span className="text-xs mt-2 text-[#86868b] dark:text-[#a1a1a6]">Gemini</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 flex items-center justify-center">
                        <Claude size={48} />
                      </div>
                      <span className="text-xs mt-2 text-[#86868b] dark:text-[#a1a1a6]">Claude</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-[#0066cc] dark:text-[#2997ff] flex items-center font-medium">
                  Learn more
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </div>
              </div>
            </FeatureCard>          </div>
          
          {/* Browser Automation Card */}
          <div className="col-span-12 md:col-span-7 mb-8 group">
            <FeatureCard
              title="Browser Automation"
              description="Simulate real user behavior with headless browser automation for complex web interactions."
              imageUrl="https://images.unsplash.com/photo-1607798748738-b15c40d33d57?q=80&w=1600&auto=format&fit=crop"
              inView={isInView}
              index={2}
              textColor="light"
            >
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between">
                <div className="relative z-10">
                  <h3 className="font-semibold tracking-tight text-3xl md:text-4xl mb-3 text-white">
                    Browser Automation
                  </h3>
                  <p className="text-white/80 text-lg max-w-md">
                    Simulate real user behavior with our browser automation engine. Navigate complex websites, handle logins, and interact with dynamic content.
                  </p>
                  
                  {/* Interactive Feature List */}
                  <ul className="mt-8 space-y-3 text-sm md:text-base max-w-lg">
                    <motion.li 
                      className="flex items-center gap-3 text-white/80 bg-black/30 rounded-lg p-3 backdrop-blur-sm border border-white/10"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <MousePointer className="h-4 w-4 text-primary" />
                      </span>
                      <span>Click, type and navigate through multi-step workflows</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-3 text-white/80 bg-black/30 rounded-lg p-3 backdrop-blur-sm border border-white/10"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Code className="h-4 w-4 text-primary" />
                      </span>
                      <span>Handle JavaScript-heavy sites with accurate rendering</span>
                    </motion.li>
                  </ul>
                </div>
              </div>
            </FeatureCard>
          </div>
        </div>
        
        {/* Data Processing Category - Section Header with slight spacing */}
        <motion.div 
          id="data-processing"
          className="mb-8 mt-16 flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center mr-4">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-white">Data Processing</h3>
          <div className="ml-4 h-[1px] flex-1 bg-gradient-to-r from-blue-400/50 to-transparent"></div>
        </motion.div>
        
        <div className="grid grid-cols-12 gap-4">
          {/* AI Row */}
          <div className="col-span-12 md:col-span-7 mb-4 group">
            <FeatureCard
              title="AI-Powered Processing"
              description="Transform raw web data into structured insights with our AI processing pipeline."
              imageUrl="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop"
              inView={isInView}
              index={3}
              textColor="light"
            >
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between">
                <div className="relative z-10">
                  <h3 className="font-semibold tracking-tight text-3xl md:text-4xl mb-3 text-white">
                    AI-Powered Processing
                  </h3>
                  <p className="text-white/80 text-lg max-w-md">
                    Transform raw web data into structured insights using advanced AI processing
                  </p>
                  
                  {/* Real-world Example */}
                  <div className="mt-6 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 max-w-md">
                    <h4 className="text-white text-sm font-medium mb-2">Real-world example:</h4>
                    <p className="text-white/70 text-sm">
                      E-commerce company used our AI to extract product data from 10,000+ pages across competitor sites, 
                      automatically categorizing products and identifying pricing trends, saving 200+ hours of manual work.
                    </p>
                  </div>
                </div>
                
                <div className="text-white flex items-center font-medium">
                  Learn more
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </div>
              </div>
            </FeatureCard>
          </div>
          
          <div className="col-span-12 md:col-span-5 mb-4">
            {/* Automated Scheduling Card with interactive hover */}
            <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-3xl h-full p-8 md:p-10 group relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/10">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="h-12 w-12 rounded-full bg-[#0066cc] flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-black dark:text-white mb-3">
                Automated Scheduling
              </h3>
              
              <p className="text-[#86868b] dark:text-[#a1a1a6] text-lg leading-relaxed">
                Set up recurring scrapes on your preferred schedule with monitoring and notifications.
              </p>
              
              {/* Testimonial that appears on hover */}
              <div className="mt-4 overflow-hidden h-0 group-hover:h-auto transition-all duration-500">
                <div className="bg-black/5 dark:bg:white/5 rounded-lg p-3 my-3 text-sm italic text-[#86868b] dark:text-[#a1a1a6]">
                  &quot;The scheduled automations run flawlessly. I set it up once and now get fresh market data every morning.&quot;
                  <p className="text-xs mt-1 font-medium">— David K., Business Analyst</p>
                </div>
              </div>
              
              <div className="text-[#0066cc] dark:text-[#2997ff] mt-5 flex items-center font-medium">
                Learn more
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </div>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-4 mb-4">
            {/* Advanced Settings Card with improved interactions */}
            <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-3xl h-full p-8 md:p-10 group relative overflow-hidden">
              <div className="absolute -bottom-20 -right-20 h-40 w-40 bg-gradient-to-tl from-blue-500/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="h-12 w-12 rounded-full bg-[#0066cc] flex items-center justify-center mb-6 relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:rotate-45 transition-transform duration-700">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-black dark:text-white mb-3 group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors duration-300">
                Advanced Settings
              </h3>
              
              <p className="text-[#86868b] dark:text-[#a1a1a6] text-lg leading-relaxed">
                Fine-tune your extraction workflows with advanced configuration options.
              </p>
              
              {/* Feature details that appear on hover */}
              <div className="mt-5 overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0066cc]"></div>
                    <span className="text-[#86868b] dark:text-[#a1a1a6]">Custom retry logic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0066cc]"></div>
                    <span className="text-[#86868b] dark:text-[#a1a1a6]">Rate limiting controls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0066cc]"></div>
                    <span className="text-[#86868b] dark:text-[#a1a1a6]">Proxy rotation settings</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-[#0066cc] dark:text-[#2997ff] mt-5 flex items-center font-medium">
                Learn more
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </div>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-8 mb-4">
            {/* API Access card with code examples */}
            <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-3xl h-full p-8 md:p-10 group relative overflow-hidden">
              <div className="h-12 w-12 rounded-full bg-[#0066cc] flex items-center justify-center mb-6">
                <Code className="h-5 w-5 text-white" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-black dark:text-white mb-3">
                API Access
              </h3>
              
              <p className="text-[#86868b] dark:text-[#a1a1a6] text-lg leading-relaxed mb-6">
                Integrate web data extraction directly into your applications with our RESTful API.
              </p>
              
              {/* Code example that appears on hover */}
              <div className="bg-zinc-800 rounded-lg p-4 overflow-hidden h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500">
                <pre className="text-sm text-green-400 font-mono">
                  <code>{`// Example API request
const response = await fetch('https://api.scrapesmart.com/v1/extract', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ${'{API_KEY}'}' },
  body: JSON.stringify({
    url: 'https://example.com/products',
    selectors: { price: '.product-price', name: '.product-name' }
  })
});`}</code>
                </pre>
              </div>
              
              <div className="text-[#0066cc] dark:text-[#2997ff] mt-5 flex items-center font-medium">
                Learn more
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Export Category - Section Header */}
        <motion.div 
          id="data-export"
          className="mb-8 mt-16 flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-10 w-10 rounded-full bg-green-400 flex items-center justify-center mr-4">
            <FileJson className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-white">Data Export</h3>
          <div className="ml-4 h-[1px] flex-1 bg-gradient-to-r from-green-400/50 to-transparent"></div>
        </motion.div>

        <div className="grid grid-cols-12 gap-4">
          {/* Export to Any Format Card - Enhanced with animated icons */}
          <div className="col-span-12 mb-4 group">
            <FeatureCard
              title="Export to Any Format"
              description="Export your data as JSON, CSV, Excel or directly to your database."
              imageUrl="https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=1600&auto=format&fit=crop"
              inView={isInView}
              index={5}
              textColor="light"
              size="medium"
            >
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between">
                <div className="relative z-10">
                  <h3 className="font-semibold tracking-tight text-3xl md:text-4xl mb-3 text-white">
                    Export to Any Format
                  </h3>
                  <p className="text-white/80 text-lg max-w-lg mb-6">
                    Export your extracted data to multiple formats or directly into your preferred systems.
                  </p>
                  
                  {/* Format options with subtle animations */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <motion.div 
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center text-center border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                      whileHover={{ y: -5, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="h-10 w-10 rounded-full bg-green-400/20 flex items-center justify-center mb-3">
                        <FileJson className="h-5 w-5 text-green-400" />
                      </div>
                      <span className="text-white font-medium text-sm">JSON</span>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center text-center border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                      whileHover={{ y: -5, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-400/20 flex items-center justify-center mb-3">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19M14 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V8M14 3L19 8M7 17H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-white font-medium text-sm">CSV</span>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center text-center border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                      whileHover={{ y: -5, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="h-10 w-10 rounded-full bg-emerald-400/20 flex items-center justify-center mb-3">
                        <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C6.46957 2 5.96086 2.21071 5.58579 2.58579C5.21071 2.96086 5 3.46957 5 4V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-white font-medium text-sm">Excel</span>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center text-center border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                      whileHover={{ y: -5, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="h-10 w-10 rounded-full bg-purple-400/20 flex items-center justify-center mb-3">
                        <svg className="h-5 w-5 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 7V17C4 17.5304 4.21071 18.0391 4.58579 18.4142C4.96086 18.7893 5.46957 19 6 19H18C18.5304 19 19.0391 18.7893 19.4142 18.4142C19.7893 18.0391 20 17.5304 20 17V11H16C15.4696 11 14.9609 10.7893 14.5858 10.4142C14.2107 10.0391 14 9.53043 14 9V5H6C5.46957 5 4.96086 5.21071 4.58579 5.58579C4.21071 5.96086 4 6.46957 4 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 5L20 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-white font-medium text-sm">Database</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </FeatureCard>
          </div>
          
          {/* Global Access and Real-time Analytics Cards */}
          <div className="col-span-12 md:col-span-6 mb-4 group">
            <FeatureCard
              title="Global Access"
              description="Access websites worldwide with our distributed proxy network and IP rotation technology."
              imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop"
              inView={isInView}
              index={6}
              textColor="light"
            >
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                <div className="relative z-10">
                  <h3 className="font-semibold tracking-tight text-3xl md:text-4xl mb-3 text-white">
                    Global Access
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-4">
                    Access websites worldwide with our distributed proxy network and IP rotation technology.
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                        <span className="text-white/70 text-sm">200+ global proxy locations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                        <span className="text-white/70 text-sm">Intelligent IP rotation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </FeatureCard>
          </div>
          
          <div className="col-span-12 md:col-span-6 mb-4 group">
            <FeatureCard
              title="Real-time Analytics"
              description="Monitor your extraction workflows with comprehensive analytics and visualization tools."
              imageUrl="https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1600&auto=format&fit=crop"
              inView={isInView}
              index={7}
              textColor="light"
            >
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                <div className="relative z-10">
                  <h3 className="font-semibold tracking-tight text-3xl md:text-4xl mb-3 text-white">
                    Real-time Analytics
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-4">
                    Monitor your extraction workflows with comprehensive analytics and visualization tools.
                  </p>
                  {/* Testimonial quote that appears on hover */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <p className="text-white/70 text-sm italic">
                        &quot;The analytics dashboard gives us instant insights into our data collection performance across all workflows.&quot;
                      </p>
                      <p className="text-white/50 text-xs mt-1">— Thomas L., Data Engineer</p>
                    </div>
                  </div>
                </div>
              </div>
            </FeatureCard>
          </div>
        </div>

        {/* Connection lines to show feature relationships */}
        <div className="relative my-12">        </div>

        {/* Apple-style CTA */}
        <div className="text-center mb-8 md:mb-12">
          <a 
            href="#" 
            className="inline-flex items-center text-[#0066cc] dark:text-[#2997ff] text-xl font-medium"
          >
            See all features
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>        
          {/* Feature Comparison Table */}
        <FeatureComparisonTable isVisible={isInView} />
      </div>
    </section>
  );
}
