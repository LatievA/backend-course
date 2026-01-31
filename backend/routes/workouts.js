const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/workoutController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.get('/', ctrl.list);            // List with search, filter, pagination
router.get('/:id', ctrl.get);          // Get single workout

// Protected routes — only admin can create/update/delete
router.post('/', authenticate, authorize('admin'), [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid difficulty'),
    body('description').optional().isString()
], ctrl.create);

router.put('/:id', authenticate, authorize('admin'), [
    body('title').optional().isString().notEmpty().withMessage('Title cannot be empty'),
    body('duration').optional().isNumeric().withMessage('Duration must be a number'),
    body('difficulty').optional().isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid difficulty'),
    body('description').optional().isString()
], ctrl.update);

router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
