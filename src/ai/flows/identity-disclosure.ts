'use server';

/**
 * @fileOverview Responds to questions about Grock AI's identity.
 *
 * - identityDisclosure - A function that provides information about Grock AI.
 * - IdentityDisclosureInput - The input type for the identityDisclosure function.
 * - IdentityDisclosureOutput - The return type for the identityDisclosure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentityDisclosureInputSchema = z.object({
  query: z.string().describe('The user query.'),
});
export type IdentityDisclosureInput = z.infer<typeof IdentityDisclosureInputSchema>;

const IdentityDisclosureOutputSchema = z.object({
  response: z.string().describe('The AI response.'),
});
export type IdentityDisclosureOutput = z.infer<typeof IdentityDisclosureOutputSchema>;

export async function identityDisclosure(input: IdentityDisclosureInput): Promise<IdentityDisclosureOutput> {
  return identityDisclosureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identityDisclosurePrompt',
  input: {schema: IdentityDisclosureInputSchema},
  output: {schema: IdentityDisclosureOutputSchema},
  prompt: `{{#if (or (eq (toLowerCase query) \"who are you\") (eq (toLowerCase query) \"who made you\"))}}
I am Grock AI Created By Grock Technologies Wich Is owned whe Gagan Sidhu
{{else}}
{{query}}
{{/if}}`,
});

const identityDisclosureFlow = ai.defineFlow(
  {
    name: 'identityDisclosureFlow',
    inputSchema: IdentityDisclosureInputSchema,
    outputSchema: IdentityDisclosureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      response: output!.response,
    };
  }
);
