// src/lib/api-keys.ts
'use server';
import { config } from 'dotenv';
config();

/**
 * Retrieves a numbered Gemini API key from environment variables.
 * This function should only be called from the server-side.
 * @param keyNumber The number of the API key to retrieve (e.g., 1 for GEMINI_API_KEY_1).
 * @returns The API key string or null if not found.
 */
export function getApiKey(keyNumber: number | null): string | null {
    if (keyNumber === null || keyNumber === undefined) {
        return null;
    }
    const key = process.env[`GEMINI_API_KEY_${keyNumber}`];
    return key || null;
}

/**
 * Retrieves the fallback Gemini API key.
 * This is used for non-user-specific tasks like suggesting prompts.
 * @returns The fallback API key string or null if not found.
 */
export function getFallbackApiKey(): string | null {
    const key = process.env.GEMINI_API_KEY_FALLBACK;
    return key || null;
}
