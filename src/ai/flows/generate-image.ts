
// src/ai/flows/generate-image.ts
'use server';
/**
 * @fileOverview A flow for generating images from a text prompt.
 *
 * - generateImage - A function that takes a text prompt and returns a data URI representing the generated image.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {STYLES} from '@/lib/options';

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
  numberOfImages: z
    .number()
    .min(1)
    .max(4)
    .optional()
    .default(1)
    .describe('The number of images to generate.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  images: z
    .array(
      z.string().describe(
        'The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
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

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const styleInfo = STYLES.find((s) => s.value === input.style);
    const stylePrompt = styleInfo ? styleInfo.prompt : '';
    const modifiedPrompt = `${stylePrompt}, ${input.prompt}`;

    const generationPromises = Array.from({ length: input.numberOfImages }).map(async () => {
        const {media} = await ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: modifiedPrompt,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });
        return media.url!;
      }
    );

    const images = await Promise.all(generationPromises);

    return {images};
  }
);
