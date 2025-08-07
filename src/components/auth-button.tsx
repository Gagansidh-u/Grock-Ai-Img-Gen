
// src/components/auth-button.tsx
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AuthButton() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
        <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className='flex flex-col gap-2'>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-28" />
            </div>
        </div>
    )
  }

  if (!user) {
    return <Button onClick={() => router.push('/login')} className="w-full">Login</Button>;
  }

  return (
    <div className="flex items-center justify-between w-full">
        <div className='flex items-center gap-3'>
            <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback>
                <UserIcon />
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <p className="text-sm font-medium leading-none truncate">{user.displayName || 'Grock User'}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
                </p>
            </div>
        </div>
        <Button variant="ghost" size="icon" onClick={signOut} className="h-9 w-9 shrink-0">
          <LogOut className="h-4 w-4" />
        </Button>
    </div>
  );
}
