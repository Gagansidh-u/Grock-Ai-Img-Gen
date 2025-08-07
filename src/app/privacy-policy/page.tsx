
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { SidebarProvider, Sidebar, SidebarRail, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarSeparator } from '@/components/ui/sidebar';
import { AuthButton } from '@/components/auth-button';
import { CreditUsage } from '@/components/credit-usage';
import { Home, Gem, ShieldAlert, ShieldCheck, User, Lock, Server, Users, Baby, Edit, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const policySections = [
  {
    icon: <User className="h-6 w-6 text-primary" />,
    title: "Information We Collect",
    content: "We collect personal data you provide (name, email), content you generate (prompts, images), usage data (IP address, browser type), and payment data processed by our partners."
  },
  {
    icon: <Lock className="h-6 w-6 text-primary" />,
    title: "Use of Your Information",
    content: "We use your information to create and manage your account, process payments, improve our AI models, analyze usage trends, and communicate with you about your account and our services."
  },
  {
    icon: <Server className="h-6 w-6 text-primary" />,
    title: "Disclosure of Your Information",
    content: "We do not sell your data. We may share information with service providers (e.g., payment processors), to comply with legal obligations, or in connection with a business transfer."
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Security of Your Information",
    content: "We use administrative, technical, and physical security measures to protect your personal information. However, no security system is impenetrable, and we cannot guarantee absolute security."
  },
  {
    icon: <Baby className="h-6 w-6 text-primary" />,
    title: "Policy for Children",
    content: "Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13."
  },
  {
    icon: <Edit className="h-6 w-6 text-primary" />,
    title: "Changes to This Privacy Policy",
    content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. You are advised to review this policy periodically."
  },
]

export default function PrivacyPolicyPage() {
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
                    <SidebarMenuButton asChild>
                        <Link href="/terms-conditions">
                            <ShieldAlert />
                            Terms & Conditions
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
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
                  <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Your privacy is important to us. Here’s how we handle your information.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-8">
                       {policySections.map((section, index) => (
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
                       <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full border border-primary/20">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:support@tryquad.ai" className="text-primary hover:underline">support@tryquad.ai</a>.
                                </p>
                            </div>
                        </div>
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
                <a href="https://www.tryquad.com" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary">
                  TryQuad Technologies
                </a>. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

    