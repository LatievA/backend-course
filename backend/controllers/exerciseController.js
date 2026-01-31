const { validationResult } = require('express-validator');
const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');

// Create exercise (admin only)
exports.create = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const workout = await Workout.findById(req.body.workout);
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        const ex = new Exercise(req.body);
        await ex.save();

        // Add exercise to workout's exercises array
        workout.exercises.push(ex._id);
        await workout.save();

        res.status(201).json(ex);
    } catch (err) {
        next(err);
    }
};

// List exercises with search and pagination
exports.list = async (req, res, next) => {
    try {
        const { search, workout, page = 1, limit = 10 } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));
        const skip = (pageNum - 1) * limitNum;

        // Build query filter
        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        if (workout) {
            filter.workout = workout;
        }

        // Get total count for pagination
        const total = await Exercise.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);

        // Fetch paginated results
        const data = await Exercise.find(filter)
            .populate('workout')
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

// Get single exercise by ID
exports.get = async (req, res, next) => {
    try {
        const ex = await Exercise.findById(req.params.id).populate('workout');
        if (!ex) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.json(ex);
    } catch (err) {
        next(err);
    }
};

// Update exercise (admin only)
exports.update = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const updated = await Exercise.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('workout');

        if (!updated) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// Delete exercise (admin only)
exports.remove = async (req, res, next) => {
    try {
        const ex = await Exercise.findById(req.params.id);
        if (!ex) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        // Remove exercise from workout's exercises array
        await Workout.findByIdAndUpdate(ex.workout, { $pull: { exercises: ex._id } });
        await ex.deleteOne();
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
