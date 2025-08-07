
"use client";

import React, { useEffect, Suspense, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GrockLogo } from '@/components/icons';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.23,4.14-4.082,5.571l6.19,5.238C39.99,34.556,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);


function LoginPageContent() {
  const { user, loading, signInWithGoogle, signInWithEmailPassword, signUpWithEmailPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!loading && user) {
      const redirectUrl = searchParams.get('redirect') || '/generate';
      router.push(redirectUrl);
    }
  }, [user, loading, router, searchParams]);
  
  const handleAuthAction = async (values: z.infer<typeof formSchema>) => {
    setIsSigningIn(true);
    try {
      if (authMode === 'signin') {
        await signInWithEmailPassword(values);
      } else {
        await signUpWithEmailPassword(values);
      }
    } catch (error) {
       console.error(`${authMode} failed`, error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in with Google failed", error);
    } finally {
        setIsSigningIn(false);
    }
  };
  
  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
    form.reset();
  }


  if (loading || user) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 overflow-hidden">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} 
            className="absolute top-4 left-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                <GrockLogo className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tighter">
                Grock AI
              </h1>
            </Link>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="w-full max-w-sm shadow-2xl shadow-primary/10">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{authMode === 'signin' ? 'Welcome Back' : 'Create an Account'}</CardTitle>
                    <CardDescription>
                      {authMode === 'signin' 
                        ? 'Sign in to continue to Grock AI Image Generator.' 
                        : 'Fill in the details to create your account.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                   <Form {...form}>
                     <form onSubmit={form.handleSubmit(handleAuthAction)} className="space-y-4">
                       <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="name@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={isSigningIn}>
                           {isSigningIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                        </Button>
                     </form>
                   </Form>
                  
                   <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                          </span>
                      </div>
                    </div>

                    <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleGoogleSignIn}
                        disabled={isSigningIn}
                    >
                        {isSigningIn && form.formState.isSubmitting ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <GoogleIcon className="mr-2 h-5 w-5" />
                        )}
                        Google
                    </Button>
                    
                     <p className="text-center text-sm text-muted-foreground">
                        {authMode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
                        <Button variant="link" onClick={toggleAuthMode} className="p-0 h-auto">
                            {authMode === 'signin' ? "Sign Up" : "Sign In"}
                        </Button>
                    </p>

                </CardContent>
            </Card>
        </motion.div>
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
