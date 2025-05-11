"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckIcon, BrainCircuit, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Apple-style pricing card
const ApplePricingCard = ({ 
  title, 
  price, 
  description,
  features, 
  isPopular, 
  index 
}: { 
  title: string; 
  price: string; 
  description: string;
  features: string[]; 
  isPopular?: boolean;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (    <motion.div      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`relative h-full ${isPopular ? 'pt-10' : 'pt-5'}`} // Different padding for the popular card to account for badge
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popular badge placed outside and above the card */}
      {isPopular && (
        <div className="absolute top-6 left-0 right-0 flex justify-center z-30">
          <motion.span 
            className="bg-gradient-to-r from-primary to-blue-500 text-xs font-medium py-2 px-6 rounded-full text-white shadow-lg border border-blue-400/20"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            Most Popular
          </motion.span>
        </div>
      )}
      
      {/* Animated highlight border for popular plan */}
      {isPopular && (
        <motion.div 
          className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-primary via-blue-400 to-primary z-0"
          animate={{ 
            opacity: isHovered ? 1 : 0.7,
            background: isHovered ? 
              "linear-gradient(45deg, var(--primary), #60a5fa, var(--primary))" : 
              "linear-gradient(45deg, var(--primary), #60a5fa, var(--primary))"
          }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundSize: "200% 200%",
            animation: isHovered ? "gradientShift 3s ease infinite" : "none"
          }}
        />
      )}        <div 
        className={`h-full flex flex-col rounded-3xl overflow-hidden relative z-10 ${
          isPopular ? 'bg-gradient-to-b from-white/[0.07] to-transparent p-px backdrop-blur-md' : 'bg-white/[0.03] border border-white/[0.05]'
        }`}
      >
        <div className={`h-full flex flex-col ${isPopular ? 'bg-[#111]/80' : ''} p-8 backdrop-blur-sm relative flex-1`}>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/60">{description}</p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-baseline">
              <div className="text-5xl font-bold text-white">{price}</div>
              <div className="text-white/60 ml-2">/mo</div>
            </div>
            <motion.div 
              className="text-sm text-primary/80 mt-1 font-medium"
              animate={{ opacity: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Badge for savings */}
              {title === "Professional" ? 
                <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs">Save 20% with yearly billing</span> : 
                <span>one-time payment</span>
              }
            </motion.div>
          </div>
          
          <div className="flex-1">
            <ul className="space-y-4 mb-8">
              {features.map((feature, i) => (
                <motion.li 
                  key={i} 
                  className="flex items-start gap-3 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                >
                  <span className="shrink-0 mt-1">
                    <motion.div
                      className="bg-primary/20 p-1 rounded-full"
                      whileHover={{ scale: 1.2, backgroundColor: "rgba(var(--primary-rgb), 0.3)" }}
                    >
                      <CheckIcon className="h-3 w-3 text-primary" />
                    </motion.div>
                  </span>
                  <span className="text-white/80">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div className="mt-auto pt-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >              <Link href="/billing" className="w-full">
                <Button 
                  className={isPopular 
                    ? "w-full bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 text-white rounded-full h-12 font-medium shadow-lg shadow-primary/20" 
                    : "w-full bg-white/5 hover:bg-white/15 text-white border border-white/10 rounded-full h-12 font-medium backdrop-blur-sm"
                  }
                >
                  <span>Choose {title}</span>
                  <ChevronRight className="h-4 w-4 ml-1 opacity-70" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function PricingSection() {
  const pricingRef = useRef(null);
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.2 });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const pricingPlans = [
    {
      title: "Starter",
      price: billingCycle === 'yearly' ? "$49" : "$5",
      description: "Perfect for individuals exploring data collection",
      features: [
        "5,000 workflow credits",
        "All 11 workflow nodes",
        "Visual workflow builder",
        "Basic AI extraction & cleaning",
        "Export to CSV & JSON formats",
        "Community support",
        "7-day retention period"
      ],
      isPopular: false
    },
    {
      title: "Professional",
      price: billingCycle === 'yearly' ? "$149" : "$15",
      description: "For teams with advanced data needs",
      features: [
        "20,000 workflow credits",
        "All workflow nodes & templates",
        "Advanced visual workflow builder",
        "Full AI extraction capabilities",
        "All export formats & integrations",
        "Scheduled automations (5 active)",
        "Priority email support",
        "30-day retention period",
        "Advanced analytics"
      ],
      isPopular: true
    },
    {
      title: "Enterprise",
      price: billingCycle === 'yearly' ? "$499" : "$49",
      description: "For organizations with high-volume needs",
      features: [
        "100,000 workflow credits",
        "All workflow nodes & templates",
        "Team collaboration features",
        "Premium AI extraction & models",
        "Custom export formats",
        "Unlimited scheduled workflows",
        "API access & webhooks",
        "Dedicated account manager",
        "90-day retention period",
        "SOC2 compliance"
      ],
      isPopular: false
    }
  ];
  return (
    <section
      id="pricing"
      ref={pricingRef}
      className="py-24 md:py-32 bg-black relative overflow-hidden"
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient blob */}
        <div className="absolute -top-[600px] left-1/2 transform -translate-x-1/2 w-[1000px] h-[1000px] opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-blue-400/40 rounded-full blur-[120px]"></div>
        </div>
        
        {/* Additional decorative elements */}
        <motion.div 
          className="absolute top-40 left-20 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"
          animate={{
            y: [0, 15, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="block text-primary font-medium mb-4 uppercase tracking-wide"
          >
            PRICING
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10"
          >
            Get started for free and scale as you grow. All plans include our powerful workflow builder and AI-assisted extraction with no hidden fees.
          </motion.p>
            <motion.div 
            className="inline-flex p-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
            whileHover={{ boxShadow: "0 0 20px rgba(var(--primary-rgb), 0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.button 
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-white/80 hover:text-white'}`}
              onClick={() => setBillingCycle('monthly')}
              whileTap={{ scale: 0.98 }}
            >
              Monthly
            </motion.button>
            <motion.button 
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${billingCycle === 'yearly' ? 'bg-white text-black' : 'text-white/80 hover:text-white'}`}
              onClick={() => setBillingCycle('yearly')}
              whileTap={{ scale: 0.98 }}
            >
              Yearly <span className="inline-block ml-1 bg-primary/20 text-primary px-2 rounded-full text-xs font-bold">SAVE 20%</span>
            </motion.button>
          </motion.div>
        </motion.div>        {/* Add savings banner */}
        {billingCycle === 'yearly' && (
          <motion.div 
            className="max-w-max mx-auto mb-12 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <circle cx="12" cy="12" r="10"/>
              <path d="m8 12 3 3 5-5"/>
            </svg>
            <span className="text-sm font-medium text-white">Save up to <span className="text-primary font-bold">$120</span> per year with annual billing</span>
          </motion.div>
        )}          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 items-start">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`${plan.isPopular ? 'md:-mt-2 md:transform md:scale-105' : ''}`}>
              <ApplePricingCard
                title={plan.title}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                isPopular={plan.isPopular}
                index={index}
              />
            </div>
          ))}
        </div>
        
        {/* Comparison link */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={pricingInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >                <Link href="/billing" className="inline-flex items-center text-primary hover:underline text-sm">
            <span>See full plan comparison</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <line x1="7" y1="12" x2="21" y2="12"></line>
              <polyline points="16 7 21 12 16 17"></polyline>
            </svg>
          </Link>
        </motion.div>          <motion.div 
          className="mt-20 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >

          {/* Custom Plan Box */}
          <motion.div 
            className="relative p-8 rounded-2xl overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/20 to-violet-500/20 rounded-2xl"></div>
            <div className="absolute inset-0 backdrop-blur-sm border border-white/10 rounded-2xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3">Need a custom enterprise solution?</h3>
              <p className="text-white/70 mb-6 max-w-lg mx-auto">
                Contact our team to design a tailored plan with custom integrations, dedicated infrastructure, and personalized support for your organization.
              </p>
              <motion.div 
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link href="/#contact">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-full py-6 px-8 text-md font-medium shadow-lg"
                  >
                    <span>Contact Sales</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          {/* AI Integration Badge */}
          <motion.div 
            className="mt-16 flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm max-w-max mx-auto"
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <BrainCircuit className="h-5 w-5 text-primary" />
            <p className="text-white/70 text-sm font-medium">
              All plans include GPT-4o, Claude, and Gemini integration
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}