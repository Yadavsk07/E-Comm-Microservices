/**
 * Currency formatter for Indian Rupees (INR) or given currency
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0.00';
  }

  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(numeric);
  } catch {
    return `₹${numeric.toFixed(2)}`;
  }
}

/**
 * Format ISO datetime string to user-friendly representation
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Truncate long string with ellipsis
 */
export function truncateText(text, maxLength = 80) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Order status configuration for visual styling and badge colors
 */
export const ORDER_STATUS_CONFIG = {
  PAYMENT_PENDING: {
    label: 'Payment Pending',
    bg: 'bg-amber-100 dark:bg-amber-950/60',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800',
    dot: 'bg-amber-500',
    step: 1,
  },
  PENDING: {
    label: 'Order Placed',
    bg: 'bg-blue-100 dark:bg-blue-950/60',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-800',
    dot: 'bg-blue-500',
    step: 1,
  },
  CONFIRMED: {
    label: 'Confirmed',
    bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    step: 2,
  },
  SHIPPED: {
    label: 'Shipped',
    bg: 'bg-indigo-100 dark:bg-indigo-950/60',
    text: 'text-indigo-800 dark:text-indigo-300',
    border: 'border-indigo-300 dark:border-indigo-800',
    dot: 'bg-indigo-500',
    step: 3,
  },
  DELIVERED: {
    label: 'Delivered',
    bg: 'bg-green-100 dark:bg-green-950/60',
    text: 'text-green-800 dark:text-green-300',
    border: 'border-green-300 dark:border-green-800',
    dot: 'bg-green-500',
    step: 4,
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-rose-100 dark:bg-rose-950/60',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-300 dark:border-rose-800',
    dot: 'bg-rose-500',
    step: 0,
  },
};
