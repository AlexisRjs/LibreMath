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
        className={`inline-katex text-slate-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className={`relative group my-3 p-3 rounded-lg bg-darkviolet-925/90 border border-purple-900/40 shadow-inner overflow-x-auto ${className}`}>
      {copyable && (
        <button
          onClick={handleCopy}
          title="Copiar sintaxis LaTeX"
          className="absolute top-2 right-2 p-1.5 rounded-md bg-darkviolet-850/80 hover:bg-darkviolet-800 text-purple-300 hover:text-white opacity-0 group-hover:opacity-100 transition-all text-xs flex items-center gap-1 border border-purple-800/40"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>LaTeX</span>
            </>
          )}
        </button>
      )}
      <div
        className="text-center text-slate-100 py-1 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
