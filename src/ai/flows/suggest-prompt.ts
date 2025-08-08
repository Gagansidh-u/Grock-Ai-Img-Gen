
'use server';
/**
 * @fileOverview A flow for suggesting a creative image prompt.
 *
 * - suggestPrompt - A function that returns a creative prompt for image generation.
 * - SuggestPromptOutput - The return type for the suggestPrompt function.
 */
import { config } from 'dotenv';
config();

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPromptOutputSchema = z.object({
  prompt: z.string().describe('A creative prompt for image generation.'),
});

export type SuggestPromptOutput = z.infer<typeof SuggestPromptOutputSchema>;

export async function suggestPrompt(): Promise<SuggestPromptOutput> {
  return suggestPromptFlow();
}

const suggestPromptFlow = ai.defineFlow(
  {
    name: 'suggestPromptFlow',
    outputSchema: SuggestPromptOutputSchema,
  },
  async () => {
    const {text} = await ai.generate({
      prompt: 'Generate a short, creative, and inspiring prompt for an image generation AI. The prompt should be a single sentence and be suitable for creating visually stunning and imaginative artwork. Do not include any quotation marks.',
      model: 'googleai/gemini-2.0-flash',
      config: {
        temperature: 1.2, // Increase creativity
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

    return {prompt: text};
  }
);
