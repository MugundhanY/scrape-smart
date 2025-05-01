import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { 
  getUserByEmail, 
  verifyPassword,
  getUserById,
  createUserAccount,
  createUser
} from "@/lib/auth/prisma-auth";

// Create a custom adapter using our server-only functions
const customAdapter = {
  createUser: async (data: any) => {
    const { email, name } = data;
    const user = await createUser({ email, name, password: Math.random().toString(36) });
    
    // Initialize user with free credits when a new user is created
    await prisma.userBalance.create({
      data: {
        userId: user.id,
        credits: 100,
      },
    });
    
    return user;
  },
  getUser: async (id: string) => {
    return getUserById(id);
  },
  getUserByEmail: async (email: string) => {
    return getUserByEmail(email);
  },
  getUserByAccount: async ({ provider, providerAccountId }: { provider: string, providerAccountId: string }) => {
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId
        }
      },
      include: { user: true }
    });
    return account?.user ?? null;
  },
  updateUser: async (data: any) => {
    const { id, ...userData } = data;
    return prisma.user.update({
      where: { id },
      data: userData
    });
  },
  linkAccount: async (data: any) => {
    return createUserAccount(data);
  },
  createSession: async (data: any) => {
    return prisma.session.create({ data });
  },
  getSessionAndUser: async (sessionToken: string) => {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true }
    });
    if (!session) return null;
    return {
      session,
      user: session.user
    };
  },
  updateSession: async (data: any) => {
    const { sessionToken, ...rest } = data;
    return prisma.session.update({
      where: { sessionToken },
      data: rest
    });
  },
  deleteSession: async (sessionToken: string) => {
    return prisma.session.delete({
      where: { sessionToken }
    });
  },
  createVerificationToken: async (data: any) => {
    return prisma.verificationToken.create({ data });
  },
  useVerificationToken: async ({ identifier, token }: { identifier: string, token: string }) => {
    try {
      return await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier,
            token
          }
        }
      });
    } catch (error) {
      return null;
    }
  },
};

export const authOptions: NextAuthOptions = {
  adapter: customAdapter as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await getUserByEmail(credentials.email);

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isPasswordValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return user;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
    signOut: "/signin",
    error: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async signIn({ user, account }) {
      try {
        // Only handle Google sign-ins - standard credentials are handled differently
        if (account?.provider === "google" && user?.id) {
          // Check if user already has a balance
          const existingBalance = await prisma.userBalance.findUnique({
            where: { userId: user.id },
          });
          
          // If user doesn't have a balance yet, create one with 100 free credits
          if (!existingBalance) {
            await prisma.userBalance.create({
              data: {
                userId: user.id,
                credits: 100,
              },
            });
          }
        }
        return true;
      } catch (error) {
        console.error("Error during sign-in callback:", error);
        return true; // Still allow sign-in even if credit allocation fails
      }
    }
  }
};