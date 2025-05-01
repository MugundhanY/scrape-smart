import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Session } from "next-auth";

// Update the type to allow null or undefined user
interface ServerAuthProps {
  children: ReactNode | (({ user }: { user: Session["user"] | null | undefined }) => ReactNode);
  fallback?: ReactNode;
  redirectUrl?: string;
}

/**
 * A server component that provides authentication state and protection for server components
 */
export async function ServerAuth({ 
  children, 
  fallback, 
  redirectUrl = "/signin" 
}: ServerAuthProps) {
  const session = await auth();
  
  if (!session.userId) {
    if (redirectUrl) {
      redirect(redirectUrl);
    }
    return fallback || null;
  }
  
  // If children is a function, pass the user data to it
  if (typeof children === 'function') {
    return children({ user: session.user });
  }
  
  // Otherwise, just render the children
  return <>{children}</>;
}