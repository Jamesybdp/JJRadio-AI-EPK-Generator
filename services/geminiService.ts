
import type { ArtistInput, EpkOutput } from '../types';

const TOKEN_STORAGE_KEY = 'jjradio-auth-token';

export class UnauthorizedError extends Error {
    constructor(message = 'Authentication required. Please log in again.') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getAuthToken = (): string | null => {
    if (!isBrowser) {
        return null;
    }
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setAuthToken = (token: string | null): void => {
    if (!isBrowser) {
        return;
    }
    if (token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
};

export const clearAuthToken = (): void => {
    setAuthToken(null);
};

export const generateEpk = async (data: ArtistInput): Promise<EpkOutput> => {
    try {
        // This function now calls a backend API endpoint, which will securely handle the call to the Gemini API.
        // This aligns with the architectural vision of moving logic and API keys to the server.
        const token = getAuthToken();
        const response = await fetch('/api/generate-epk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            if (response.status === 401) {
                clearAuthToken();
                throw new UnauthorizedError();
            }
            const errorData = await response.json().catch(() => ({ message: 'An unknown server error occurred.' }));
            throw new Error(errorData.message || `Server responded with status: ${response.status}`);
        }

        return await response.json() as EpkOutput;

    } catch (error) {
        console.error("Error calling backend service:", error);
        if (error instanceof UnauthorizedError) {
            throw error;
        }
        // Re-throw the error so it can be caught by the component.
        if (error instanceof Error) {
            throw new Error(`Failed to generate EPK: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while generating the EPK.");
    }
};
