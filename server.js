require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const workoutsRouter = require('./routes/workouts');
const exercisesRouter = require('./routes/exercises');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/workouts', workoutsRouter);
app.use('/api/exercises', exercisesRouter);

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

start();
