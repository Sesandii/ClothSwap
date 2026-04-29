import { getStoredToken, logout } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

const isBrowser = typeof window !== 'undefined';
const AUTH_PAGES = ['/login', '/register', '/admin/login'];

const handleUnauthorized = () => {
    if (!isBrowser) {
        return;
    }

    const currentPath = window.location.pathname;

    if (AUTH_PAGES.includes(currentPath)) {
        return;
    }

    logout();
    const redirectTo = encodeURIComponent(currentPath + window.location.search);
    window.location.assign(`/login?reason=session-expired&redirect=${redirectTo}`);
};

export async function apiFetch(path: string, init?: RequestInit) {
    const token = getStoredToken();
    const headers = new Headers(init?.headers || {});

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(apiUrl(path), {
        ...init,
        headers
    });

    if (response.status === 401) {
        handleUnauthorized();
    }

    return response;
}

// Favorites API endpoints
export async function toggleFavorite(clothesId: string) {
    return apiFetch(`/api/favorites/${clothesId}`, {
        method: 'POST',
    });
}

export async function getFavorites() {
    return apiFetch('/api/favorites', {
        method: 'GET',
    });
}

export async function checkIsFavorited(clothesId: string) {
    return apiFetch(`/api/favorites/check/${clothesId}`, {
        method: 'GET',
    });
}

export async function removeFavorite(clothesId: string) {
    return apiFetch(`/api/favorites/${clothesId}`, {
        method: 'DELETE',
    });
}
