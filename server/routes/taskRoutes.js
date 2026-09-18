const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskStats,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { validateTask } = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(protect);

// Task stats / dashboard route (placed before :id route so 'stats' isn't treated as an ID)
router.get('/stats', getTaskStats);

// Task CRUD
router.route('/')
  .post(validateTask, createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskById)
  .put(validateTask, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

module.exports = router;
