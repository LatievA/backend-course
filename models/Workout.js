const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  duration: { type: Number, required: true, min: 0 }, // minutes
  difficulty: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  description: { type: String },
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
}, { timestamps: true });

module.exports = mongoose.model('Workout', WorkoutSchema);
