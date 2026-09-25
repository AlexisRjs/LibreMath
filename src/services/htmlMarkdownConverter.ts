/**
 * Utility to convert between Markdown and HTML for the WYSIWYG note editor.
 * Ensures lossless two-way editing between rich formatted text and markdown storage.
 */

/**
 * Converts stored Markdown into styled HTML for the visual editor
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split(/\r?\n/);
  const htmlLines: string[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block check ```
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        htmlLines.push(`<pre><code>${codeBuffer.join('\n')}</code></pre>`);
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(escapeHtml(line));
      continue;
    }

    // List check
    const listMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        htmlLines.push('<ul>');
        inList = true;
      }
      htmlLines.push(`<li>${formatInline(listMatch[2])}</li>`);
      continue;
    } else if (inList) {
      htmlLines.push('</ul>');
      inList = false;
    }

    // Headings
    if (line.startsWith('# ')) {
      htmlLines.push(`<h1>${formatInline(line.substring(2))}</h1>`);
    } else if (line.startsWith('## ')) {
      htmlLines.push(`<h2>${formatInline(line.substring(3))}</h2>`);
    } else if (line.startsWith('### ')) {
      htmlLines.push(`<h3>${formatInline(line.substring(4))}</h3>`);
    } else if (line.startsWith('#### ')) {
      htmlLines.push(`<h4>${formatInline(line.substring(5))}</h4>`);
    } else if (line.startsWith('> ')) {
      htmlLines.push(`<blockquote>${formatInline(line.substring(2))}</blockquote>`);
    } else if (line.trim() === '---' || line.trim() === '***') {
      htmlLines.push('<hr />');
    } else if (line.trim() === '') {
      htmlLines.push('<p><br></p>');
    } else {
      htmlLines.push(`<p>${formatInline(line)}</p>`);
    }
  }

  if (inCodeBlock && codeBuffer.length > 0) {
    htmlLines.push(`<pre><code>${codeBuffer.join('\n')}</code></pre>`);
  }
  if (inList) {
    htmlLines.push('</ul>');
  }

  return htmlLines.join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Format inline elements like underline, strikethrough, bold, italic, code
 */
function formatInline(text: string): string {
  if (!text) return '<br>';

  let formatted = text;

  // Strikethrough ~~text~~ or ~text~
  formatted = formatted.replace(/~~(.*?)~~/g, '<s>$1</s>');
  formatted = formatted.replace(/(?<!~)\~([^~]+)\~(?!~)/g, '<s>$1</s>');

  // Underline <u>text</u> (already HTML) or keep as is
  // Bold **text** or __text__
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  formatted = formatted.replace(/__(.*?)__/g, '<b>$1</b>');

  // Italic *text* or _text_
  formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<i>$1</i>');
  formatted = formatted.replace(/(?<!_)_([^_]+)_(?!_)/g, '<i>$1</i>');

  // Inline code `code`
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

  return formatted;
}

/**
 * Converts DOM tree or HTML string from the visual editor back to clean Markdown
 */
export function htmlToMarkdown(container: HTMLElement | string): string {
  let root: HTMLElement;
  if (typeof container === 'string') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${container}</div>`, 'text/html');
    root = doc.body.firstElementChild as HTMLElement || doc.body;
  } else {
    root = container;
  }

  function processNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const style = (el.getAttribute('style') || '').toLowerCase();

    // Check inline decorations from styles
    const isUnderline = tag === 'u' || style.includes('underline');
    const isStrike = tag === 's' || tag === 'del' || tag === 'strike' || style.includes('line-through');
    const isBold = tag === 'b' || tag === 'strong' || style.includes('bold') || style.includes('700');
    const isItalic = tag === 'i' || tag === 'em' || style.includes('italic');

    let inner = '';
    for (let i = 0; i < el.childNodes.length; i++) {
      inner += processNode(el.childNodes[i]);
    }

    // Apply inline markdown wrappers
    if (isUnderline && tag !== 'u') {
      inner = `<u>${inner}</u>`;
    }
    if (isStrike && tag !== 's' && tag !== 'del' && tag !== 'strike') {
      inner = `~~${inner}~~`;
    }
    if (isBold && tag !== 'b' && tag !== 'strong') {
      inner = `**${inner}**`;
    }
    if (isItalic && tag !== 'i' && tag !== 'em') {
      inner = `*${inner}*`;
    }

    switch (tag) {
      case 'h1':
        return `\n# ${inner.trim()}\n\n`;
      case 'h2':
        return `\n## ${inner.trim()}\n\n`;
      case 'h3':
        return `\n### ${inner.trim()}\n\n`;
      case 'h4':
        return `\n#### ${inner.trim()}\n\n`;
      case 'p':
        return inner.trim() ? `${inner.trim()}\n\n` : '\n';
      case 'div':
        return inner ? `${inner}\n` : '\n';
      case 'br':
        return '\n';
      case 'u':
        return `<u>${inner}</u>`;
      case 's':
      case 'del':
      case 'strike':
        return `~~${inner}~~`;
      case 'b':
      case 'strong':
        return `**${inner}**`;
      case 'i':
      case 'em':
        return `*${inner}*`;
      case 'code':
        if (el.parentElement?.tagName.toLowerCase() === 'pre') return inner;
        return `\`${inner}\``;
      case 'pre': {
        const lang = el.querySelector('code')?.className.replace(/language-/, '') || '';
        return `\n\`\`\`${lang}\n${el.textContent || ''}\n\`\`\`\n\n`;
      }
      case 'ul':
        return `\n${inner}\n`;
      case 'ol':
        return `\n${inner}\n`;
      case 'li':
        return `- ${inner.trim()}\n`;
      case 'blockquote':
        return `\n> ${inner.trim()}\n\n`;
      case 'hr':
        return `\n---\n\n`;
      default:
        return inner;
    }
  }

  let result = '';
  for (let i = 0; i < root.childNodes.length; i++) {
    result += processNode(root.childNodes[i]);
  }

  // Clean up excess consecutive line breaks
  return result
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
