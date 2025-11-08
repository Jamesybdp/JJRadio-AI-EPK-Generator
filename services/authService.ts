
/**
 * Authenticates a user with their email and password.
 * @param email The user's email address.
 * @param password The user's password.
 * @returns A promise that resolves with an object containing the authentication token.
 * @throws An error if the login request fails, if the server response is not ok, or if no token is provided.
 */
export const login = async (email: string, password: string): Promise<{ token: string }> => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Use the error message from the backend if available.
            throw new Error(data.message || `Server error: ${response.status}`);
        }

        // Assuming the backend responds with { token: "..." } on success.
        if (!data.token) {
            throw new Error('Authentication successful, but no token was provided.');
        }

        return data;
    } catch (error) {
        console.error('Login service error:', error);
        if (error instanceof Error) {
            // Rethrow a more generic message for network errors.
            if (error.message.includes('Failed to fetch')) {
                 throw new Error('Could not connect to the authentication service. Please try again later.');
            }
            throw error;
        }
        throw new Error('An unexpected error occurred during login.');
    }
};
