"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBeamProps {
  className?: string;
  direction?: "horizontal" | "vertical";
  position?: "start" | "center" | "end";
  size?: "sm" | "md" | "lg" | "full";
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  duration?: number;
  glowOpacity?: number;
}

export function AnimatedBeam({
  className,
  direction = "horizontal",
  position = "center",
  size = "md",
  colorFrom = "from-primary",
  colorTo = "to-violet-600",
  delay = 0,
  duration = 2.5,
  glowOpacity = 0.3,
}: AnimatedBeamProps) {
  const beamRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay * 1000);
        }
      });
    });

    if (beamRef.current) {
      observer.observe(beamRef.current);
    }

    return () => {
      if (beamRef.current) {
        observer.unobserve(beamRef.current);
      }
    };
  }, [delay]);

  const beamSizeClasses = {
    sm: direction === "horizontal" ? "h-[1px] w-20" : "h-20 w-[1px]",
    md: direction === "horizontal" ? "h-[1px] w-40" : "h-40 w-[1px]",
    lg: direction === "horizontal" ? "h-[1px] w-60" : "h-60 w-[1px]",
    full: direction === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
  };

  const positionClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };

  return (
    <div
      className={cn(
        "relative flex w-full",
        positionClasses[position],
        className
      )}
    >
      <div
        ref={beamRef}
        className={cn(
          beamSizeClasses[size],
          "relative overflow-hidden rounded-full bg-gradient-to-r",
          colorFrom,
          colorTo,
          "opacity-0 transition-opacity",
          isVisible && "opacity-100"
        )}
        style={{
          transition: `opacity ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            animation: isVisible
              ? `beam-glow ${duration * 1.5}s ease-in-out infinite`
              : "none",
            opacity: glowOpacity,
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes beam-glow {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}