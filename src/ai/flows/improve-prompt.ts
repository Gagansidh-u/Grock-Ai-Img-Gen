'use server';
/**
 * @fileOverview A flow for improving a user's image prompt.
 *
 * - improvePrompt - A function that takes a user's prompt and returns an improved version.
 * - ImprovePromptInput - The input type for the improvePrompt function.
 * - ImprovePromptOutput - The return type for the improvePrompt function.
 */

import {ai} from '@/ai/genkit';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import { getApiKey } from '@/lib/api-keys';

const ImprovePromptInputSchema = z.object({
  prompt: z.string().describe('The user-provided prompt to improve.'),
  apiKeyNumber: z.number().optional().describe("The user's assigned API key number."),
});

export type ImprovePromptInput = z.infer<typeof ImprovePromptInputSchema>;

const ImprovePromptOutputSchema = z.object({
  prompt: z.string().describe('The improved, more detailed prompt.'),
});

export type ImprovePromptOutput = z.infer<typeof ImprovePromptOutputSchema>;

export async function improvePrompt(input: ImprovePromptInput): Promise<ImprovePromptOutput> {
  return improvePromptFlow(input);
}

const improvePromptFlow = ai.defineFlow(
  {
    name: 'improvePromptFlow',
    inputSchema: ImprovePromptInputSchema,
    outputSchema: ImprovePromptOutputSchema,
  },
  async ({ prompt, apiKeyNumber }) => {
    
    const userApiKey = getApiKey(apiKeyNumber);
    if (!userApiKey) {
        throw new Error('User API key is not configured or assigned.');
    }
    
    // Create a temporary, user-specific AI instance
    const userAi = genkit({
      plugins: [googleAI({ apiKey: userApiKey })],
    });

    const {text} = await userAi.generate({
      prompt: `Rewrite and improve the following image generation prompt to be more vivid, descriptive, and detailed. Add specific visual elements, lighting conditions, and artistic composition details. Do not specify any particular artistic style (e.g., "photorealistic," "anime," "watercolor"). Focus only on the subject and scene. Return only the improved prompt, without any extra text or quotation marks.
      
      Original prompt: "${prompt}"`,
      model: 'googleai/gemini-2.0-flash',
      config: {
        temperature: 0.8,
      },
    });

    return {prompt: text};
  }
);
