import { Link, useSearchParams } from 'react-router-dom';
import { ShieldAlert, LogIn, Home } from 'lucide-react';
import Button from '../components/common/Button';

export default function Unauthorized() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-sm space-y-4">
        <div className="w-12 h-12 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Access Restricted
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You must be signed in with an authorized account to access this microservice resource.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}>
            <Button variant="primary" size="sm" icon={LogIn}>
              Sign In Now
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm" icon={Home}>
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
