import MarkdownIt from 'markdown-it';
import katex from 'katex';

// Obsidian markdown-it engine
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

// Custom Math (KaTeX) processing for inline $...$ and block $$...$$
function renderMathBlock(content: string): string {
  try {
    return katex.renderToString(content.trim(), {
      displayMode: true,
      throwOnError: false,
    });
  } catch (err) {
    return `<pre class="katex-error">${err}</pre>`;
  }
}

function renderMathInline(content: string): string {
  try {
    return katex.renderToString(content.trim(), {
      displayMode: false,
      throwOnError: false,
    });
  } catch (err) {
    return `<span class="katex-error">${err}</span>`;
  }
}

/**
 * Pre-process Obsidian wiki-links [[slug|label]] or [[slug]]
 */
function processWikiLinks(text: string): string {
  return text.replace(/\[\[([^\]]+)\]\]/g, (_match, inner) => {
    const parts = inner.split('|');
    const target = parts[0].trim();
    const label = parts[1] ? parts[1].trim() : target;
    return `<a href="#/topic/${target}" class="obsidian-internal-link" data-slug="${target}">[[${label}]]</a>`;
  });
}

/**
 * Process Obsidian callouts (> [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT], > [!INFO], > [!EXAMPLE])
 */
function processCallouts(text: string): string {
  const calloutRegex = /^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|INFO|EXAMPLE|CAUTION)\]([^\n]*)\n((?:>.*(?:\n|$))*)/gim;

  return text.replace(calloutRegex, (_match, type, title, body) => {
    const calloutType = type.toUpperCase();
    const cleanTitle = title.trim() || getDefaultCalloutTitle(calloutType);
    const cleanBody = body
      .split('\n')
      .map((line: string) => line.replace(/^>\s?/, ''))
      .join('\n');

    return `<div class="obsidian-callout obsidian-callout-${calloutType.toLowerCase()}">
      <div class="obsidian-callout-header">
        <span class="obsidian-callout-icon">${getCalloutIcon(calloutType)}</span>
        <span class="obsidian-callout-title">${cleanTitle}</span>
      </div>
      <div class="obsidian-callout-body">
${cleanBody}
      </div>
    </div>\n\n`;
  });
}

function getDefaultCalloutTitle(type: string): string {
  switch (type) {
    case 'NOTE':
      return 'Nota Teórica';
    case 'TIP':
      return 'Consejo / Truco';
    case 'WARNING':
      return 'Atención';
    case 'IMPORTANT':
      return 'Importante';
    case 'INFO':
      return 'Información';
    case 'EXAMPLE':
      return 'Ejemplo de Aplicación';
    default:
      return type;
  }
}

function getCalloutIcon(type: string): string {
  switch (type) {
    case 'NOTE':
    case 'INFO':
      return 'ℹ️';
    case 'TIP':
      return '💡';
    case 'WARNING':
    case 'CAUTION':
      return '⚠️';
    case 'IMPORTANT':
      return '📌';
    case 'EXAMPLE':
      return '📝';
    default:
      return '🔹';
  }
}

/**
 * Parse and render markdown using Markdown-it with Obsidian extensions
 */
export function renderObsidianMarkdown(markdown: string): string {
  if (!markdown) return '';

  // 1. Math block extraction to prevent markdown parser from interfering with LaTeX characters
  const mathBlocks: string[] = [];
  let processed = markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_match, math) => {
    const placeholder = `@@MATHBLOCK_${mathBlocks.length}@@`;
    mathBlocks.push(renderMathBlock(math));
    return placeholder;
  });

  // 2. Inline math extraction
  const inlineMath: string[] = [];
  processed = processed.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (_match, prefix, math) => {
    const placeholder = `@@MATHINLINE_${inlineMath.length}@@`;
    inlineMath.push(renderMathInline(math));
    return `${prefix}${placeholder}`;
  });

  // 3. Process Obsidian callouts
  processed = processCallouts(processed);

  // 4. Process Obsidian internal wiki links
  processed = processWikiLinks(processed);

  // 5. Render via Markdown-it
  let html = md.render(processed);

  // 6. Restore math blocks safely with replacer function
  mathBlocks.forEach((rendered, i) => {
    html = html.replace(new RegExp(`@@MATHBLOCK_${i}@@`, 'g'), () => `<div class="math-display-wrapper my-3 overflow-x-auto">${rendered}</div>`);
  });

  // 7. Restore inline math safely with replacer function
  inlineMath.forEach((rendered, i) => {
    html = html.replace(new RegExp(`@@MATHINLINE_${i}@@`, 'g'), () => rendered);
  });

  return html;
}
