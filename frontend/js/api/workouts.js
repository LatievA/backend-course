import { API_URL, DEFAULT_PAGE_SIZE } from '../config.js';
import { authHeaders, handleResponse } from '../utils/helpers.js';

// Get all workouts with optional search, filter, and pagination
export async function getWorkouts(options = {}) {
    const { search = '', difficulty = '', page = 1, limit = DEFAULT_PAGE_SIZE } = options;

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (difficulty) params.append('difficulty', difficulty);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await fetch(`${API_URL}/workouts?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
}

// Get single workout by ID
export async function getWorkout(id) {
    const response = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
}

// Create new workout (admin only)
export async function createWorkout(data) {
    const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

// Update workout (admin only)
export async function updateWorkout(id, data) {
    const response = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

// Delete workout (admin only)
export async function deleteWorkout(id) {
    const response = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Failed to delete workout');
    }

    return true;
}
