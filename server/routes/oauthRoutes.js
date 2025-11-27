const express = require('express');
const passport = require('passport');
const router = express.Router();
const { generateToken } = require('../controllers/authController');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Helper to handle successful auth
const handleAuthSuccess = (req, res) => {
  const token = generateToken(req.user._id);
  // Redirect to frontend with token
  res.redirect(`${CLIENT_URL}/login?token=${token}`);
};

// --- Local Strategy ---
// Optional: Expose a passport-based login route
router.post('/login/passport', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message || 'Login failed' });
    
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      linkedEmployee: user.linkedEmployee,
      token: token,
    });
  })(req, res, next);
});

// --- GitHub Strategy ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: `${CLIENT_URL}/login?error=github_failed` }),
  handleAuthSuccess
);

// --- Google Strategy ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/login?error=google_failed` }),
  handleAuthSuccess
);

module.exports = router;
