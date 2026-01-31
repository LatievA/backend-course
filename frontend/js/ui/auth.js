import { getUser, isAuthenticated, isAdmin, clearAuth, saveAuth } from '../state.js';
import * as authApi from '../api/auth.js';
import { showToast } from '../utils/helpers.js';

// Update auth UI based on current state
export function updateAuthUI() {
    const user = getUser();
    const authenticated = isAuthenticated();
    const admin = isAdmin();

    // Auth buttons in navbar
    const loginBtn = document.getElementById('nav-login-btn');
    const registerBtn = document.getElementById('nav-register-btn');
    const logoutBtn = document.getElementById('nav-logout-btn');
    const profileBtn = document.getElementById('nav-profile-btn');
    const userInfo = document.getElementById('nav-user-info');

    if (loginBtn) loginBtn.classList.toggle('d-none', authenticated);
    if (registerBtn) registerBtn.classList.toggle('d-none', authenticated);
    if (logoutBtn) logoutBtn.classList.toggle('d-none', !authenticated);
    if (profileBtn) profileBtn.classList.toggle('d-none', !authenticated);

    if (userInfo && authenticated && user) {
        userInfo.classList.remove('d-none');
        userInfo.innerHTML = `
      <span class="navbar-text me-2">
        <i class="bi bi-person-circle me-1"></i>
        ${user.name || user.email}
        ${admin ? '<span class="badge bg-danger ms-1">Admin</span>' : ''}
      </span>
    `;
    } else if (userInfo) {
        userInfo.classList.add('d-none');
        userInfo.innerHTML = '';
    }

    // Admin-only elements
    document.querySelectorAll('.admin-only').forEach(el => {
        el.classList.toggle('d-none', !admin);
    });

    // Authenticated-only elements
    document.querySelectorAll('.auth-only').forEach(el => {
        el.classList.toggle('d-none', !authenticated);
    });

    // Guest-only elements
    document.querySelectorAll('.guest-only').forEach(el => {
        el.classList.toggle('d-none', authenticated);
    });
}

// Handle login form submission
export async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.querySelector('#login-email').value;
    const password = form.querySelector('#login-password').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Logging in...';

        const { token, user } = await authApi.login(email, password);
        saveAuth(token, user);

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();

        // Reset form
        form.reset();

        // Update UI
        updateAuthUI();
        showToast('Login successful!', 'success');

        // Trigger workouts reload
        window.dispatchEvent(new CustomEvent('auth-changed'));

    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Login';
    }
}

// Handle register form submission
export async function handleRegister(event) {
    event.preventDefault();

    const form = event.target;
    const name = form.querySelector('#register-name').value;
    const email = form.querySelector('#register-email').value;
    const password = form.querySelector('#register-password').value;
    const confirmPassword = form.querySelector('#register-confirm-password').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validate passwords match
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Registering...';

        const { token, user } = await authApi.register(email, password, name);
        saveAuth(token, user);

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        modal.hide();

        // Reset form
        form.reset();

        // Update UI
        updateAuthUI();
        showToast('Registration successful! Welcome!', 'success');

        // Trigger workouts reload
        window.dispatchEvent(new CustomEvent('auth-changed'));

    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Register';
    }
}

// Handle logout
export function handleLogout() {
    clearAuth();
    updateAuthUI();
    showToast('Logged out successfully', 'info');

    // Trigger workouts reload
    window.dispatchEvent(new CustomEvent('auth-changed'));
}

// Handle profile form submission
export async function handleProfileUpdate(event) {
    event.preventDefault();

    const form = event.target;
    const name = form.querySelector('#profile-name').value;
    const email = form.querySelector('#profile-email').value;
    const password = form.querySelector('#profile-password').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    const updateData = { name, email };
    if (password) {
        updateData.password = password;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Updating...';

        const updatedUser = await authApi.updateMe(updateData);

        // Update stored user data
        const currentUser = getUser();
        saveAuth(localStorage.getItem('workout_token'), {
            ...currentUser,
            name: updatedUser.name,
            email: updatedUser.email
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
        modal.hide();

        // Reset password field
        form.querySelector('#profile-password').value = '';

        // Update UI
        updateAuthUI();
        showToast('Profile updated successfully!', 'success');

    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Save Changes';
    }
}

// Load profile data into modal
export function loadProfileData() {
    const user = getUser();
    if (!user) return;

    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
}
