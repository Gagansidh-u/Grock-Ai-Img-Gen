
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { SidebarProvider, Sidebar, SidebarRail, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarSeparator } from '@/components/ui/sidebar';
import { AuthButton } from '@/components/auth-button';
import { CreditUsage } from '@/components/credit-usage';
import { Home, Gem, ShieldAlert, Receipt, XCircle, Ban, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const refundSections = [
    {
        icon: <Ban className="h-5 w-5 text-primary" />,
        title: "All Sales Are Final",
        content: "Once a subscription fee is processed, it is non-refundable. This applies to all our plans and in all circumstances, including accidental purchases or if you forget to cancel your subscription."
    },
    {
        icon: <XCircle className="h-5 w-5 text-primary" />,
        title: "No Refunds for Partial Use",
        content: "We do not provide refunds or credits for any partial subscription periods or unused services. If you cancel, you will retain access until the end of your billing cycle."
    },
    {
        icon: <HelpCircle className="h-5 w-5 text-primary" />,
        title: "Why This Policy?",
        content: "Our services incur significant, non-recoverable computational costs for every image generated. This no-refund policy allows us to manage these costs and continue providing a high-quality service at a competitive price."
    },
]

export default function RefundPolicyPage() {
  return (
    <SidebarProvider>
      <Sidebar side="left">
        <SidebarRail />
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-3">
              <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/logo2.png" alt="Logo" width={38} height={38} />
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
                    <SidebarMenuButton asChild>
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
                    <SidebarMenuButton asChild isActive>
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
          <main className="flex-1 bg-secondary/30">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <Receipt className="h-16 w-16 mx-auto mb-4 text-primary" />
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Refund Policy</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Our policy on refunds is simple and transparent.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    <Card className="shadow-lg mb-8">
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                {refundSections.map((section, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            {section.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold">{section.title}</h2>
                                            <p className="text-muted-foreground text-sm">
                                                {section.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
                        <XCircle className="h-5 w-5" />
                        <AlertTitle className="font-semibold">No Exceptions</AlertTitle>
                        <AlertDescription>
                            All payments are final and non-refundable. We encourage you to use our Free plan to evaluate the service before purchasing a subscription. For questions, contact <a href="mailto:support@tryquad.ai" className="font-medium text-destructive-foreground hover:underline">support@tryquad.ai</a>.
                        </AlertDescription>
                    </Alert>

                </div>
            </div>
          </main>
          <footer className="border-t border-border/50 py-8">
            <div className="container mx-auto px-4 text-center">
                 <div className="flex items-center justify-center gap-2 mb-2">
                    <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/logo2.png" alt="Logo" width={33} height={33} />
                     <p className="text-lg font-semibold">TryQuad AI</p>
                </div>
              <p className="text-muted-foreground">
                &copy; {new Date().getFullYear()}{' '}
                <a href="https://www.grock.fun" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary">
                  Grock Technologies
                </a>. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

    
