
// src/hooks/use-auth.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from '@/lib/firebase';
import { useToast } from './use-toast';
import { createUserProfile, getUserProfile } from '@/lib/firestore';
import * as z from 'zod';

const authCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string().optional(),
});

export type AuthCredentials = z.infer<typeof authCredentialsSchema>;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailPassword: (credentials: AuthCredentials) => Promise<void>;
  signUpWithEmailPassword: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUserCreation = async (user: User, displayName?: string | null) => {
    const userProfile = await getUserProfile(user.uid);
    if (!userProfile) {
      await createUserProfile(user, displayName);
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserCreation(result.user, result.user.displayName);
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message,
      });
      throw error;
    } finally {
        // We don't setLoading(false) here because the onAuthStateChanged listener will do it.
    }
  };

  const signUpWithEmailPassword = async (credentials: AuthCredentials) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      await updateProfile(result.user, {
        displayName: credentials.name
      })
      await handleUserCreation(result.user, credentials.name);
    } catch (error: any) {
       console.error("Error signing up: ", error);
       toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
      throw error;
    } finally {
        // We don't setLoading(false) here because the onAuthStateChanged listener will do it.
    }
  }

  const signInWithEmailPassword = async (credentials: AuthCredentials) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error: any) {
       console.error("Error signing in: ", error);
       toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message,
      });
      throw error;
    } finally {
        // We don't setLoading(false) here because the onAuthStateChanged listener will do it.
    }
  }


  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error("Error signing out: ", error);
       toast({
        variant: 'destructive',
        title: 'Sign Out Failed',
        description: error.message,
      })
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmailPassword, signUpWithEmailPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
