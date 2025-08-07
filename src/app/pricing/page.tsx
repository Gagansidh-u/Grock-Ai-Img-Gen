
"use client";

import React from 'react';
import Script from 'next/script';
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
import { createOrder } from '@/lib/razorpay';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';

const plans = [
    {
        name: 'Free',
        price: 0,
        pricePeriod: '/ month',
        description: 'For individuals starting out.',
        features: [
            '25 image generations per month',
            'Basic image quality',
            'Community support',
        ],
        cta: 'Current Plan',
        isPrimary: false,
    },
    {
        name: 'Basic',
        price: 10,
        pricePeriod: '/ month',
        description: 'For hobbyists and frequent users.',
        features: [
            '250 image generations per month',
            'Standard image quality',
            'Access to all styles',
            'Email support',
        ],
        cta: 'Upgrade to Basic',
        isPrimary: false,
    },
    {
        name: 'Standard',
        price: 25,
        pricePeriod: '/ month',
        description: 'For professionals and power users.',
        features: [
            '1000 image generations per month',
            'High-resolution images',
            'Priority generation queue',
            'Priority support',
        ],
        cta: 'Upgrade to Standard',
        isPrimary: true,
    },
    {
        name: 'Pro',
        price: 60,
        pricePeriod: '/ month',
        description: 'For businesses and creative agencies.',
        features: [
            'Unlimited image generations',
            'Highest quality & resolution',
            'Dedicated account manager',
            'API access (coming soon)',
        ],
        cta: 'Upgrade to Pro',
        isPrimary: false,
    }
]


export default function PricingPage() {
  const { user, loading } = useAuth();
  const { userData, loading: userDataLoading } = useUserData();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);


  const handlePayment = async (planName: string, amount: number) => {
    if (!user) {
        router.push('/login?redirect=/pricing');
        return;
    }
    setIsProcessing(planName);

    try {
        const order = await createOrder({ amount, currency: 'INR' });

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Grock AI",
            description: `Upgrade to ${planName} Plan`,
            order_id: order.id,
            handler: function (response: any) {
                // Here you would typically verify the payment signature on your backend
                // and then update the user's plan in Firestore.
                // For now, we'll just show a success message.
                console.log(response);
                toast({
                    title: "Payment Successful!",
                    description: `You have successfully upgraded to the ${planName} plan.`,
                });
                // Example: await updateUserPlan(user.uid, planName);
            },
            prefill: {
                name: user.displayName || '',
                email: user.email || '',
            },
            theme: {
                color: "#8A2BE2"
            }
        };
        
        const rzp = new (window as any).Razorpay(options);
        rzp.open();

        rzp.on('payment.failed', function (response: any){
            console.error(response);
            toast({
                variant: 'destructive',
                title: 'Payment Failed',
                description: 'Something went wrong. Please try again.',
            });
        });

    } catch (error) {
        console.error("Payment Error: ", error);
        toast({
            variant: 'destructive',
            title: 'Oh no! Something went wrong.',
            description: 'Could not initiate the payment process. Please try again later.',
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
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <div className="flex flex-col min-h-screen bg-background">
           <Header/>
          <main className="flex-1 flex flex-col items-center p-4 md:py-24">
            <div className="container mx-auto max-w-6xl w-full animate-in">
              <div className="flex flex-col gap-8">
                 <div className='text-center flex flex-col gap-2'>
                    <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>Choose Your Plan</h1>
                    <p className='text-muted-foreground md:text-lg'>Simple, transparent pricing for everyone.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={cn("flex flex-col", plan.isPrimary && "border-primary shadow-lg shadow-primary/10")}>
                            <CardHeader>
                                <CardTitle>{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">${plan.price}</span>
                                    <span className="text-muted-foreground">{plan.pricePeriod}</span>
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
                                    disabled={userData?.plan === plan.name || isProcessing !== null} 
                                    variant={plan.isPrimary ? 'default' : 'secondary'}
                                    onClick={() => handlePayment(plan.name, plan.price)}
                                >
                                    {isProcessing === plan.name ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
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
      </>
  )
}
