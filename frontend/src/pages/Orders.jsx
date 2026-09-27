import { useState, useEffect } from 'react';
import { Package, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import OrderCard from '../components/order/OrderCard';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { OrderSkeleton } from '../components/common/Skeleton';
import { getApiErrorMessage } from '../utils/errorHandler';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderApi.getUserOrders();
      // Sort newest orders first
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      setOrders(sorted);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          Your Orders
        </span>
      </nav>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Your Orders
          </h1>
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </span>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="space-y-3">
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load your orders"
          message={error}
          onRetry={fetchOrders}
        />
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-xs">
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place orders, they will appear here with live shipment trackers and invoices."
            actionText="Start Shopping"
            actionLink="/products"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
