import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Button from '../components/common/Button';

export default function Login() {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login({
      email: formData.email.trim(),
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      success('Logged in successfully!');
      navigate(redirect, { replace: true });
    } else {
      setError(result.error);
      toastError(result.error);
    }
  };

  const handleDemoFill = () => {
    setFormData({
      email: 'admin@gmail.com',
      password: 'Admin@123',
    });
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-xs">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex w-10 h-10 rounded-md bg-blue-600 text-white items-center justify-center mb-1 shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Sign In
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your orders, cart, and recommendations.
          </p>
        </div>

        {/* Demo Quick Fill Hint */}
        <div className="p-2.5 rounded-md bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 flex items-center justify-between gap-2">
          <div>
            <span className="font-bold">Test:</span> admin@gmail.com
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="font-bold text-blue-600 dark:text-blue-400 underline cursor-pointer"
          >
            Auto Fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <Input
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            icon={Mail}
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          <PasswordInput
            label="Password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loading}
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link
            to={`/register${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
