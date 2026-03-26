'use client';

import { useEffect, useState } from 'react';

interface Props {
  content: string;
  typing?: boolean;
}

export function AgentMessage({ content, typing = false }: Props) {
  const [visible, setVisible] = useState(!typing);

  useEffect(() => {
    if (typing) {
      const delay = 400 + Math.random() * 400;
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [typing]);

  return (
    <div className="flex items-start gap-3 max-w-2xl">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FFC82B] flex items-center justify-center text-[#1a1a1a] text-sm font-bold">
        A
      </div>
      <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-gray-100 text-sm leading-relaxed min-h-[40px]">
        {!visible ? (
          <span className="flex gap-1 items-center h-5">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
        ) : (
          <span>{content}</span>
        )}
      </div>
    </div>
  );
}
