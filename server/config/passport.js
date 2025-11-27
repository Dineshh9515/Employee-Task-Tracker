const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Serialize/Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Local Strategy
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || 'GITHUB_CLIENT_ID',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'GITHUB_CLIENT_SECRET',
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback',
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        
        if (!email) {
          return done(new Error('No email found in GitHub profile'), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          // Create new user
          // Generate a dummy password hash since they use OAuth
          const salt = await bcrypt.genSalt(10);
          const dummyPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          const passwordHash = await bcrypt.hash(dummyPassword, salt);

          user = await User.create({
            name: profile.displayName || profile.username,
            email: email,
            passwordHash: passwordHash,
            role: 'user',
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
          return done(new Error('No email found in Google profile'), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          // Create new user
          const salt = await bcrypt.genSalt(10);
          const dummyPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          const passwordHash = await bcrypt.hash(dummyPassword, salt);

          user = await User.create({
            name: profile.displayName,
            email: email,
            passwordHash: passwordHash,
            role: 'user',
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
