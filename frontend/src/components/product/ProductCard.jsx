import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Star } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';
import { useCart } from '../../context/CartContext';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80';

// Deterministic rating generator for consistent Amazon/Flipkart style ratings
function getProductRating(id) {
  const num = Number(id) || 1;
  const rating = (3.8 + ((num * 7) % 12) / 10).toFixed(1);
  const count = 45 + ((num * 173) % 2450);
  return { rating: Math.min(5, Math.max(3.5, Number(rating))), count };
}

export default function ProductCard({ product }) {
  const { addToCart, actionLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity && product.stockQuantity <= 5 && !isOutOfStock;
  const { rating, count } = getProductRating(product.id);

  // Compute a realistic MRP (20-35% higher) if not already set, like Amazon/Flipkart
  const originalPrice =
    product.originalPrice ||
    Math.round(Number(product.price || 0) * (1.2 + ((Number(product.id || 1) % 4) * 0.05)));

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAdding || actionLoading) return;

    setIsAdding(true);
    const ok = await addToCart(product.id, 1);
    setIsAdding(false);

    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 text-left">
      {/* Product Image Frame (Compact, centered, object-contain like Amazon/Flipkart) */}
      <Link
        to={`/products/${product.id}`}
        className="relative block w-full h-32 sm:h-36 md:h-40 p-2 sm:p-2.5 bg-white dark:bg-slate-900/60 overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800/60"
      >
        <img
          src={product.imageUrl || DEFAULT_IMAGE}
          alt={product.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 items-start">
          {product.category && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {product.category}
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        {isOutOfStock ? (
          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white shadow-xs">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500 text-white shadow-xs">
            Only {product.stockQuantity} left
          </span>
        ) : null}
      </Link>

      {/* Card Details */}
      <div className="flex flex-col flex-1 p-2.5">
        {/* Title */}
        <Link
          to={`/products/${product.id}`}
          className="text-xs sm:text-[13px] font-normal text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-tight mb-1 min-h-[2.1rem]"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Ratings row (Flipkart / Amazon style) */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
            <span>{rating}</span>
            <Star className="w-2.5 h-2.5 fill-current" />
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            ({count.toLocaleString()})
          </span>
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Assured
          </span>
        </div>

        {/* Price & Discount */}
        <div className="mt-auto pt-1">
          <PriceDisplay
            price={product.price}
            originalPrice={originalPrice}
            size="xs"
            className="flex-wrap"
          />

          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free delivery</span>
          </p>
        </div>

        {/* Compact Add to Cart CTA */}
        <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={isOutOfStock || isAdding}
            onClick={handleAddToCart}
            className={`w-full py-1 px-2 rounded font-medium text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-xs'
                : isOutOfStock
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-[0.98]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3 h-3" />
                <span>Added</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

