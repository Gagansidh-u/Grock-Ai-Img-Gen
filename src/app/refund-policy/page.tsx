
import Link from 'next/link';
import { Header } from '@/components/header';
import { TryQuadLogo } from '@/components/icons';

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <article className="prose prose-invert lg:prose-xl mx-auto">
            <h1>Refund Policy for TryQuad AI</h1>
            
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2>Overview</h2>
            <p>
              Thank you for subscribing to TryQuad AI. Our mission is to provide you with the best AI image generation service.
              This policy outlines our position on refunds for all our subscription plans.
            </p>

            <h2>No Refunds</h2>
            <p>
              All payments made to TryQuad Technologies for our subscription services are final and non-refundable. This policy applies in all circumstances, without exception.
            </p>
            <p>
              Once a subscription fee is processed, it will not be refunded, in whole or in part, for any reason, including but not limited to:
            </p>
            <ul>
              <li>Your dissatisfaction with the Service.</li>
              <li>Your failure to use the Service or cancellation of your account before the end of your subscription period.</li>
              <li>Accidental purchases or subscriptions.</li>
              <li>A change in your needs or circumstances.</li>
              <li>Service outages or technical issues (we will work to resolve them, but this does not qualify for a refund).</li>
              <li>Termination of your account due to a violation of our Terms and Conditions.</li>
            </ul>

            <h2>Subscription Cancellation</h2>
            <p>
              You are free to cancel your subscription at any time. When you cancel, you will continue to have access to the service through the end of your current paid billing period. After the billing period ends, your subscription will not be renewed, and you will not be charged again. Cancelling your subscription does not entitle you to a refund for any portion of the fees already paid.
            </p>

            <h2>Why We Have This Policy</h2>
            <p>
              Our no-refund policy is in place because our services incur significant computational costs upfront for every image generation. When you subscribe, you are purchasing a set number of image credits or unlimited access for a period, and we provision resources accordingly. These costs are irreversible on our end.
            </p>
            
            <h2>Free Plan</h2>
            <p>
              We offer a free plan with a limited number of image generations per month. We encourage all users to utilize the free plan to evaluate the service and ensure it meets your needs before upgrading to a paid subscription. This allows you to test our features and quality without any financial commitment.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our Refund Policy, please do not hesitate to contact us. We are here to help you understand our services and policies.
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

    