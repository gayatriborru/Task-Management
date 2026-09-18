import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Tag,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { getDueStatus } from '../utils/formatters';

export const TaskCard = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const dueInfo = getDueStatus(task.dueDate, task.status);
  const isCompleted = task.status === 'Completed';

  const handleToggleComplete = () => {
    const nextStatus = isCompleted ? 'Pending' : 'Completed';
    onStatusChange(task._id, nextStatus);
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-5 shadow-sm hover:shadow-md ${
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/10'
          : dueInfo.isOverdue
          ? 'border-rose-200 bg-rose-50/10'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox and Title */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={handleToggleComplete}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 hover:border-brand-500 bg-white'
            }`}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          <div className="min-w-0 flex-1">
            <Link
              to={`/tasks/${task._id}`}
              className={`block font-semibold text-base text-slate-900 group-hover:text-brand-600 transition-colors truncate ${
                isCompleted ? 'line-through text-slate-400' : ''
              }`}
            >
              {task.title}
            </Link>

            {task.description && (
              <p
                className={`mt-1 text-xs text-slate-500 line-clamp-2 ${
                  isCompleted ? 'text-slate-400' : ''
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                <Link
                  to={`/tasks/${task._id}`}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Details</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Task</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Task</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Badges row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={task.status} size="sm" />
        <PriorityBadge priority={task.priority} size="sm" />
        {task.category && (
          <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full border border-slate-200">
            {task.category}
          </span>
        )}
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Tag className="w-3 h-3 text-slate-400 mr-0.5" />
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Due Date & Status Switcher */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className={dueInfo.color}>{dueInfo.label}</span>
        </div>

        {/* Quick status cycle button */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

