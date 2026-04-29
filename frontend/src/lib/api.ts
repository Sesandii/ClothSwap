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

// User endpoints
export async function getCurrentUser() {
    const res = await apiFetch('/api/users/me', { method: 'GET' });
    return res;
}

export async function updateCurrentUser(payload: Record<string, any>) {
    const res = await apiFetch('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
    return res;
}

// Clothes endpoints
export async function getMyClothes() {
    return apiFetch('/api/clothes/me', { method: 'GET' });
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

// Messages endpoints
export async function getMessageConversations() {
    return apiFetch('/api/messages/conversations', {
        method: 'GET',
    });
}

export async function getConversationWithUser(userId: string) {
    return apiFetch(`/api/messages/conversations/${userId}`, {
        method: 'GET',
    });
}

export async function sendMessageToUser(userId: string, text: string) {
    return apiFetch(`/api/messages/conversations/${userId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text }),
    });
}

// Notifications endpoints
export async function getNotifications() {
    return apiFetch('/api/notifications', {
        method: 'GET',
    });
}

export async function getUnreadNotificationCount() {
    return apiFetch('/api/notifications/unread-count', {
        method: 'GET',
    });
}

export async function markNotificationRead(notificationId: string) {
    return apiFetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
    });
}

export async function markAllNotificationsRead() {
    return apiFetch('/api/notifications/read-all', {
        method: 'PATCH',
    });
}
