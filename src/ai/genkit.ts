
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI features may not work.");
}

export const ai = genkit({
  plugins: [googleAI({apiKey: apiKey || ''})],
  model: 'googleai/gemini-2.0-flash',
});
