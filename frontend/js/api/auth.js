import { API_URL } from '../config.js';
import { authHeaders, handleResponse } from '../utils/helpers.js';

// Register new user
export async function register(email, password, name = '') {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
    });
    return handleResponse(response);
}

// Login user
export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
}

// Get current user profile
export async function getMe() {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: authHeaders()
    });
    return handleResponse(response);
}

// Update current user profile
export async function updateMe(data) {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}
