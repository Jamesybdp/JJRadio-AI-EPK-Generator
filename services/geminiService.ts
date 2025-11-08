import type { ArtistInput, EpkOutput } from '../types';

export const generateEpk = async (data: ArtistInput, token: string | null): Promise<EpkOutput> => {
    if (!token) {
        throw new Error('401: Authentication token is missing.');
    }

    try {
        const response = await fetch('/api/generate-epk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (response.status === 401 || response.status === 403) {
            throw new Error(`${response.status}: Authentication failed. Please log in again.`);
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown server error occurred.' }));
            throw new Error(errorData.message || `Server responded with status: ${response.status}`);
        }

        return await response.json() as EpkOutput;

    // FIX: Added curly braces to define the catch block scope, which resolves the undefined 'error' variable issue.
    } catch (error) {
        console.error("Error calling backend service:", error);
        // Re-throw the error so it can be caught by the component.
        if (error instanceof Error) {
            throw new Error(`Failed to generate EPK: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while generating the EPK.");
    }
};
