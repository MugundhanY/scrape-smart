"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

export function useForceDarkMode() {
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  useEffect(() => {
    // Force dark mode on the landing page
    if (isLandingPage) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }

    return () => {
      // Nothing to clean up, as we want to respect user's choice when navigating away
    };
  }, [isLandingPage, setTheme]);

  return { isLandingPage };
}
