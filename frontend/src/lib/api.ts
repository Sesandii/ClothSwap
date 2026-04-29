const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

export async function apiFetch(path: string, init?: RequestInit) {
    return fetch(apiUrl(path), {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers || {})
        }
    });
}
