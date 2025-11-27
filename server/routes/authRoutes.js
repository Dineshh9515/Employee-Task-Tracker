const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.post('/register', registerUser); // Public registration
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
