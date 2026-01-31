const { validationResult } = require('express-validator');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

// Create workout (admin only)
exports.create = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const w = new Workout(req.body);
        await w.save();
        res.status(201).json(w);
    } catch (err) {
        next(err);
    }
};

// List workouts with search, filter, and pagination
exports.list = async (req, res, next) => {
    try {
        const { search, difficulty, page = 1, limit = 10 } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));
        const skip = (pageNum - 1) * limitNum;

        // Build query filter
        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (difficulty && ['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
            filter.difficulty = difficulty;
        }

        // Get total count for pagination
        const total = await Workout.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);

        // Fetch paginated results
        const data = await Workout.find(filter)
            .populate('exercises')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.json({
            data,
            page: pageNum,
            limit: limitNum,
            total,
            totalPages
        });
    } catch (err) {
        next(err);
    }
};

// Get single workout by ID
exports.get = async (req, res, next) => {
    try {
        const w = await Workout.findById(req.params.id).populate('exercises');
        if (!w) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json(w);
    } catch (err) {
        next(err);
    }
};

// Update workout (admin only)
exports.update = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const updated = await Workout.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('exercises');

        if (!updated) {
            return res.status(404).json({ message: 'Workout not found' });
        }
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// Delete workout (admin only) - cascades to exercises
exports.remove = async (req, res, next) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        // Remove exercises belonging to this workout
        await Exercise.deleteMany({ workout: req.params.id });
        await Workout.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
