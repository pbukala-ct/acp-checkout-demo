'use client';

import { useEffect, useRef } from 'react';
import { ApiEntry, type ApiLogEntry } from './ApiEntry';

interface Props {
  open: boolean;
  onToggle: () => void;
  entries: ApiLogEntry[];
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
          {/* Summary strip */}
          {entries.length > 0 && (
            <div className="flex-shrink-0 border-b border-gray-800 px-3 py-2 flex flex-wrap gap-1.5">
              {entries.map((e, i) => {
                const path = e.url.replace(/^https?:\/\/[^/]+/, '') || '/';
                const label = path.split('/').filter(Boolean).pop() ?? path;
                const statusColor =
                  e.isError ? 'text-red-400' :
                  e.status >= 400 ? 'text-orange-400' :
                  e.status >= 200 ? 'text-green-400' : 'text-gray-400';
                return (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-[10px] font-mono"
                    title={e.url}
                  >
                    <span className="text-gray-500">{e.method}</span>
                    <span className="text-gray-300 truncate max-w-[80px]">{label}</span>
                    <span className={`font-bold ${statusColor}`}>{e.status}</span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Entries list */}
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
