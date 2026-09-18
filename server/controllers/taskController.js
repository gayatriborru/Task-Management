const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate, category, tags } = req.body;

    // Clean tags if provided as comma-separated string or array
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === 'string' && tags.trim()) {
      processedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: dueDate || null,
      category: category && category.trim() ? category.trim() : 'General',
      tags: processedTags,
      userId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for current user with search, filter, sort
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, category, dueDateFilter, sortBy, sortOrder } = req.query;

    const query = { userId: req.user._id };

    // Search by title, description, or tags
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
      ];
    }

    // Status filter
    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      query.status = status;
    }

    // Priority filter
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    // Due date filtering
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (dueDateFilter === 'today') {
      query.dueDate = { $gte: startOfToday, $lte: endOfToday };
    } else if (dueDateFilter === 'overdue') {
      query.dueDate = { $lt: startOfToday };
      query.status = { $ne: 'Completed' };
    } else if (dueDateFilter === 'upcoming') {
      query.dueDate = { $gt: endOfToday };
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default

    if (sortBy === 'dueDate') {
      sortOptions = { dueDate: sortOrder === 'desc' ? -1 : 1, createdAt: -1 };
    } else if (sortBy === 'priority') {
      // Sort logic handled in post-query or mapped if needed, or by priority string
      sortOptions = { priority: sortOrder === 'asc' ? 1 : -1, createdAt: -1 };
    } else if (sortBy === 'title') {
      sortOptions = { title: sortOrder === 'desc' ? -1 : 1 };
    } else if (sortBy === 'createdAt') {
      sortOptions = { createdAt: sortOrder === 'asc' ? 1 : -1 };
    }

    const tasks = await Task.find(query).sort(sortOptions);

    // If sorting by priority logically (High > Medium > Low)
    if (sortBy === 'priority') {
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
      tasks.sort((a, b) => {
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return sortOrder === 'asc' ? weightA - weightB : weightB - weightA;
      });
    }

    // Distinct categories for filters
    const categories = await Task.distinct('category', { userId: req.user._id });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      categories,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics and productivity summary
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const allTasks = await Task.find({ userId }).sort({ createdAt: -1 });

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === 'Completed').length;
    const inProgressTasks = allTasks.filter((t) => t.status === 'In Progress').length;
    const pendingTasks = allTasks.filter((t) => t.status === 'Pending').length;
    
    // Overdue: dueDate is in the past AND status is not Completed
    const overdueTasks = allTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < startOfToday && t.status !== 'Completed'
    ).length;

    // High Priority
    const highPriorityTasks = allTasks.filter((t) => t.priority === 'High').length;
    const mediumPriorityTasks = allTasks.filter((t) => t.priority === 'Medium').length;
    const lowPriorityTasks = allTasks.filter((t) => t.priority === 'Low').length;

    // Completion percentage
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recent tasks (up to 5)
    const recentTasks = allTasks.slice(0, 5);

    // Upcoming deadlines (next 5 tasks with due date in future, not completed)
    const upcomingDeadlines = allTasks
      .filter((t) => t.dueDate && new Date(t.dueDate) >= startOfToday && t.status !== 'Completed')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    // Category distribution
    const categoryCounts = {};
    allTasks.forEach((task) => {
      const cat = task.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        overdueTasks,
        highPriorityTasks,
        mediumPriorityTasks,
        lowPriorityTasks,
        completionPercentage,
        categoryCounts,
        recentTasks,
        upcomingDeadlines,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate, category, tags } = req.body;

    let task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied.',
      });
    }

    // Process tags
    let processedTags = task.tags;
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.priority = priority !== undefined ? priority : task.priority;
    task.status = status !== undefined ? status : task.status;
    task.dueDate = dueDate !== undefined ? (dueDate || null) : task.dueDate;
    task.category = category !== undefined ? (category.trim() || 'General') : task.category;
    task.tags = processedTags;

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status only
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Pending, In Progress, or Completed.',
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied.',
      });
    }

    task.status = status;
    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: `Task marked as ${status}!`,
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskStats,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};

