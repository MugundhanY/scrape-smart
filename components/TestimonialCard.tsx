import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatarIndex: number;
  index: number;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  avatarIndex,
  index,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col">
        <CardContent className="pt-6 px-6 flex-1 flex flex-col">
          <div className="mb-4 text-primary">
            <Quote size={24} />
          </div>
          <p className="text-foreground/80 mb-6 flex-1">{quote}</p>
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={`/avatars/avatar-${avatarIndex}.png`} alt={author} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {author.split(" ").map(name => name[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{author}</p>
              <p className="text-xs text-foreground/60">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}