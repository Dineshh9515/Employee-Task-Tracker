const Employee = require('../models/Employee');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all employees (Approved only by default, or all if specified)
// @route   GET /api/employees
// @access  Admin
const getEmployees = async (req, res) => {
  try {
    // By default show only approved employees in the main list
    const employees = await Employee.find({ status: 'approved' });
    
    // Add task count to each employee
    const employeesWithTaskCount = await Promise.all(employees.map(async (emp) => {
      const taskCount = await Task.countDocuments({ assignedTo: emp._id });
      return { ...emp.toObject(), taskCount };
    }));

    res.json(employeesWithTaskCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending employees
// @route   GET /api/employees/pending
// @access  Admin
const getPendingEmployees = async (req, res) => {
  try {
    const pendingEmployees = await Employee.find({ status: 'pending' });
    res.json(pendingEmployees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve employee
// @route   POST /api/employees/:id/approve
// @access  Admin
const approveEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    employee.status = 'approved';
    await employee.save();

    if (employee.linkedUser) {
      const user = await User.findById(employee.linkedUser);
      if (user) {
        user.isApproved = true;
        await user.save();
      }
    }

    res.json({ message: 'Employee approved', employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject employee
// @route   POST /api/employees/:id/reject
// @access  Admin
const rejectEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    employee.status = 'rejected';
    await employee.save();

    // Optionally we could delete the user or keep them as rejected
    // For now, we just keep them rejected so they can't login

    res.json({ message: 'Employee rejected', employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete profile for OAuth users
// @route   POST /api/employees/complete-profile
// @access  Private (User)
const completeProfile = async (req, res) => {
  const { name, email, empId, department, roleTitle, tasksInfo, actionsInfo } = req.body;
  const userId = req.user._id;

  try {
    // Check if employee record already exists
    let employee = await Employee.findOne({ linkedUser: userId });

    if (employee) {
      return res.status(400).json({ message: 'Profile already submitted' });
    }

    employee = await Employee.create({
      name,
      email,
      empId,
      department,
      roleTitle,
      tasksInfo,
      actionsInfo,
      status: 'pending',
      linkedUser: userId
    });

    const user = await User.findById(userId);
    user.linkedEmployee = employee._id;
    await user.save();

    res.status(201).json({ message: 'Profile submitted, awaiting approval', employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new employee (Admin manual creation)
// @route   POST /api/employees
// @access  Admin
const createEmployee = async (req, res) => {
  const { name, email, department, roleTitle } = req.body;

  if (!name || !email || !department || !roleTitle) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    const employee = await Employee.create({
      name,
      email,
      department,
      roleTitle,
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Admin
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Admin
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Soft delete or hard delete. Let's do hard delete for simplicity as per requirements, 
    // but maybe check for tasks first? Requirement says "Optionally handle reassignment".
    // We will just delete for now.
    await Employee.deleteOne({ _id: req.params.id });

    res.json({ message: 'Employee removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmployees,
  getPendingEmployees,
  approveEmployee,
  rejectEmployee,
  completeProfile,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
