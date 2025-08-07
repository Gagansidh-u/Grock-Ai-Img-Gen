
"use client";

import React, { useState, useTransition, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateImage } from '@/ai/flows/generate-image';
import { suggestPrompt } from '@/ai/flows/suggest-prompt';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Download, Image as ImageIcon, Sparkles, Loader2, Upload, X } from 'lucide-react';
import { STYLES, ASPECT_RATIOS, IMAGE_COUNTS } from '@/lib/options';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { fileToDataUri } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<string>('cinematic');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isSuggesting, startSuggestionTransition] = useTransition();
  const { toast } = useToast();
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim() && referenceImages.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Prompt or image is required',
        description: 'Please enter a prompt or upload an image to generate.',
      });
      return;
    }

    startGenerationTransition(async () => {
      try {
        setGeneratedImages([]);
        const result = await generateImage({ prompt, style, aspectRatio, numberOfImages, referenceImages });
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

  const handleAspectRatioChange = (value: string) => {
    if (value) {
      setAspectRatio(value);
    }
  };
  
  const handleImageCountChange = (value: string) => {
    if (value) {
      setNumberOfImages(Number(value));
    }
  };

  useEffect(() => {
    if (initialRenderComplete) {
      if ((prompt.trim() || referenceImages.length > 0) && (aspectRatio || numberOfImages)) {
        handleGenerate();
      }
    } else {
      setInitialRenderComplete(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectRatio, numberOfImages]);

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

  const isPending = isGenerating || isSuggesting;
  const promptRows = prompt.split('\n').length;
  const showSmallUploadButton = promptRows <= 2;
  const hasReferenceImages = referenceImages.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6">
        <div className="container mx-auto max-w-6xl w-full animate-in">
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
                        <Image src={image} alt={`Reference ${index + 1}`} width={60} height={60} className="rounded-md object-cover w-auto h-auto" />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            removeReferenceImage(index)
                          }}
                        >
                          <X className="h-3 w-3" />
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
            
            <div className="flex justify-center items-center gap-4">
              <Button variant="ghost" size="lg" onClick={handleSuggestPrompt} disabled={isPending} className="group rounded-full">
                {isSuggesting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />}
                Inspire Me
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isPending}
                size="lg"
                className="rounded-full font-semibold"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="flex flex-col gap-2">
                <Label>Number of Images</Label>
                <ToggleGroup type="single" value={String(numberOfImages)} onValueChange={handleImageCountChange} disabled={isPending} className="w-full grid grid-cols-4 gap-2">
                  {IMAGE_COUNTS.map((c) => (
                    <ToggleGroupItem key={c.value} value={String(c.value)} className="h-11 rounded-lg shadow-sm data-[state=on]:border-primary data-[state=on]:border-2">
                      {c.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          </div>
          <div className="mt-8">
            {isGenerating && (
              <div className={`grid gap-4 ${numberOfImages > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
                 {Array.from({ length: numberOfImages }).map((_, i) => (
                  <Card key={i} className="w-full bg-card border-border/80 flex items-center justify-center overflow-hidden" style={{aspectRatio: aspectRatio.replace(':', ' / ')}}>
                    <CardContent className="p-0 h-full w-full relative">
                       <Skeleton className="h-full w-full" />
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
                          download={`grock-generated-image-${index + 1}.png`}
                          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 shadow-lg">
                            <Download className="h-5 w-5" />
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
                className="w-full bg-card/50 border-2 border-dashed border-border/80 flex items-center justify-center transition-all hover:border-primary/50 hover:bg-primary/5"
                style={{aspectRatio: aspectRatio.replace(':', ' / ')}}
              >
                <CardContent className="p-0 h-full w-full relative">
                  <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center h-full">
                      <ImageIcon className="h-16 w-16 mx-auto mb-4 text-primary/30" />
                    <h3 className="text-xl font-semibold">Your images will appear here</h3>
                    <p className="text-base">Enter a prompt and select your options to get started.</p>
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
