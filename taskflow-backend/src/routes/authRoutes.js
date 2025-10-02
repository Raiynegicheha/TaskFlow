const express = require('express');
const router = express.Router();
const { register, login, getMe, updateMe } = require('../controllers/authContoller');
const { protect } = require('../middleware/auth');

//Public routes (no authentication required)
// Registration route
router.post('/register', register);
// Login route
router.post('/login', login);

//Protected routes (authentication required)
// Get current logged-in user
router.get('/me', protect, getMe);
// Update user profile
router.put('/profile', protect, updateMe);

module.exports = router;