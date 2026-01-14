const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sets: { type: Number, required: true, min: 1 },
  reps: { type: Number, required: true, min: 1 },
  workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Exercise', ExerciseSchema);
