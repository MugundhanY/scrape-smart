import NextAuth from "next-auth/next";
import { authOptions } from "./auth-options";

// Create the NextAuth handler with our server-only auth options
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };