
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

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

interface AuthDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signInWithGoogle, signInWithEmailPassword, signUpWithEmailPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuthAction = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (authMode === 'signin') {
        await signInWithEmailPassword(values);
      } else {
        await signUpWithEmailPassword(values);
      }
      onOpenChange(false); // Close dialog on success
    } catch (error) {
       console.error(`${authMode} failed`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onOpenChange(false); // Close dialog on success
    } catch (error) {
      console.error("Sign in with Google failed", error);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md p-0">
             <Card className="w-full border-none shadow-none">
                <DialogHeader className="p-6 pb-2">
                    <CardTitle className="text-2xl text-center">{authMode === 'signin' ? 'Welcome Back' : 'Create an Account'}</CardTitle>
                    <CardDescription className="text-center">
                      {authMode === 'signin' 
                        ? 'Sign in to continue to TryQuad AI.' 
                        : 'Fill in the details to create your account.'}
                    </CardDescription>
                </DialogHeader>
                <CardContent className="flex flex-col gap-4 p-6 pt-2">
                   <Form {...form}>
                     <form onSubmit={form.handleSubmit(handleAuthAction)} className="space-y-4">
                       <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="name@example.com" {...field} disabled={isSubmitting} />
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
                                <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                        </Button>
                     </form>
                   </Form>
                  
                   <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">
                          Or continue with
                          </span>
                      </div>
                    </div>

                    <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleGoogleSignIn}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <GoogleIcon className="mr-2 h-5 w-5" />
                        )}
                        Google
                    </Button>
                    
                     <p className="text-center text-sm text-muted-foreground">
                        {authMode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
                        <Button variant="link" onClick={toggleAuthMode} className="p-0 h-auto" disabled={isSubmitting}>
                            {authMode === 'signin' ? "Sign Up" : "Sign In"}
                        </Button>
                    </p>
                </CardContent>
            </Card>
        </DialogContent>
    </Dialog>
  );
}

    