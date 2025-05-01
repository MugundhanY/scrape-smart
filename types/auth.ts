import { User } from "@prisma/client";
import { Session } from "next-auth";
import type { LiteralUnion } from "next-auth/react";

// Define provider types directly instead of importing them
type BuiltInProviderType = "google" | "github" | "facebook" | "twitter" | "auth0" | "credentials" | "email";

export interface AuthResult {
  userId: string | null;
  sessionId: string | null;
  session: any;
  user: Session["user"] | null;
  protect: () => Promise<Session>;
}

// Define a custom sign-in options interface that matches what we need
export interface CustomSignInOptions {
  provider?: LiteralUnion<BuiltInProviderType, string>;
  callbackUrl?: string;
  redirect?: boolean;
  email?: string;
  password?: string;
}

export interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  sessionId: string | null;
  user: Session["user"] | null;
  signIn: (options?: CustomSignInOptions) => Promise<any>;
  signOut: () => Promise<any>;
  updateUserData: (userData: Partial<Session['user']>) => Promise<any>;
}

export interface AuthMiddlewareResult {
  userId: string | null;
  sessionId: string | null;
  session: any | null;
  authenticated: boolean;
}