
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
      switch (userData.plan) {
        case 'Free': return { name: 'Free', limit: 8, used: userData.imagesGenerated };
        case 'Basic': return { name: 'Basic', limit: 100, used: userData.imagesGenerated };
        case 'Standard': return { name: 'Standard', limit: 250, used: userData.imagesGenerated };
        case 'Pro': return { name: 'Pro', limit: Infinity, used: userData.imagesGenerated };
        default: return { name: 'Free', limit: 8, used: userData.imagesGenerated };
      }
    }
    // Default for non-logged-in users
    return { name: 'Free', limit: 8, used: 0 };
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

  const { name: planName, limit: imageLimit, used: imagesUsed } = getPlanDetails();
  
  const progressPercentage = imageLimit === Infinity ? 100 : (imagesUsed / imageLimit) * 100;

  return (
    <Card className="p-3 bg-card/50 flex flex-col gap-2 border-0 shadow-none">
        <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{planName} Plan</span>
            <span className="text-sm text-muted-foreground">
            {imageLimit === Infinity ? `${imagesUsed} / ∞` : `${imagesUsed} / ${imageLimit}`}
            </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
    </Card>
  );
}
