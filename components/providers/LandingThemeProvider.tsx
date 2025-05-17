"use client";

import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function LandingThemeProvider({ children }: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // Force dark theme on the landing page
  useEffect(() => {
    if (isLandingPage) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }

    return () => {
      // Only clean up if we're navigating away from the landing page
      if (isLandingPage) {
        // Let the ThemeProvider handle theme restoration
      }
    };
  }, [isLandingPage]);

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme={isLandingPage ? "dark" : "system"} 
      enableSystem={!isLandingPage} 
      forcedTheme={isLandingPage ? "dark" : undefined}
    >
      {children}
    </ThemeProvider>
  );
}
