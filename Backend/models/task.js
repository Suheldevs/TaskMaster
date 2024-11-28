const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Urgent', 'Other'],
      default: 'Other',
    },
    dueDate: {
      type: Date,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
  },
  { timestamps: true }
);

const taskModel = mongoose.model('Task', taskSchema);
module.exports = {taskSchema,taskModel};
