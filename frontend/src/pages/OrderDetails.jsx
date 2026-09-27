import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  CreditCard,
  Package,
  Receipt,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { useRazorpay } from '../hooks/useRazorpay';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/common/StatusBadge';
import PriceDisplay from '../components/common/PriceDisplay';
import OrderStatusTimeline from '../components/order/OrderStatusTimeline';
import Button from '../components/common/Button';
import ErrorState from '../components/common/ErrorState';
import { Skeleton } from '../components/common/Skeleton';
import { formatDate } from '../utils/formatters';
import { getApiErrorMessage } from '../utils/errorHandler';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80';

export default function OrderDetails() {
  const { id } = useParams();
  const { processPayment, loading: paymentLoading } = useRazorpay();
  const { success, error: toastError } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderApi.getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleRetryPayment = async () => {
    if (!order) return;
    await processPayment(order.id, {
      onSuccess: () => {
        success('Payment completed successfully!');
        fetchOrder();
      },
      onFailure: (errMsg) => {
        toastError(errMsg);
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Could not find order"
          message={error || 'The requested order details could not be retrieved.'}
          onRetry={fetchOrder}
        />
      </div>
    );
  }

  const isPendingPayment = order.status === 'PAYMENT_PENDING';

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/orders" className="hover:text-blue-600 transition-colors">
          Orders
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          Order #{order.id}
        </span>
      </nav>

      {/* Order Top Banner */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Order #{order.id}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Placed on {formatDate(order.createdAt)}</span>
            </div>
          </div>

          <StatusBadge status={order.status} />
        </div>

        {/* Visual Progression Timeline */}
        <OrderStatusTimeline status={order.status} />

        {/* Pending Payment Warning & Action */}
        {isPendingPayment && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold">Payment is pending for this order</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Complete payment via Razorpay to confirm fulfillment and dispatch.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleRetryPayment}
              isLoading={paymentLoading}
              className="shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
            >
              Pay Now
            </Button>
          </div>
        )}
      </div>

      {/* Items in Order */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          Items Ordered ({order.items?.length || 0})
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {order.items &&
            order.items.map((item, idx) => (
              <div
                key={idx}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage || DEFAULT_IMAGE}
                    alt={item.productName}
                    className="w-14 h-14 rounded object-contain bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_IMAGE;
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {item.productName}
                    </h4>
                    <p className="text-slate-400 text-[11px]">
                      Product ID: {item.productId}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <PriceDisplay
                    price={item.subtotal || item.price * item.quantity}
                    size="sm"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Payment & Summary Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment info */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-3 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-900 dark:text-white">
              Payment Information
            </h4>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-slate-400 block text-[11px]">Payment Method</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Razorpay Payment Gateway
              </span>
            </div>

            {order.paymentOrderId && (
              <div>
                <span className="text-slate-400 block text-[11px]">Razorpay Order ID</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {order.paymentOrderId}
                </span>
              </div>
            )}

            {order.paymentId ? (
              <div>
                <span className="text-slate-400 block text-[11px]">Razorpay Payment ID</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {order.paymentId}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-slate-400 block text-[11px]">Payment Status</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  Awaiting Transaction
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-3 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Receipt className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-900 dark:text-white">
              Order Total Breakdown
            </h4>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Standard Delivery</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Taxes</span>
              <span className="text-slate-400">Included</span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline font-bold text-sm text-slate-900 dark:text-white">
              <span>Total Amount</span>
              <span className="text-base">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
