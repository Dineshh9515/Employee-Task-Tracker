const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const Employee = require('../models/Employee');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { 
    name, email, password, role, 
    empId, department, roleTitle, tasksInfo, actionsInfo 
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Determine approval status
  // Admins are auto-approved (or you might want a super-admin to approve admins, but let's assume auto for now)
  // Regular users are NOT approved by default
  const isApproved = role === 'admin'; 

  try {
    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'user',
      isApproved,
    });

    // If it's a regular user, create a pending Employee record
    if (role === 'user') {
      const employee = await Employee.create({
        name,
        email,
        empId: empId || 'TEMP-' + Date.now(), // Fallback if not provided
        department: department || 'Unassigned',
        roleTitle: roleTitle || 'Employee',
        tasksInfo,
        actionsInfo,
        status: 'pending',
        linkedUser: user._id
      });

      // Link employee to user
      user.linkedEmployee = employee._id;
      await user.save();
    }

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      linkedEmployee: user.linkedEmployee,
      isApproved: user.isApproved,
      lastLoginAt: user.lastLoginAt,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  generateToken,
};
