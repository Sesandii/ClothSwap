import { currentUser } from '../data/mockData';

export type StoredUser = {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    profilePic?: string;
    avatar?: string;
};

const TOKEN_KEY = 'clothswap_token';
const USER_KEY = 'clothswap_user';

const isBrowser = typeof window !== 'undefined';

const normalizeToken = (value: string | null) => {
    if (!value) {
        return null;
    }

    const token = value.trim();

    if (!token || token === 'null' || token === 'undefined') {
        return null;
    }

    return token;
};

export function saveAuth(token: string, user: StoredUser) {
    if (!isBrowser) return;

    const normalizedToken = normalizeToken(token);

    if (!normalizedToken) {
        return;
    }

    window.localStorage.setItem(TOKEN_KEY, normalizedToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredToken() {
    if (!isBrowser) return null;

    const token = normalizeToken(window.localStorage.getItem(TOKEN_KEY));

    if (!token) {
        window.localStorage.removeItem(TOKEN_KEY);
        return null;
    }

    return token;
}

export function getStoredUser(): StoredUser {
    if (!isBrowser) return currentUser;

    const rawUser = window.localStorage.getItem(USER_KEY);
    if (!rawUser) return currentUser;

    try {
        const parsed = JSON.parse(rawUser) as StoredUser;
        const name = parsed.name || currentUser.name;

        return {
            ...currentUser,
            ...parsed,
            avatar:
                parsed.avatar ||
                parsed.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e8786f&color=fff`
        };
    } catch {
        return currentUser;
    }
}

export function getAuthenticatedUser(): StoredUser | null {
    if (!isBrowser) return null;
    if (!getStoredToken()) return null;

    const rawUser = window.localStorage.getItem(USER_KEY);
    if (!rawUser) return null;

    try {
        const parsed = JSON.parse(rawUser) as StoredUser;
        const name = parsed.name || currentUser.name;

        return {
            ...parsed,
            avatar:
                parsed.avatar ||
                parsed.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e8786f&color=fff`
        };
    } catch {
        return null;
    }
}

export function logout() {
    if (!isBrowser) return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
}
