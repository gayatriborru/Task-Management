import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Check,
  Edit2,
  Trash2,
  ExternalLink,
  ClipboardList,
  Plus,
} from 'lucide-react';
import { TaskCard } from './TaskCard';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { getDueStatus } from '../utils/formatters';

export const TaskList = ({
  tasks = [],
  viewMode = 'grid', // 'grid' | 'table'
  onStatusChange,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center my-6">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">No tasks found</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          No tasks match your current filters or search query. Try tweaking your filters or create a new task.
        </p>
        {onAddNew && (
          <button
            type="button"
            onClick={onAddNew}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        )}
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Table view
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 pl-5 pr-3 w-10">Done</th>
              <th className="py-3.5 px-3">Title & Category</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3">Priority</th>
              <th className="py-3.5 px-3">Due Date</th>
              <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tasks.map((task) => {
              const isCompleted = task.status === 'Completed';
              const dueInfo = getDueStatus(task.dueDate, task.status);

              return (
                <tr
                  key={task._id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Done checkbox */}
                  <td className="py-3.5 pl-5 pr-3">
                    <button
                      type="button"
                      onClick={() =>
                        onStatusChange(
                          task._id,
                          isCompleted ? 'Pending' : 'Completed'
                        )
                      }
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-brand-500 bg-white'
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  </td>

                  {/* Title & Category */}
                  <td className="py-3.5 px-3 max-w-xs">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/tasks/${task._id}`}
                        className={`font-medium text-slate-900 group-hover:text-brand-600 transition-colors truncate ${
                          isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </Link>
                      {task.category && (
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                          {task.category}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusBadge status={task.status} size="sm" />
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} size="sm" />
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className={dueInfo.color}>{dueInfo.label}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/tasks/${task._id}`}
                        title="View Details"
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onEdit(task)}
                        title="Edit Task"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(task)}
                        title="Delete Task"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

