const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, updateProject, deleteProject, addTeamMember, removeTeamMember } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

//Project routes
router.route('/')
  .post(createProject)  // Create a new project
  .get(getProjects);    // Get all projects for the authenticated user

router.route('/:id')
  .get(getProject)   // Get a specific project by ID
  .put(updateProject)    // Update a specific project by ID
  .delete(deleteProject); // Delete a specific project by ID


//Team member management
router.post('/:id/members', addTeamMember);
router.delete('/:id/members/:userId', removeTeamMember);

module.exports = router;