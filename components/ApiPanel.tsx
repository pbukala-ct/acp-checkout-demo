'use client';

import { useEffect, useRef } from 'react';
import { ApiEntry, type ApiLogEntry } from './ApiEntry';

interface Props {
  open: boolean;
  onToggle: () => void;
  entries: ApiLogEntry[];
}

const METHOD_COLOR: Record<string, string> = {
  GET: 'bg-blue-600 text-white',
  POST: 'bg-green-600 text-white',
  PUT: 'bg-yellow-500 text-black',
  PATCH: 'bg-orange-500 text-white',
  DELETE: 'bg-red-600 text-white',
};

function getBusinessName(method: string, url: string): string {
  const path = url.replace(/^https?:\/\/[^/]+/, '');
  if (/\/complete$/.test(path)) return 'Place Order';
  if (/\/cancel$/.test(path)) return 'Cancel Session';
  if (/\/checkout_sessions\/[^/]+$/.test(path) && method === 'POST') return 'Select Shipping';
  if (/\/checkout_sessions\/[^/]+$/.test(path) && method === 'GET') return 'Get Session';
  if (/\/checkout_sessions$/.test(path) && method === 'POST') return 'Create Session';
  return path.split('/').filter(Boolean).pop() ?? 'API Call';
}

export function ApiPanel({ open, onToggle, entries }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries, open]);

  return (
    <div className={`flex flex-col border-l border-gray-800 transition-all duration-300 ${open ? 'w-[520px]' : 'w-10'} flex-shrink-0`}>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        title={open ? 'Close API Inspector' : 'Open API Inspector'}
        className="flex items-center justify-center h-10 w-full bg-gray-900 border-b border-gray-800 hover:bg-gray-800 transition-colors flex-shrink-0"
      >
        {open ? (
          <span className="text-xs text-gray-400 font-mono flex items-center gap-2 px-3 w-full">
            <span className="text-yellow-400">{'</>'}</span>
            <span className="text-gray-300 font-semibold">API Inspector</span>
            {entries.length > 0 && (
              <span className="bg-[#FFC82B] text-[#1a1a1a] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {entries.length}
              </span>
            )}
            <span className="ml-auto text-gray-600">→</span>
          </span>
        ) : (
          <span className="text-yellow-400 text-xs font-mono rotate-90 whitespace-nowrap">API</span>
        )}
      </button>

      {open && (
        <div className="flex flex-col flex-1 overflow-hidden bg-gray-950">

          {/* Summary list */}
          {entries.length > 0 && (
            <div className="flex-shrink-0 border-b border-gray-700 bg-gray-900">
              <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Request Log
              </p>
              <ul className="pb-2">
                {entries.map((e, i) => {
                  const path = e.url.replace(/^https?:\/\/[^/]+/, '') || '/';
                  const businessName = getBusinessName(e.method, e.url);
                  const statusColor =
                    e.isError || e.status >= 500 ? 'text-red-400 bg-red-950/40 border-red-800/50' :
                    e.status >= 400 ? 'text-orange-400 bg-orange-950/40 border-orange-800/50' :
                    'text-green-400 bg-green-950/40 border-green-800/50';
                  return (
                    <li key={i} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-800/60 transition-colors">
                      {/* Step number */}
                      <span className="w-4 h-4 rounded-full bg-gray-700 text-gray-400 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      {/* Method badge */}
                      <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${METHOD_COLOR[e.method] ?? 'bg-gray-600 text-white'}`}>
                        {e.method}
                      </span>
                      {/* Business name */}
                      <span className="text-xs font-semibold text-gray-200 flex-1 min-w-0 truncate">
                        {businessName}
                      </span>
                      {/* Endpoint path */}
                      <span className="text-[10px] text-gray-600 font-mono truncate max-w-[120px] hidden lg:block" title={path}>
                        {path}
                      </span>
                      {/* Status */}
                      <span className={`shrink-0 text-[11px] font-bold px-1.5 py-0.5 rounded border ${statusColor}`}>
                        {e.status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Full entries */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {entries.length === 0 ? (
              <p className="text-xs text-gray-600 text-center mt-8 font-mono">
                API calls will appear here as the demo progresses
              </p>
            ) : (
              entries.map((e, i) => <ApiEntry key={i} entry={e} />)
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </div>
  );
}
