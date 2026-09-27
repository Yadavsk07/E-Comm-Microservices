import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Shield,
  LogOut,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import Button from '../components/common/Button';

export default function Profile() {
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState(authUser);

  useEffect(() => {
    async function loadFreshData() {
      if (authUser?.id) {
        try {
          const fresh = await authApi.getUserById(authUser.id);
          if (fresh) setProfile(fresh);
        } catch {
          // Fall back to authUser
        }
      }
    }
    loadFreshData();
  }, [authUser?.id]);

  const user = profile || authUser;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          My Account
        </span>
      </nav>

      {/* Header Profile Card */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg uppercase shadow-xs shrink-0">
            {user?.firstName ? user.firstName.charAt(0) : 'U'}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                {user?.role || 'CUSTOMER'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Account ID: <span className="font-mono text-slate-700 dark:text-slate-300">{user?.id || '—'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={LogOut}
              onClick={logout}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs py-1.5 px-3"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact info */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Contact Information
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Email Address</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {user?.email || '—'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Phone Number</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {user?.phone || '—'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Shield className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Security & Role</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  JWT Authenticated ({user?.role || 'CUSTOMER'})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Address info */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Primary Delivery Address
            </h3>
          </div>

          {user?.address ? (
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">
                {user.address.street}
              </p>
              <p>
                {user.address.city}, {user.address.state}
              </p>
              <p>
                {user.address.zipcode}, {user.address.country}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              No delivery address specified in profile. You can enter one at checkout.
            </p>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/orders"
          className="flex items-center justify-between p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 transition-colors group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                My Orders
              </h4>
              <p className="text-[11px] text-slate-400">Track shipments & view receipts</p>
            </div>
          </div>
        </Link>

        <Link
          to="/cart"
          className="flex items-center justify-between p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 transition-colors group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Shopping Cart
              </h4>
              <p className="text-[11px] text-slate-400">Manage saved items for checkout</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
