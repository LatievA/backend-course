// Main entry point for the application
import { updateAuthUI, handleLogin, handleRegister, handleLogout, handleProfileUpdate, loadProfileData } from './ui/auth.js';
import { loadWorkouts, handleSearch, resetSearch, handleCreateWorkout, handleEditWorkout, handleAddExercise, handleEditExercise } from './ui/workouts.js';

// Initialize the application
function init() {
    // Update auth UI on load
    updateAuthUI();

    // Load initial workouts
    loadWorkouts();

    // Set up event listeners
    setupEventListeners();

    // Listen for auth changes
    window.addEventListener('auth-changed', () => {
        loadWorkouts({ page: 1 });
    });
}

// Set up all event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Logout button
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    // Profile button - load data when modal opens
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        profileModal.addEventListener('show.bs.modal', loadProfileData);
    }

    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Search form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    // Reset search button
    const resetBtn = document.getElementById('reset-search-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSearch);
    }

    // Create workout form
    const createWorkoutForm = document.getElementById('createWorkoutForm');
    if (createWorkoutForm) {
        createWorkoutForm.addEventListener('submit', handleCreateWorkout);
    }

    // Edit workout form
    const editWorkoutForm = document.getElementById('editWorkoutForm');
    if (editWorkoutForm) {
        editWorkoutForm.addEventListener('submit', handleEditWorkout);
    }

    // Add exercise form
    const addExerciseForm = document.getElementById('addExerciseForm');
    if (addExerciseForm) {
        addExerciseForm.addEventListener('submit', handleAddExercise);
    }

    // Edit exercise form
    const editExerciseForm = document.getElementById('editExerciseForm');
    if (editExerciseForm) {
        editExerciseForm.addEventListener('submit', handleEditExercise);
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
