"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, LineChart, Clock, Shield } from "lucide-react";
import Link from "next/link";

// Feature benefit component
const FeatureBenefit = ({ icon, title, description, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/30 flex items-center justify-center mb-4"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-white/60 text-sm max-w-[220px]">{description}</p>
    </motion.div>
  );
};

// Generate fixed particle positions outside the component to prevent re-rendering on hover
const generateParticles = () => Array.from({ length: 8 }).map(() => ({
  top: `${15 + Math.random() * 70}%`,
  left: `${5 + Math.random() * 90}%`,
  duration: 3 + Math.random() * 5,
  delay: Math.random() * 2
}));

// Pre-generated particles that won't change between renders
const PRE_GENERATED_PARTICLES = generateParticles();

export default function CallToAction() {
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });
  const [hoverButton, setHoverButton] = useState<'start' | 'demo' | null>(null);
  
  // Use the pre-generated particles that won't change on re-renders
  const particles = PRE_GENERATED_PARTICLES;

  return (
    <section
      id="cta"
      ref={ctaRef}
      className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-slate-950 to-black"
    >
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
        {/* Main gradient blob */}
        <div className="absolute -top-[400px] -right-[300px] w-[900px] h-[900px] opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-400/30 rounded-full blur-[120px]"></div>
        </div>
        
        {/* Secondary gradients */}
        <motion.div 
          className="absolute bottom-40 left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Decorative particles with fixed positions */}
        <div className="absolute inset-0 z-0">
          {particles.map((particle, i) => (
            <motion.div 
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary"
              style={{
                top: particle.top,
                left: particle.left,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay
              }}
            />
          ))}
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
          >
            <motion.span 
              className="block text-primary font-medium mb-4 uppercase tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              GET STARTED TODAY
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <motion.span 
                className="text-white block"
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Ready to transform your
              </motion.span>
              <motion.span 
                className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400"
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                data collection workflow?
              </motion.span>
            </h2>
            <motion.p 
              className="text-xl md:text-2xl text-white/70 leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Join thousands of data professionals using ScrapeSmart to extract web data with precision, 
              reliability, and unprecedented ease.
            </motion.p>
            
          </motion.div>
          
          <div className="relative">
            {/* Animated highlight line */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ width: "0%" }}
              animate={ctaInView ? { width: "80%" } : { width: "0%" }}
              transition={{ delay: 0.8, duration: 1.5 }}
            />
          
            {/* Enhanced CTA buttons with animations */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-5 justify-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.9, duration: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoverButton('start')}
                onMouseLeave={() => setHoverButton(null)}
              >
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 text-white rounded-full h-16 px-10 text-lg font-medium shadow-lg shadow-primary/20 relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Start for free
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300" 
                        style={{
                          transform: hoverButton === 'start' ? 'translateX(4px)' : 'translateX(0)'
                        }}
                      />
                    </span>
                    <AnimatePresence>
                      {hoverButton === 'start' && (
                        <motion.span 
                          className="absolute inset-0 bg-white/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoverButton('demo')}
                onMouseLeave={() => setHoverButton(null)}
              >
                <Link href="/#contact">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full h-16 px-10 text-lg font-medium backdrop-blur-sm"
                  >
                    <span className="flex items-center">
                      Request demo
                      {hoverButton === 'demo' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0, x: -10 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="ml-2"
                        >
                          <Shield className="h-5 w-5" />
                        </motion.div>
                      )}
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex flex-col items-center space-y-3"
              initial={{ opacity: 0 }}
              animate={ctaInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/60 text-sm">
                  No credit card required
                </p>
                
                <div className="w-1 h-1 rounded-full bg-white/30 mx-2"></div>
                
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/60 text-sm">
                  5,000 free credits to start
                </p>
              </div>
              
              <p className="text-white/40 text-xs">
                Trusted by over 3,000+ companies worldwide
              </p>
            </motion.div>
          </div>        </div>
      </div>
    </section>
  );
}