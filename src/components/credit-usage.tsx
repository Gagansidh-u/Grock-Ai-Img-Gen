
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useUserData } from '@/hooks/use-user-data';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from './ui/skeleton';
import { getCreditsForPlan } from '@/lib/firestore';

export function CreditUsage() {
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: userDataLoading } = useUserData();

  const getPlanDetails = () => {
    const plan = userData?.plan || 'Free';
    return getCreditsForPlan(plan);
  };
  
  if (authLoading || (user && userDataLoading)) {
    return (
        <Card className="p-3 bg-card/50 flex flex-col gap-2 border-0 shadow-none">
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full mb-2" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
        </Card>
    )
  }

  const planDetails = getPlanDetails();
  const monthlyCredits = userData?.monthlyImageCredits ?? planDetails.monthly;
  const dailyCredits = userData?.dailyImageCredits ?? planDetails.daily;

  const monthlyProgress = planDetails.monthly === Infinity ? 100 : (monthlyCredits / planDetails.monthly) * 100;
  const dailyProgress = (dailyCredits / planDetails.daily) * 100;

  return (
    <Card className="p-3 bg-card/50 flex flex-col gap-2 border-0 shadow-none">
        <div className="flex justify-between items-center text-xs">
            <span className="font-medium">Monthly Credits</span>
            <span className="text-muted-foreground">
            {planDetails.monthly === Infinity ? `∞` : `${monthlyCredits} / ${planDetails.monthly}`}
            </span>
        </div>
        <Progress value={monthlyProgress} className="h-1.5" />

        <div className="flex justify-between items-center text-xs mt-2">
            <span className="font-medium">Daily Credits</span>
            <span className="text-muted-foreground">
             {`${dailyCredits} / ${planDetails.daily}`}
            </span>
        </div>
        <Progress value={dailyProgress} className="h-1.5" />
    </Card>
  );
}

    