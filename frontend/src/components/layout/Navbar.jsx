import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Package,
  ChevronDown,
  MapPin,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Books',
  'Sports',
  'Beauty',
  'Grocery',
  'Toys',
  'Automotive',
  'Furniture',
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const catDropdownRef = useRef(null);

  // Close dropdowns on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setCategoriesDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      let path = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      if (selectedSearchCategory) {
        path += `&category=${encodeURIComponent(selectedSearchCategory)}`;
      }
      navigate(path);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* Top Primary Bar (Amazon & Flipkart Style Compact Header) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo & Subtitle */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex flex-col group leading-none">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                Shop<span className="text-blue-600 dark:text-blue-400">Vibe</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 pl-8 -mt-0.5 flex items-center gap-0.5">
              Explore <span className="text-amber-500 font-bold">Plus</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
            </span>
          </Link>

          {/* Delivery Location Widget (Amazon Style) */}
          <div className="hidden xl:flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="text-left leading-tight">
              <span className="text-[10px] text-slate-400 block">Deliver to</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[100px]">
                {user?.address?.city ? `${user.address.city}, India` : 'India 110001'}
              </span>
            </div>
          </div>
        </div>

        {/* Big Central Search Bar (Flipkart / Amazon Style) */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-2xl hidden md:flex items-stretch rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden transition-all h-9"
        >
          {/* Category Dropdown Prefix */}
          <select
            value={selectedSearchCategory}
            onChange={(e) => setSelectedSearchCategory(e.target.value)}
            className="hidden sm:block bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700 px-2 outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products, brands and more..."
            className="flex-1 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 bg-transparent outline-none"
          />

          <button
            type="submit"
            className="px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right Actions: Theme, Account, Orders, Cart */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User Auth Section (Amazon "Hello, Sign in / Account" Style) */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 py-1 px-2 rounded-md text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  {user?.firstName ? user.firstName.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block leading-tight text-left">
                  <span className="text-[10px] text-slate-400 block truncate max-w-[90px]">
                    Hello, {user?.firstName || 'User'}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-0.5">
                    <span>Account</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-52 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg p-1.5 z-50 divide-y divide-slate-100 dark:divide-slate-800"
                  >
                    <div className="px-3 py-2">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Signed in as
                      </p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        <span>Orders & Receipts</span>
                      </Link>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1 shadow-xs"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}

          {/* Returns & Orders Link (Amazon Style) */}
          <Link
            to="/orders"
            className="hidden md:flex flex-col py-1 px-2 rounded-md leading-tight text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="text-[10px] text-slate-400">Returns</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              & Orders
            </span>
          </Link>

          {/* Cart Icon & Count (Flipkart / Amazon Style) */}
          <Link
            to="/cart"
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-slate-800 dark:text-slate-200" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[18px] h-4.5 px-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200">
              Cart
            </span>
          </Link>

          {/* Mobile Search & Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Secondary Category Sub-Navbar (Flipkart / Amazon Strip) */}
      <div className="hidden md:block bg-slate-100 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80 text-xs relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* All Categories Dropdown - outside overflow container */}
            <div className="relative shrink-0" ref={catDropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 font-semibold cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
              >
                <Menu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>All Categories</span>
                <ChevronDown
                  className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
                    categoriesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {categoriesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1 w-56 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-50 divide-y divide-slate-100 dark:divide-slate-800"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Shop By Category
                    </div>
                    <div className="py-1">
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat}
                          to={`/products?category=${encodeURIComponent(cat)}`}
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                        >
                          <span>{cat}</span>
                          <span className="text-[10px] text-slate-400">›</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scrollable category links */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar font-medium">
              <Link
                to="/products"
                className="py-1 px-2 rounded text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors whitespace-nowrap"
              >
                All Products
              </Link>

            <Link
              to="/products?category=Electronics"
              className="py-1 px-2 rounded text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Electronics
            </Link>

            <Link
              to="/products?category=Fashion"
              className="py-1 px-2 rounded text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Fashion
            </Link>

            <Link
              to="/products?category=Home%20%26%20Kitchen"
              className="py-1 px-2 rounded text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Home & Kitchen
            </Link>

            <Link
              to="/products?category=Books"
              className="py-1 px-2 rounded text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Books
            </Link>

            <Link
              to="/products?category=Sports"
              className="py-1 px-2 rounded text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Sports
            </Link>
          </div>
        </div>

          <div className="flex items-center gap-3 font-semibold text-slate-600 dark:text-slate-400">
            <Link
              to="/products"
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Today's Deals</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-[11px] text-slate-500">24/7 Verified Support</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu & Search */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2.5 pb-4 space-y-3"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-3 pr-10 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-blue-600 text-white rounded text-xs flex items-center justify-center"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-col gap-1 text-xs font-semibold">
              <Link
                to="/"
                className="px-2.5 py-1.5 rounded text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="px-2.5 py-1.5 rounded text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                All Products
              </Link>
              <Link
                to="/orders"
                className="px-2.5 py-1.5 rounded text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                My Orders
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="px-2.5 py-1.5 rounded text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-2.5 py-1.5 rounded text-rose-600 text-left hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-2.5 py-1.5 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  Sign In / Register
                </Link>
              )}
            </div>

            {/* Popular Categories */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Categories
              </p>
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
