"use client";

import React, { useState, useTransition, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { suggestPrompt } from '@/ai/flows/suggest-prompt';
import { improvePrompt } from '@/ai/flows/improve-prompt';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Download, Image as ImageIcon, Sparkles, Loader2, Upload, X, Home, Gem, ShieldAlert } from 'lucide-react';
import { STYLES, ASPECT_RATIOS } from '@/lib/options';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { fileToDataUri } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { SidebarProvider, Sidebar, SidebarRail, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarSeparator } from '@/components/ui/sidebar';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useUserData } from '@/hooks/use-user-data';
import { AuthButton } from '@/components/auth-button';
import { motion } from 'framer-motion';
import { CreditUsage } from '@/components/credit-usage';
import { Header } from '@/components/header';
import { updateImageCount } from '@/lib/firestore';
import { AuthDialog } from '@/components/auth-dialog';


export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<string>('cinematic');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isImproving, startImprovingTransition] = useTransition();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { userData } = useUserData();

  const handleGenerate = () => {
    if (!user) {
        setIsAuthDialogOpen(true);
        return;
    }

    if (!prompt.trim() && referenceImages.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Prompt or image is required',
        description: 'Please enter a prompt or upload an image to generate.',
      });
      return;
    }

    if (userData) {
      if (userData.plan !== 'Pro' && userData.monthlyImageCredits < 1) {
        toast({
          variant: 'destructive',
          title: 'Not enough monthly credits',
          description: `You need 1 credit to generate, but you only have ${userData.monthlyImageCredits} for the month. Please upgrade your plan.`,
          action: (
            <Button asChild>
              <Link href="/pricing">Upgrade</Link>
            </Button>
          ),
        });
        return;
      }
      if (userData.plan !== 'Pro' && userData.dailyImageCredits < 1) {
        toast({
          variant: 'destructive',
          title: 'Daily limit reached',
          description: `You have ${userData.dailyImageCredits} daily credits remaining. Your credits will reset at 12:00 AM.`,
        });
        return;
      }
    }

    startGenerationTransition(async () => {
      try {
        setGeneratedImages([]);
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                style,
                aspectRatio,
                referenceImages,
                userId: user?.uid,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            toast({
              variant: 'destructive',
              title: 'Oh no! Something went wrong.',
              description: errorData.error || 'There was a problem generating the image. Please try again later.',
            });
            return;
        }

        const result = await response.json();
        setGeneratedImages(result.images);
        
        if (user && userData && userData.plan !== 'Pro') {
            await updateImageCount(user.uid, 1);
        }

      } catch (error: any) {
        console.error('Image generation failed:', error);
        toast({
          variant: 'destructive',
          title: 'Oh no! Something went wrong.',
          description: error.message || 'There was a problem generating the image. Please try again later.',
        });
      }
    });
  };

  const handleAspectRatioChange = (value: string) => {
    if (value) {
      setAspectRatio(value);
    }
  };

  const handleImprovePrompt = () => {
    if (!user) {
        setIsAuthDialogOpen(true);
        return;
    }
    
    if (!prompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter a prompt to improve.',
      });
      return;
    }
    startImprovingTransition(async () => {
      try {
        const result = await improvePrompt({ prompt });
        setPrompt(result.prompt);
      } catch (error: any) {
        console.error('Prompt improvement failed:', error);
        toast({
          variant: 'destructive',
          title: 'Improvement failed',
          description: error.message || 'Could not improve the prompt at this time.',
        });
      }
    });
  };
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (referenceImages.length + acceptedFiles.length > 10) {
      toast({
        variant: 'destructive',
        title: 'Too many images',
        description: 'You can upload a maximum of 10 images.',
      });
      return;
    }
    const dataUris = await Promise.all(acceptedFiles.map(fileToDataUri));
    setReferenceImages(prev => [...prev, ...dataUris]);
  }, [referenceImages.length, toast]);

  const { getRootProps, getInputProps, isDragActive, open: openFileDialog } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: true,
    maxFiles: 10,
    noClick: true,
    noKeyboard: true,
  });

  const removeReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const isPending = isGenerating || isImproving;
  const promptRows = prompt.split('\n').length;
  const showSmallUploadButton = promptRows <= 2;
  const hasReferenceImages = referenceImages.length > 0;
  
  return (
    <>
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
                    <SidebarMenuButton asChild isActive>
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
          <main className="flex-1 flex flex-col items-center p-4 md:p-6">
            <motion.div 
              className="container mx-auto max-w-6xl w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col gap-6">
                <div className='text-center flex flex-col gap-2'>
                  <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>AI Image Generator</h1>
                  <p className='text-muted-foreground md:text-lg'>Create stunning visuals with the power of AI.</p>
                </div>
                 
                 <div {...getRootProps()} className={`relative border-2 rounded-2xl transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-input'}`}>
                  {hasReferenceImages && (
                    <div className="p-2 flex flex-wrap gap-2">
                      {referenceImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <Image src={image} alt={`Reference ${index + 1}`} width={24} height={24} className="rounded-full object-cover w-6 h-6" />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -top-1 -right-1 h-4 w-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation(); 
                                removeReferenceImage(index)
                              }}
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isDragActive ? "Drop the files here..." : "A vibrant synthwave cityscape..."}
                    className={`pl-4 pr-12 h-auto resize-none py-3 shadow-lg rounded-2xl border-none focus-visible:ring-0 focus-visible:ring-offset-0 ${hasReferenceImages ? 'pt-0' : ''}`}
                    rows={promptRows < 20 ? promptRows : 20}
                    disabled={isPending}
                  />
                  <input {...getInputProps()} />
                  <div className={`absolute right-2 flex items-center gap-2 ${showSmallUploadButton ? 'top-1/2 -translate-y-1/2' : 'bottom-3'}`}>
                     <Button variant="ghost" size="icon" onClick={openFileDialog} disabled={isPending} className="h-9 w-9 group rounded-full">
                       <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                     </Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Button variant="outline" size="lg" onClick={handleImprovePrompt} disabled={isPending || !prompt.trim()} className="group rounded-full w-full sm:w-auto border-dashed hover:border-solid hover:border-primary">
                    {isImproving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />}
                    Improve Prompt with Ai
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isPending}
                    size="lg"
                    className="rounded-full font-semibold w-full sm:w-auto"
                  >
                    {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                     <Label>Style</Label>
                     <Select value={style} onValueChange={setStyle} disabled={isPending}>
                      <SelectTrigger className="w-full h-11 rounded-full shadow-sm">
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                      <SelectContent>
                        {STYLES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Aspect Ratio</Label>
                    <ToggleGroup type="single" value={aspectRatio} onValueChange={handleAspectRatioChange} disabled={isPending} className="w-full grid grid-cols-3 gap-2">
                      {ASPECT_RATIOS.map((r) => (
                        <ToggleGroupItem key={r.value} value={r.value} className="h-11 rounded-lg shadow-sm data-[state=on]:border-primary data-[state=on]:border-2">
                          {r.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                {isGenerating && (
                  <div className="grid grid-cols-1">
                      <Card className="w-full bg-card border-border/80 flex items-center justify-center overflow-hidden" style={{aspectRatio: aspectRatio.replace(':', ' / ')}}>
                        <CardContent className="p-0 h-full w-full relative">
                           <Skeleton className="h-full w-full" />
                        </CardContent>
                      </Card>
                  </div>
                )}

                {!isGenerating && generatedImages.length > 0 && (
                    <motion.div 
                        className="grid grid-cols-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                    >
                    {generatedImages.map((image, index) => (
                      <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          <Card 
                            className="w-full bg-card border-border/80 flex items-center justify-center overflow-hidden shadow-lg"
                            style={{aspectRatio: aspectRatio.replace(':', ' / ')}}
                          >
                            <CardContent className="p-0 h-full w-full relative">
                              <div className="relative group h-full w-full">
                                <Image
                                  src={image}
                                  alt={prompt}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <a
                                  href={image}
                                  download={`tryquad-generated-image-${index + 1}.png`}
                                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 shadow-lg">
                                    <Download className="h-5 w-5" />
                                  </Button>
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                
                {!isGenerating && generatedImages.length === 0 && (
                   <Card 
                    className="w-full bg-card/50 border-2 border-dashed border-border/80 flex items-center justify-center transition-all hover:border-primary/50 hover:bg-primary/5"
                    style={{aspectRatio: aspectRatio.replace(':', ' / ')}}
                  >
                    <CardContent className="p-0 h-full w-full relative">
                      <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center h-full">
                          <ImageIcon className="h-16 w-16 mx-auto mb-4 text-primary/30" />
                        <h3 className="text-xl font-semibold">Your image will appear here</h3>
                        <p className="text-base">Enter a prompt and select your options to get started.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
    <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </>
  );
}
