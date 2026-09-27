import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  BookOpen,
  Trophy,
  Heart,
  Flame,
  Truck,
  Tag,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { productApi } from '../api/productApi';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/Skeleton';
import Button from '../components/common/Button';

const CATEGORIES = [
  { name: 'Electronics', icon: Smartphone, bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400', discount: 'Up to 50% Off' },
  { name: 'Fashion', icon: Shirt, bg: 'bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400', discount: 'Min 40% Off' },
  { name: 'Home & Kitchen', icon: HomeIcon, bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400', discount: 'Starting ₹199' },
  { name: 'Books', icon: BookOpen, bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400', discount: 'From ₹99' },
  { name: 'Sports', icon: Trophy, bg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400', discount: 'Up to 60% Off' },
  { name: 'Beauty', icon: Heart, bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400', discount: 'Buy 1 Get 1' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const data = await productApi.getAllProducts();
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn('Error fetching home products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const dealProducts = products.slice(0, 6);
  const trendingProducts = products.slice(6, 12).length > 0 ? products.slice(6, 12) : products.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* 1. Flipkart-style Top Category Icon Rail */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 sm:p-4 shadow-xs">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 text-center">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center justify-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${cat.bg} flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform shadow-xs`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium line-clamp-1">
                  {cat.discount}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Sleek Amazon / Flipkart Style Promotional Hero Banner */}
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center p-6 sm:p-10 gap-6">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-400 text-slate-950 text-[11px] font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              <span>Great Savings Days • Live Now</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Mega Deals on Electronics, Gadgets & Daily Essentials
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              Save up to 60% on flagship headphones, wearables, smart audio, and home products. Instant checkout with verified Razorpay integration.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/products">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 border-0 shadow-xs"
                >
                  <span>Shop All Deals</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
              <Link to="/products?category=Electronics">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-4 py-2"
                >
                  Explore Electronics
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:col-span-4 justify-center">
            <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-lg bg-white/10 backdrop-blur-md p-3 flex items-center justify-center border border-white/20 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                alt="Headphones Deal"
                className="max-h-full max-w-full object-contain drop-shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-extrabold shadow-md">
                50% OFF
              </div>
            </div>
          </div>
        </div>

        {/* Banner micro-strip */}
        <div className="bg-slate-950/40 border-t border-white/10 px-6 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-4">
            <span>✓ 10% Instant Bank Discount on Cards</span>
            <span className="hidden sm:inline">✓ No Cost EMI Available</span>
          </div>
          <span className="font-semibold text-amber-300">Ends in 2 Days</span>
        </div>
      </div>

      {/* 3. Amazon 4-in-1 Deal Feature Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Top Deals in Electronics
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Up to 60% off audio & wearables
            </p>
            <div className="h-28 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 mb-3">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80"
                alt="Wearables"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
          <Link
            to="/products?category=Electronics"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>See more offers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Trending Lifestyle & Bags
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Starting from ₹499
            </p>
            <div className="h-28 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 mb-3">
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80"
                alt="Bags"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
          <Link
            to="/products?category=Fashion"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Explore collection</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Home & Workspace Decor
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Minimalist lamps & kitchenware
            </p>
            <div className="h-28 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 mb-3">
              <img
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80"
                alt="Home Decor"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
          <Link
            to="/products?category=Home%20%26%20Kitchen"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Discover home</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Razorpay Verified Checkout
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Safe & guaranteed transactions
            </p>
            <div className="h-28 rounded bg-emerald-50 dark:bg-emerald-950/40 flex flex-col items-center justify-center p-2 mb-3 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-10 h-10 mb-1" />
              <span className="text-[11px] font-bold">100% Buyer Protection</span>
            </div>
          </div>
          <Link
            to="/orders"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Track your orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Deals of the Day Shelf (Flipkart / Amazon Product Shelf) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Deals of the Day
              </h2>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[11px] font-semibold">
              <Clock className="w-3 h-3" />
              <span>Limited Time</span>
            </div>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Trending & Popular Catalogue */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Trending Products & New Arrivals
            </h2>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>SEE ALL</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
            {trendingProducts.map((product) => (
              <ProductCard key={`trend-${product.id}`} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Flipkart / Amazon Trust Proposition Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-center gap-2.5 pt-2 md:pt-0">
            <Truck className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Fast & Free Shipping</h4>
              <p className="text-[11px] text-slate-400">On all eligible orders</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-2 md:pt-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% Genuine Items</h4>
              <p className="text-[11px] text-slate-400">Directly sourced</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-2 md:pt-0">
            <RotateCcw className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Easy 30-Day Returns</h4>
              <p className="text-[11px] text-slate-400">No questions asked</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-2 md:pt-0">
            <Zap className="w-5 h-5 text-purple-600 shrink-0" />
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Razorpay Secure</h4>
              <p className="text-[11px] text-slate-400">HMAC-SHA256 verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
