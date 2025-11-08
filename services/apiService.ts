import type { ArtistInput, EpkOutput } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';
const AUTH_STORAGE_KEY = 'jjradio_auth_token';

const buildHeaders = (contentType: string | null = 'application/json') => {
  const headers: Record<string, string> = {};

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

export const setAuthToken = (token: string | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const generateEpk = async (data: ArtistInput): Promise<EpkOutput> => {
  const response = await fetch(`${API_BASE_URL}/api/generate-epk`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = (errorBody && errorBody.message) || 'Failed to generate EPK.';
    throw new Error(message);
  }

  return response.json();
};

export const downloadEpkAsPdf = async (filenameSlug: string) => {
  const response = await fetch(`${API_BASE_URL}/api/epks/${encodeURIComponent(filenameSlug)}/pdf`, {
    method: 'GET',
    headers: buildHeaders(null)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = (errorBody && errorBody.message) || 'Failed to download EPK PDF.';
    throw new Error(message);
  }

  if (typeof window === 'undefined') {
    return;
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);

  try {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${filenameSlug}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    window.URL.revokeObjectURL(downloadUrl);
  }
};
