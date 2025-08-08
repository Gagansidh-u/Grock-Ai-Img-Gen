
// src/lib/api-keys.ts
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Retrieves all Gemini API keys from environment variables.
 * Keys should be named GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.
 * @returns An array of available API keys.
 */
export function getApiKeyPool(): string[] {
    const keys: string[] = [];
    let i = 1;
    while (process.env[`GEMINI_API_KEY_${i}`]) {
        keys.push(process.env[`GEMINI_API_KEY_${i}`]!);
        i++;
    }
    return keys;
}

/**
 * Retrieves a specific API key from the environment by its number.
 * @param keyNumber The number of the key to retrieve.
 * @returns The API key string, or the fallback key if the number is invalid.
 */
export function getApiKey(keyNumber?: number | null): string {
    if (keyNumber && keyNumber > 0) {
        const key = process.env[`GEMINI_API_KEY_${keyNumber}`];
        if (key) {
            return key;
        }
    }
    // Fallback to a default key if the user's key isn't found or is invalid
    return process.env.GEMINI_API_KEY_FALLBACK!;
}

/**
 * Finds the next available API key number to be assigned to a new user.
 * It checks which keys are already used in the Firestore 'users' collection.
 * @returns The number of the next available key, or 0 if all keys are assigned.
 */
export async function getNextAvailableApiKeyNumber(): Promise<number> {
    const apiKeyPool = getApiKeyPool();
    const totalKeys = apiKeyPool.length;

    if (totalKeys === 0) {
        return 0; // No keys in the pool
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('apiKeyNumber', '>', 0));
    
    try {
        const querySnapshot = await getDocs(q);

        const assignedKeyNumbers = new Set(
            querySnapshot.docs.map(doc => doc.data().apiKeyNumber as number)
        );

        for (let i = 1; i <= totalKeys; i++) {
            if (!assignedKeyNumbers.has(i)) {
                return i; // Found an unassigned key number
            }
        }
    } catch (error) {
        console.error("Error fetching assigned API keys from Firestore:", error);
        return 0; // Return 0 on error to prevent assigning a potentially duplicate key
    }


    return 0; // All keys are assigned
}

