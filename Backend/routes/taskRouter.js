const express = require('express');
const {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
} = require('../controller/taskcontroller');

const router = express.Router();

// Routes
router.post('/post', createTask); // Add a new task
router.get('/get', getUserTasks); // Fetch tasks for a specific user
router.put('/update/:taskId', updateTask);  // Update a specific task
router.delete('/delete', deleteTask); // Delete a specific task

module.exports = router;
