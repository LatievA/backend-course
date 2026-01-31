const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
    return jwt.sign({
        id: user._id,
        role: user.role,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
}

// Register - role is NOT allowed in body (admin created via seed only)
exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, name } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Force role to 'user' - admins can only be created via seed script
        const user = new User({ email, password, name, role: 'user' });
        await user.save();

        const token = signToken(user);
        res.status(201).json({
            token,
            user: { id: user._id, email: user.email, role: user.role, name: user.name }
        });
    } catch (err) {
        next(err);
    }
};

// Login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const ok = await user.comparePassword(password);
        if (!ok) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user);
        res.json({
            token,
            user: { id: user._id, email: user.email, role: user.role, name: user.name }
        });
    } catch (err) {
        next(err);
    }
};

// Get current user profile
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

// Update current user profile
exports.updateMe = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (email !== undefined) {
            // Check if email is already taken by another user
            const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (existing) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            updateData.email = email;
        }

        let user;
        if (password) {
            // If password is being changed, we need to use save() to trigger the pre-save hook
            user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            Object.assign(user, updateData);
            user.password = password;
            await user.save();
        } else {
            user = await User.findByIdAndUpdate(
                req.user.id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        }

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json(userResponse);
    } catch (err) {
        next(err);
    }
};
