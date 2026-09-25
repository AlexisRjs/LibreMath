import { renderObsidianMarkdown } from './markdownParser';
import { PDF_FOOTER_BASE64 } from './pdfFooterBase64';

export interface PdfExportOptions {
  title: string;
  unit?: string;
  moduleName?: string;
  markdownContent: string;
  isUserNote?: boolean;
}

export async function exportTopicToPdf(options: PdfExportOptions): Promise<void> {
  const { title, unit = 'Apuntes y Anotaciones', moduleName = 'LibreMath', markdownContent, isUserNote = false } = options;
  const showFooter = !isUserNote;

  // 1. Render Markdown with KaTeX math to HTML
  const bodyHtml = renderObsidianMarkdown(markdownContent);
  const dateStr = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const brandDisplay = isUserNote
    ? 'LibreMath • Mis Notas'
    : (moduleName.toLowerCase().startsWith('libremath')
        ? moduleName
        : `LibreMath • ${moduleName}`);

  // 2. Build print HTML document (repeating footer only for subject pages, excluded for user notes)
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title} - LibreMath</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css">
  <style>
    @page {
      size: A4 portrait;
      margin: ${showFooter ? '12mm 14mm 14mm 14mm' : '14mm 14mm 14mm 14mm'};
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1a1a1a;
      background-color: #ffffff;
      font-size: 13.5px;
      line-height: 1.55;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Print table layout guaranteeing footer spacer on every page */
    table.print-layout-table {
      width: 100%;
      border-collapse: collapse;
      border: none;
      margin: 0;
      padding: 0;
    }
    td.print-td-blank {
      border: none;
      padding: 0;
      height: 0;
    }
    td.print-td-content {
      border: none;
      padding: 0;
      vertical-align: top;
    }
    td.print-td-footer-spacer {
      border: none;
      padding: 0;
    }
    .footer-spacer {
      height: 26mm;
      width: 100%;
    }

    /* Fixed Footer repeated on every single page */
    .pdf-fixed-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      text-align: center;
      background: #ffffff;
      padding: 0;
      margin: 0;
      z-index: 9999;
    }
    .pdf-fixed-footer img {
      width: auto;
      max-width: 100%;
      height: auto;
      max-height: 21mm;
      object-fit: contain;
      display: block;
      margin: 0 auto;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }

    /* Document header styling */
    .header {
      border-bottom: 2px solid #7c3aed;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-family: monospace;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    .header-top .brand {
      color: #7c3aed;
      font-weight: bold;
    }
    h1.title {
      font-size: 24px;
      font-weight: 800;
      color: #111827;
      margin: 0 0 6px 0;
      line-height: 1.25;
      letter-spacing: -0.02em;
    }
    .unit-tag {
      font-size: 13px;
      color: #4b5563;
      margin: 0;
    }

    /* Content and typography */
    .content {
      margin-bottom: 16px;
    }
    h1 {
      font-size: 19px;
      font-weight: 700;
      margin: 22px 0 10px 0;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4px;
      page-break-after: avoid;
      break-after: avoid;
    }
    h2 {
      font-size: 16px;
      font-weight: 700;
      margin: 18px 0 8px 0;
      color: #374151;
      page-break-after: avoid;
      break-after: avoid;
    }
    h3 {
      font-size: 14.5px;
      font-weight: 600;
      margin: 14px 0 6px 0;
      color: #4b5563;
      page-break-after: avoid;
      break-after: avoid;
    }
    p {
      margin: 0 0 11px 0;
      color: #374151;
    }
    ul, ol {
      margin: 0 0 11px 0;
      padding-left: 22px;
    }
    li {
      margin-bottom: 4px;
    }
    code {
      font-family: "Consolas", "Courier New", monospace;
      background: #f3f4f6;
      color: #6b21a8;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 12px;
      border: 1px solid #e5e7eb;
    }
    pre {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      overflow-x: auto;
      font-family: "Consolas", "Courier New", monospace;
      font-size: 12px;
      line-height: 1.5;
      margin: 14px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    blockquote {
      margin: 14px 0;
      padding: 10px 16px;
      border-left: 4px solid #7c3aed;
      background: #f5f3ff;
      border-radius: 0 6px 6px 0;
      font-size: 13px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    table:not(.print-layout-table) {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    table:not(.print-layout-table) th,
    table:not(.print-layout-table) td {
      border: 1px solid #e5e7eb;
      padding: 8px 12px;
      text-align: left;
      vertical-align: middle;
    }
    table:not(.print-layout-table) th {
      background-color: #f9fafb;
      font-weight: 600;
      color: #374151;
    }

    /* KaTeX print rules - Standard comfortable size */
    .katex {
      font-size: 1.05em;
    }
    .katex-display {
      margin: 12px 0;
      padding: 6px 0;
      overflow-x: visible;
      text-align: center;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    /* Fractions specifically: compensate for default KaTeX fraction shrinkage */
    .katex .mfrac {
      font-size: 1.18em;
    }
    table .katex .mfrac {
      font-size: 1.25em;
    }

    /* Obsidian Callouts print rules */
    .obsidian-callout {
      border-left: 4px solid #7c3aed;
      background-color: #f8fafc;
      border-radius: 4px;
      padding: 10px 14px;
      margin: 14px 0;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .obsidian-callout-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 4px;
      color: #6b21a8;
    }
    .obsidian-callout-tip {
      border-left-color: #10b981;
    }
    .obsidian-callout-tip .obsidian-callout-header {
      color: #047857;
    }
    .obsidian-callout-warning {
      border-left-color: #f59e0b;
    }
    .obsidian-callout-warning .obsidian-callout-header {
      color: #b45309;
    }
    .obsidian-callout-important {
      border-left-color: #ef4444;
    }
    .obsidian-callout-important .obsidian-callout-header {
      color: #b91c1c;
    }
    .obsidian-callout-body {
      color: #374151;
      font-size: 13px;
      line-height: 1.5;
    }
    .obsidian-callout-body p:last-child {
      margin-bottom: 0;
    }
  </style>
</head>
<body>
  <!-- Table structure that forces page break before running into the fixed footer -->
  <table class="print-layout-table">
    <thead>
      <tr>
        <td class="print-td-blank"></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="print-td-content">
          <div class="header">
            <div class="header-top">
              <span class="brand">${brandDisplay}</span>
              <span>${dateStr}</span>
            </div>
            <h1 class="title">${title}</h1>
            <p class="unit-tag">${unit}</p>
          </div>

          <div class="content">
            ${bodyHtml}
          </div>
        </td>
      </tr>
    </tbody>
    ${showFooter ? `<tfoot>
      <tr>
        <td class="print-td-footer-spacer">
          <div class="footer-spacer"></div>
        </td>
      </tr>
    </tfoot>` : ''}
  </table>

  ${showFooter ? `<!-- Persistent Page Footer Image present on every single printed sheet for module subjects -->
  <div class="pdf-fixed-footer">
    <img src="${PDF_FOOTER_BASE64}" alt="Universitarios por la Libertad" />
  </div>` : ''}
</body>
</html>`;

  // 3. Create hidden iframe and trigger native Print/Save as PDF dialog
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = 'about:blank';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    throw new Error('No se pudo inicializar el documento de impresión');
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Wait for fonts, KaTeX styles and base64 footer image to be fully decoded
  try {
    if (doc.fonts) {
      await doc.fonts.ready;
    }
    if (showFooter) {
      const footerImg = doc.querySelector('.pdf-fixed-footer img') as HTMLImageElement;
      if (footerImg && !footerImg.complete) {
        await new Promise((resolve) => {
          footerImg.onload = resolve;
          footerImg.onerror = resolve;
        });
      }
    }
  } catch (err) {
    console.warn('Error waiting for print assets:', err);
  }

  // Small delay to ensure browser layout compositor paints the iframe content
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('Error invoking print dialog:', e);
    } finally {
      // Remove iframe after user interacts with print dialog
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }, 400);
}
