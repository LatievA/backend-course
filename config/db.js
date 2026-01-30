const mongoose = require('mongoose');

async function connect(uri) {
  await mongoose.connect(uri, {
    // modern mongoose no longer requires useNewUrlParser/useUnifiedTopology flags
  });
  console.log('MongoDB connected');
}

module.exports = { connect };