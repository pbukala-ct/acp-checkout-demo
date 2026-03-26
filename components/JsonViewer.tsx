'use client';

interface Props {
  data: unknown;
  indent?: number;
}

function JsonNode({ data, indent = 0 }: Props) {
  const pad = '  '.repeat(indent);
  const padInner = '  '.repeat(indent + 1);

  if (data === null) return <span className="text-rose-400">null</span>;
  if (data === undefined) return <span className="text-gray-500">undefined</span>;
  if (typeof data === 'boolean') return <span className="text-violet-400">{String(data)}</span>;
  if (typeof data === 'number') return <span className="text-amber-300">{data}</span>;
  if (typeof data === 'string') {
    // Detect URLs for special colouring
    const isUrl = /^https?:\/\//.test(data);
    return (
      <span className={isUrl ? 'text-sky-400 underline-offset-2' : 'text-emerald-400'}>
        &quot;{data}&quot;
      </span>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-gray-400">[]</span>;
    return (
      <>
        <span className="text-gray-400">[</span>
        {'\n'}
        {data.map((item, i) => (
          <span key={i}>
            {padInner}
            <JsonNode data={item} indent={indent + 1} />
            {i < data.length - 1 && <span className="text-gray-600">,</span>}
            {'\n'}
          </span>
        ))}
        {pad}
        <span className="text-gray-400">]</span>
      </>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return <span className="text-gray-400">{'{}'}</span>;
    return (
      <>
        <span className="text-gray-400">{'{'}</span>
        {'\n'}
        {entries.map(([key, val], i) => (
          <span key={key}>
            {padInner}
            <span className="text-cyan-300">&quot;{key}&quot;</span>
            <span className="text-gray-500">: </span>
            <JsonNode data={val} indent={indent + 1} />
            {i < entries.length - 1 && <span className="text-gray-600">,</span>}
            {'\n'}
          </span>
        ))}
        {pad}
        <span className="text-gray-400">{'}'}</span>
      </>
    );
  }

  return <span className="text-gray-300">{String(data)}</span>;
}

export function JsonViewer({ data }: Props) {
  return (
    <pre className="text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre">
      <JsonNode data={data} indent={0} />
    </pre>
  );
}
