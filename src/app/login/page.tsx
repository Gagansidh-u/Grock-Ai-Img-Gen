
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { AuthDialog } from '@/components/auth-dialog';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(true);

  useEffect(() => {
    // If user is logged in, redirect to generator page
    if (!loading && user) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect') || '/generate';
      router.replace(redirectUrl);
    }
    // If the user closes the dialog, redirect them to the home page.
    if (!isAuthDialogOpen && !user) {
        router.replace('/');
    }
  }, [user, loading, router, isAuthDialogOpen]);

  // Render a loading spinner while checking auth state or if user is logged in
  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not logged in, show the auth dialog
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </div>
  );
}
