import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

interface PricingCardProps {
  title: string;
  price: string;
  credits: number;
  features: string[];
  isPopular?: boolean;
  index: number;
}

export default function PricingCard({
  title,
  price,
  credits,
  features,
  isPopular = false,
  index,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className={`h-full flex flex-col relative ${isPopular ? 'border-primary shadow-lg shadow-primary/20' : ''}`}>
        {isPopular && (
          <div className="absolute -top-3 left-0 right-0 flex justify-center">
            <span className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-full">
              Most Popular
            </span>
          </div>
        )}
        <CardHeader className="text-center pt-8">
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="mt-4">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-foreground/70 ml-1">one-time</span>
          </div>
          <p className="text-foreground/70 mt-2">{credits.toLocaleString()} credits</p>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" variant={isPopular ? "default" : "outline"}>
            <Link href="/signup">
              Get Started
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}