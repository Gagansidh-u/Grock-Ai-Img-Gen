
// src/lib/firestore.ts
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  plan: 'Free' | 'Basic' | 'Standard' | 'Pro';
  imageCredits: number;
  planRenewalDate: Timestamp;
  createdAt: any;
  updatedAt: any;
}

// Create a new user profile in Firestore
export const createUserProfile = async (user: User, displayName?: string | null): Promise<void> => {
  const userRef = doc(db, 'users', user.uid);
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);

  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: displayName || user.displayName,
    plan: 'Free',
    imageCredits: 8,
    planRenewalDate: Timestamp.fromDate(renewalDate),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(userRef, userProfile);
};

// Backfill missing fields for an existing user
export const updateUserProfileFields = async (uid: string): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    const defaultFields = {
        plan: 'Free',
        imageCredits: 8,
        planRenewalDate: Timestamp.fromDate(renewalDate),
        updatedAt: serverTimestamp(),
    };
    // Use set with merge:true to add new fields without overwriting existing ones
    await setDoc(userRef, defaultFields, { merge: true });
}

// Get a user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

// Update user image generation count by decrementing
export const updateImageCount = async (uid: string, count: number): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        imageCredits: increment(-count),
        updatedAt: serverTimestamp()
    });
};

const getCreditsForPlan = (plan: UserProfile['plan']) => {
    switch (plan) {
        case 'Basic': return 100;
        case 'Standard': return 250;
        case 'Pro': return Infinity; // Using Infinity for Pro plan
        default: return 8; // Free plan
    }
}

// Update user plan and reset credits
export const updateUserPlan = async (uid: string, plan: UserProfile['plan']): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    const newCredits = getCreditsForPlan(plan);
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    await updateDoc(userRef, {
        plan: plan,
        imageCredits: newCredits,
        planRenewalDate: Timestamp.fromDate(renewalDate),
        updatedAt: serverTimestamp()
    });
};

// Reset credits for a user
export const resetUserCredits = async (uid: string, plan: UserProfile['plan']): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    const newCredits = getCreditsForPlan(plan);
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    await updateDoc(userRef, {
        imageCredits: newCredits,
        planRenewalDate: Timestamp.fromDate(renewalDate),
        updatedAt: serverTimestamp()
    });
};
