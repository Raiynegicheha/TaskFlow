const mongoose = require('mongoose');

// Define a schema - the structure of your data
const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create model from schema
module.exports = mongoose.model('Test', testSchema);