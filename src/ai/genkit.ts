import { config } from 'dotenv';
config(); // Load environment variables from .env file

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This global AI instance will be used for flows that do not require a user-specific API key,
// such as suggesting or improving prompts. It relies on the server's environment variable.
// The GEMINI_API_KEY check ensures the server doesn't start without a fallback key.
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in your environment. Please check your .env file or hosting provider's settings.");
}

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-2.0-flash',
});
