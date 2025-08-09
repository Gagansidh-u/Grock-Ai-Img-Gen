
// src/lib/firestore.ts
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  plan: 'Free' | 'Basic' | 'Standard' | 'Pro';
  monthlyImageCredits: number;
  monthlyPlanRenewalDate: Timestamp;
  dailyImageCredits: number;
  lastDailyReset: Timestamp;
  createdAt: any;
  updatedAt: any;
}

export const getCreditsForPlan = (plan: UserProfile['plan']) => {
    switch (plan) {
        case 'Pro': return { monthly: 775, daily: 25 };
        case 'Standard': return { monthly: 250, daily: 15 };
        case 'Basic': return { monthly: 100, daily: 10 };
        default: return { monthly: 8, daily: 8 }; // Free plan
    }
}

// Create a new user profile in Firestore
export const createUserProfile = async (user: User, displayName?: string | null): Promise<void> => {
  const userRef = doc(db, 'users', user.uid);
  const monthlyRenewalDate = new Date();
  monthlyRenewalDate.setMonth(monthlyRenewalDate.getMonth() + 1);
  const credits = getCreditsForPlan('Free');

  const userProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
    uid: user.uid,
    email: user.email,
    displayName: displayName || user.displayName || 'TryQuad User',
    plan: 'Free',
    monthlyImageCredits: credits.monthly,
    monthlyPlanRenewalDate: Timestamp.fromDate(monthlyRenewalDate),
    dailyImageCredits: credits.daily,
    lastDailyReset: Timestamp.now(),
  };
  await setDoc(userRef, {
    ...userProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// Backfill missing fields for an existing user
export const updateUserProfileFields = async (uid: string, plan: UserProfile['plan'], displayName?: string | null): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    const existingData = docSnap.data() as UserProfile | undefined;

    const updates: Partial<UserProfile> = {
        updatedAt: serverTimestamp(),
    };

    if (!existingData) return;

    if (!existingData.plan) {
        const credits = getCreditsForPlan(plan);
        const monthlyRenewalDate = new Date();
        monthlyRenewalDate.setMonth(monthlyRenewalDate.getMonth() + 1);
        updates.plan = plan;
        updates.monthlyImageCredits = credits.monthly;
        updates.monthlyPlanRenewalDate = Timestamp.fromDate(monthlyRenewalDate);
        updates.dailyImageCredits = credits.daily;
        updates.lastDailyReset = Timestamp.now();
    }
    
    if (displayName && !existingData.displayName) {
        updates.displayName = displayName;
    }
    

    if (Object.keys(updates).length > 1) { // Only update if there are changes
      await updateDoc(userRef, updates);
    }
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
        monthlyImageCredits: increment(-count),
        dailyImageCredits: increment(-count),
        updatedAt: serverTimestamp()
    });
};


// Update user plan and reset credits
export const updateUserPlan = async (uid: string, plan: UserProfile['plan']): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    const credits = getCreditsForPlan(plan);
    const monthlyRenewalDate = new Date();
    monthlyRenewalDate.setMonth(monthlyRenewalDate.getMonth() + 1);

    await updateDoc(userRef, {
        plan: plan,
        monthlyImageCredits: credits.monthly,
        monthlyPlanRenewalDate: Timestamp.fromDate(monthlyRenewalDate),
        dailyImageCredits: credits.daily,
        lastDailyReset: Timestamp.now(),
        updatedAt: serverTimestamp()
    });
};

// Reset only daily credits
export const resetDailyCredits = async (uid: string, plan: UserProfile['plan']): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    const credits = getCreditsForPlan(plan);
    await updateDoc(userRef, {
        dailyImageCredits: credits.daily,
        lastDailyReset: Timestamp.now(),
        updatedAt: serverTimestamp()
    });
};

// Reset monthly credits (and daily)
export const resetMonthlyCredits = async (uid: string, plan: UserProfile['plan']): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    const credits = getCreditsForPlan(plan);
    const monthlyRenewalDate = new Date();
    monthlyRenewalDate.setMonth(monthlyRenewalDate.getMonth() + 1);

    await updateDoc(userRef, {
        monthlyImageCredits: credits.monthly,
        monthlyPlanRenewalDate: Timestamp.fromDate(monthlyRenewalDate),
        dailyImageCredits: credits.daily,
        lastDailyReset: Timestamp.now(),
        updatedAt: serverTimestamp()
    });
};
