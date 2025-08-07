// src/lib/firestore.ts
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  plan: 'Free' | 'Basic' | 'Standard' | 'Pro';
  imagesGenerated: number;
  createdAt: any;
  updatedAt: any;
}

// Create a new user profile in Firestore
export const createUserProfile = async (user: User): Promise<void> => {
  const userRef = doc(db, 'users', user.uid);
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    plan: 'Free',
    imagesGenerated: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(userRef, userProfile);
};

// Get a user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

// Update user image generation count
export const updateImageCount = async (uid: string, count: number): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        imagesGenerated: increment(count),
        updatedAt: serverTimestamp()
    });
};

// Update user plan
export const updateUserPlan = async (uid: string, plan: UserProfile['plan']): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        plan: plan,
        updatedAt: serverTimestamp()
    });
};
