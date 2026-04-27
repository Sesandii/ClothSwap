import { currentUser } from '../data/mockData';

export type StoredUser = {
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

export function saveAuth(token: string, user: StoredUser) {
    if (!isBrowser) return;
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredToken() {
    if (!isBrowser) return null;
    return window.localStorage.getItem(TOKEN_KEY);
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

export function logout() {
    if (!isBrowser) return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
}
