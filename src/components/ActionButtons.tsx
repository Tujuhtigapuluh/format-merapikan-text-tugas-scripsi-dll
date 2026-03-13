// ActionButtons.tsx - VERSION 2.0 (Enhanced Copy Functionality)
import { useState } from 'react';
import { Copy, Download, Check, FileText, ClipboardCheck, Printer } from 'lucide-react';
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
  const [copiedToc, setCopiedToc] = useState(false);
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
      // Create a rich HTML format optimized for Word
      const richHtml = createRichHtmlForWord(html, docType);
      const blob = new Blob([richHtml], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([clipboardItem]);
    } catch {
      // Fallback to plain text
      const plainText = sectionsToPlainText(sections, docType);
      await navigator.clipboard.writeText(plainText);
    }
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyTocOnly = async () => {
    // Extract only TOC sections
    const tocSections = sections.filter(s => s.type === 'toc');
    if (tocSections.length === 0) {
      alert('Tidak ada Daftar Isi yang terdeteksi!');
      return;
    }
    
    const tocText = sectionsToPlainText(tocSections, docType);
    await navigator.clipboard.writeText(tocText);
    setCopiedToc(true);
    setTimeout(() => setCopiedToc(false), 2000);
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
      alert('Gagal mengekspor. Silakan coba lagi.');
    }
    setExporting(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Print Document</title>
            <style>${getPrintStyles(docType)}</style>
          </head>
          <body>${html}</body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const hasToc = sections.some(s => s.type === 'toc');

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
        {copiedText ? 'Tersalin!' : 'Copy Teks'}
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
        {copiedHtml ? 'Tersalin!' : 'Copy untuk Word'}
      </button>

      {hasToc && (
        <button
          onClick={handleCopyTocOnly}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            copiedToc
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-md'
          }`}
        >
          {copiedToc ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          {copiedToc ? 'Tersalin!' : 'Copy Daftar Isi Saja'}
        </button>
      )}

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
        onClick={handlePrint}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gray-800 text-white hover:bg-gray-900 hover:shadow-lg transition-all duration-200"
      >
        <Printer className="w-4 h-4" />
        Print / PDF
      </button>
    </div>
  );
}

// Helper to create Word-optimized HTML
function createRichHtmlForWord(html: string, docType: DocumentType): string {
  const fontFamily = docType === 'ppt' ? 'Arial, sans-serif' : 'Times New Roman, serif';
  const fontSize = docType === 'ppt' ? '14pt' : '12pt';
  
  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Document</title>
      <style>
        body { 
          font-family: ${fontFamily}; 
          font-size: ${fontSize};
          line-height: ${docType === 'skripsi' ? '2' : docType === 'makalah' ? '1.5' : '1.6'};
        }
        h1 { 
          font-size: ${docType === 'ppt' ? '18pt' : '14pt'}; 
          font-weight: bold; 
          text-align: ${docType === 'artikel' ? 'left' : 'center'};
          text-transform: uppercase;
        }
        h2 { 
          font-size: ${docType === 'ppt' ? '16pt' : '13pt'}; 
          font-weight: bold; 
        }
        p { 
          text-align: justify; 
          text-indent: ${docType === 'skripsi' || docType === 'makalah' ? '1.27cm' : '0'};
        }
        .toc-entry {
          display: flex;
          justify-content: space-between;
        }
        .toc-leader {
          flex: 1;
          border-bottom: 1px dotted #000;
          margin: 0 0.5em;
          min-width: 2em;
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;
}

function getPrintStyles(docType: DocumentType): string {
  const fontFamily = docType === 'ppt' ? 'Arial, sans-serif' : 'Times New Roman, serif';
  
  return `
    @page {
      size: A4;
      margin: ${docType === 'skripsi' ? '4cm 3cm 4cm 3cm' : '3cm'};
    }
    
    body {
      font-family: ${fontFamily};
      font-size: 12pt;
      line-height: ${docType === 'skripsi' ? '2' : docType === 'makalah' ? '1.5' : '1.6'};
      color: #000;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
    }
    
    h1 {
      font-size: 14pt;
      font-weight: bold;
      text-align: ${docType === 'artikel' ? 'left' : 'center'};
      text-transform: uppercase;
      margin: 1.5em 0 0.75em;
      page-break-after: avoid;
    }
    
    h2 {
      font-size: 13pt;
      font-weight: bold;
      margin: 1.25em 0 0.5em;
      page-break-after: avoid;
    }
    
    h3 {
      font-size: 12pt;
      font-weight: bold;
      margin: 1em 0 0.5em;
      page-break-after: avoid;
    }
    
    p {
      text-align: justify;
      text-indent: ${docType === 'skripsi' || docType === 'makalah' ? '1.27cm' : '0'};
      margin-bottom: 0.5em;
      orphans: 3;
      widows: 3;
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
      border-left: 3px solid #6366f1;
      padding-left: 1em;
    }
    
    pre {
      font-family: 'Courier New', monospace;
      font-size: 10pt;
      background: #f5f5f5;
      padding: 1em;
      white-space: pre-wrap;
      page-break-inside: avoid;
    }
    
    /* TOC Styles */
    .toc-section {
      margin: 0.5em 0;
    }
    
    .toc-entry {
      display: flex;
      align-items: baseline;
      line-height: 2;
      page-break-inside: avoid;
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
      border-bottom: 1px dotted #333;
      margin: 0 0.3em;
      min-height: 1em;
      position: relative;
      top: -0.2em;
    }
    
    .toc-page {
      flex-shrink: 0;
      text-align: right;
      white-space: nowrap;
      min-width: 2ch;
    }
    
    @media print {
      body {
        padding: 0;
      }
    }
  `;
}