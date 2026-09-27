import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Star,
  MapPin,
  Tag,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/common/QuantitySelector';
import ProductCard from '../components/product/ProductCard';
import ErrorState from '../components/common/ErrorState';
import { Skeleton } from '../components/common/Skeleton';
import { getApiErrorMessage } from '../utils/errorHandler';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';

// Deterministic rating generator for Amazon/Flipkart feel
function getProductRating(id) {
  const num = Number(id) || 1;
  const rating = (3.8 + ((num * 7) % 12) / 10).toFixed(1);
  const count = 120 + ((num * 243) % 4500);
  const reviews = Math.round(count * 0.18);
  return { rating: Math.min(5, Math.max(3.6, Number(rating))), count, reviews };
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, actionLoading } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('110001');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.getProductById(id);
      setProduct(data);

      if (data?.category) {
        try {
          const categoryList = await productApi.getProductsByCategory(data.category);
          if (Array.isArray(categoryList)) {
            setRelatedProducts(
              categoryList.filter((p) => p.id !== Number(id)).slice(0, 6)
            );
          }
        } catch {
          // Non-blocking
        }
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    if (!product || isAdding || actionLoading) return;
    setIsAdding(true);
    const ok = await addToCart(product.id, quantity);
    setIsAdding(false);
    if (ok) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2200);
    }
  };

  const handleBuyNow = async () => {
    if (!product || isAdding || actionLoading) return;
    setIsAdding(true);
    const ok = await addToCart(product.id, quantity);
    setIsAdding(false);
    if (ok) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="w-full h-80 rounded-md" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-3">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ErrorState
          title="Product Not Found"
          message={error || 'The requested product could not be located in the inventory.'}
          onRetry={fetchProduct}
        />
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity && product.stockQuantity <= 5 && !isOutOfStock;
  const { rating, count, reviews } = getProductRating(product.id);

  // Compute realistic MRP and discount
  const originalPrice =
    product.originalPrice ||
    Math.round(Number(product.price || 0) * (1.25 + ((Number(product.id || 1) % 3) * 0.05)));
  const discountPercent = Math.round(
    ((originalPrice - Number(product.price)) / originalPrice) * 100
  );

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-4">
      {/* Breadcrumb Navigation (Amazon/Flipkart Compact Style) */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-blue-600 transition-colors">
          Products
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-blue-600 transition-colors"
            >
              {product.category}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Image Box & Flipkart Dual Action Buttons */}
          <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-20">
            {/* Centered Image Container */}
            <div className="relative w-full h-60 sm:h-72 md:h-80 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 flex items-center justify-center overflow-hidden">
              <img
                src={product.imageUrl || DEFAULT_IMAGE}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_IMAGE;
                }}
              />

              {product.category && (
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {product.category}
                </span>
              )}

              {discountPercent > 0 && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Dual Action Buttons (Flipkart & Amazon Hallmark) */}
            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              <button
                type="button"
                disabled={isOutOfStock || isAdding || actionLoading}
                onClick={handleAddToCart}
                className={`py-2.5 px-3 rounded-md font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : isOutOfStock
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-[0.98]'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isOutOfStock || isAdding || actionLoading}
                onClick={handleBuyNow}
                className={`py-2.5 px-3 rounded-md font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isOutOfStock
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 text-white active:scale-[0.98]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Right Column: Product Details, Offers, Specs */}
          <div className="lg:col-span-7 space-y-3">
            {/* Title & Ratings */}
            <div className="space-y-1 pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <h1 className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-snug">
                {product.name}
              </h1>

              {/* Flipkart Green Rating Badge & Amazon Review count */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-600 text-white">
                  <span>{rating}</span>
                  <Star className="w-2.5 h-2.5 fill-current" />
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {count.toLocaleString()} Ratings & {reviews.toLocaleString()} Reviews
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 pl-1 border-l border-slate-200 dark:border-slate-700">
                  ShopVibe Assured
                </span>
              </div>
            </div>

            {/* Special Price & Discount Box (Flipkart Style) */}
            <div className="space-y-0.5 py-0.5">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Special Price
              </span>
              <div className="flex items-baseline flex-wrap gap-2">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {discountPercent}% off
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Inclusive of all taxes. Free shipping on this order.
              </p>
            </div>

            {/* Available Bank Offers (Iconic Flipkart/Amazon coupon block) */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-md p-3 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Available Offers</span>
              </div>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Bank Offer:</strong> 10% Instant Discount on All Major Credit & Debit Cards (up to ₹1,500).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Partner Offer:</strong> Pay with Razorpay UPI & get flat ₹100 cashback voucher.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>No Cost EMI:</strong> Available on orders above ₹3,000.
                  </span>
                </li>
              </ul>
            </div>

            {/* Delivery & Pincode Checker */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Deliver to:</span>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-24 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-xs font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  maxLength={6}
                />
                <span className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline text-[11px]">
                  Check
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 pl-6 text-[11px]">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  FREE Delivery by Tomorrow, 8 PM
                </span>
                <span>|</span>
                <span>Cash on Delivery / Razorpay Available</span>
              </div>
            </div>

            {/* Stock & Quantity */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quantity:
                </span>
                <QuantitySelector
                  quantity={quantity}
                  min={1}
                  max={Math.min(product.stockQuantity || 10, 99)}
                  onChange={setQuantity}
                  disabled={isOutOfStock}
                />
              </div>

              <div>
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    Currently Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Only {product.stockQuantity} left in stock - order soon
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    In Stock ({product.stockQuantity} available)
                  </span>
                )}
              </div>
            </div>

            {/* Highlights & Specifications */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Product Details & Specifications
              </h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden text-xs">
                <div className="grid grid-cols-3 p-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Category</span>
                  <span className="col-span-2 font-semibold text-slate-800 dark:text-slate-200">
                    {product.category || 'General'}
                  </span>
                </div>
                <div className="grid grid-cols-3 p-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Item Code / SKU</span>
                  <span className="col-span-2 font-semibold text-slate-800 dark:text-slate-200">
                    SV-PROD-{product.id}
                  </span>
                </div>
                <div className="grid grid-cols-3 p-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Warranty</span>
                  <span className="col-span-2 font-semibold text-slate-800 dark:text-slate-200">
                    1 Year Manufacturer Brand Warranty
                  </span>
                </div>
                <div className="grid grid-cols-3 p-2">
                  <span className="text-slate-500 font-medium">Return Policy</span>
                  <span className="col-span-2 font-semibold text-slate-800 dark:text-slate-200">
                    30-Day Replacement Guarantee
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2 space-y-1 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Description</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description || 'Authentic curated product with verified manufacturer quality.'}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-center text-slate-600 dark:text-slate-300">
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 flex flex-col items-center">
                <Truck className="w-4 h-4 text-blue-600 mb-1" />
                <span className="font-medium">Free Express Delivery</span>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-amber-600 mb-1" />
                <span className="font-medium">30-Day Returns</span>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="font-medium">Razorpay Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Shelf */}
      {relatedProducts.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Similar Products in {product.category}
            </h3>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              VIEW ALL
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
