import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Lock,
  ArrowRight,
  AlertCircle,
  PackageCheck,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRazorpay } from '../hooks/useRazorpay';
import { orderApi } from '../api/orderApi';
import PriceDisplay from '../components/common/PriceDisplay';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import EmptyState from '../components/common/EmptyState';
import { getApiErrorMessage } from '../utils/errorHandler';

export default function Checkout() {
  const { items, itemCount, subtotal, fetchCart } = useCart();
  const { user } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const { processPayment, loading: paymentLoading } = useRazorpay();
  const navigate = useNavigate();

  // Pre-fill shipping address from authenticated user if available
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    country: user?.address?.country || 'India',
    zipcode: user?.address?.zipcode || '',
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.zipcode) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    setIsPlacingOrder(true);
    setErrorMessage(null);

    try {
      // 1. Create order in Order Service (stock is verified and decreased, cart is cleared)
      let order = createdOrder;
      if (!order) {
        order = await orderApi.createOrder();
        setCreatedOrder(order);
        await fetchCart(); // Refresh cart to empty state
      }

      // 2. Launch Razorpay payment flow
      await processPayment(order.id, {
        onSuccess: ({ orderId, paymentId }) => {
          toastSuccess('Payment verified successfully!');
          navigate(`/order-success?orderId=${orderId}&paymentId=${paymentId}`, {
            replace: true,
          });
        },
        onFailure: (errMsg) => {
          setErrorMessage(errMsg);
          toastError(errMsg);
        },
      });
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!items || items.length === 0) {
    if (createdOrder) {
      // Order was already placed and waiting for payment
      return (
        <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
          <div className="p-6 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
            <PackageCheck className="w-10 h-10 text-blue-600 mx-auto" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Order #{createdOrder.id} Placed
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your order is pending payment. Click below to complete payment via Razorpay.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold border-0 shadow-xs text-xs"
                onClick={handleProceedToPayment}
                isLoading={isPlacingOrder || paymentLoading}
              >
                Complete Payment Now
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Your checkout is empty"
          description="You don't have any items in your cart to proceed with checkout."
          actionText="Explore Products"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 sm:p-4 shadow-xs">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Confirm delivery address and complete payment via Razorpay.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Checkout Notice</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleProceedToPayment}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left: Shipping & Payment Method */}
          <div className="lg:col-span-7 space-y-4">
            {/* Step 1: Delivery Address */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Delivery Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="sm:col-span-2">
                  <Input
                    label="Street Address"
                    name="street"
                    required
                    icon={MapPin}
                    placeholder="123 High Street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                  />
                </div>
                <Input
                  label="City"
                  name="city"
                  required
                  placeholder="Bengaluru"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                />
                <Input
                  label="State"
                  name="state"
                  required
                  placeholder="Karnataka"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                />
                <Input
                  label="Postal / Zip Code"
                  name="zipcode"
                  required
                  placeholder="560001"
                  value={shippingAddress.zipcode}
                  onChange={handleAddressChange}
                />
                <Input
                  label="Country"
                  name="country"
                  required
                  placeholder="India"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                />
              </div>
            </div>

            {/* Step 2: Payment Provider */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Payment Method
                </h3>
              </div>

              {/* Selected Razorpay radio card */}
              <div className="p-3 rounded-md border-2 border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Razorpay Official Gateway
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      UPI, Credit/Debit Cards, NetBanking & Wallets
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>256-bit SSL encrypted. Payment verified securely by backend.</span>
              </div>
            </div>
          </div>

          {/* Right: Review Items & Pay Button */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-2.5 border-b border-slate-100 dark:border-slate-800 text-[11px]">
                Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </h3>

              {/* Items scroll */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {items.map((item) => (
                  <div key={item.id || item.productId} className="flex items-center justify-between gap-2.5 text-xs py-1 border-b border-slate-50 dark:border-slate-800/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-9 h-9 rounded object-contain bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <PriceDisplay price={item.subtotal || item.price * item.quantity} size="xs" className="shrink-0" />
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <PriceDisplay price={subtotal} size="xs" />
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span>₹{Number(subtotal).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit / Pay CTA */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold border-0 shadow-xs uppercase tracking-wide text-xs py-2.5"
                isLoading={isPlacingOrder || paymentLoading}
              >
                <span>Place Order & Pay</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
