import { Link } from 'react-router-dom';
import { Compass, Home, ShoppingBag } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-sm space-y-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
          <Compass className="w-6 h-6 animate-spin-slow" />
        </div>

        <div className="space-y-1">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
            404
          </span>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The page or route you were looking for doesn't exist, has been relocated, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
          <Link to="/">
            <Button variant="primary" size="sm" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="sm" icon={ShoppingBag}>
              Explore Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
