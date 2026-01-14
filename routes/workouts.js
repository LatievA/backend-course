const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

const router = express.Router();

// POST /api/workouts  - create
router.post('/',
  [
    body('title').isString().notEmpty(),
    body('duration').isNumeric(),
    body('difficulty').isIn(['Beginner','Intermediate','Advanced']),
    body('description').optional().isString()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const workout = new Workout(req.body);
      await workout.save();
      res.status(201).json(workout);
    } catch (err) { next(err); }
  }
);

// GET /api/workouts - list (populate exercises)
router.get('/', async (req, res, next) => {
  try {
    const list = await Workout.find().populate('exercises').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
});

// GET /api/workouts/:id - single
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
    const item = await Workout.findById(req.params.id).populate('exercises');
    if (!item) return res.status(404).json({ message: 'Workout not found' });
    res.json(item);
  } catch (err) { next(err); }
});

// PUT /api/workouts/:id - update
router.put('/:id',
  [
    body('title').optional().isString().notEmpty(),
    body('duration').optional().isNumeric(),
    body('difficulty').optional().isIn(['Beginner','Intermediate','Advanced']),
    body('description').optional().isString()
  ],
  async (req, res, next) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: 'Workout not found' });
      res.json(updated);
    } catch (err) { next(err); }
  }
);

// DELETE /api/workouts/:id - remove (also remove exercises)
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
    const w = await Workout.findById(req.params.id);
    if (!w) return res.status(404).json({ message: 'Workout not found' });

    // remove related exercises
    await Exercise.deleteMany({ workout: w._id });
    await w.deleteOne();
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;
