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
import { createUserProfile, getUserProfile, UserProfile, updateUserProfileFields } from '@/lib/firestore';
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

  const handleUserVerification = async (user: User, displayName?: string | null): Promise<UserProfile | null> => {
    let userProfile = await getUserProfile(user.uid);
    if (!userProfile) {
      // Create profile for new user
      await createUserProfile(user, displayName);
      userProfile = await getUserProfile(user.uid);
    } else if (!userProfile.plan || !userProfile.hasOwnProperty('monthlyImageCredits') || !userProfile.hasOwnProperty('dailyImageCredits') || !userProfile.hasOwnProperty('apiKeyNumber')) {
      // Backfill old users with new fields
      await updateUserProfileFields(user.uid, userProfile.plan || 'Free', userProfile.displayName);
      userProfile = await getUserProfile(user.uid);
    }
    return userProfile;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await handleUserVerification(user, user.displayName);
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserVerification(result.user, result.user.displayName);
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
      // Manually update the user object after profile update
      const updatedUser = { ...result.user, displayName: credentials.name };
      await handleUserVerification(updatedUser, credentials.name);
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
      const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      await handleUserVerification(result.user);
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
