// State management for authentication
const TOKEN_KEY = 'workout_token';
const USER_KEY = 'workout_user';

// Get token from localStorage
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Get user from localStorage
export function getUser() {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    try {
        return JSON.parse(userJson);
    } catch {
        return null;
    }
}

// Save auth data to localStorage
export function saveAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Clear auth data from localStorage
export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// Check if user is authenticated
export function isAuthenticated() {
    return !!getToken();
}

// Check if user is admin
export function isAdmin() {
    const user = getUser();
    return user && user.role === 'admin';
}
