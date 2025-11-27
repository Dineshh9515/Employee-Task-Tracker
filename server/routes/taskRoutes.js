const express = require('express');
const router = express.Router();
const {
  getTasks,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, admin, getTasks)
  .post(protect, admin, createTask);

router.get('/my', protect, getMyTasks);

router.route('/:id')
  .put(protect, updateTask) // Admin or User (status only)
  .delete(protect, admin, deleteTask);

module.exports = router;
