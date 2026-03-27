'use client';

import { type FulfillmentOption, formatCents, formatDeliveryWindow } from '@/lib/fulfillment';

interface Props {
  options: FulfillmentOption[];
  onSelect: (option: FulfillmentOption) => void;
}

export function ShippingOptions({ options, onSelect }: Props) {
  return (
    <div className="w-full max-w-md space-y-2">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Choose a delivery option</p>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt)}
          className="w-full text-left bg-gray-800 border border-gray-700 hover:border-yellow-400 hover:bg-gray-750 rounded-xl p-4 transition-all group focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-white group-hover:text-yellow-300 transition-colors">
                  {opt.title}
                </span>
                {opt.type === 'shipping' && (
                  <span className="text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded font-mono">
                    {opt.carrier_info}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">{opt.subtitle}</p>
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                <span>🚚</span>
                <span>{formatDeliveryWindow(opt.earliest_delivery_time, opt.latest_delivery_time)}</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-base font-bold text-yellow-400">
                {opt.total === 0 ? 'Free' : formatCents(opt.total)}
              </p>
              {opt.tax > 0 && (
                <p className="text-[10px] text-gray-600">+{formatCents(opt.tax)} tax</p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
