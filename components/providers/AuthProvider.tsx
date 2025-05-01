"use client";

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { 
  signIn as nextAuthSignIn, 
  signOut, 
  useSession, 
  SessionProvider
} from "next-auth/react";
import { AuthContextType, CustomSignInOptions } from "@/types/auth";
import { Session } from "next-auth";

const AuthContext = createContext<AuthContextType>({
  isLoaded: false,
  isSignedIn: false,
  userId: null,
  sessionId: null,
  user: null,
  signIn: () => Promise.resolve({}),
  signOut: () => Promise.resolve({}),
  updateUserData: () => Promise.resolve({}),
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: session, status, update: sessionUpdate } = useSession();
  const [user, setUser] = useState<Session['user'] | null>(null);
  
  useEffect(() => {
    if (status !== 'loading') {
      setIsLoaded(true);
      // Update local user state when session changes
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    }
  }, [status, session]);

  // Properly typed signIn function
  const handleSignIn = async (options?: CustomSignInOptions) => {
    if (!options) {
      return nextAuthSignIn();
    }
    
    const { provider, ...rest } = options;
    if (provider) {
      return nextAuthSignIn(provider, rest);
    }
    
    return nextAuthSignIn("credentials", rest);
  };

  // Add function to update user data in the session
  const updateUserData = async (userData: Partial<Session['user']>) => {
    // Update local state immediately for UI response
    if (user) {
      const newUserData = { ...user, ...userData };
      setUser(newUserData);
      
      // Wait a moment to prevent race conditions with Next.js auth state
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Then update the actual session
      return sessionUpdate({
        ...session,
        user: newUserData
      });
    }
    
    // If no user, just update the session
    return sessionUpdate(userData);
  };
  
  const value: AuthContextType = {
    isLoaded,
    isSignedIn: !!user,
    userId: user?.id || null,
    sessionId: user?.id || null,
    user: user || null,
    signIn: handleSignIn,
    signOut: () => signOut({ callbackUrl: '/signin' }),
    updateUserData,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}