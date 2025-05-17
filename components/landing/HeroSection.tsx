"use client";
import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight,
  Zap,
  BrainCircuit,
  Terminal,
  FileJson,
  Clock,
  Lock,
  PlayIcon,
  CheckIcon,
  UploadIcon,
  XIcon,
  GlobeIcon,
  Link2Off,
  Edit3Icon,
  MousePointerClick,
  ArrowUpIcon,
  CodeIcon,
  BrainIcon,
  TextIcon,
  EyeIcon,
  FileJson2Icon,
  DatabaseIcon,
  SendIcon,
  Link2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import WorkflowAnimationSequence from "./WorkflowAnimationSequence";
import TooltipWrapper from "@/components/TooltipWrapper";
import Link from "next/link";

export default function HeroSection() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Node descriptions for tooltips
  const nodeDescriptions = {
    // Automation group
    "Launch Browser": "Start a new browser instance to begin web scraping",
    "Navigate URL": "Go to a specific URL or website address",
    "Fill Input": "Enter text into form fields like search boxes or login forms",
    "Click Element": "Simulate clicking on buttons, links, or other interactive elements",
    "Scroll to Element": "Move the page view to ensure an element is visible",
    
    // Extraction group
    "Get HTML from page": "Extract the raw HTML code from the current page",
    "Extract data with AI": "Use AI to intelligently extract structured data from web content",
    "Extract text from element": "Get the text content from a specific element on the page",
    "Wait for Element": "Pause workflow until a specific element appears on the page",
    
    // Data processing group
    "Read property from JSON": "Access specific values stored in JSON data structure",
    "Add property to JSON": "Insert or modify values in your JSON data structure",
    "Deliver via Webhook": "Send extracted data to another system via a webhook endpoint"
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[120vh] flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Apple-style minimalistic gradient background */}
      <div className="absolute inset-0 bg-black">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(64,78,237,0.15)_0%,_rgba(0,0,0,0)_70%)]"
        />
      </div>

      <div className="container relative z-10 px-4 mx-auto mt-20">
        {/* Introductory pill label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="py-1 px-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
            <span className="text-sm font-medium text-white/80">Introducing ScrapeSmart</span>
          </div>
        </motion.div>
        
        {/* Hero headline text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-6"
        >
          <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.1]">
            Web scraping.
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 inline-block ml-3 pb-2 align-bottom">
              Reimagined.
            </span>
          </h1>
        </motion.div>
        
        {/* Subtitle text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Extract structured data from any website with our intuitive visual workflow builder and AI-assisted extraction technology.
          </p>
        </motion.div>
        
        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center gap-4 flex-wrap mb-16 sm:flex-row flex-col px-6 sm:px-0"
        >          <Link href="/signup">
            <Button 
              size="lg" 
              className="bg-white hover:bg-white/90 text-black rounded-full h-14 px-8 text-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight className="relative z-10 ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link href="/pricing">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full h-14 px-8 text-lg"
            >
              <Zap className="mr-2 h-5 w-5" /> View Pricing
            </Button>
          </Link>
        </motion.div>

        {/* Workflow Editor Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="max-w-5xl mx-auto mb-8"
        >
          <WorkflowAnimationSequence />
        </motion.div>
      </div>
      
      {/* Feature pills */}
      <motion.div 
        className="container mx-auto px-4 max-w-4xl"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        <motion.h3
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className="text-center text-white/80 mb-6 text-lg font-medium"
        >
          Available Workflow Nodes
        </motion.h3>

        <div className="flex flex-wrap justify-center gap-3 mb-32 max-w-4xl mx-auto">
          {[
            // Automation group
            [
              { name: "Launch Browser", icon: <GlobeIcon className="h-3 w-3" />, category: "Automation" },
              { name: "Navigate URL", icon: <Link2Icon className="h-3 w-3" />, category: "Automation" },
              { name: "Fill Input", icon: <Edit3Icon className="h-3 w-3" />, category: "Automation" },
              { name: "Click Element", icon: <MousePointerClick className="h-3 w-3" />, category: "Automation" },
              { name: "Scroll to Element", icon: <ArrowUpIcon className="h-3 w-3" />, category: "Automation" },
            ],
            // Extraction group
            [
              { name: "Get HTML from page", icon: <CodeIcon className="h-3 w-3" />, category: "Extraction" },
              { name: "Extract data with AI", icon: <BrainIcon className="h-3 w-3" />, category: "Extraction" },
              { name: "Extract text from element", icon: <TextIcon className="h-3 w-3" />, category: "Extraction" },
              { name: "Wait for Element", icon: <EyeIcon className="h-3 w-3" />, category: "Extraction" },
            ],
            // Data processing group
            [
              { name: "Read property from JSON", icon: <FileJson2Icon className="h-3 w-3" />, category: "Processing" },
              { name: "Add property to JSON", icon: <DatabaseIcon className="h-3 w-3" />, category: "Processing" },
              { name: "Deliver via Webhook", icon: <SendIcon className="h-3 w-3" />, category: "Processing" },
            ]
          ].map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-wrap justify-center gap-3 w-full my-3">
              {group.map((item, i) => (
                <TooltipWrapper key={i} content={nodeDescriptions[item.name as keyof typeof nodeDescriptions]} side="top">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.5 }}
                    className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center gap-1.5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-primary group-hover:text-primary/90">{item.icon}</span>
                    <span className="text-xs text-white/80 group-hover:text-white/100">{item.name}</span>
                  </motion.div>
                </TooltipWrapper>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Scroll indicator - moved to fixed position */}
      <motion.div 
        style={{ opacity }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="text-xs tracking-wider uppercase text-white/40"
          >
            Scroll to explore
          </motion.span>
          <motion.div 
            className="w-6 h-10 rounded-full border border-white/20 flex justify-center items-start py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
          >
            <motion.div 
              className="w-1 h-1.5 rounded-full bg-white"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}