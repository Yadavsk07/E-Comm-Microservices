import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import PriceDisplay from '../common/PriceDisplay';
import { formatDate } from '../../utils/formatters';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80';

export default function OrderCard({ order }) {
  if (!order) return null;

  const totalItemsCount = order.items
    ? order.items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0)
    : 0;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-shadow overflow-hidden text-xs">
      {/* Header: Order ID, Date, Status (Amazon Style Order Banner) */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Order Placed
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Total Amount
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              ₹{Number(order.totalAmount).toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Items
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <span className="text-slate-400 font-mono text-[11px]">
            #{order.id}
          </span>
        </div>
      </div>

      {/* Item thumbnails & names */}
      <div className="p-3 sm:p-4 space-y-3">
        {order.items &&
          order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.productImage || DEFAULT_IMAGE}
                  alt={item.productName}
                  className="w-12 h-12 rounded object-contain bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_IMAGE;
                  }}
                />
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {item.productName || `Product #${item.productId}`}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Qty: {item.quantity} • ₹{Number(item.price).toLocaleString('en-IN')} each
                  </p>
                </div>
              </div>
              <PriceDisplay price={item.subtotal || item.price * item.quantity} size="xs" className="shrink-0" />
            </div>
          ))}

        {order.items && order.items.length > 3 && (
          <p className="text-[11px] text-slate-500 font-medium pl-15">
            + {order.items.length - 3} more {order.items.length - 3 === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>

      {/* Footer: View Details CTA */}
      <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Payment verified by Razorpay
        </span>

        <Link
          to={`/orders/${order.id}`}
          className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
        >
          <span>View Order Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
