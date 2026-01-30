const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/exerciseController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', ctrl.list);       // public
router.get('/:id', ctrl.get);     // public

// Protected — only admin can create/update/delete
router.post('/', authenticate, authorize('admin'), [
  body('name').isString().notEmpty(),
  body('sets').isInt({ min: 1 }),
  body('reps').isInt({ min: 1 }),
  body('workout').isString().notEmpty()
], ctrl.create);

router.put('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
