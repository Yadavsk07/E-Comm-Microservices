import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, User, Phone, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Button from '../components/common/Button';

export default function Register() {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    zipcode: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    // Build payload exactly as required by backend RegisterRequest & AddressDto
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      address: {
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        zipcode: formData.zipcode.trim(),
      },
    };

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      success('Account registered successfully! Welcome to ShopVibe.');
      navigate(redirect, { replace: true });
    } else {
      setError(result.error);
      toastError(result.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-xs">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex w-10 h-10 rounded-md bg-blue-600 text-white items-center justify-center mb-1 shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join ShopVibe for personalized shopping, order tracking, and express checkout.
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First name"
                name="firstName"
                required
                icon={User}
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                label="Last name"
                name="lastName"
                required
                icon={User}
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
              <Input
                label="Email address"
                name="email"
                type="email"
                required
                icon={Mail}
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                label="Phone number"
                name="phone"
                type="tel"
                required
                icon={Phone}
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Security
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                label="Password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <PasswordInput
                label="Confirm password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Shipping Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Street Address"
                  name="street"
                  required
                  icon={MapPin}
                  placeholder="123 Silicon Boulevard, Apt 4B"
                  value={formData.street}
                  onChange={handleChange}
                />
              </div>
              <Input
                label="City"
                name="city"
                required
                placeholder="Bengaluru"
                value={formData.city}
                onChange={handleChange}
              />
              <Input
                label="State"
                name="state"
                required
                placeholder="Karnataka"
                value={formData.state}
                onChange={handleChange}
              />
              <Input
                label="Zip / Postal Code"
                name="zipcode"
                required
                placeholder="560001"
                value={formData.zipcode}
                onChange={handleChange}
              />
              <Input
                label="Country"
                name="country"
                required
                placeholder="India"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loading}
          >
            <span>Register & Start Shopping</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
          Already have an account?{' '}
          <Link
            to={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
