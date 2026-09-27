import { CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react';

const STEPS = [
  { id: 'placed', label: 'Order Placed', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Package },
];

export default function OrderStatusTimeline({ status }) {
  const normStatus = status ? String(status).toUpperCase() : 'PENDING';

  if (normStatus === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200">
        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <p className="text-sm font-bold">This order has been cancelled.</p>
          <p className="text-xs text-rose-600 dark:text-rose-400">
            If you were charged, your payment will be refunded within 5-7 business days.
          </p>
        </div>
      </div>
    );
  }

  // Determine active step index:
  // PAYMENT_PENDING / PENDING = 0
  // CONFIRMED = 1
  // SHIPPED = 2
  // DELIVERED = 3
  let currentStepIndex = 0;
  if (normStatus === 'CONFIRMED') currentStepIndex = 1;
  else if (normStatus === 'SHIPPED') currentStepIndex = 2;
  else if (normStatus === 'DELIVERED') currentStepIndex = 3;

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Progress background line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-0" />

        {/* Progress filled line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 -z-0"
          style={{
            width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] sm:text-xs font-semibold mt-2 text-center ${
                  isCurrent || isDone
                    ? 'text-slate-900 dark:text-slate-100 font-bold'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
