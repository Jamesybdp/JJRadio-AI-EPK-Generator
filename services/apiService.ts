
import type { ArtistInput, EpkOutput } from '../types';

/**
 * Generates an Electronic Press Kit (EPK) by sending artist data to the backend.
 * @param data The artist input data.
 * @param token The authentication token.
 * @returns A promise that resolves with the generated EPK data.
 * @throws An error if the authentication token is missing, if the request fails, or if the server response is not ok.
 */
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

    } catch (error) {
        console.error("Error calling backend service:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate EPK: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while generating the EPK.");
    }
};


/**
 * Downloads the generated EPK as a PDF file.
 * @param epkData The EPK data to be included in the PDF.
 * @param token The authentication token.
 * @returns A promise that resolves when the download is initiated.
 * @throws An error if the authentication token is missing or if the PDF generation fails on the server.
 */
export const downloadEpkAsPdf = async (epkData: EpkOutput, token: string | null): Promise<void> => {
    if (!token) {
        throw new Error('401: Authentication token is missing.');
    }

    const response = await fetch('/api/download-epk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(epkData),
    });

    if (!response.ok) {
        // You can add more specific error handling based on status codes if needed
        throw new Error('Failed to generate PDF on the server.');
    }

    // Process the response as a blob (binary file data)
    const blob = await response.blob();
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${epkData.filename_slug || 'jjradio-epk'}.pdf`; // Set the filename for the download
    document.body.appendChild(a);
    a.click(); // Programmatically click the link to start the download
    
    // Clean up by removing the temporary element and revoking the object URL
    a.remove();
    window.URL.revokeObjectURL(url);
};
