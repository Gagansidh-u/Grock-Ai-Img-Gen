
// src/hooks/use-user-data.ts
import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserProfile, resetDailyCredits, resetMonthlyCredits } from '@/lib/firestore';

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    if (user) {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      unsubscribe = onSnapshot(userRef, async (docSnap) => {
        if (docSnap.exists()) {
          const profile = docSnap.data() as UserProfile;
          const now = new Date();
          
          const monthlyRenewalDate = profile.monthlyPlanRenewalDate.toDate();
          if (now >= monthlyRenewalDate) {
              await resetMonthlyCredits(user.uid, profile.plan);
              // The listener will pick up the changes, so we don't set state here.
              return; // Exit to avoid processing old data
          }
          
          const dailyResetDate = profile.lastDailyReset.toDate();
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (dailyResetDate < startOfToday) {
              await resetDailyCredits(user.uid, profile.plan);
              // The listener will pick up the changes.
              return; // Exit to avoid processing old data
          }
          
          setUserData(profile);

        } else {
          setUserData(null);
        }
        setLoading(false);
      });
    } else {
      setUserData(null);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  return { userData, loading };
};

    