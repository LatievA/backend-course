import { isAdmin } from '../state.js';
import * as workoutsApi from '../api/workouts.js';
import * as exercisesApi from '../api/exercises.js';
import { showToast, formatDate, getDifficultyBadgeClass } from '../utils/helpers.js';
import { DIFFICULTY_LEVELS, DEFAULT_PAGE_SIZE } from '../config.js';

// Current state
let currentPage = 1;
let currentSearch = '';
let currentDifficulty = '';

// Render workouts list
export function renderWorkouts(workoutsData) {
    const container = document.getElementById('workouts-container');
    if (!container) return;

    const { data: workouts, page, totalPages, total } = workoutsData;
    const admin = isAdmin();

    if (workouts.length === 0) {
        container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <i class="bi bi-info-circle me-2"></i>
          No workouts found. ${admin ? 'Create one to get started!' : ''}
        </div>
      </div>
    `;
        renderPagination(0, 0, 0);
        return;
    }

    container.innerHTML = workouts.map(workout => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 workout-card shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">${escapeHtml(workout.title)}</h5>
          <span class="badge ${getDifficultyBadgeClass(workout.difficulty)}">${workout.difficulty}</span>
        </div>
        <div class="card-body">
          <p class="card-text text-muted">
            <i class="bi bi-clock me-1"></i> ${workout.duration} minutes
          </p>
          ${workout.description ? `<p class="card-text">${escapeHtml(workout.description)}</p>` : ''}
          
          <h6 class="mt-3">
            <i class="bi bi-list-check me-1"></i> 
            Exercises (${workout.exercises?.length || 0})
          </h6>
          
          ${workout.exercises && workout.exercises.length > 0 ? `
            <ul class="list-group list-group-flush exercise-list">
              ${workout.exercises.map(ex => `
                <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>
                    <strong>${escapeHtml(ex.name)}</strong>
                    <small class="text-muted d-block">${ex.sets} sets × ${ex.reps} reps</small>
                  </span>
                  ${admin ? `
                    <div class="btn-group btn-group-sm admin-only">
                      <button class="btn btn-outline-primary btn-sm" onclick="window.openEditExerciseModal('${ex._id}', '${escapeHtml(ex.name)}', ${ex.sets}, ${ex.reps})" title="Edit">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-sm" onclick="window.handleDeleteExercise('${ex._id}')" title="Delete">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  ` : ''}
                </li>
              `).join('')}
            </ul>
          ` : '<p class="text-muted small">No exercises yet</p>'}
        </div>
        
        <div class="card-footer bg-transparent">
          <small class="text-muted">
            <i class="bi bi-calendar me-1"></i> Created ${formatDate(workout.createdAt)}
          </small>
          ${admin ? `
            <div class="btn-group float-end admin-only">
              <button class="btn btn-sm btn-outline-success" onclick="window.openAddExerciseModal('${workout._id}')" title="Add Exercise">
                <i class="bi bi-plus-lg"></i> Exercise
              </button>
              <button class="btn btn-sm btn-outline-primary" onclick="window.openEditWorkoutModal('${workout._id}', '${escapeHtml(workout.title)}', ${workout.duration}, '${workout.difficulty}', '${escapeHtml(workout.description || '')}')" title="Edit">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="window.handleDeleteWorkout('${workout._id}')" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

    renderPagination(page, totalPages, total);
}

// Render pagination
function renderPagination(page, totalPages, total) {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = total > 0 ? `<small class="text-muted">Showing ${total} workout${total !== 1 ? 's' : ''}</small>` : '';
        return;
    }

    let paginationHtml = `
    <nav>
      <ul class="pagination pagination-sm justify-content-center mb-0">
        <li class="page-item ${page <= 1 ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="window.changePage(${page - 1}); return false;">
            <i class="bi bi-chevron-left"></i>
          </a>
        </li>
  `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
            paginationHtml += `
        <li class="page-item ${i === page ? 'active' : ''}">
          <a class="page-link" href="#" onclick="window.changePage(${i}); return false;">${i}</a>
        </li>
      `;
        } else if (i === page - 2 || i === page + 2) {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    paginationHtml += `
        <li class="page-item ${page >= totalPages ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="window.changePage(${page + 1}); return false;">
            <i class="bi bi-chevron-right"></i>
          </a>
        </li>
      </ul>
    </nav>
    <small class="text-muted d-block text-center mt-2">
      Page ${page} of ${totalPages} (${total} total)
    </small>
  `;

    container.innerHTML = paginationHtml;
}

// Load workouts
export async function loadWorkouts(options = {}) {
    const container = document.getElementById('workouts-container');
    if (!container) return;

    // Show loading state
    container.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading workouts...</p>
    </div>
  `;

    try {
        const { search = currentSearch, difficulty = currentDifficulty, page = currentPage } = options;

        // Update current state
        currentSearch = search;
        currentDifficulty = difficulty;
        currentPage = page;

        const workoutsData = await workoutsApi.getWorkouts({ search, difficulty, page, limit: DEFAULT_PAGE_SIZE });
        renderWorkouts(workoutsData);
    } catch (err) {
        container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Failed to load workouts: ${err.message}
        </div>
      </div>
    `;
    }
}

// Change page
window.changePage = function (page) {
    if (page < 1) return;
    loadWorkouts({ page });
};

// Handle search
export function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input');
    const difficultySelect = document.getElementById('difficulty-filter');

    loadWorkouts({
        search: searchInput?.value || '',
        difficulty: difficultySelect?.value || '',
        page: 1
    });
}

// Reset search
export function resetSearch() {
    const searchInput = document.getElementById('search-input');
    const difficultySelect = document.getElementById('difficulty-filter');

    if (searchInput) searchInput.value = '';
    if (difficultySelect) difficultySelect.value = '';

    loadWorkouts({ search: '', difficulty: '', page: 1 });
}

// Create workout
export async function handleCreateWorkout(event) {
    event.preventDefault();

    const form = event.target;
    const title = form.querySelector('#workout-title').value;
    const duration = parseInt(form.querySelector('#workout-duration').value);
    const difficulty = form.querySelector('#workout-difficulty').value;
    const description = form.querySelector('#workout-description').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Creating...';

        await workoutsApi.createWorkout({ title, duration, difficulty, description });

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createWorkoutModal'));
        modal.hide();

        // Reset form
        form.reset();

        showToast('Workout created successfully!', 'success');
        loadWorkouts({ page: 1 });

    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Create Workout';
    }
}

// Open edit workout modal
window.openEditWorkoutModal = function (id, title, duration, difficulty, description) {
    document.getElementById('edit-workout-id').value = id;
    document.getElementById('edit-workout-title').value = title;
    document.getElementById('edit-workout-duration').value = duration;
    document.getElementById('edit-workout-difficulty').value = difficulty;
    document.getElementById('edit-workout-description').value = description;

    const modal = new bootstrap.Modal(document.getElementById('editWorkoutModal'));
    modal.show();
};

// Handle edit workout
export async function handleEditWorkout(event) {
    event.preventDefault();

    const form = event.target;
    const id = form.querySelector('#edit-workout-id').value;
    const title = form.querySelector('#edit-workout-title').value;
    const duration = parseInt(form.querySelector('#edit-workout-duration').value);
    const difficulty = form.querySelector('#edit-workout-difficulty').value;
    const description = form.querySelector('#edit-workout-description').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Saving...';

        await workoutsApi.updateWorkout(id, { title, duration, difficulty, description });

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editWorkoutModal'));
        modal.hide();

        showToast('Workout updated successfully!', 'success');
        loadWorkouts();

    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Save Changes';
    }
}

// Delete workout
window.handleDeleteWorkout = async function (id) {
    if (!confirm('Are you sure you want to delete this workout? This will also delete all exercises in it.')) {
        return;
    }

    try {
        await workoutsApi.deleteWorkout(id);
        showToast('Workout deleted successfully!', 'success');
        loadWorkouts();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

// Open add exercise modal
window.openAddExerciseModal = function (workoutId) {
    document.getElementById('exercise-workout-id').value = workoutId;
    document.getElementById('addExerciseForm').reset();
    document.getElementById('exercise-workout-id').value = workoutId;

    const modal = new bootstrap.Modal(document.getElementById('addExerciseModal'));
    modal.show();
};

// Handle add exercise
export async function handleAddExercise(event) {
    event.preventDefault();

    const form = event.target;
    const workoutId = form.querySelector('#exercise-workout-id').value;
    const name = form.querySelector('#exercise-name').value;
    const sets = parseInt(form.querySelector('#exercise-sets').value);
    const reps = parseInt(form.querySelector('#exercise-reps').value);
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Adding...';

        await exercisesApi.createExercise({ name, sets, reps, workout: workoutId });

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addExerciseModal'));
        modal.hide();

        // Reset form
        form.reset();

        showToast('Exercise added successfully!', 'success');
        loadWorkouts();

    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Add Exercise';
    }
}

// Open edit exercise modal
window.openEditExerciseModal = function (id, name, sets, reps) {
    document.getElementById('edit-exercise-id').value = id;
    document.getElementById('edit-exercise-name').value = name;
    document.getElementById('edit-exercise-sets').value = sets;
    document.getElementById('edit-exercise-reps').value = reps;

    const modal = new bootstrap.Modal(document.getElementById('editExerciseModal'));
    modal.show();
};

// Handle edit exercise
export async function handleEditExercise(event) {
    event.preventDefault();

    const form = event.target;
    const id = form.querySelector('#edit-exercise-id').value;
    const name = form.querySelector('#edit-exercise-name').value;
    const sets = parseInt(form.querySelector('#edit-exercise-sets').value);
    const reps = parseInt(form.querySelector('#edit-exercise-reps').value);
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Saving...';

        await exercisesApi.updateExercise(id, { name, sets, reps });

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editExerciseModal'));
        modal.hide();

        showToast('Exercise updated successfully!', 'success');
        loadWorkouts();

    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Save Changes';
    }
}

// Delete exercise
window.handleDeleteExercise = async function (id) {
    if (!confirm('Are you sure you want to delete this exercise?')) {
        return;
    }

    try {
        await exercisesApi.deleteExercise(id);
        showToast('Exercise deleted successfully!', 'success');
        loadWorkouts();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

// Helper to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
