'use client';

interface Props {
  sessionId: string;
  productName: string;
}

export function OrderConfirmation({ sessionId, productName }: Props) {
  return (
    <div className="bg-green-950 border border-green-700 rounded-xl p-4 max-w-md">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-green-400 text-xl">✓</span>
        <p className="text-green-300 font-semibold text-sm">Order Confirmed!</p>
      </div>
      <p className="text-gray-300 text-sm">
        Your order for <span className="font-medium text-white">{productName}</span> has been placed
        successfully.
      </p>
      <div className="mt-3 pt-3 border-t border-green-800">
        <p className="text-[11px] text-gray-500 font-mono">
          Session reference:{' '}
          <span className="text-green-400 break-all">{sessionId}</span>
        </p>
      </div>
    </div>
  );
}
