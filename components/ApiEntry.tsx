'use client';

import { useState } from 'react';
import { JsonViewer } from './JsonViewer';

export interface ApiCallContext {
  stepName: string;
  description: string;
  system: string;
  specRef?: string;
}

export interface ApiLogEntry {
  method: string;
  url: string;
  status: number;
  requestBody: unknown;
  responseBody: unknown;
  isError: boolean;
  timestamp: string;
  context?: ApiCallContext;
}

const METHOD_COLOR: Record<string, string> = {
  GET: 'bg-blue-600 text-white',
  POST: 'bg-green-600 text-white',
  PUT: 'bg-yellow-500 text-black',
  PATCH: 'bg-orange-500 text-white',
  DELETE: 'bg-red-600 text-white',
};

const STATUS_COLOR = (status: number) => {
  if (status >= 500) return 'text-red-400';
  if (status >= 400) return 'text-orange-400';
  if (status >= 300) return 'text-yellow-400';
  if (status >= 200) return 'text-green-400';
  return 'text-gray-400';
};

export function ApiEntry({ entry }: { entry: ApiLogEntry }) {
  const [expanded, setExpanded] = useState(true);
  const [tab, setTab] = useState<'response' | 'request'>('response');
  const [fullHeight, setFullHeight] = useState(false);

  const host = entry.url.match(/^https?:\/\/([^/]+)/)?.[1] ?? '';
  const path = entry.url.replace(/^https?:\/\/[^/]+/, '') || '/';
  const time = new Date(entry.timestamp).toLocaleTimeString();

  return (
    <div className={`rounded-lg overflow-hidden border ${entry.isError ? 'border-red-700/60' : 'border-gray-700/60'}`}>
      {/* Header row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className={`w-full flex items-center gap-2 px-3 py-2.5 text-left ${entry.isError ? 'bg-red-950/60' : 'bg-gray-800/80'} hover:bg-gray-700/60 transition-colors`}
      >
        <span className={`shrink-0 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide ${METHOD_COLOR[entry.method] ?? 'bg-gray-600 text-white'}`}>
          {entry.method}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-500 truncate">{host}</p>
          <p className="text-xs text-gray-200 font-mono truncate">{path}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-sm font-bold ${STATUS_COLOR(entry.status)}`}>{entry.status}</span>
          <span className="text-[10px] text-gray-600">{time}</span>
          <span className="text-gray-600 text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="bg-gray-950/80 border-t border-gray-800/60">
          {/* Protocol context banner */}
          {entry.context && (
            <div className="px-3 py-2.5 border-b border-gray-800/60 bg-gray-900/60">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-[#FFC82B]/20 text-[#FFC82B] border border-[#FFC82B]/30">
                  {entry.context.system}
                </span>
                <span className="text-xs font-semibold text-gray-200">{entry.context.stepName}</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">{entry.context.description}</p>
              {entry.context.specRef && (
                <a
                  href={entry.context.specRef}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-[10px] text-blue-400 hover:text-blue-300 underline underline-offset-2"
                >
                  Spec reference ↗
                </a>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-800/60">
            {(['response', 'request'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-[11px] font-medium capitalize transition-colors ${
                  tab === t
                    ? 'text-yellow-400 border-b-2 border-yellow-400 -mb-px'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t}
                {t === 'request' && entry.requestBody === null && (
                  <span className="ml-1 text-gray-700">(empty)</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className={`p-3 overflow-y-auto ${fullHeight ? '' : 'max-h-80'}`}>
            {tab === 'request' ? (
              entry.requestBody !== null ? (
                <JsonViewer data={entry.requestBody} />
              ) : (
                <p className="text-xs text-gray-600 italic">No request body</p>
              )
            ) : (
              <JsonViewer data={entry.responseBody} />
            )}
          </div>
          <button
            onClick={() => setFullHeight((v) => !v)}
            className="w-full py-1 text-[10px] text-gray-600 hover:text-gray-400 hover:bg-gray-800/40 transition-colors border-t border-gray-800/60 font-mono"
          >
            {fullHeight ? '▲ collapse' : '▼ expand'}
          </button>
        </div>
      )}
    </div>
  );
}
