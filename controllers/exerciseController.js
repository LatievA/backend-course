const { validationResult } = require('express-validator');
const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const workout = await Workout.findById(req.body.workout);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });

    const ex = new Exercise(req.body);
    await ex.save();

    workout.exercises.push(ex._id);
    await workout.save();

    res.status(201).json(ex);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const items = await Exercise.find().populate('workout').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const ex = await Exercise.findById(req.params.id).populate('workout');
    if (!ex) return res.status(404).json({ message: 'Exercise not found' });
    res.json(ex);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Exercise not found' });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const ex = await Exercise.findById(req.params.id);
    if (!ex) return res.status(404).json({ message: 'Exercise not found' });

    await Workout.findByIdAndUpdate(ex.workout, { $pull: { exercises: ex._id } });
    await ex.deleteOne();
    res.status(204).send();
  } catch (err) { next(err); }
};