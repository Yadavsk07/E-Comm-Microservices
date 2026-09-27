import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { success } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      success('Thank you for subscribing to ShopVibe insider updates!');
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200 mt-12 text-xs">
      {/* Amazon-style "Back to top" button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b border-slate-200 dark:border-slate-800"
      >
        <ArrowUp className="w-3.5 h-3.5" />
        <span>Back to top</span>
      </button>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Shop<span className="text-blue-600 dark:text-blue-400">Vibe</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              India's next-generation e-commerce platform built on Spring Boot microservices, high-performance API Gateway, and verified Razorpay payments.
            </p>

            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} className="pt-1 max-w-sm">
              <div className="flex items-center gap-1.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for offers"
                  className="w-full text-xs px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shrink-0 transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Shop Column */}
          <div className="space-y-2.5">
            <h5 className="font-bold uppercase tracking-wider text-[11px] text-slate-800 dark:text-slate-200">
              Categories
            </h5>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><Link to="/products?category=Electronics" className="hover:text-blue-600 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-blue-600 transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=Home%20%26%20Kitchen" className="hover:text-blue-600 transition-colors">Home & Kitchen</Link></li>
              <li><Link to="/products?category=Books" className="hover:text-blue-600 transition-colors">Books & Media</Link></li>
              <li><Link to="/products?category=Sports" className="hover:text-blue-600 transition-colors">Sports & Fitness</Link></li>
            </ul>
          </div>

          {/* Customer Service & Account */}
          <div className="space-y-2.5">
            <h5 className="font-bold uppercase tracking-wider text-[11px] text-slate-800 dark:text-slate-200">
              Customer Care
            </h5>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><Link to="/orders" className="hover:text-blue-600 transition-colors">Your Orders</Link></li>
              <li><Link to="/cart" className="hover:text-blue-600 transition-colors">Shipping Rates & Policies</Link></li>
              <li><Link to="/profile" className="hover:text-blue-600 transition-colors">Your Account</Link></li>
              <li><Link to="/products" className="hover:text-blue-600 transition-colors">Returns & Replacements</Link></li>
            </ul>
          </div>

          {/* Microservices Architecture */}
          <div className="space-y-2.5">
            <h5 className="font-bold uppercase tracking-wider text-[11px] text-slate-800 dark:text-slate-200">
              Microservices
            </h5>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Product Service (MySQL)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Cart Service (MongoDB)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                <span>Order Service (JPA)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Razorpay Gateway</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} ShopVibe, Inc. or its affiliates. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Conditions of Use</span>
            <span className="hover:underline cursor-pointer">Privacy Notice</span>
            <span className="hover:underline cursor-pointer">Interest-Based Ads</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
