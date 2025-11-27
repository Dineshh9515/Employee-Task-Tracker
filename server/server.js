require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const oauthRoutes = require('./routes/oauthRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Default Vite port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
