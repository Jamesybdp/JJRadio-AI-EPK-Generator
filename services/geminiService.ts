
import type { ArtistInput, EpkOutput } from '../types';

export const generateEpk = async (data: ArtistInput): Promise<EpkOutput> => {
    try {
        // This function now calls a backend API endpoint, which will securely handle the call to the Gemini API.
        // This aligns with the architectural vision of moving logic and API keys to the server.
        const response = await fetch('/api/generate-epk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown server error occurred.' }));
            throw new Error(errorData.message || `Server responded with status: ${response.status}`);
        }

        return await response.json() as EpkOutput;

    } catch (error) {
        console.error("Error calling backend service:", error);
        // Re-throw the error so it can be caught by the component.
        if (error instanceof Error) {
            throw new Error(`Failed to generate EPK: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while generating the EPK.");
    }
};
