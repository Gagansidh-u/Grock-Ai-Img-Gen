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

const identityDisclosureFlow = ai.defineFlow(
  {
    name: 'identityDisclosureFlow',
    inputSchema: IdentityDisclosureInputSchema,
    outputSchema: IdentityDisclosureOutputSchema,
  },
  async input => {
    const lowerCaseQuery = input.query.toLowerCase();
    if (lowerCaseQuery === 'who are you' || lowerCaseQuery === 'who made you') {
      return {
        response: 'I am Grock AI Created By Grock Technologies Wich Is owned whe Gagan Sidhu',
      };
    }
    const {output} = await ai.generate({
      prompt: input.query,
    });
    return {
      response: output.text,
    };
  }
);
