require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Employee = require('./models/Employee');
const Task = require('./models/Task');
const connectDB = require('./config/db');

const seedData = async () => {
  await connectDB();

  try {
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Task.deleteMany({});

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'admin',
    });

    console.log('Admin User Created');

    // Create Employees
    const emp1 = await Employee.create({
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Engineering',
      roleTitle: 'Senior Developer',
    });

    const emp2 = await Employee.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      department: 'Marketing',
      roleTitle: 'Marketing Manager',
    });

    console.log('Employees Created');

    // Create Regular User linked to Employee
    const userPassword = await bcrypt.hash('user123', salt);
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: userPassword,
      role: 'user',
      linkedEmployee: emp1._id,
    });

    console.log('Regular User Created');

    // Create Tasks
    await Task.create({
      title: 'Fix Login Bug',
      description: 'Login page throws 500 error on wrong password',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      assignedTo: emp1._id,
      createdBy: adminUser._id,
    });

    await Task.create({
      title: 'Q4 Marketing Plan',
      description: 'Draft the plan for Q4',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday (Overdue)
      assignedTo: emp2._id,
      createdBy: adminUser._id,
    });

    console.log('Tasks Created');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
