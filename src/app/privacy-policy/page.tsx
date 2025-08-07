
import Link from 'next/link';
import { Header } from '@/components/header';
import { TryQuadLogo } from '@/components/icons';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarRail, SidebarSeparator } from '@/components/ui/sidebar';
import { AuthButton } from '@/components/auth-button';
import { CreditUsage } from '@/components/credit-usage';
import { Home, Gem, ShieldAlert } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <SidebarProvider>
      <Sidebar side="left">
        <SidebarRail />
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                <TryQuadLogo className="h-7 w-7 text-primary" />
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
          <main className="flex-1">
            <div className="container mx-auto px-4 py-12 md:py-16">
              <article className="prose prose-invert lg:prose-xl mx-auto">
                <h1>Privacy Policy for TryQuad AI</h1>
                
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <p>
                  Welcome to TryQuad AI. We are committed to protecting your privacy. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you use our AI Image Generator service (the "Service"). Please read
                  this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.
                </p>

                <h2>1. Information We Collect</h2>
                <p>
                  We may collect information about you in a variety of ways. The information we may collect via the Service includes:
                </p>
                <ul>
                  <li>
                    <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic
                    information, that you voluntarily give to us when you register with the Service.
                  </li>
                  <li>
                    <strong>Generated Content:</strong> The prompts you enter and the images you generate using our Service. We retain this
                    data to improve our AI models and provide the service to you.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Information our servers automatically collect when you access the Service, such as your IP
                    address, your browser type, your operating system, your access times, and the pages you have viewed directly
                    before and after accessing the Service.
                  </li>
                  <li>
                    <strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your
                    payment instrument number (e.g., a credit card number), and the security code associated with your payment
                    instrument. All payment data is stored by our payment processor, Razorpay. You should review their privacy policy
                    and contact them directly for responses to your questions.
                  </li>
                </ul>

                <h2>2. Use of Your Information</h2>
                <p>
                  Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience.
                  Specifically, we may use information collected about you via the Service to:
                </p>
                <ul>
                  <li>Create and manage your account.</li>
                  <li>Process your payments and subscriptions.</li>
                  <li>Email you regarding your account or order.</li>
                  <li>Improve our AI models and the overall quality of the Service.</li>
                  <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
                  <li>Notify you of updates to the Service.</li>
                  <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                  <li>Respond to customer service requests.</li>
                </ul>

                <h2>3. Disclosure of Your Information</h2>
                <p>
                  We do not share your personal information with third parties except as described in this Privacy Policy. We may share
                  information we have collected about you in certain situations:
                </p>
                <ul>
                    <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                    <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service.</li>
                    <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                </ul>

                <h2>4. Security of Your Information</h2>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. While we
                  have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our
                  efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed
                  against any interception or other type of misuse.
                </p>
                
                <h2>5. Policy for Children</h2>
                <p>
                  We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any
                  data we have collected from children under age 13, please contact us using the contact information provided below.
                </p>
                
                <h2>6. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy
                  on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>
                
                <h2>7. Contact Us</h2>
                <p>
                  If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <p>
                  TryQuad Technologies<br/>
                  Email: <a href="mailto:support@tryquad.ai">support@tryquad.ai</a>
                </p>

              </article>
            </div>
          </main>
          <footer className="border-t border-border/50 py-8">
            <div className="container mx-auto px-4 text-center">
                 <div className="flex items-center justify-center gap-2 mb-2">
                    <TryQuadLogo className="h-6 w-6 text-primary"/>
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
