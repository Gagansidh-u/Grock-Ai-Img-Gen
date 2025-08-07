
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
  signOut as firebaseSignOut
} from '@/lib/firebase';
import { useToast } from './use-toast';
import { createUserProfile, getUserProfile } from '@/lib/firestore';
import * as z from 'zod';

const authCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
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

  const handleUserCreation = async (user: User) => {
    const userProfile = await getUserProfile(user.uid);
    if (!userProfile) {
      await createUserProfile(user);
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserCreation(result.user);
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message,
      });
      throw error;
    } finally {
        setLoading(false);
    }
  };

  const signUpWithEmailPassword = async (credentials: AuthCredentials) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      await handleUserCreation(result.user);
    } catch (error: any) {
       console.error("Error signing up: ", error);
       toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
      throw error;
    } finally {
        setLoading(false);
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
        setLoading(false);
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
