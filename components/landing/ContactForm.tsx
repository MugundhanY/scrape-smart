"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, MapPin, Phone, Clock, CheckCircle2 } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().optional(),
  topic: z.string({ required_error: "Please select a topic" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const contactRef = useRef(null);
  const contactInView = useInView(contactRef, { once: true, amount: 0.2 });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      topic: "",
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    form.reset();
  }
  return (
    <section 
      id="contact" 
      ref={contactRef}
      className="py-24 md:py-32 bg-black relative overflow-hidden"
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[600px] left-1/2 transform -translate-x-1/2 w-[1000px] h-[1000px] opacity-15">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-400/30 rounded-full blur-[120px]"></div>
        </div>
        
        {/* Additional decorative elements */}
        <motion.div 
          className="absolute top-40 right-20 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl"
          animate={{
            y: [0, 15, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-60 left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1]
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
          animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="block text-primary font-medium mb-4 uppercase tracking-wide"
          >
            CONTACT US
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
          >
            Get in Touch
          </motion.h2>          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto"
          >
            Have questions about ScrapeSmart? We&apos;re here to help you automate your web data extraction needs.
          </motion.p>
        </motion.div>        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={contactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-white/[0.05] to-transparent p-[1px] rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-white mb-6">Connect With Us</h3>
                <p className="text-white/70 mb-8">
                  Looking for a personalized demo? Have questions about our platform?
                  We&apos;re here to help you get started with web scraping automation.
                </p>
                
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/30 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Email</h3>
                      <a href="mailto:contact@scrapesmart.com" className="text-primary hover:text-primary/80 transition-colors">
                        contact@scrapesmart.com
                      </a>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/30 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Phone</h3>
                      <p className="text-white/70">
                        +1 (888) 555-1234
                      </p>
                      <p className="text-xs text-white/50 mt-1">Monday-Friday, 9AM-6PM EST</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/30 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Locations</h3>
                      <p className="text-white/70">
                        Remote-first company with offices in London and Bangalore
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/30 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Response Time</h3>
                      <p className="text-white/70">
                        We typically respond within 1 business day
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
            <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-white/[0.07] to-transparent p-[1px] rounded-2xl backdrop-blur-md border border-white/10 overflow-hidden"
              >
                <div className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px] text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/30 to-blue-400/30 flex items-center justify-center mb-8"
                  >
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Message Sent Successfully!
                  </motion.h3>
                  
                  <motion.p
                    className="text-white/70 mb-8 max-w-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Thank you for reaching out. A member of our team will review your message and get back to you within 1 business day.
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 text-white rounded-full px-8 py-6 font-medium shadow-lg shadow-primary/20"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="bg-gradient-to-br from-white/[0.07] to-transparent p-[1px] rounded-2xl backdrop-blur-md border border-white/10"
              >
                <div className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl">
                  <h3 className="text-2xl font-semibold text-white mb-6">Send us a message</h3>
                
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem 
                              className={`transition-all duration-300 ${activeField === 'name' ? 'scale-[1.02]' : ''}`}
                              onFocus={() => setActiveField('name')}
                              onBlur={() => setActiveField(null)}
                            >
                              <FormLabel className="text-white/80">Full Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your name" 
                                  {...field} 
                                  className="bg-white/5 border border-white/10 focus:border-primary/50 text-white placeholder:text-white/40 rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem
                              className={`transition-all duration-300 ${activeField === 'email' ? 'scale-[1.02]' : ''}`}
                              onFocus={() => setActiveField('email')}
                              onBlur={() => setActiveField(null)}
                            >
                              <FormLabel className="text-white/80">Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="you@example.com" 
                                  {...field} 
                                  className="bg-white/5 border border-white/10 focus:border-primary/50 text-white placeholder:text-white/40 rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem
                              className={`transition-all duration-300 ${activeField === 'company' ? 'scale-[1.02]' : ''}`}
                              onFocus={() => setActiveField('company')}
                              onBlur={() => setActiveField(null)}
                            >
                              <FormLabel className="text-white/80">Company (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your organization" 
                                  {...field} 
                                  className="bg-white/5 border border-white/10 focus:border-primary/50 text-white placeholder:text-white/40 rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="topic"
                          render={({ field }) => (
                            <FormItem
                              className={`transition-all duration-300 ${activeField === 'topic' ? 'scale-[1.02]' : ''}`}
                              onFocus={() => setActiveField('topic')}
                              onBlur={() => setActiveField(null)}
                            >
                              <FormLabel className="text-white/80">Topic</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/5 border border-white/10 focus:border-primary/50 text-white placeholder:text-white/40 rounded-lg">
                                    <SelectValue placeholder="Select a topic" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-zinc-900 border border-white/10">
                                  <SelectItem value="general">General Inquiry</SelectItem>
                                  <SelectItem value="demo">Request a Demo</SelectItem>
                                  <SelectItem value="pricing">Pricing Question</SelectItem>
                                  <SelectItem value="support">Technical Support</SelectItem>
                                  <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem
                            className={`transition-all duration-300 ${activeField === 'message' ? 'scale-[1.02]' : ''}`}
                            onFocus={() => setActiveField('message')}
                            onBlur={() => setActiveField(null)}
                          >
                            <FormLabel className="text-white/80">Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="How can we help you?" 
                                className="min-h-[150px] bg-white/5 border border-white/10 focus:border-primary/50 text-white placeholder:text-white/40 rounded-lg resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="pt-2"
                      >
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 text-white rounded-full h-12 font-medium shadow-lg shadow-primary/20 text-base" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                              Sending Message...
                            </>
                          ) : (
                            "Send Message"
                          )}
                        </Button>
                      </motion.div>
                      
                      <p className="text-center text-xs text-white/40 mt-4">
                        By submitting this form, you agree to our 
                        <a href="#" className="text-primary hover:underline mx-1">Privacy Policy</a> 
                        and 
                        <a href="#" className="text-primary hover:underline ml-1">Terms of Service</a>
                      </p>
                    </form>
                  </Form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>        </div>
      </div>
    </section>
  );
}