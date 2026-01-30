const { validationResult } = require('express-validator');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const w = new Workout(req.body);
    await w.save();
    res.status(201).json(w);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const list = await Workout.find().populate('exercises').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const w = await Workout.findById(req.params.id).populate('exercises');
    if (!w) return res.status(404).json({ message: 'Workout not found' });
    res.json(w);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Workout not found' });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    // remove exercises belonging to this workout
    await Exercise.deleteMany({ workout: req.params.id });
    await Workout.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};