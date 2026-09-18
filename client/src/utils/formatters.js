import { format, isToday, isTomorrow, isYesterday, isPast, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy h:mm a');
  } catch (error) {
    return 'Invalid date';
  }
};

export const getDueStatus = (dueDateString, status) => {
  if (!dueDateString) return { label: 'No deadline', color: 'text-slate-400', isOverdue: false };
  if (status === 'Completed') return { label: 'Completed', color: 'text-emerald-600', isOverdue: false };

  try {
    const date = typeof dueDateString === 'string' ? parseISO(dueDateString) : dueDateString;
    
    if (isToday(date)) {
      return { label: 'Due today', color: 'text-amber-600 font-medium', isOverdue: false, isUrgent: true };
    }
    if (isTomorrow(date)) {
      return { label: 'Due tomorrow', color: 'text-blue-600', isOverdue: false };
    }
    if (isYesterday(date)) {
      return { label: 'Overdue (yesterday)', color: 'text-rose-600 font-semibold', isOverdue: true };
    }
    if (isPast(date)) {
      return { label: `Overdue (${format(date, 'MMM dd')})`, color: 'text-rose-600 font-semibold', isOverdue: true };
    }
    return { label: `Due ${format(date, 'MMM dd')}`, color: 'text-slate-600', isOverdue: false };
  } catch (error) {
    return { label: 'Invalid date', color: 'text-slate-400', isOverdue: false };
  }
};

export const isTaskOverdue = (dueDateString, status) => {
  if (!dueDateString || status === 'Completed') return false;
  try {
    const date = typeof dueDateString === 'string' ? parseISO(dueDateString) : dueDateString;
    // Overdue if past end of today
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return date < startOfToday;
  } catch {
    return false;
  }
};

export const getPriorityStyles = (priority) => {
  switch (priority) {
    case 'High':
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: 'High',
      };
    case 'Medium':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Medium',
      };
    case 'Low':
    default:
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Low',
      };
  }
};

export const getStatusStyles = (status) => {
  switch (status) {
    case 'Completed':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        indicator: 'bg-emerald-500',
        label: 'Completed',
      };
    case 'In Progress':
      return {
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        indicator: 'bg-indigo-500',
        label: 'In Progress',
      };
    case 'Pending':
    default:
      return {
        badge: 'bg-slate-100 text-slate-700 border-slate-200',
        indicator: 'bg-slate-400',
        label: 'Pending',
      };
  }
};

