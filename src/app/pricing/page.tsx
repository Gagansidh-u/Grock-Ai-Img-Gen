
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Gem, CheckCircle, Loader2 } from 'lucide-react';
import { GrockLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUserData } from '@/hooks/use-user-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import useRazorpay from "react-razorpay";
import { createOrder } from '@/lib/razorpay';
import { useToast } from '@/hooks/use-toast';
import { updateUserPlan, UserProfile } from '@/lib/firestore';


const plans = [
    {
        name: 'Free',
        price: 0,
        pricePeriod: '/ month',
        description: 'For individuals starting out.',
        features: [
            '8 image generations per month',
            'Basic image quality',
            'Community support',
        ],
        cta: 'Current Plan',
        isPrimary: false,
    },
    {
        name: 'Basic',
        price: 12,
        pricePeriod: '/ month',
        description: '100 image credits.',
        features: [
            '100 image credits per month',
            'Standard image quality',
            'Access to all styles',
            'Email support',
        ],
        cta: 'Upgrade',
        isPrimary: false,
    },
    {
        name: 'Standard',
        price: 22,
        pricePeriod: '/ month',
        description: '250 image credits.',
        features: [
            '250 image credits per month',
            'High-resolution images',
            'Priority generation queue',
            'Priority support',
        ],
        cta: 'Upgrade',
        isPrimary: true,
    },
    {
        name: 'Pro',
        price: 32,
        pricePeriod: '/ month',
        description: 'Unlimited credits.',
        features: [
            'Unlimited image credits',
            'Highest quality & resolution',
            'Dedicated account manager',
            'API access (coming soon)',
        ],
        cta: 'Upgrade',
        isPrimary: false,
    }
]


export default function PricingPage() {
  const { user, loading } = useAuth();
  const { userData, loading: userDataLoading } = useUserData();
  const router = useRouter();
  const [Razorpay] = useRazorpay();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);

  const handlePayment = async (plan: typeof plans[number]) => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }
    
    setIsProcessing(plan.name);

    try {
      const order = await createOrder({ amount: plan.price * 100, currency: 'INR' });
      if (!order) {
        throw new Error('Order creation failed');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount.toString(),
        currency: order.currency,
        name: "Grock AI",
        description: `Payment for ${plan.name} Plan`,
        order_id: order.id,
        handler: async (response: any) => {
          await updateUserPlan(user.uid, plan.name as UserProfile['plan']);
          toast({
            title: "Payment Successful",
            description: `You have successfully upgraded to the ${plan.name} plan.`,
          });
        },
        prefill: {
            name: user.displayName || '',
            email: user.email || '',
        },
        theme: {
            color: "#6D28D9"
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed: ", error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'There was a problem with the payment. Please try again.',
      });
    } finally {
        setIsProcessing(null);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading plans...</p>
      </div>
    );
  }

  return (
     <SidebarProvider>
      <Sidebar>
        <SidebarRail />
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-lg">
              <GrockLogo className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tighter">
              Grock AI
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/generate">
                  <Home />
                  Generator
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/pricing">
                  <Gem />
                  Pricing
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {user &&
            (userDataLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : userData ? (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.photoURL || ''}
                    alt={user.displayName || 'User'}
                  />
                  <AvatarFallback>
                    {user.displayName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userData.imagesGenerated} images used
                  </p>
                </div>
              </div>
            ) : null)}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-background">
          <Header />
          <main className="flex-1 flex flex-col items-center p-4 md:py-24">
            <div className="container mx-auto max-w-6xl w-full animate-in">
              <div className="flex flex-col gap-8">
                <div className="text-center flex flex-col gap-2">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Choose Your Plan
                  </h1>
                  <p className="text-muted-foreground md:text-lg">
                    Simple, transparent pricing for everyone.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {plans.map((plan) => (
                    <Card
                      key={plan.name}
                      className={cn(
                        'flex flex-col',
                        plan.isPrimary &&
                          'border-primary shadow-lg shadow-primary/10'
                      )}
                    >
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="mb-6">
                          <span className="text-4xl font-bold">
                            ₹{plan.price}
                          </span>
                          <span className="text-muted-foreground">
                            {plan.pricePeriod}
                          </span>
                        </div>
                        <ul className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          disabled={userData?.plan === plan.name || !!isProcessing}
                          variant={plan.isPrimary ? 'default' : 'secondary'}
                          onClick={() => handlePayment(plan)}
                        >
                           {isProcessing === plan.name ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                           ) : userData?.plan === plan.name ? 'Current Plan' : plan.cta}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

    