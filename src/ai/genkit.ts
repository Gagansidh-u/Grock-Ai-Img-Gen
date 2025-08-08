import { config } from 'dotenv';
config(); // Load environment variables from .env file

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GEMINI_API_KEY_FALLBACK;

if (!apiKey) {
  console.warn("GEMINI_API_KEY_FALLBACK is not defined. AI features may not work.");
}

export const ai = genkit({
  plugins: [googleAI({apiKey: apiKey || ''})],
  model: 'googleai/gemini-2.0-flash',
});
