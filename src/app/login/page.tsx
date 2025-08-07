
"use client";

import React, { useEffect, Suspense } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GrockLogo } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

// Define a simple SVG for Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.23,4.14-4.082,5.571l6.19,5.238C39.99,34.556,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

function LoginPageContent() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  useEffect(() => {
    if (!loading && user) {
      const redirectUrl = searchParams.get('redirect') || '/generate';
      router.push(redirectUrl);
    }
  }, [user, loading, router, searchParams]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn();
      // The useEffect will handle redirection on successful sign-in
    } catch (error) {
      console.error("Sign in failed", error);
    } finally {
        // Don't set isSigningIn to false here, because redirection will happen
    }
  };


  if (loading || user) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Please wait...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-4 left-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                <GrockLogo className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tighter">
                Grock AI
              </h1>
            </Link>
        </div>
        <Card className="w-full max-w-sm shadow-2xl shadow-primary/10">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>Sign in to continue to Grock AI Image Generator.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button 
                    variant="outline" 
                    className="w-full h-11"
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                >
                    {isSigningIn ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <GoogleIcon className="mr-2 h-5 w-5" />
                    )}
                    Sign in with Google
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex flex-col min-h-screen bg-background items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
      <LoginPageContent />
    </Suspense>
  )
}
