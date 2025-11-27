const Task = require('../models/Task');
const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'DONE' });
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    const tasksByStatus = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Admin Quick Overview Widget Data
    let userStats = null;
    if (req.user && req.user.role === 'admin') {
      const totalUsers = await User.countDocuments();
      const adminCount = await User.countDocuments({ role: 'admin' });
      const userCount = await User.countDocuments({ role: 'user' });
      userStats = { totalUsers, adminCount, userCount };
    }

    // Workload & Burnout Indicator Logic
    const employees = await Employee.find({});
    const workloadData = await Promise.all(
      employees.map(async (emp) => {
        const tasks = await Task.find({ assignedTo: emp._id });
        
        const openTasks = tasks.filter(t => t.status !== 'DONE');
        const overdueTasks = tasks.filter(t => {
          return t.status !== 'DONE' && new Date(t.dueDate) < new Date();
        });

        // Simple workload score calculation
        // 1 point for open task, 3 points for overdue task, 2 points for HIGH priority
        let score = 0;
        openTasks.forEach(t => {
          score += 1;
          if (t.priority === 'HIGH') score += 2;
          if (new Date(t.dueDate) < new Date()) score += 3;
        });

        let workloadLevel = 'Low';
        if (score > 5) workloadLevel = 'Moderate';
        if (score > 10) workloadLevel = 'High';

        return {
          _id: emp._id,
          name: emp.name,
          openTasks: openTasks.length,
          overdueTasks: overdueTasks.length,
          workloadScore: score,
          workloadLevel
        };
      })
    );

    res.json({
      totalTasks,
      completedTasks,
      completionRate,
      tasksByStatus,
      workloadData,
      userStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardSummary };
