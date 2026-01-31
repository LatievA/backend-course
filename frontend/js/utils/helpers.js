import { getToken } from '../state.js';

// Get authorization headers
export function authHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

// Handle API response
export async function handleResponse(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message || data?.errors?.[0]?.msg || 'An error occurred';
        throw new Error(message);
    }

    return data;
}

// Show toast notification
export function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toastId = `toast-${Date.now()}`;
    const bgClass = type === 'success' ? 'bg-success' :
        type === 'error' ? 'bg-danger' :
            type === 'warning' ? 'bg-warning' : 'bg-info';

    const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });
    toast.show();

    // Remove toast element after it's hidden
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

// Format date
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Get difficulty badge class
export function getDifficultyBadgeClass(difficulty) {
    switch (difficulty) {
        case 'Beginner': return 'bg-success';
        case 'Intermediate': return 'bg-warning text-dark';
        case 'Advanced': return 'bg-danger';
        default: return 'bg-secondary';
    }
}
