
import Link from 'next/link';
import { Header } from '@/components/header';
import { TryQuadLogo } from '@/components/icons';

export default function TermsConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <article className="prose prose-invert lg:prose-xl mx-auto">
            <h1>Terms and Conditions for TryQuad AI</h1>
            
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>
              Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the TryQuad AI
              Image Generator service (the "Service") operated by TryQuad Technologies ("us", "we", or "our").
            </p>
            <p>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These
              Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service,
              you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>

            <h2>1. Accounts</h2>
            <p>
              When you create an account with us, you must provide us with information that is accurate, complete, and current at
              all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your
              account on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions
              under your password, whether your password is with our Service or a third-party service. You agree not to disclose
              your password to any third party. You must notify us immediately upon becoming aware of any breach of security or
              unauthorized use of your account.
            </p>

            <h2>2. Subscriptions and Payments</h2>
            <p>
              Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on
              a recurring and periodic basis ("Billing Cycle"). Billing cycles are set on a monthly basis.
            </p>
            <p>
              At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless
              you cancel it or TryQuad Technologies cancels it. You may cancel your Subscription renewal either through your
              online account management page or by contacting TryQuad Technologies customer support.
            </p>
            <p>
              A valid payment method, including a credit card, is required to process the payment for your Subscription. You shall
              provide TryQuad Technologies with accurate and complete billing information. By submitting such payment information,
              you automatically authorize TryQuad Technologies to charge all Subscription fees incurred through your account to
              any such payment instruments.
            </p>

            <h2>3. Content and Ownership</h2>
            <p>
                <strong>Your Content:</strong> You retain ownership of the text prompts you provide to the Service. By using the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and modify the prompts to generate images and to improve our Service.
            </p>
            <p>
                <strong>Generated Images:</strong> You own the images you create with the Service, subject to the rights of others in any underlying components. You are free to use them for any purpose, including commercial use, provided you comply with these Terms and applicable laws. You are responsible for ensuring that your prompts and the resulting images do not infringe on the intellectual property rights of any third party. We do not claim any ownership rights to the images you generate.
            </p>
            <p>
                <strong>Prohibited Content:</strong> You agree not to use the Service to create any content that is unlawful, harmful, defamatory, obscene, infringing, or otherwise objectionable. We reserve the right, but not the obligation, to review prompts and generated images and to remove any content that violates these Terms.
            </p>
            
            <h2>4. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding Content provided by users), features, and functionality are and will
              remain the exclusive property of TryQuad Technologies and its licensors. The Service is protected by copyright,
              trademark, and other laws of both India and foreign countries. Our trademarks and trade dress may not be used in
              connection with any product or service without the prior written consent of TryQuad Technologies.
            </p>

            <h2>5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever,
              including without limitation if you breach the Terms. Upon termination, your right to use the Service will
              immediately cease.
            </p>
            
            <h2>6. Limitation Of Liability</h2>
            <p>
              In no event shall TryQuad Technologies, nor its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation,
              loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or
              inability to access or use the Service.
            </p>

            <h2>7. Disclaimer</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The
              Service is provided without warranties of any kind, whether express or implied, including, but not limited to,
              implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
            </p>
            
            <h2>8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict
              of law provisions.
            </p>
            
            <h2>9. Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
              material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a
              material change will be determined at our sole discretion.
            </p>
            
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
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
  );
}

    