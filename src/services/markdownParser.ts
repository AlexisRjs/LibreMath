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
function getDefaultCalloutTitle(type: string): string {
  switch (type) {
    case 'NOTE':
      return 'Nota Teórica';
    case 'TIP':
      return 'Método Práctico';
    case 'WARNING':
    case 'CAUTION':
      return 'Precaución';
    case 'IMPORTANT':
      return 'Observación Clave';
    case 'INFO':
      return 'Definición';
    case 'EXAMPLE':
      return 'Ejemplo de Aplicación';
    default:
      return type;
  }
}

function getCalloutIcon(type: string): string {
  switch (type) {
    case 'NOTE':
      return '<svg class="w-4 h-4 inline-block shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>';
    case 'TIP':
      return '<svg class="w-4 h-4 inline-block shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>';
    case 'WARNING':
    case 'CAUTION':
      return '<svg class="w-4 h-4 inline-block shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>';
    case 'IMPORTANT':
      return '<svg class="w-4 h-4 inline-block shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    case 'EXAMPLE':
      return '<svg class="w-4 h-4 inline-block shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>';
    case 'INFO':
    default:
      return '<svg class="w-4 h-4 inline-block shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>';
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

  // 3. Process Obsidian callouts into placeholders BEFORE md.render
  // This guarantees closing </div> tags are never parsed by CommonMark as indented code blocks!
  const calloutBlocks: string[] = [];
  const calloutRegex = /^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|INFO|EXAMPLE|CAUTION)\]([^\n]*)\n((?:>.*(?:\n|$))*)/gim;

  processed = processed.replace(calloutRegex, (_match, type, title, body) => {
    const calloutType = type.toUpperCase();
    const cleanTitle = title.trim() || getDefaultCalloutTitle(calloutType);
    const cleanBody = body
      .split('\n')
      .map((line: string) => line.replace(/^>\s?/, ''))
      .join('\n');

    const placeholder = `@@CALLOUT_BLOCK_${calloutBlocks.length}@@`;
    const renderedBody = md.render(cleanBody.trim());

    const calloutHtml = `<div class="obsidian-callout obsidian-callout-${calloutType.toLowerCase()}">
<div class="obsidian-callout-header">
<span class="obsidian-callout-icon">${getCalloutIcon(calloutType)}</span>
<span class="obsidian-callout-title">${cleanTitle}</span>
</div>
<div class="obsidian-callout-body">
${renderedBody}
</div>
</div>\n\n`;

    calloutBlocks.push(calloutHtml);
    return placeholder;
  });

  // 4. Process Obsidian internal wiki links
  processed = processWikiLinks(processed);

  // 5. Render via Markdown-it
  let html = md.render(processed);

  // 6. Restore callouts safely with replacer function
  calloutBlocks.forEach((rendered, i) => {
    html = html.replace(new RegExp(`@@CALLOUT_BLOCK_${i}@@`, 'g'), () => rendered);
  });

  // 7. Restore math blocks safely with replacer function
  mathBlocks.forEach((rendered, i) => {
    html = html.replace(new RegExp(`@@MATHBLOCK_${i}@@`, 'g'), () => `<div class="math-display-wrapper my-3 overflow-x-auto">${rendered}</div>`);
  });

  // 8. Restore inline math safely with replacer function
  inlineMath.forEach((rendered, i) => {
    html = html.replace(new RegExp(`@@MATHINLINE_${i}@@`, 'g'), () => rendered);
  });

  return html;
}
