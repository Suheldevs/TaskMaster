const mongoose = require('mongoose');
const {taskSchema,taskModel} = require('../models/task'); // The generic task schema

// Helper function to get a user-specific model
const getUserTaskModel = (email) => {
  // Ensure the collection name is sanitized
  const sanitizedEmail = email.replace(/[@.]/g, '_');
  const collectionName = `tasks_${sanitizedEmail}`;
  return mongoose.model(collectionName, taskSchema, collectionName);
};

// Create a new task
const createTask = async (req, res) => {
  const { email, title, description, category } = req.body;

  if (!email || !title) {
    return res.status(400).json({ message: 'Email and title are required' });
  }

  try {
    const TaskModel = getUserTaskModel(email);
    const newTask = new TaskModel({ title, description, category, email });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create task', error });
  }
};

// Get all tasks for a specific user
const getUserTasks = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const TaskModel = getUserTaskModel(email);
    const tasks = await TaskModel.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
};

// Update a task for a specific user
const updateTask = async (req, res) => {
  const { taskId } = req.params;  // Get taskId from URL params
  const { title, description, category, status, email } = req.body;  // Get data from request body

  console.log(taskId); // Check if taskId is correct

  if (!taskId) {
    return res.status(400).json({ message: 'TaskId is required' });
  }

  try {
    const TaskModel = getUserTaskModel(email);  // Get the task model based on email
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,  // Use taskId from params to find the task
      { title, description, category, status },  // Fields to be updated
      { new: true, runValidators: true }  // Return updated task and validate the update
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);  // Send the updated task back
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
};


// Backend: In your controller (taskcontroller.js)
const deleteTask = async (req, res) => {
  const { email, taskId } = req.query;  // Extract the email and taskId from the query parameters

  if (!email || !taskId) {
    return res.status(400).json({ message: 'Email and taskId are required' });
  }

  try {
    const TaskModel = getUserTaskModel(email); // Get the task model based on the email
    const deletedTask = await TaskModel.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error });
  }
};



module.exports = {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
};
