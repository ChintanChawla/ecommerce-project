const express = require('express');
const router = express.Router();
const { registerUser, login } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);
router.post('/login', login);

module.exports = router;
