import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AuthProvider } from '@/hooks/use-auth';


export const metadata: Metadata = {
  title: 'Grock AI Image Generator',
  description: 'Generate stunning images with the power of AI. Built by Grock Technologies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
