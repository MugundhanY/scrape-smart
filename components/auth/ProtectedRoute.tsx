"use client";

import { useAuth } from "../providers/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only redirect if auth state is loaded and user is not signed in
    if (isLoaded && !isSignedIn) {
      setIsRedirecting(true);
      // Add the current path as callback URL for returning after login
      const callbackUrl = encodeURIComponent(pathname);
      router.replace(`/signin?callbackUrl=${callbackUrl}`);
    }
  }, [isLoaded, isSignedIn, router, pathname]);

  // Show loading spinner when auth is not loaded or when redirecting
  if (!isLoaded || isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If we get here, user is authenticated
  return <>{children}</>;
}