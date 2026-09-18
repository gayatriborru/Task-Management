import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  LayoutGrid,
  List,
  Filter,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { taskService } from '../services/taskService';
import { TaskList } from '../components/TaskList';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { TaskFormModal } from '../components/TaskFormModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export const TasksPage = () => {
  const { showNotification } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [showFilters, setShowFilters] = useState(false);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    dueDateFilter: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: search.trim() || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        category: filters.category || undefined,
        dueDateFilter: filters.dueDateFilter || undefined,
        sortBy: filters.sortBy || undefined,
        sortOrder: filters.sortOrder || undefined,
      };

      const data = await taskService.getTasks(params);
      setTasks(data.tasks || []);
      setCategories(data.categories || []);
    } catch (err) {
      showNotification(err.customMessage || 'Failed to fetch tasks.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, filters, showNotification]);

  // Load tasks on mount and when filters/search change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Listen for task:created global event
  useEffect(() => {
    const handleCreated = () => fetchTasks();
    window.addEventListener('task:created', handleCreated);
    return () => window.removeEventListener('task:created', handleCreated);
  }, [fetchTasks]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilters({
      status: '',
      priority: '',
      category: '',
      dueDateFilter: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  // Status toggle handler
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
      showNotification(`Task marked as ${newStatus}!`, 'success');
    } catch (err) {
      showNotification(err.customMessage || 'Failed to update status.', 'error');
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  // Form Submit (Create or Update)
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingTask) {
        const response = await taskService.updateTask(editingTask._id, formData);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? response.task : t))
        );
        showNotification('Task updated successfully!', 'success');
      } else {
        const response = await taskService.createTask(formData);
        setTasks((prev) => [response.task, ...prev]);
        showNotification('Task created successfully!', 'success');
      }
      setIsFormModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      showNotification(err.customMessage || 'Failed to save task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handlers
  const handleOpenDelete = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await taskService.deleteTask(taskToDelete._id);
      setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
      showNotification('Task deleted successfully.', 'info');
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      showNotification(err.customMessage || 'Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tasks</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, organize, and track the progress of all your tasks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-100 text-slate-800'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-slate-100 text-slate-800'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* New Task Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-600/20 hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Trigger Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || Object.values(filters).some((v) => v && v !== 'createdAt' && v !== 'desc')
                ? 'bg-brand-50 border-brand-200 text-brand-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <button
            type="button"
            onClick={fetchTasks}
            title="Refresh Tasks"
            className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
          onReset={handleResetFilters}
        />
      )}

      {/* Task Content List or Loading */}
      {loading ? (
        <div className="py-16">
          <LoadingSpinner size="md" text="Loading tasks..." />
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          viewMode={viewMode}
          onStatusChange={handleStatusChange}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onAddNew={handleOpenCreate}
        />
      )}

      {/* Create / Edit Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Task?"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
      />
    </div>
  );
};

