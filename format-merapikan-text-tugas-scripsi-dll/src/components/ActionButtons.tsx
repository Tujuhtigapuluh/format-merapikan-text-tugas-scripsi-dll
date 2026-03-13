import { useState } from 'react';
import { Copy, Download, Check, FileText, ClipboardCheck } from 'lucide-react';
import { FormattedSection, DocumentType, sectionsToPlainText } from '../utils/textFormatter';
import { exportToDocx } from '../utils/docxExporter';

interface Props {
  sections: FormattedSection[];
  docType: DocumentType;
  html: string;
}

export default function ActionButtons({ sections, docType, html }: Props) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (sections.length === 0) return null;

  const handleCopyText = async () => {
    const plainText = sectionsToPlainText(sections, docType);
    await navigator.clipboard.writeText(plainText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyHtml = async () => {
    try {
      const blob = new Blob([html], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([clipboardItem]);
    } catch {
      const plainText = sectionsToPlainText(sections, docType);
      await navigator.clipboard.writeText(plainText);
    }
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleExportDocx = async () => {
    setExporting(true);
    try {
      const docTypeNames: Record<DocumentType, string> = {
        skripsi: 'Skripsi',
        makalah: 'Makalah',
        ppt: 'Presentasi',
        artikel: 'Artikel',
      };
      await exportToDocx(sections, docType, `${docTypeNames[docType]}_Formatted`);
    } catch (err) {
      console.error('Export error:', err);
    }
    setExporting(false);
  };

  const printStyles = `
    body {
      font-family: 'Times New Roman', serif;
      margin: 2cm;
      font-size: 12pt;
      line-height: 2;
    }
    h1 {
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      margin: 1.5em 0 0.75em;
    }
    h2 {
      font-size: 13pt;
      font-weight: bold;
      margin: 1.25em 0 0.5em;
    }
    h3 {
      font-size: 12pt;
      font-weight: bold;
      margin: 1em 0 0.5em;
    }
    p {
      text-align: justify;
      text-indent: 1.27cm;
      margin-bottom: 0.5em;
    }
    p.no-indent {
      text-indent: 0;
    }
    ul, ol {
      padding-left: 2em;
      margin-bottom: 0.5em;
    }
    li {
      margin-bottom: 0.25em;
    }
    blockquote {
      margin: 1em 2em;
      font-style: italic;
    }
    pre {
      font-family: 'Courier New', monospace;
      font-size: 10pt;
      background: #f5f5f5;
      padding: 1em;
    }

    /* TOC Styles for Print */
    .toc-section {
      margin: 0.5em 0;
    }
    .toc-entry {
      display: flex;
      align-items: baseline;
      line-height: 2;
      padding: 1px 0;
    }
    .toc-bold .toc-title {
      font-weight: bold;
    }
    .toc-indent-1 {
      padding-left: 1.27cm;
    }
    .toc-indent-2 {
      padding-left: 2.54cm;
    }
    .toc-title {
      flex-shrink: 0;
      white-space: nowrap;
    }
    .toc-leader {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      margin: 0 4px;
      letter-spacing: 1px;
      color: #333;
      min-width: 20px;
    }
    .toc-page {
      flex-shrink: 0;
      text-align: right;
      white-space: nowrap;
      min-width: 20px;
    }

    @media print {
      body { margin: 0; }
    }
  `;

  return (
    <div className="flex flex-wrap gap-3 animate-fade-in">
      <button
        onClick={handleCopyText}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
          copiedText
            ? 'bg-green-500 text-white shadow-lg shadow-green-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
        }`}
      >
        {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copiedText ? 'Tersalin!' : 'Copy Teks Rapi'}
      </button>

      <button
        onClick={handleCopyHtml}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
          copiedHtml
            ? 'bg-green-500 text-white shadow-lg shadow-green-200'
            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:shadow-md'
        }`}
      >
        {copiedHtml ? (
          <Check className="w-4 h-4" />
        ) : (
          <ClipboardCheck className="w-4 h-4" />
        )}
        {copiedHtml ? 'Tersalin!' : 'Copy untuk MS Word'}
      </button>

      <button
        onClick={handleExportDocx}
        disabled={exporting}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
          exporting
            ? 'bg-blue-400 text-white cursor-wait'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200'
        }`}
      >
        {exporting ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {exporting ? 'Mengekspor...' : 'Download .docx'}
      </button>

      <button
        onClick={() => {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <html>
                <head>
                  <title>Print Document</title>
                  <style>${printStyles}</style>
                </head>
                <body>${html}</body>
              </html>
            `);
            printWindow.document.close();
            printWindow.print();
          }
        }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gray-800 text-white hover:bg-gray-900 hover:shadow-lg transition-all duration-200"
      >
        <FileText className="w-4 h-4" />
        Print / PDF
      </button>
    </div>
  );
}
