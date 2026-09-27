import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

export default function CartSummary({
  subtotal,
  itemCount,
  onCheckout,
  isCheckoutLoading = false,
  showCheckoutButton = true,
}) {
  const shipping = subtotal > 0 ? 0 : 0; // Free delivery
  const total = subtotal + shipping;
  const estimatedSavings = Math.round(Number(subtotal) * 0.2);

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-4 text-xs">
      <h3 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800 text-[11px]">
        Price Details ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
      </h3>

      <div className="space-y-2.5 text-slate-600 dark:text-slate-300">
        <div className="flex justify-between items-center">
          <span>Price ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-medium text-slate-900 dark:text-white">
            ₹{Number(subtotal).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Delivery Charges</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {subtotal > 0 ? 'FREE' : '₹0'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Platform Packaging</span>
          <span className="text-slate-500">Free</span>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline font-bold text-sm sm:text-base text-slate-900 dark:text-white">
          <span>Total Amount</span>
          <span className="text-base sm:text-lg">₹{Number(total).toLocaleString('en-IN')}</span>
        </div>

        {subtotal > 0 && (
          <div className="pt-2 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
            You will save ₹{estimatedSavings.toLocaleString('en-IN')} on this order
          </div>
        )}
      </div>

      {showCheckoutButton && (
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {onCheckout ? (
            <Button
              variant="primary"
              size="md"
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold border-0 shadow-xs uppercase tracking-wide text-xs py-2.5"
              isLoading={isCheckoutLoading}
              onClick={onCheckout}
              disabled={itemCount === 0 || isCheckoutLoading}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <Link to="/checkout" className="block w-full">
              <Button
                variant="primary"
                size="md"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold border-0 shadow-xs uppercase tracking-wide text-xs py-2.5"
                disabled={itemCount === 0}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Safe & Secure Razorpay Payments</span>
          </div>
        </div>
      )}
    </div>
  );
}
