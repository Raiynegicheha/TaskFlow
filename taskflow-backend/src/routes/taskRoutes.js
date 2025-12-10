const express = require('express');
const router = express.Router({mergeParams: true}); // Important for nested routes
const { getTasks, getTask, createTask, updateTask, deleteTask, reorderTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

//Project-specific task routes
router.route('/')
  .get(getTasks)        // Get all tasks for a specific project
  .post(createTask);    // Create a new task in a specific project

//Bulk reorder tasks
router.put('/reorder', reorderTasks); // Reorder tasks within a project


//Individual task routes (these will be mounted at /api/tasks
router.route('/:id')
  .get(getTask)         // Get a specific task by ID
  .put(updateTask)      // Update a specific task by ID
  .delete(deleteTask);  // Delete a specific task by ID


module.exports = router;