
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Brush, Image as ImageIcon, Sparkles, Home, Gem } from 'lucide-react';
import { GrockLogo } from '@/components/icons';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import { useUserData } from '@/hooks/use-user-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


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
  const { user } = useAuth();
  const router = useRouter();
  const { userData, loading: userDataLoading } = useUserData();

  const handleGetStarted = () => {
    if (user) {
      router.push('/generate');
    } else {
      router.push('/login');
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarRail />
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                <GrockLogo className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tighter">
                Grock AI
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
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {user && (
            userDataLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : userData ? (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
               <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                  <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold truncate">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {userData.imagesGenerated} images used
                  </p>
                </div>
            </div>
          ): null)}
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
                  Unleash Your Creativity with AI
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-muted-foreground">
                  Welcome to the Grock AI Image Generator, brought to you by Grock Technologies. Transform your text prompts into stunning visual art, logos, and more. Effortlessly create, customize, and download unique images in seconds.
                </p>
                <Button size="lg" className="font-semibold text-lg group" onClick={handleGetStarted}>
                  Start Generating
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              <div className="mt-16 md:mt-24">
                 <Card className="max-w-4xl mx-auto shadow-2xl shadow-primary/10">
                    <CardContent className="p-2">
                        <Image
                            src="https://placehold.co/1200x600.png"
                            data-ai-hint="futuristic robot landscape"
                            alt="AI generated image of a futuristic landscape"
                            width={1200}
                            height={600}
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
                    Explore a gallery of images created with Grock AI.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Image src="https://placehold.co/400x600.png" data-ai-hint="fantasy castle" alt="Fantasy castle" width={400} height={600} className="rounded-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                    <Image src="https://placehold.co/400x600.png" data-ai-hint="anime character portrait" alt="Anime character" width={400} height={600} className="rounded-lg object-cover w-full h-full row-span-2 hover:scale-105 transition-transform duration-300" />
                    <Image src="https://placehold.co/400x300.png" data-ai-hint="cyberpunk city" alt="Cyberpunk city" width={400} height={300} className="rounded-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                    <Image src="https://placehold.co/400x300.png" data-ai-hint="3d model car" alt="3D model car" width={400} height={300} className="rounded-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                    <Image src="https://placehold.co/400x300.png" data-ai-hint="photorealistic animal" alt="Photorealistic animal" width={400} height={300} className="rounded-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                    <Image src="https://placehold.co/400x300.png" data-ai-hint="vaporwave sunset" alt="Vaporwave sunset" width={400} height={300} className="rounded-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                    <Image src="https://placehold.co/400x600.png" data-ai-hint="abstract art" alt="Abstract art" width={400} height={600} className="rounded-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
            </section>

          </main>

          {/* Footer */}
          <footer className="border-t border-border/50 py-8">
            <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <GrockLogo className="h-6 w-6 text-primary"/>
                     <p className="text-lg font-semibold">Grock AI</p>
                </div>
              <p className="text-muted-foreground">
                &copy; {new Date().getFullYear()}{' '}
                <a
                  href="https://www.grock.fun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-primary"
                >
                  Grock Technologies
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

    
