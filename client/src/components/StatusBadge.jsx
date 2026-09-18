import React from 'react';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { getStatusStyles } from '../utils/formatters';

export const StatusBadge = ({ status, showIcon = true, size = 'md' }) => {
  const styles = getStatusStyles(status);

  const getIcon = () => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
      case 'In Progress':
        return <PlayCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
      case 'Pending':
      default:
        return <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
    }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles.badge} ${sizeClass} transition-colors`}
    >
      {showIcon && getIcon()}
      <span>{styles.label}</span>
    </span>
  );
};

