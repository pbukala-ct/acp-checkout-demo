'use client';

interface Props {
  sessionId: string;
  productName: string;
}

export function OrderConfirmation({ sessionId, productName }: Props) {
  return (
    <div className="bg-yellow-950/40 border border-yellow-600/50 rounded-xl p-4 max-w-md">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#FFC82B] text-xl">✓</span>
        <p className="text-yellow-300 font-semibold text-sm">Order Confirmed!</p>
      </div>
      <p className="text-gray-300 text-sm">
        Your order for <span className="font-medium text-white">{productName}</span> has been placed
        successfully.
      </p>
      <div className="mt-3 pt-3 border-t border-yellow-800/50">
        <p className="text-[11px] text-gray-500 font-mono">
          Session reference:{' '}
          <span className="text-yellow-400 break-all">{sessionId}</span>
        </p>
      </div>
    </div>
  );
}
