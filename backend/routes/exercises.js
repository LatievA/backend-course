const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/exerciseController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.get('/', ctrl.list);       // List with search, pagination
router.get('/:id', ctrl.get);     // Get single exercise

// Protected routes — only admin can create/update/delete
router.post('/', authenticate, authorize('admin'), [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('sets').isInt({ min: 1 }).withMessage('Sets must be at least 1'),
    body('reps').isInt({ min: 1 }).withMessage('Reps must be at least 1'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('workout').isString().notEmpty().withMessage('Workout ID is required')
], ctrl.create);

router.put('/:id', authenticate, authorize('admin'), [
    body('name').optional().isString().notEmpty().withMessage('Name cannot be empty'),
    body('sets').optional().isInt({ min: 1 }).withMessage('Sets must be at least 1'),
    body('reps').optional().isInt({ min: 1 }).withMessage('Reps must be at least 1'),
    body('description').optional().isString().withMessage('Description must be a string')
], ctrl.update);

router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
