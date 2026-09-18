import React, { useMemo } from 'react';
import { renderObsidianMarkdown } from '../services/markdownParser';

interface MarkdownRendererProps {
  content: string;
  onNavigateTopic?: (slug: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onNavigateTopic,
}) => {
  const htmlContent = useMemo(() => {
    return renderObsidianMarkdown(content);
  }, [content]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('.obsidian-internal-link');
    if (target) {
      e.preventDefault();
      const slug = target.getAttribute('data-slug');
      if (slug && onNavigateTopic) {
        onNavigateTopic(slug);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className="obsidian-markdown-view prose-engineering space-y-4 text-slate-300 leading-relaxed text-[15px]"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
