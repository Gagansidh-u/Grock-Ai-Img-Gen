'use server';
/**
 * @fileOverview Media analysis AI agent.
 *
 * - analyzeMedia - A function that handles the media analysis process.
 * - AnalyzeMediaInput - The input type for the analyzeMedia function.
 * - AnalyzeMediaOutput - The return type for the analyzeMedia function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMediaInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A media file (image or video), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question about the media content.'),
});
export type AnalyzeMediaInput = z.infer<typeof AnalyzeMediaInputSchema>;

const AnalyzeMediaOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the media.'),
});
export type AnalyzeMediaOutput = z.infer<typeof AnalyzeMediaOutputSchema>;

export async function analyzeMedia(input: AnalyzeMediaInput): Promise<AnalyzeMediaOutput> {
  return analyzeMediaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMediaPrompt',
  input: {schema: AnalyzeMediaInputSchema},
  output: {schema: AnalyzeMediaOutputSchema},
  prompt: `You are an AI assistant that analyzes media content and answers questions about it.\n\nYou will be provided with a media file (image or video) and a question about its content. Your task is to analyze the media and answer the question as accurately and comprehensively as possible.\n\nMedia: {{media url=mediaDataUri}}\nQuestion: {{{question}}}\n\nAnswer:`,
});

const analyzeMediaFlow = ai.defineFlow(
  {
    name: 'analyzeMediaFlow',
    inputSchema: AnalyzeMediaInputSchema,
    outputSchema: AnalyzeMediaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
