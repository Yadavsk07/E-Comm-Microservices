import { formatCurrency } from '../../utils/formatters';

export default function PriceDisplay({
  price,
  currency = 'INR',
  originalPrice,
  size = 'md',
  showDiscount = true,
  className = '',
}) {
  const sizeClasses = {
    xs: 'text-xs font-bold',
    sm: 'text-xs sm:text-sm font-bold',
    md: 'text-sm sm:text-base font-bold',
    lg: 'text-lg sm:text-xl font-bold',
    xl: 'text-xl sm:text-2xl font-extrabold',
  };

  const numPrice = Number(price) || 0;
  const numOriginal = originalPrice ? Number(originalPrice) : null;
  const hasDiscount = numOriginal && numOriginal > numPrice;
  const discountPercent = hasDiscount
    ? Math.round(((numOriginal - numPrice) / numOriginal) * 100)
    : 0;

  return (
    <div className={`inline-flex items-baseline flex-wrap gap-1.5 ${className}`}>
      <span className={`text-slate-900 dark:text-white tracking-tight ${sizeClasses[size] || sizeClasses.md}`}>
        {formatCurrency(numPrice, currency)}
      </span>

      {hasDiscount && (
        <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
          {formatCurrency(numOriginal, currency)}
        </span>
      )}

      {hasDiscount && showDiscount && discountPercent > 0 && (
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          {discountPercent}% off
        </span>
      )}
    </div>
  );
}

