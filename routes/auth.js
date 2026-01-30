const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', [
  body('email').isEmail().withMessage('Email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').optional().isIn(['user','admin'])
], authController.register);

router.post('/login', authController.login);

module.exports = router;