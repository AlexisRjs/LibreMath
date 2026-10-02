import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { Copy, Check } from 'lucide-react';

interface MathRendererProps {
  math: string;
  block?: boolean;
  className?: string;
  copyable?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  math,
  block = false,
  className = '',
  copyable = false,
}) => {
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch (err) {
      console.error('KaTeX error:', err);
      return `<span class="text-rose-400 font-mono text-sm">${math}</span>`;
    }
  }, [math, block]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(math.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  if (!block) {
    return (
      <span
        className={`inline-katex text-white ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className={`relative group my-3 p-3.5 rounded-xl bg-black border border-zinc-800 shadow-sm overflow-x-auto text-center ${className}`}>
      {copyable && (
        <button
          onClick={handleCopy}
          title="Copiar sintaxis LaTeX"
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#0e0e12] hover:bg-zinc-800 text-zinc-300 hover:text-white opacity-0 group-hover:opacity-100 transition-all text-xs flex items-center gap-1 border border-zinc-800 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium text-[11px]">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span className="text-[11px] font-mono">LaTeX</span>
            </>
          )}
        </button>
      )}
      <div
        className="text-center text-white py-1 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
