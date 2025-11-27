const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getPendingEmployees,
  approveEmployee,
  rejectEmployee,
  completeProfile,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

router.post('/complete-profile', protect, completeProfile);

router.get('/pending', protect, admin, getPendingEmployees);
router.post('/:id/approve', protect, admin, approveEmployee);
router.post('/:id/reject', protect, admin, rejectEmployee);

router.route('/')
  .get(protect, admin, getEmployees)
  .post(protect, admin, createEmployee);

router.route('/:id')
  .put(protect, admin, updateEmployee)
  .delete(protect, admin, deleteEmployee);

module.exports = router;
