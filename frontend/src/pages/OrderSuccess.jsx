import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Home } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import PriceDisplay from '../components/common/PriceDisplay';
import Button from '../components/common/Button';
import { formatDate } from '../utils/formatters';
import { Skeleton } from '../components/common/Skeleton';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const data = await orderApi.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.warn('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <Skeleton className="w-20 h-20 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto rounded-2xl" />
        <Skeleton className="h-4 w-96 mx-auto rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-xs text-center space-y-4">
        {/* Success Icon */}
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Payment Verified & Authenticated
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Order Confirmed!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Thank you for your purchase. We have received your order and our fulfillment team is preparing it for shipment.
          </p>
        </div>

        {/* Transaction Metadata Card */}
        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-left grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Order Reference</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">
              #{orderId || order?.id || '—'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Razorpay Payment ID</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono truncate block">
              {paymentId || order?.paymentId || 'Verified'}
            </span>
          </div>

          {order && (
            <>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Order Placed On</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Total Paid</span>
                <PriceDisplay price={order.totalAmount} size="xs" />
              </div>
            </>
          )}
        </div>

        {/* Order Items List Preview if loaded */}
        {order?.items && order.items.length > 0 && (
          <div className="text-left pt-1">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Order Items ({order.items.length})
            </h4>
            <div className="space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1.5 text-xs">
                  <div className="flex items-center gap-2.5">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-8 h-8 rounded object-cover bg-slate-100 dark:bg-slate-800"
                      />
                    )}
                    <div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 block truncate max-w-[200px] sm:max-w-xs">
                        {item.productName}
                      </span>
                      <span className="text-slate-400 text-[10px]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <PriceDisplay price={item.subtotal || item.price * item.quantity} size="xs" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          {orderId && (
            <Link to={`/orders/${orderId}`}>
              <Button variant="primary" size="sm" className="w-full sm:w-auto">
                <PackageCheck className="w-3.5 h-3.5 mr-1.5" />
                <span>Track Order</span>
              </Button>
            </Link>
          )}
          <Link to="/products">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              <span>Continue Shopping</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
