import { ShoppingBag } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon = ShoppingBag,
  title = 'No items found',
  description = 'Try adjusting your filters or explore other collections.',
  actionText,
  actionLink,
  onActionClick,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs max-w-md mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xs">
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink}>
          <Button variant="primary" size="sm">
            {actionText}
          </Button>
        </Link>
      )}

      {actionText && !actionLink && onActionClick && (
        <Button variant="primary" size="sm" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
