const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  duration: { type: Number, required: true, min: 0 },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  description: String,
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
}, { timestamps: true });

module.exports = mongoose.model('Workout', WorkoutSchema);