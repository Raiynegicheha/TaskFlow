import { Schema, model } from 'mongoose';

// Define a schema - the structure of your data
const testSchema = new Schema({
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
export default model('Test', testSchema);