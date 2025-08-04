
"use client";

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateImage } from '@/ai/flows/generate-image';
import { suggestPrompt } from '@/ai/flows/suggest-prompt';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Download, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { STYLES, ASPECT_RATIOS, IMAGE_COUNTS } from '@/lib/options';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<string>('cinematic');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isSuggesting, startSuggestionTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Prompt is required',
        description: 'Please enter a prompt to generate an image.',
      });
      return;
    }

    startGenerationTransition(async () => {
      try {
        setGeneratedImages([]);
        const result = await generateImage({ prompt, style, aspectRatio, numberOfImages });
        setGeneratedImages(result.images);
      } catch (error) {
        console.error('Image generation failed:', error);
        toast({
          variant: 'destructive',
          title: 'Oh no! Something went wrong.',
          description:
            'There was a problem generating the image. Please try again later or check the console for details.',
        });
      }
    });
  };

  const handleSuggestPrompt = () => {
    startSuggestionTransition(async () => {
      try {
        const result = await suggestPrompt();
        setPrompt(result.prompt);
      } catch (error) {
        console.error('Prompt suggestion failed:', error);
        toast({
          variant: 'destructive',
          title: 'Suggestion failed',
          description: 'Could not generate a prompt suggestion at this time.',
        });
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const isPending = isGenerating || isSuggesting;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="container mx-auto max-w-4xl w-full animate-in">
          <div className="flex flex-col gap-4">
             <div className="relative">
              <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="A vibrant synthwave cityscape..."
                className="pl-10 pr-48 h-12 text-base"
                disabled={isPending}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleSuggestPrompt} disabled={isPending} className="h-9 w-9 group">
                  {isSuggesting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />}
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isPending}
                  className="h-9"
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Select value={style} onValueChange={setStyle} disabled={isPending}>
                <SelectTrigger className="w-full h-11">
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
               <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isPending}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select an aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                   {ASPECT_RATIOS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(numberOfImages)} onValueChange={(v) => setNumberOfImages(Number(v))} disabled={isPending}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Number of images" />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_COUNTS.map((c) => (
                    <SelectItem key={c.value} value={String(c.value)}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6">
            {isGenerating && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{aspectRatio: aspectRatio.replace(':', ' / ')}}>
                 {Array.from({ length: numberOfImages }).map((_, i) => (
                  <Card key={i} className="w-full bg-secondary/30 border-dashed border-border/80 flex items-center justify-center aspect-square md:aspect-auto">
                    <CardContent className="p-0 h-full w-full relative">
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/50 backdrop-blur-sm">
                        <div className="three-dots-loader">
                          <span />
                          <span />
                          <span />
                        </div>
                        <p className="text-muted-foreground">Generating your masterpiece...</p>
                      </div>
                    </CardContent>
                  </Card>
                 ))}
              </div>
            )}

            {!isGenerating && generatedImages.length > 0 && (
                <div className={`grid gap-4 ${generatedImages.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
                {generatedImages.map((image, index) => (
                  <Card 
                    key={index}
                    className="w-full bg-secondary/30 border-dashed border-border/80 flex items-center justify-center overflow-hidden"
                    style={{aspectRatio: aspectRatio.replace(':', ' / ')}}
                  >
                    <CardContent className="p-0 h-full w-full relative">
                      <div className="relative group h-full w-full">
                        <Image
                          src={image}
                          alt={prompt}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <a
                          href={image}
                          download={`grock-generated-image-${index + 1}.png`}
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm rounded-full"
                        >
                          <Button variant="secondary" size="icon" className="rounded-full h-9 w-9">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {!isGenerating && generatedImages.length === 0 && (
              <Card 
                className="w-full bg-secondary/30 border-dashed border-border/80 flex items-center justify-center"
                style={{aspectRatio: aspectRatio.replace(':', ' / ')}}
              >
                <CardContent className="p-0 h-full w-full relative">
                  <div className="text-center text-muted-foreground p-8">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Your images will appear here</h3>
                    <p className="text-sm">Enter a prompt and select your options to get started.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
