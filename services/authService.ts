import { setAuthToken } from './geminiService';

type AuthEndpoint = '/api/signup' | '/api/login';

interface AuthCredentials {
    email: string;
    password: string;
}

interface AuthSuccessResponse {
    token: string;
}

const authenticate = async (endpoint: AuthEndpoint, credentials: AuthCredentials): Promise<AuthSuccessResponse> => {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const payload = await response.json().catch(() => ({ message: 'Authentication failed.' }));

    if (!response.ok) {
        const error = payload?.message || 'Unable to authenticate with the provided credentials.';
        throw new Error(error);
    }

    if (!payload?.token) {
        throw new Error('Authentication succeeded but no token was returned by the server.');
    }

    setAuthToken(payload.token);

    return { token: payload.token };
};

export const signup = async (credentials: AuthCredentials): Promise<AuthSuccessResponse> =>
    authenticate('/api/signup', credentials);

export const login = async (credentials: AuthCredentials): Promise<AuthSuccessResponse> =>
    authenticate('/api/login', credentials);

export type { AuthCredentials, AuthSuccessResponse };
