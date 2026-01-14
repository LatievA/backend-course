const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');

const router = express.Router();

// POST /api/exercises - create exercise
router.post('/',
  [
    body('name').isString().notEmpty(),
    body('sets').isInt({ min: 1 }),
    body('reps').isInt({ min: 1 }),
    body('workout').isString().notEmpty()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const workoutId = req.body.workout;
      if (!mongoose.Types.ObjectId.isValid(workoutId)) return res.status(400).json({ message: 'Invalid workout id' });
      const workout = await Workout.findById(workoutId);
      if (!workout) return res.status(404).json({ message: 'Workout not found' });

      const ex = new Exercise(req.body);
      await ex.save();

      workout.exercises.push(ex._id);
      await workout.save();

      res.status(201).json(ex);
    } catch (err) { next(err); }
  }
);

// GET /api/exercises - get all exercises
router.get('/', async (req, res, next) => {
  try {
    const items = await Exercise.find().populate('workout').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
});

// GET /api/exercises/:id - get exercise by id
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
    const item = await Exercise.findById(req.params.id).populate('workout');
    if (!item) return res.status(404).json({ message: 'Exercise not found' });
    res.json(item);
  } catch (err) { next(err); }
});

// PUT /api/exercises/:id - update exercise by id
router.put('/:id',
  [
    body('name').optional().isString().notEmpty(),
    body('sets').optional().isInt({ min: 1 }),
    body('reps').optional().isInt({ min: 1 })
  ],
  async (req, res, next) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: 'Exercise not found' });
      res.json(updated);
    } catch (err) { next(err); }
  }
);

// DELETE /api/exercises/:id - delete exercise by id
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
    const ex = await Exercise.findById(req.params.id);
    if (!ex) return res.status(404).json({ message: 'Exercise not found' });

    // remove reference from workout
    await Workout.findByIdAndUpdate(ex.workout, { $pull: { exercises: ex._id } });
    await ex.deleteOne();
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;
