
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { SidebarProvider, Sidebar, SidebarRail, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarSeparator } from '@/components/ui/sidebar';
import { AuthButton } from '@/components/auth-button';
import { CreditUsage } from '@/components/credit-usage';
import { Home, Gem, ShieldAlert, FileText, User, CreditCard, Image as ImageIcon, VenetianMask, Zap, Shield, FileX, Scale } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const termsSections = [
    {
        icon: <User className="h-6 w-6 text-primary" />,
        title: "1. Accounts",
        content: "You must provide accurate and current information when creating an account. You are responsible for safeguarding your password and for all activities that occur under your account."
    },
    {
        icon: <CreditCard className="h-6 w-6 text-primary" />,
        title: "2. Subscriptions and Payments",
        content: "Subscriptions are billed on a recurring monthly basis. They automatically renew unless canceled. Payments are processed through a third-party payment provider."
    },
    {
        icon: <ImageIcon className="h-6 w-6 text-primary" />,
        title: "3. Content and Ownership",
        content: "You own the images you create. By using our service, you grant us a license to use your prompts to generate images and improve our AI. You are responsible for ensuring your prompts and generated images do not infringe on third-party rights."
    },
    {
        icon: <VenetianMask className="h-6 w-6 text-primary" />,
        title: "4. Prohibited Content",
        content: "You agree not to create content that is unlawful, harmful, defamatory, obscene, or otherwise objectionable. We reserve the right to remove content and terminate accounts that violate these terms."
    },
    {
        icon: <Zap className="h-6 w-6 text-primary" />,
        title: "5. Intellectual Property",
        content: "The Service and its original content, features, and functionality are the exclusive property of Grock Technologies and are protected by copyright and trademark laws."
    },
    {
        icon: <FileX className="h-6 w-6 text-primary" />,
        title: "6. Termination",
        content: "We may terminate or suspend your account immediately, without prior notice, for any reason, including a breach of these Terms. Upon termination, your right to use the Service will cease."
    },
    {
        icon: <Shield className="h-6 w-6 text-primary" />,
        title: "7. Disclaimer and Limitation of Liability",
        content: "The Service is provided 'as is' without warranties of any kind. Grock Technologies shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service."
    },
    {
        icon: <Scale className="h-6 w-6 text-primary" />,
        title: "8. Governing Law & Changes",
        content: "These Terms are governed by the laws of India. We reserve the right to modify these terms at any time and will provide notice of material changes."
    },
]

export default function TermsConditionsPage() {
  return (
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
                    <SidebarMenuButton asChild>
                        <Link href="/pricing">
                            <Gem />
                            Pricing
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarSeparator className="my-2" />
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
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
          <main className="flex-1 bg-secondary/30">
            <div className="container mx-auto px-4 py-12 md:py-16">
               <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms & Conditions</h1>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Please read these terms carefully before using our service.
                  </p>
                   <p className="text-sm text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                
                 <Card className="shadow-lg">
                  <CardContent className="p-8">
                     <div className="space-y-8">
                       {termsSections.map((section, index) => (
                        <div key={index} className="flex items-start gap-6">
                            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full border border-primary/20">
                                {section.icon}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {section.content}
                                </p>
                            </div>
                        </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
          <footer className="border-t border-border/50 py-8">
            <div className="container mx-auto px-4 text-center">
                 <div className="flex items-center justify-center gap-2 mb-2">
                    <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/logo2.png" alt="Logo" width={24} height={24} className="text-primary"/>
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
