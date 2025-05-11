"use client";

import { Shield, Lock, ShieldCheck } from "lucide-react";

export default function TrustBadges() {
  return (
    <section className="py-12 bg-black/80">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Trusted by Businesses Worldwide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Security Badge */}
          <div className="flex flex-col items-center text-center p-6 bg-background/5 rounded-lg border border-primary/20 hover:border-primary/40 transition-all">
            <Shield className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Enterprise-Grade Security</h3>
            <p className="text-sm text-muted-foreground">Your data is protected with advanced encryption and security protocols.</p>
          </div>
          
          {/* Compliance Badge */}
          <div className="flex flex-col items-center text-center p-6 bg-background/5 rounded-lg border border-primary/20 hover:border-primary/40 transition-all">
            <Lock className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">GDPR Compliant</h3>
            <p className="text-sm text-muted-foreground">We adhere to strict data protection regulations to ensure your privacy.</p>
          </div>
          
          {/* Support Badge */}
          <div className="flex flex-col items-center text-center p-6 bg-background/5 rounded-lg border border-primary/20 hover:border-primary/40 transition-all">
            <ShieldCheck className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">24/7 Expert Support</h3>
            <p className="text-sm text-muted-foreground">Our dedicated team is available round the clock to assist you.</p>
          </div>
        </div>
        
        {/* Client Logos */}
        <div className="mt-16">
          <p className="text-center text-sm text-muted-foreground mb-6">Trusted by innovative companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            {/* Add your client logos here - these are placeholder divs */}
            <div className="h-8 w-32 bg-muted-foreground/20 rounded"></div>
            <div className="h-8 w-32 bg-muted-foreground/20 rounded"></div>
            <div className="h-8 w-32 bg-muted-foreground/20 rounded"></div>
            <div className="h-8 w-32 bg-muted-foreground/20 rounded"></div>
            <div className="h-8 w-32 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
}