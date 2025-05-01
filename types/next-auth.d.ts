import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Extending the built-in Session type to include id
   */
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }

  /**
   * Extending the built-in User type to include id
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}