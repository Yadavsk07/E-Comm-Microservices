import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItemRow from '../components/cart/CartItemRow';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';
import { CartSkeleton } from '../components/common/Skeleton';
import Button from '../components/common/Button';

export default function Cart() {
  const { items, itemCount, subtotal, loading, clearCart, actionLoading } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Sign in to view your cart"
          description="Your cart is tied to your account across all microservices."
          actionText="Sign In Now"
          actionLink="/login?redirect=/cart"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          Shopping Cart
        </span>
      </nav>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Shopping Cart
          </h1>
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            disabled={actionLoading}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs self-start sm:self-auto py-1 px-2.5"
            icon={Trash2}
          >
            Clear Cart
          </Button>
        )}
      </div>

      {loading ? (
        <CartSkeleton />
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-xs">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Explore our best offers and add items to your cart."
            actionText="Continue Shopping"
            actionLink="/products"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-2.5">
            {items.map((item) => (
              <CartItemRow key={item.id || item.productId} item={item} />
            ))}

            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Cart Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-20">
            <CartSummary
              subtotal={subtotal}
              itemCount={itemCount}
              showCheckoutButton={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
