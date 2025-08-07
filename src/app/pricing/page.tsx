
"use client";

import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import { Home, Gem, CheckCircle, Loader2, Download, X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarRail, SidebarSeparator } from '@/components/ui/sidebar';
import { createOrder } from '@/lib/razorpay';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { updateUserPlan, UserProfile } from '@/lib/firestore';
import { AuthButton } from '@/components/auth-button';
import { useUserData } from '@/hooks/use-user-data';
import { motion } from 'framer-motion';
import { Invoice, InvoiceData } from '@/components/invoice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CreditUsage } from '@/components/credit-usage';
import { AuthDialog } from '@/components/auth-dialog';

declare const window: any;

const plans = [
    {
        name: 'Free',
        price: 0,
        pricePeriod: '/ month',
        description: 'For individuals starting out.',
        features: [
            '8 image credits per month',
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
  const [invoiceData, setInvoiceData] = React.useState<InvoiceData | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { userData } = useUserData();
  const router = useRouter();
  const invoiceRef = React.useRef(null);

  const handleDownloadInvoice = () => {
    const input = invoiceRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2, backgroundColor: null }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`invoice-${invoiceData?.orderId}.pdf`);
    });
  };

  const handlePayment = async (plan: typeof plans[0]) => {
    setLoadingPlan(plan.name);

    if (!user) {
      setIsAuthDialogOpen(true);
      setLoadingPlan(null);
      return;
    }

    try {
      const order = await createOrder({
        amount: plan.price * 100, // Amount in paise
        currency: 'INR',
      });

      if (!order || !order.id) {
        throw new Error('Order creation failed');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount.toString(),
        currency: order.currency,
        name: 'TryQuad AI',
        description: `${plan.name} Plan`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await updateUserPlan(user.uid, plan.name as UserProfile['plan']);
            setInvoiceData({
                planName: plan.name,
                amount: plan.price,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                userName: user.displayName || 'TryQuad User',
                userEmail: user.email || '',
                date: new Date(),
            });
          } catch(err) {
            console.error(err);
             toast({
              variant: 'destructive',
              title: 'Update failed',
              description: 'Your payment was successful but we failed to update your plan. Please contact support.',
            });
          }
        },
        prefill: {
          name: user.displayName || 'TryQuad User',
          email: user.email || '',
        },
        theme: {
          color: '#A050F0',
        },
      };

      const rzp = new window.Razorpay(options);

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
     <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
     <SidebarProvider>
      <Sidebar side="left">
        <SidebarRail />
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-lg">
              <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/logo2.png" alt="Logo" width={28} height={28} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tighter">
              TryQuad AI
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
             <SidebarSeparator className="my-2" />
             <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/terms-conditions">
                        <ShieldAlert />
                        Terms & Conditions
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/privacy-policy">
                        <ShieldAlert />
                        Privacy Policy
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/refund-policy">
                        <ShieldAlert />
                        Refund Policy
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <CreditUsage />
            <AuthButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-background">
          <Header />
          <main className="flex-1 flex flex-col items-center p-4 md:py-24">
            <motion.div 
                className="container mx-auto max-w-6xl w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
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
                  {plans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card
                        className={cn(
                            'flex flex-col h-full',
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
                            disabled={loadingPlan === plan.name || (userData?.plan === plan.name)}
                            variant={plan.isPrimary ? 'default' : 'secondary'}
                            onClick={() => {
                                if (plan.name !== 'Free' && userData?.plan !== plan.name) {
                                    handlePayment(plan);
                                }
                            }}
                            >
                            {loadingPlan === plan.name ? (
                                <Loader2 className="animate-spin" />
                                ) : userData?.plan === plan.name ? (
                                'Current Plan'
                                ) : (
                                plan.cta
                                )}
                            </Button>
                        </CardFooter>
                        </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
    <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    <Dialog open={!!invoiceData} onOpenChange={(open) => !open && setInvoiceData(null)}>
        <DialogContent className="max-w-2xl bg-card">
            <DialogHeader>
                <DialogTitle className="text-2xl">Payment Successful!</DialogTitle>
                <DialogDescription>
                    Your payment has been processed successfully. You can download the invoice below.
                </DialogDescription>
             <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
            </DialogHeader>
            <div ref={invoiceRef} className="p-6 bg-background rounded-lg">
               {invoiceData && <Invoice {...invoiceData} />}
            </div>
            <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline" onClick={() => setInvoiceData(null)}>Close</Button>
                <Button onClick={handleDownloadInvoice}>
                    <Download className="mr-2 h-4 w-4"/>
                    Download Invoice
                </Button>
            </div>
        </DialogContent>
    </Dialog>
    </>
  )
}
