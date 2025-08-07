
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Brush, Image as ImageIcon, Sparkles, Home, Gem, ShieldAlert } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarRail, SidebarSeparator } from '@/components/ui/sidebar';
import { AuthButton } from '@/components/auth-button';
import { CreditUsage } from '@/components/credit-usage';


const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Suggestions',
    description: 'Stuck for ideas? Get unique, creative prompts suggested by our AI to kickstart your imagination.',
  },
  {
    icon: <Brush className="h-8 w-8 text-primary" />,
    title: 'Multiple Artistic Styles',
    description: 'Choose from a variety of styles like Cinematic, Anime, 3D Model, or Pixel Art to match your vision.',
  },
  {
    icon: <ImageIcon className="h-8 w-8 text-primary" />,
    title: 'Flexible Aspect Ratios',
    description: 'Generate images in square, portrait, or landscape formats to perfectly fit your needs.',
  },
];

export default function LandingPage() {

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
          <main className="flex-1">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 md:py-32 text-center">
              <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
                  Unleash Your Creativity with TryQuad AI
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-muted-foreground">
                  Welcome to the TryQuad AI Image Generator, brought to you by TryQuad Technologies. Transform your text prompts into stunning visual art, logos, and more. Effortlessly create, customize, and download unique images in seconds.
                </p>
                <Button size="lg" className="font-semibold text-lg group" asChild>
                  <Link href="/generate">
                    Start Generating
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              <div className="mt-16 md:mt-24">
                 <Card className="max-w-4xl mx-auto shadow-2xl shadow-primary/10">
                    <CardContent className="p-2">
                        <Image
                            src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/f3864b6d-bd81-4d5d-b541-356d65114494.jpeg?raw=true"
                            alt="AI generated image of a futuristic landscape"
                            width={1200}
                            height={600}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="rounded-lg object-cover"
                        />
                    </CardContent>
                 </Card>
              </div>
            </section>

            {/* Features Section */}
            <section className="bg-secondary/30 py-20 md:py-24">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Create</h2>
                  <p className="max-w-xl mx-auto mt-2 text-muted-foreground">
                    Powerful features designed for both beginners and professionals.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {features.map((feature) => (
                    <Card key={feature.title} className="bg-card/80 backdrop-blur-sm border-border/50">
                      <CardHeader>
                        <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">{feature.icon}</div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Gallery Section */}
             <section className="py-20 md:py-24">
              <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">From Imagination to Image</h2>
                  <p className="max-w-xl mx-auto mt-2 text-muted-foreground">
                    Explore a gallery of images created with TryQuad AI.
                  </p>
                </div>
                <div className="columns-2 md:columns-4 gap-4 space-y-4">
                    <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/ba4ffc06-f9e9-4cdb-b15b-bd9497b0005d.jpeg?raw=true" alt="Fantasy castle" width={400} height={600} sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover w-full h-auto hover:scale-105 transition-transform duration-300" />
                    <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/e7511167-627d-4861-8b8b-499f5bf1e01e.jpeg?raw=true" alt="Anime character" width={400} height={600} sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover w-full h-auto hover:scale-105 transition-transform duration-300" />
                    <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/b01b75e9-fd97-4b03-ad7c-e4693f18077f.jpeg?raw=true" alt="Cyberpunk city" width={400} height={300} sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover w-full h-auto hover:scale-105 transition-transform duration-300" />
                    <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/Lilith.jpeg?raw=true" alt="3D model car" width={400} height={300} sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover w-full h-auto hover:scale-105 transition-transform duration-300" />
                    <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/Goku.jpeg?raw=true" alt="Photorealistic animal" width={400} height={300} sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover w-full h-auto hover:scale-105 transition-transform duration-300" />
                    <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/9c84c2ef-ecf6-4f4c-ad3d-a26313858da7.jpeg?raw=true" alt="Vaporwave sunset" width={400} height={300} sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover w-full h-auto hover:scale-105 transition-transform duration-300" />
                    <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/1467fd58-8982-4b29-a314-cf481ea61e63.jpeg?raw=true" alt="Abstract art" width={400} height={600} sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover w-full h-auto hover:scale-105 transition-transform duration-300" />
                    <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/a9dcd4d5-0380-4ed7-9201-8e59ba2618c2.jpeg?raw=true" alt="Abstract art" width={400} height={600} sizes="(max-width: 768px) 50vw, 25vw" className="rounded-lg object-cover w-full h-auto hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
            </section>

          </main>

          {/* Footer */}
          <footer className="border-t border-border/50 py-8">
            <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/logo2.png" alt="Logo" width={24} height={24} className="text-primary"/>
                     <p className="text-lg font-semibold">TryQuad AI</p>
                </div>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                  <Button variant="link" asChild>
                    <Link href="/terms-conditions">Terms & Conditions</Link>
                  </Button>
                  <Button variant="link" asChild>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                  </Button>
                  <Button variant="link" asChild>
                    <Link href="/refund-policy">Refund Policy</Link>
                  </Button>
              </div>
              <p className="text-muted-foreground">
                &copy; {new Date().getFullYear()}{' '}
                <a
                  href="https://www.tryquad.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-primary"
                >
                  TryQuad Technologies
                </a>
                . All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
