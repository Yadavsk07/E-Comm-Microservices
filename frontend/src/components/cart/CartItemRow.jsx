import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import QuantitySelector from '../common/QuantitySelector';
import PriceDisplay from '../common/PriceDisplay';
import { useCart } from '../../context/CartContext';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80';

export default function CartItemRow({ item }) {
  const { updateQuantity, removeFromCart, actionLoading } = useCart();

  if (!item) return null;

  const handleQuantityChange = (newQty) => {
    if (newQty <= 0) {
      removeFromCart(item.productId);
    } else {
      updateQuantity(item.productId, newQty);
    }
  };

  const lineSubtotal =
    item.subtotal !== undefined
      ? Number(item.subtotal)
      : Number(item.price || 0) * Number(item.quantity || 1);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors">
      {/* Product Image & Info */}
      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
        <Link
          to={`/products/${item.productId}`}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-white dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center"
        >
          <img
            src={item.productImage || DEFAULT_IMAGE}
            alt={item.productName || 'Product image'}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
        </Link>

        <div className="space-y-1 min-w-0">
          <Link
            to={`/products/${item.productId}`}
            className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-snug"
          >
            {item.productName || `Product #${item.productId}`}
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-600 font-semibold text-[11px]">In Stock</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 text-[11px]">Eligible for FREE Shipping</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unit Price: <span className="font-semibold text-slate-800 dark:text-slate-200">₹{Number(item.price).toLocaleString('en-IN')}</span>
          </p>
        </div>
      </div>

      {/* Quantity & Subtotal Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        <QuantitySelector
          quantity={item.quantity}
          min={1}
          max={99}
          onChange={handleQuantityChange}
          disabled={actionLoading}
        />

        <div className="text-right min-w-[80px]">
          <span className="text-xs text-slate-400 block sm:hidden">Total:</span>
          <PriceDisplay price={lineSubtotal} size="sm" />
        </div>

        <button
          type="button"
          disabled={actionLoading}
          onClick={() => removeFromCart(item.productId)}
          className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          aria-label="Remove item"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
