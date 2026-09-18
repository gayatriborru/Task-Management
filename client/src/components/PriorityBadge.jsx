import React from 'react';
import { AlertCircle, AlertTriangle, ArrowDown } from 'lucide-react';
import { getPriorityStyles } from '../utils/formatters';

export const PriorityBadge = ({ priority, size = 'md' }) => {
  const styles = getPriorityStyles(priority);

  const getIcon = () => {
    switch (priority) {
      case 'High':
        return <AlertCircle className={size === 'sm' ? 'w-3 h-3 text-rose-600' : 'w-3.5 h-3.5 text-rose-600'} />;
      case 'Medium':
        return <AlertTriangle className={size === 'sm' ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />;
      case 'Low':
      default:
        return <ArrowDown className={size === 'sm' ? 'w-3 h-3 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />;
    }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles.badge} ${sizeClass}`}
    >
      {getIcon()}
      <span>{styles.label} Priority</span>
    </span>
  );
};

