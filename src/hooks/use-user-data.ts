// src/hooks/use-user-data.ts
import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserProfile, resetUserCredits } from '@/lib/firestore';

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    if (user) {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const profile = docSnap.data() as UserProfile;
          
          // Check for monthly credit reset
          const now = new Date();
          const renewalDate = profile.planRenewalDate.toDate();
          if (now > renewalDate) {
              // Reset credits if renewal date has passed
              resetUserCredits(user.uid, profile.plan).then(() => {
                  // The onSnapshot listener will pick up the change automatically
              });
          } else {
             setUserData(profile);
          }

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
