const Task = require('../models/Task');
const Employee = require('../models/Employee');

// @desc    Get all tasks (Admin) or filtered
// @route   GET /api/tasks
// @access  Admin
const getTasks = async (req, res) => {
  try {
    const { status, employeeId } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (employeeId) {
      query.assignedTo = employeeId;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my tasks
// @route   GET /api/tasks/my
// @access  Private (User)
const getMyTasks = async (req, res) => {
  try {
    // Assuming req.user.linkedEmployee is populated or we find it
    if (!req.user.linkedEmployee) {
      return res.status(400).json({ message: 'User is not linked to an employee record' });
    }

    const tasks = await Task.find({ assignedTo: req.user.linkedEmployee })
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Admin
const createTask = async (req, res) => {
  const { title, description, priority, dueDate, assignedTo } = req.body;

  if (!title || !dueDate || !assignedTo) {
    return res.status(400).json({ message: 'Please add required fields' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      status: 'TODO',
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (Admin or User for status)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin') {
      // Regular user can only update status of their own tasks
      if (task.assignedTo.toString() !== req.user.linkedEmployee?.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }

      // Only allow status update
      if (req.body.status) {
        task.status = req.body.status;
        await task.save();
        return res.json(task);
      } else {
        return res.status(403).json({ message: 'Users can only update task status' });
      }
    }

    // Admin can update everything
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
};
