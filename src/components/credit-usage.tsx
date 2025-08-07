
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useUserData } from '@/hooks/use-user-data';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from './ui/skeleton';

export function CreditUsage() {
  const { user } = useAuth();
  const { userData, loading: userDataLoading } = useUserData();

  const getPlanLimit = () => {
    if (!userData) return 8; // Default for non-logged-in or new users
    switch (userData.plan) {
      case 'Free': return 8;
      case 'Basic': return 100;
      case 'Standard': return 250;
      case 'Pro': return Infinity;
      default: return 8;
    }
  };

  if (userDataLoading) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
        </div>
    )
  }

  if (!user || !userData) {
    return null;
  }
  
  const imagesUsed = userData.imagesGenerated ?? 0;
  const imageLimit = getPlanLimit();
  const progressPercentage = imageLimit === Infinity ? 100 : (imagesUsed / imageLimit) * 100;

  return (
    <Card className="p-3 bg-card/50 flex flex-col gap-2 border-0 shadow-none">
        <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{userData.plan} Plan</span>
            <span className="text-sm text-muted-foreground">
            {imageLimit === Infinity ? 'Unlimited' : `${imagesUsed} / ${imageLimit}`}
            </span>
        </div>
        <Progress value={progressPercentage} />
    </Card>
  );
}
