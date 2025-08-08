import { config } from 'dotenv';
config(); // Load environment variables from .env file

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { getFallbackApiKey } from '@/lib/api-keys';

const fallbackApiKey = getFallbackApiKey();

if (!fallbackApiKey) {
  console.warn("GEMINI_API_KEY_FALLBACK is not defined. AI features like prompt suggestions may not work.");
}

// This global AI instance will be used for flows that do not require a user-specific API key,
// such as suggesting prompts. It relies on the server's fallback environment variable.
export const ai = genkit({
  plugins: [googleAI({apiKey: fallbackApiKey || ''})],
  model: 'googleai/gemini-2.0-flash',
});
