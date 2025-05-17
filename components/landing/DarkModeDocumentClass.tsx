"use client";

import { useEffect } from 'react';

// This component ensures the HTML document always has the dark class
// to force dark mode on the landing page
export default function DarkModeDocumentClass() {
  useEffect(() => {
    // Apply dark mode class to document
    document.documentElement.classList.add("dark");

    // Force dark mode in localStorage to prevent flashing
    try {
      localStorage.setItem("theme", "dark");
    } catch (e) {
      // Ignore errors from localStorage
    }

    // No cleanup needed, we want the landing page to stay in dark mode
  }, []);

  return null;
}
