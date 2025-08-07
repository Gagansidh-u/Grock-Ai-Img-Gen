
"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Gem, CheckCircle, Loader2 } from 'lucide-react';
import { GrockLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import useRazorpay from "react-razorpay";
import { createOrder } from '@/lib/razorpay';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { updateUserPlan, UserProfile } from '@/lib/firestore';
import { AuthButton } from '@/components/auth-button';
import { useUserData } from '@/hooks/use-user-data';

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
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);
  const Razorpay = useRazorpay();
  const { toast } = useToast();
  const { user } = useAuth();
  const { userData } = useUserData();
  const router = useRouter();

  const handlePayment = async (plan: typeof plans[0]) => {
    setLoadingPlan(plan.name);
    try {
      const order = await createOrder({
        amount: plan.price * 100, // Amount in paise
        currency: 'INR',
      });
      
      if (!order) {
        throw new Error('Order creation failed');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: 'Grock AI',
        description: `${plan.name} Plan`,
        order_id: order.id,
        handler: async (response: any) => {
          if (user) {
            await updateUserPlan(user.uid, plan.name as UserProfile['plan']);
          }
          toast({
            title: 'Payment Successful!',
            description: `You have successfully upgraded to the ${plan.name} plan.`,
          });
          if(user) {
            router.push('/generate');
          }
        },
        prefill: {
          name: user?.displayName || 'Anonymous User',
          email: user?.email || '',
        },
        theme: {
          color: '#8A2BE2',
        },
      };
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast({
          variant: 'destructive',
          title: 'Payment Failed',
          description: response.error.description,
        });
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not initiate payment. Please try again.',
      });
    } finally {
      setLoadingPlan(null);
    }
  };


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
        <SidebarFooter className="p-2">
            <AuthButton />
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
                          disabled={loadingPlan === plan.name || userData?.plan === plan.name}
                          variant={plan.isPrimary ? 'default' : 'secondary'}
                          onClick={() => plan.name !== 'Free' && handlePayment(plan)}
                        >
                           {loadingPlan === plan.name ? <Loader2 className="animate-spin" /> : (userData?.plan === plan.name ? 'Current Plan' : plan.cta)}
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
