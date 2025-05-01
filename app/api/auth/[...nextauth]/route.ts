import NextAuth from "next-auth/next";
import { authOptions } from "./auth-options";

// Re-export authOptions so that it can be imported from this file
export { authOptions };

// Create the NextAuth handler with our server-only auth options
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };