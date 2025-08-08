
// src/ai/flows/generate-image.ts
'use server';
/**
 * @fileOverview A flow for generating images from a text prompt.
 *
 * - generateImage - A function that takes a text prompt and returns a data URI representing the generated image.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */
import { config } from 'dotenv';
config();

import {ai} from '@/ai/genkit';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import {STYLES} from '@/lib/options';
import type { UserProfile } from '@/lib/firestore';
import { getApiKey } from '@/lib/api-keys';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to use to generate the image.'),
  style: z
    .string()
    .optional()
    .describe('The artistic style of the image to generate.'),
  aspectRatio: z
    .string()
    .optional()
    .describe('The aspect ratio of the image to generate.'),
  referenceImages: z
    .array(
      z
        .string()
        .describe(
          "A reference image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
        )
    )
    .optional()
    .describe('An array of reference image data URIs.'),
  plan: z.enum(['Free', 'Basic', 'Standard', 'Pro']).optional().default('Free').describe('The user\'s subscription plan.'),
  apiKeyNumber: z.number().optional().describe("The user's assigned API key number."),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  images: z
    .array(
      z.string().describe(
        'The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'\'\'data:<mimetype>;base64,<encoded_data>\'\'\'.'
      )
    )
    .describe('An array of generated image data URIs.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(
  input: GenerateImageInput
): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const getQualityForPlan = (plan: UserProfile['plan']) => {
    switch (plan) {
        case 'Pro': return '4k';
        case 'Standard': return '2k';
        case 'Basic': return 'hd';
        default: return 'standard';
    }
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    
    const userApiKey = getApiKey(input.apiKeyNumber);
    if (!userApiKey) {
        throw new Error('User API key is not configured or assigned.');
    }
    
    // Create a temporary, user-specific AI instance
    const userAi = genkit({
      plugins: [googleAI({ apiKey: userApiKey })],
    });
    
    const styleInfo = STYLES.find((s) => s.value === input.style);
    const stylePrompt = styleInfo ? styleInfo.prompt : '';
    
    const modifiedPrompt = [stylePrompt, input.prompt.trim()].filter(Boolean).join(', ');

    const promptPayload: ({ text: string } | { media: { url: string } })[] = [];

    // Add reference images first
    if (input.referenceImages && input.referenceImages.length > 0) {
      input.referenceImages.forEach((url) => {
        promptPayload.push({ media: { url } });
      });
    }

    // Then add the text prompt
    if (modifiedPrompt) {
      promptPayload.push({ text: modifiedPrompt });
    }
    
    // If there are only reference images, add a default prompt to guide the model.
    if (promptPayload.length > 0 && !promptPayload.some(item => 'text' in item)) {
        promptPayload.push({ text: "Generate a new image based on the provided reference, maintaining a similar style and subject." });
    }

    if (promptPayload.length === 0) {
        throw new Error("A prompt or reference image is required.");
    }
    
    const quality = getQualityForPlan(input.plan || 'Free');

    const {media} = await userAi.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: promptPayload,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        quality,
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      },
    });

    if (!media) {
      throw new Error('Image generation failed to return media.');
    }
    
    return { images: [media.url!] };
  }
);
