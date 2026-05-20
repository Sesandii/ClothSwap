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

export async function getUnreadMessageCount() {
    return apiFetch('/api/messages/unread-count', {
        method: 'GET',
    });
}

export async function getConversationWithUser(userId: string) {
    return apiFetch(`/api/messages/conversations/${userId}`, {
        method: 'GET',
    });
}

export async function markMessagesReadFromUser(userId: string) {
    return apiFetch(`/api/messages/conversations/${userId}/read`, {
        method: 'PATCH',
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

// Admin endpoints
export async function getAdminDashboard() {
    return apiFetch('/api/admin/dashboard', { method: 'GET' });
}

export async function getAdminUsers() {
    return apiFetch('/api/admin/users', { method: 'GET' });
}

export async function updateAdminUserStatus(userId: string, status: 'active' | 'blocked') {
    return apiFetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}

export async function updateAdminUserRole(userId: string, role: 'user' | 'admin') {
    return apiFetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
    });
}

export async function deleteAdminUser(userId: string) {
    return apiFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
}

export async function getAdminClothes() {
    return apiFetch('/api/admin/clothes', { method: 'GET' });
}

export async function updateAdminClothesApproval(clothesId: string, approvalStatus: 'pending' | 'approved' | 'rejected') {
    return apiFetch(`/api/admin/clothes/${clothesId}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approvalStatus }),
    });
}

export async function deleteAdminClothes(clothesId: string) {
    return apiFetch(`/api/admin/clothes/${clothesId}`, { method: 'DELETE' });
}

export async function getAdminSwaps() {
    return apiFetch('/api/admin/swaps', { method: 'GET' });
}

export async function getAdminComplaints() {
    return apiFetch('/api/admin/complaints', { method: 'GET' });
}

export async function updateAdminComplaintStatus(complaintId: string, status: 'pending' | 'investigating' | 'resolved') {
    return apiFetch(`/api/admin/complaints/${complaintId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}

export async function updateAdminSwap(swapId: string, payload: Record<string, any>) {
    return apiFetch(`/api/admin/swaps/${swapId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
}

export async function deleteAdminSwap(swapId: string) {
    return apiFetch(`/api/admin/swaps/${swapId}`, { method: 'DELETE' });
}

export async function getAdminCategories() {
    return apiFetch('/api/admin/categories', { method: 'GET' });
}

export async function getPublicCategories() {
    return apiFetch('/api/clothes/categories', { method: 'GET' });
}

export async function createAdminCategory(name: string, sizes: string[]) {
    return apiFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name, sizes }),
    });
}

export async function updateAdminCategory(categoryId: string, name: string, sizes: string[]) {
    return apiFetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify({ name, sizes }),
    });
}

export async function deleteAdminCategory(categoryId: string) {
    return apiFetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
}

export async function getAdminReviews() {
    return apiFetch('/api/admin/reviews', { method: 'GET' });
}

export async function deleteAdminReview(reviewId: string) {
    return apiFetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' });
}

export async function getAdminSettings() {
    return apiFetch('/api/admin/settings', { method: 'GET' });
}

export async function getCollectionPoints() {
    return apiFetch('/api/collection-points', { method: 'GET' });
}

export async function getPublicSettings() {
    return apiFetch('/api/settings/public', { method: 'GET' });
}

export async function updateAdminSettings(payload: Record<string, any>) {
    return apiFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
}

export async function createAdminCollectionPoint(payload: Record<string, any>) {
    return apiFetch('/api/admin/collection-points', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function updateAdminCollectionPoint(pointId: string, payload: Record<string, any>) {
    return apiFetch(`/api/admin/collection-points/${pointId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
}

export async function deleteAdminCollectionPoint(pointId: string) {
    return apiFetch(`/api/admin/collection-points/${pointId}`, { method: 'DELETE' });
}
