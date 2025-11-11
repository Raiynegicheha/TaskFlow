// import { Schema, model } from "mongoose";
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [3, "Project name is required"],
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      maxlength: [500, "Description is required"],
    },
    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed", "cancelled"],
      default: "planning",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    color: {
      type: String,
      default: "#3b82f6", //Default blue color
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);


//Index for faster queries
projectSchema.index({owner: 1, status: 1});
projectSchema.index({ teamMembers: 1});

//virtual for task count(We'll add this later when we create tasks)
projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true,
});

//Ensure virtuals are included in JSON
projectSchema.set('toJSON', { virtuals: true});
projectSchema.set('toObject', { virtuals: true});


module.exports = mongoose.model('Project', projectSchema);
// export default model('Project', projectSchema);
