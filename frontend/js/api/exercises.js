import { API_URL, DEFAULT_PAGE_SIZE } from '../config.js';
import { authHeaders, handleResponse } from '../utils/helpers.js';

// Get all exercises with optional search and pagination
export async function getExercises(options = {}) {
    const { search = '', workout = '', page = 1, limit = DEFAULT_PAGE_SIZE } = options;

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (workout) params.append('workout', workout);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await fetch(`${API_URL}/exercises?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
}

// Get single exercise by ID
export async function getExercise(id) {
    const response = await fetch(`${API_URL}/exercises/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
}

// Create new exercise (admin only)
export async function createExercise(data) {
    const response = await fetch(`${API_URL}/exercises`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

// Update exercise (admin only)
export async function updateExercise(id, data) {
    const response = await fetch(`${API_URL}/exercises/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
}

// Delete exercise (admin only)
export async function deleteExercise(id) {
    const response = await fetch(`${API_URL}/exercises/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Failed to delete exercise');
    }

    return true;
}
