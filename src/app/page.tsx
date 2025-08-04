
"use client";

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateImage } from '@/ai/flows/generate-image';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Download, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
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

    startTransition(async () => {
      try {
        setGeneratedImage(null);
        const result = await generateImage({ prompt });
        setGeneratedImage(result.image);
      } catch (error) {
        console.error('Image generation failed:', error);
        toast({
          variant: 'destructive',
          title: 'Oh no! Something went wrong.',
          description:
            'There was a problem generating the image. Please try again.',
        });
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="container mx-auto max-w-2xl w-full animate-in">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="A vibrant synthwave cityscape..."
                className="pl-10 pr-32 h-12 text-base"
                disabled={isPending}
              />
              <Button
                onClick={handleGenerate}
                disabled={isPending}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9"
              >
                {isPending ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <Card className="aspect-square w-full bg-secondary/30 border-dashed border-border/80 flex items-center justify-center">
              <CardContent className="p-0 h-full w-full relative">
                {isPending && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/50 backdrop-blur-sm">
                     <div className="three-dots-loader">
                       <span />
                       <span />
                       <span />
                     </div>
                    <p className="text-muted-foreground">Generating your masterpiece...</p>
                  </div>
                )}
                {generatedImage ? (
                  <div className="relative group h-full w-full">
                    <Image
                      src={generatedImage}
                      alt={prompt}
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                     <a
                      href={generatedImage}
                      download="grock-generated-image.png"
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm rounded-full"
                    >
                      <Button variant="secondary" size="icon" className="rounded-full h-9 w-9">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                ) : (
                  !isPending && (
                    <div className="text-center text-muted-foreground p-8">
                       <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">Your image will appear here</h3>
                      <p className="text-sm">Enter a prompt above and click "Generate" to see the magic happen.</p>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
