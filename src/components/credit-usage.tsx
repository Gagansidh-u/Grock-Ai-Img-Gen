
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useUserData } from '@/hooks/use-user-data';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from './ui/skeleton';

export function CreditUsage() {
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: userDataLoading } = useUserData();

  const getPlanDetails = () => {
    if (user && userData) {
      const planLimits = {
        'Free': 8,
        'Basic': 100,
        'Standard': 250,
        'Pro': Infinity,
      }
      return { 
        name: userData.plan, 
        limit: planLimits[userData.plan] || 8, 
        used: (planLimits[userData.plan] || 8) - userData.imageCredits
      };
    }
    // Default for non-logged-in users
    return { name: 'Free', limit: 8, used: 0, current: 8 };
  };
  
  if (authLoading || (user && userDataLoading)) {
    return (
        <Card className="p-3 bg-card/50 flex flex-col gap-2 border-0 shadow-none">
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full" />
        </Card>
    )
  }

  const { name: planName, limit: imageLimit } = getPlanDetails();
  const imageCredits = userData?.imageCredits ?? 8;
  const progressPercentage = imageLimit === Infinity ? 100 : (imageCredits / imageLimit) * 100;

  return (
    <Card className="p-3 bg-card/50 flex flex-col gap-2 border-0 shadow-none">
        <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{planName} Plan</span>
            <span className="text-sm text-muted-foreground">
            {imageLimit === Infinity ? `∞ Credits` : `${imageCredits} / ${imageLimit}`}
            </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
    </Card>
  );
}
