const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

// Public routes
router.post('/register', [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().isString().trim()
], authController.register);

router.post('/login', authController.login);

// Protected routes (require authentication)
router.get('/me', authenticate, authController.getMe);

router.put('/me', authenticate, [
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().isString().trim()
], authController.updateMe);

module.exports = router;
