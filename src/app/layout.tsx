
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { AuthProvider } from '@/hooks/use-auth';


export const metadata: Metadata = {
  title: 'TryQuad AI: Advanced AI Image Generator for Stunning Visuals',
  description: 'Transform your ideas into reality with TryQuad AI. Generate custom, high-quality images, art, and logos from text prompts. Unleash your creativity today!',
  keywords: 'AI image generator, text to image, TryQuad AI, AI art generator, custom logos, AI visuals, creative prompts, generate images with AI, machine learning art, digital illustration, TryQuad Technologies',
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
