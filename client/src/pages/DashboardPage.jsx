import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  Calendar,
  AlertCircle,
  Tag,
  Plus,
} from 'lucide-react';
import { taskService } from '../services/taskService';
import { DashboardCard } from '../components/DashboardCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getDueStatus } from '../utils/formatters';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTaskStats();
      setStats(data);
    } catch (err) {
      setError(err.customMessage || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();

    // Listen for custom task creation event
    const handleTaskCreated = () => {
      fetchDashboardStats();
    };

    window.addEventListener('task:created', handleTaskCreated);
    return () => window.removeEventListener('task:created', handleTaskCreated);
  }, [fetchDashboardStats]);

  if (loading && !stats) {
    return (
      <div className="py-16">
        <LoadingSpinner size="lg" text="Loading dashboard analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
        <p className="font-semibold">Unable to fetch dashboard statistics</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchDashboardStats}
          className="mt-3 px-4 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const {
    totalTasks = 0,
    completedTasks = 0,
    inProgressTasks = 0,
    pendingTasks = 0,
    overdueTasks = 0,
    completionPercentage = 0,
    recentTasks = [],
    upcomingDeadlines = [],
    categoryCounts = {},
  } = stats || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-medium text-white backdrop-blur-md mb-3">
            <TrendingUp className="w-3.5 h-3.5" /> Productivity Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'there'}! 👋
          </h1>
          <p className="mt-1 text-sm text-brand-100 max-w-xl">
            You have completed{' '}
            <span className="font-bold text-white">{completedTasks}</span> of{' '}
            <span className="font-bold text-white">{totalTasks}</span> tasks.
            {overdueTasks > 0
              ? ` Note: You have ${overdueTasks} overdue ${overdueTasks === 1 ? 'task' : 'tasks'} requiring attention.`
              : ' Great job staying on top of your deadlines!'}
          </p>
        </div>

        {/* Completion Progress Dial / Pill */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 min-w-[220px]">
          <div className="w-14 h-14 rounded-full border-4 border-brand-300 flex items-center justify-center font-black text-lg text-white">
            {completionPercentage}%
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-brand-200 font-semibold">
              Completion Rate
            </p>
            <div className="w-28 bg-white/20 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Total Tasks"
          value={totalTasks}
          subtitle="All registered tasks"
          icon={Layers}
          colorScheme="indigo"
        />
        <DashboardCard
          title="Completed"
          value={completedTasks}
          subtitle={`${completionPercentage}% achieved`}
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <DashboardCard
          title="In Progress"
          value={inProgressTasks}
          subtitle="Currently active"
          icon={PlayCircle}
          colorScheme="blue"
        />
        <DashboardCard
          title="Pending"
          value={pendingTasks}
          subtitle="Awaiting start"
          icon={Clock}
          colorScheme="amber"
        />
        <DashboardCard
          title="Overdue"
          value={overdueTasks}
          subtitle="Passed due deadline"
          icon={AlertTriangle}
          colorScheme="rose"
        />
      </div>

      {/* Two Column Layout: Recent Tasks & Upcoming Deadlines / Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Tasks (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              <span>Recent Tasks</span>
            </h2>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-500">
              <p className="text-sm font-medium">No tasks yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Click "+ Add Task" in the top bar to create your first task.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {recentTasks.map((task) => {
                const dueInfo = getDueStatus(task.dueDate, task.status);
                return (
                  <div
                    key={task._id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/tasks/${task._id}`}
                        className={`text-sm font-semibold text-slate-900 hover:text-brand-600 truncate block ${
                          task.status === 'Completed' ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        {task.category && (
                          <span className="font-medium text-slate-600">
                            {task.category}
                          </span>
                        )}
                        <span>•</span>
                        <span className={dueInfo.color}>{dueInfo.label}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <PriorityBadge priority={task.priority} size="sm" />
                      <StatusBadge status={task.status} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Deadlines & Categories */}
        <div className="space-y-6">
          {/* Upcoming Deadlines Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>Upcoming Deadlines</span>
            </h3>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No upcoming deadlines on your schedule.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((task) => {
                  const dueInfo = getDueStatus(task.dueDate, task.status);
                  return (
                    <Link
                      key={task._id}
                      to={`/tasks/${task._id}`}
                      className="block p-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-slate-50/60 transition-all"
                    >
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {task.title}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        <span className={dueInfo.color}>{dueInfo.label}</span>
                        <PriorityBadge priority={task.priority} size="sm" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category Breakdown Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-600" />
              <span>Category Distribution</span>
            </h3>

            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No categories yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const catPercent = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{cat}</span>
                        <span className="text-slate-400 font-semibold">{count} ({catPercent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-500 h-full rounded-full"
                          style={{ width: `${catPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

