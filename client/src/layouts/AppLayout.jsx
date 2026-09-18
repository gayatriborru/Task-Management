import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { TaskFormModal } from '../components/TaskFormModal';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const { notification, clearNotification, showNotification } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/tasks/')) return 'Task Details';
    if (path.startsWith('/tasks')) return 'My Tasks';
    if (path.startsWith('/profile')) return 'User Profile';
    if (path.startsWith('/settings')) return 'Settings';
    return 'TaskFlow';
  };

  const handleCreateTask = async (taskData) => {
    try {
      setIsSubmittingTask(true);
      await taskService.createTask(taskData);
      setIsTaskModalOpen(false);
      showNotification('Task created successfully!', 'success');
      // Dispatch custom event to notify current active page (Dashboard or Tasks) to refresh
      window.dispatchEvent(new Event('task:created'));
      if (location.pathname !== '/tasks') {
        navigate('/tasks');
      }
    } catch (error) {
      showNotification(error.customMessage || 'Failed to create task.', 'error');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <Navbar
          title={getPageTitle()}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAddTask={() => setIsTaskModalOpen(true)}
        />

        {/* Floating Notification Banner */}
        {notification && (
          <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in slide-in-from-top duration-200 max-w-sm">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : notification.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}
            >
              {notification.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              )}
              {notification.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              {notification.type === 'info' && (
                <Info className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              )}
              <span className="flex-1">{notification.message}</span>
              <button
                type="button"
                onClick={clearNotification}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Nested Page Outlet */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Add Task Modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={isSubmittingTask}
      />
    </div>
  );
};

