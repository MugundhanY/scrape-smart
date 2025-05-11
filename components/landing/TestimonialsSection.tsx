"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, User, Quote } from "lucide-react";

// Enhanced testimonial card with professional styling and hover effects
const TestimonialCard = ({ 
  quote, 
  author, 
  role, 
  image, 
  index 
}: { 
  quote: string; 
  author: string; 
  role: string; 
  image: string; 
  index: number;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Get initials for the avatar fallback
  const initials = author.split(' ').map(name => name[0]).join('');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-2xl group"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-blue-500/30 to-violet-500/50 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative h-full rounded-2xl bg-black/80 backdrop-blur-md m-[1px] p-8 flex flex-col justify-between">
        <div>
          {/* Quote mark overlay */}
          <Quote className="absolute top-4 right-4 h-12 w-12 text-white/5 rotate-180" />
            <div className="flex mb-4">
            {[...Array(5)].map((_, i) => {
              // Vary star ratings to appear more authentic (4-5 stars)
              const rating = index % 2 === 0 ? 5 : 4;
              return (
                <Star 
                  key={i} 
                  className={`h-4 w-4 mr-1 ${i < rating ? "text-primary fill-primary" : "text-primary/30"}`} 
                />
              );
            })}
          </div>
          
          <p className="text-white/80 text-lg font-light italic leading-relaxed mb-6 relative z-10">
            &quot;{quote}&quot;
          </p>
        </div>
        
        <div className="flex items-center">
          <motion.div 
            className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/50 mr-4 bg-gradient-to-br from-primary/30 to-blue-500/30 flex items-center justify-center shadow-lg"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {imageError ? (
              <div className="flex items-center justify-center w-full h-full text-white/70 uppercase font-medium">
                {initials}
              </div>
            ) : (
              <Image 
                src={image} 
                alt={author}
                width={64}
                height={64}
                className="object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </motion.div>
          
          <div>
            <h4 className="font-semibold text-white text-lg">{author}</h4>
            <p className="text-primary/80 text-sm">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TestimonialsSection() {
  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });
  const testimonials = [
    {
      quote: "ScrapeSmart has transformed how we collect competitive pricing data. What used to take days now happens automatically in minutes.",
      author: "Sarah Johnson",
      role: "Head of E-commerce, RetailTech",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&h=200&fit=crop&auto=format"
    },
    {
      quote: "The AI extraction capabilities are mind-blowing. It correctly identified and extracted product specifications with minimal setup.",
      author: "Michael Chen",
      role: "Data Scientist, TechAnalytics",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&fit=crop&auto=format"
    },
    {
      quote: "We've tried many scraping tools, but the visual workflow builder makes it accessible to our entire team, not just developers.",
      author: "Emily Rodriguez",
      role: "Marketing Director, GrowthCo",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&fit=crop&auto=format"
    },
    {
      quote: "The scheduled automations run flawlessly. I set it up once and now get fresh market data delivered to our dashboard every morning.",
      author: "David Kim",
      role: "Business Analyst, MarketInsight",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop&auto=format"
    },    {
      quote: "Customer support has been exceptional. They helped us set up a complex workflow for our specific use case within hours.",
      author: "Jessica Taylor",
      role: "Operations Manager, DataFirst",
      image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=200&h=200&fit=crop&auto=format"
    },
    {
      quote: "The platform's ethical compliance features give us confidence that we're gathering data responsibly and within legal boundaries.",
      author: "Robert Wilson",
      role: "Legal Counsel, ComplianceAI",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&fit=crop&auto=format"
    }
  ];
  return (
    <section
      id="testimonials"
      ref={testimonialsRef}
      className="py-28 md:py-36 relative overflow-hidden"
    >
      {/* Enhanced background with richer gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-black" />
      
      {/* Top connector gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-zinc-900/80 to-transparent" />
      
      {/* Enhanced rotating gradient background with additional elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div 
          className="absolute -top-[500px] -left-[300px] w-[1000px] h-[1000px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 70%)',
          }}
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            rotate: {
              duration: 50,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
        <motion.div 
          className="absolute -bottom-[500px] -right-[300px] w-[1000px] h-[1000px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(236, 72, 153, 0.08) 50%, transparent 70%)',
          }}
          animate={{ 
            rotate: -360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: {
              duration: 50,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
        
        {/* Additional floating elements */}
        <motion.div 
          className="absolute top-[20%] left-[15%] w-24 h-24 rounded-full bg-primary/5 blur-xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-[25%] right-[20%] w-32 h-32 rounded-full bg-blue-500/5 blur-xl"
          animate={{
            y: [0, 40, 0],
            opacity: [0.6, 0.9, 0.6]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">        <motion.div 
          className="text-center max-w-3xl mx-auto mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="block text-primary font-medium mb-4 uppercase tracking-wide"
          >
            TESTIMONIALS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
          >
            Trusted by data professionals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto"
          >
            Join thousands of businesses already using <span className="text-primary font-medium">ScrapeSmart</span> to transform their data workflows.
          </motion.p>
        </motion.div>        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              image={testimonial.image}
              index={index}
            />
          ))}
        </motion.div>
          {/* Enhanced company logos section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-28 border-t border-white/10 pt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto mb-14"
          >
            <p className="text-center text-primary font-semibold text-sm uppercase tracking-widest mb-3">TRUSTED BY INDUSTRY LEADERS</p>
            <p className="text-white/60 text-base">Join top organizations already using our platform to transform their data workflows</p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-12 md:gap-x-20 gap-y-10">
            {["Apple", "Microsoft", "Google", "Amazon", "Meta", "Salesforce"].map((company, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                animate={testimonialsInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.7 + (i * 0.1) }}
                whileHover={{ scale: 1.05 }}
                className="text-white/30 hover:text-white/70 transition-all duration-300"
              >
                <span className="text-xl md:text-2xl font-medium bg-gradient-to-r from-white/70 to-white/30 bg-clip-text hover:text-transparent">{company}</span>
              </motion.div>
            ))}          </div>
        </motion.div>
        
        {/* Call to action section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-24 text-center"
        >
          <div className="relative max-w-2xl mx-auto px-8 py-10 rounded-2xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/10 to-violet-500/20 rounded-2xl"></div>
            <div className="absolute inset-0 backdrop-blur-xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to experience the difference?</h3>              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Join thousands of professionals who are already transforming their data collection workflows with ScrapeSmart.
              </p>
              <motion.div 
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <a 
                  href="/signup" 
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white font-medium py-3 px-8 rounded-full transition-all"
                >
                  Get Started Free
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}