export type DocumentType = 'skripsi' | 'makalah' | 'ppt' | 'artikel';

export interface TocEntry {
  title: string;
  page: string;
  bold: boolean;
  indent: number;
}

export interface FormattedSection {
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'bullet' | 'numbered' | 'blockquote' | 'code' | 'hr' | 'toc';
  content: string;
  items?: string[];
  tocEntries?: TocEntry[];
}

// ====== TOC DETECTION ======

/**
 * Detect if a line is a Table of Contents entry
 * Pattern: text + at least 3 consecutive dots + page number (roman/arabic)
 * Examples:
 *   **HALAMAN JUDUL** ......................... i
 *   1.1 Latar Belakang ........................ 1
 *   Tabel 2.1 Nama Tabel ..................... 25
 *   Lampiran A: Judul ........................ 95
 */
function parseTocEntryLine(line: string): TocEntry | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Match: text + 3+ consecutive dots + optional spaces/dots + page number
  // Page number: roman numerals (i, ii, iii, iv, v, vi, vii, viii, ix, x, xi, xii, etc.) or arabic numbers
  const match = trimmed.match(
    /^(.+?)\s*\.{3,}[\s.]*([ivxlcdmIVXLCDM]+|\d+)\s*$/
  );
  if (!match) return null;

  let title = match[1].trim();
  const page = match[2].trim();

  // Page number should be reasonable (1-8 chars)
  if (page.length > 8) return null;

  // Detect bold: has ** markers
  let bold = false;
  if (/\*\*/.test(title)) {
    bold = true;
  }
  // Strip all ** markers
  title = title.replace(/\*\*/g, '').trim();

  // Determine indent level based on numbering pattern
  let indent = 0;
  if (/^\d+\.\d+\.\d+/.test(title)) {
    indent = 2; // e.g., 1.1.1
  } else if (/^\d+\.\d+/.test(title)) {
    indent = 1; // e.g., 1.1, 2.10
  }

  return { title, page, bold, indent };
}

function isTocEntryLine(line: string): boolean {
  return parseTocEntryLine(line) !== null;
}

// ====== MAIN PARSER ======

export function parseAIText(rawText: string): FormattedSection[] {
  const sections: FormattedSection[] = [];
  const lines = rawText.split('\n');

  let i = 0;
  let inCodeBlock = false;
  let codeContent = '';

  while (i < lines.length) {
    const line = lines[i].trimEnd();
    const trimmedLine = line.trim();

    // Skip empty lines
    if (trimmedLine === '') {
      i++;
      continue;
    }

    // ── Code blocks ──
    if (trimmedLine.startsWith('```')) {
      if (inCodeBlock) {
        sections.push({ type: 'code', content: codeContent.trim() });
        codeContent = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      i++;
      continue;
    }

    // ── Horizontal rules ──
    if (/^[-*_]{3,}\s*$/.test(trimmedLine)) {
      sections.push({ type: 'hr', content: '' });
      i++;
      continue;
    }

    // ── Headers (# ## ###) ──
    if (trimmedLine.startsWith('### ')) {
      sections.push({ type: 'h3', content: cleanInlineMarkdown(trimmedLine.slice(4)) });
      i++;
      continue;
    }
    if (trimmedLine.startsWith('## ')) {
      sections.push({ type: 'h2', content: cleanInlineMarkdown(trimmedLine.slice(3)) });
      i++;
      continue;
    }
    if (trimmedLine.startsWith('# ')) {
      sections.push({ type: 'h1', content: cleanInlineMarkdown(trimmedLine.slice(2)) });
      i++;
      continue;
    }

    // ── TOC Entries (Daftar Isi, Daftar Tabel, etc.) ──
    // Must check BEFORE bold-only lines and numbered lists!
    if (isTocEntryLine(trimmedLine)) {
      const tocEntries: TocEntry[] = [];
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        // Skip empty lines within TOC block
        if (currentLine === '') {
          i++;
          continue;
        }
        const entry = parseTocEntryLine(currentLine);
        if (entry) {
          tocEntries.push(entry);
          i++;
        } else {
          break; // Non-TOC line found, stop grouping
        }
      }
      if (tocEntries.length > 0) {
        sections.push({ type: 'toc', content: '', tocEntries });
      }
      continue;
    }

    // ── Bold-only lines as headers (**Title**) ──
    if (/^\*\*[^*]+\*\*\s*$/.test(trimmedLine) && trimmedLine.length < 100) {
      const content = trimmedLine.replace(/^\*\*/, '').replace(/\*\*\s*$/, '');
      sections.push({ type: 'h2', content: cleanInlineMarkdown(content) });
      i++;
      continue;
    }

    // ── Blockquotes ──
    if (trimmedLine.startsWith('> ')) {
      let quoteContent = '';
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteContent += lines[i].trim().slice(2) + ' ';
        i++;
      }
      sections.push({ type: 'blockquote', content: cleanInlineMarkdown(quoteContent.trim()) });
      continue;
    }

    // ── Numbered lists (1. 2. 3.) ──
    if (/^\d+[\.\)]\s/.test(trimmedLine)) {
      const items: string[] = [];
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (/^\d+[\.\)]\s/.test(currentLine)) {
          items.push(cleanInlineMarkdown(currentLine.replace(/^\d+[\.\)]\s*/, '')));
          i++;
        } else if (currentLine === '') {
          break;
        } else if (currentLine.startsWith('  ') || currentLine.startsWith('\t')) {
          if (items.length > 0) {
            items[items.length - 1] += ' ' + cleanInlineMarkdown(currentLine.trim());
          }
          i++;
        } else {
          break;
        }
      }
      sections.push({ type: 'numbered', content: '', items });
      continue;
    }

    // ── Bullet lists (- * • +) ──
    if (/^[-*•+]\s/.test(trimmedLine)) {
      const items: string[] = [];
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (/^[-*•+]\s/.test(currentLine)) {
          items.push(cleanInlineMarkdown(currentLine.replace(/^[-*•+]\s*/, '')));
          i++;
        } else if (currentLine === '') {
          break;
        } else if (currentLine.startsWith('  ') || currentLine.startsWith('\t')) {
          if (items.length > 0) {
            items[items.length - 1] += ' ' + cleanInlineMarkdown(currentLine.trim());
          }
          i++;
        } else {
          break;
        }
      }
      sections.push({ type: 'bullet', content: '', items });
      continue;
    }

    // ── Regular paragraphs — merge consecutive lines ──
    let paragraphContent = trimmedLine;
    i++;
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      if (
        nextLine === '' ||
        nextLine.startsWith('#') ||
        nextLine.startsWith('```') ||
        /^[-*•+]\s/.test(nextLine) ||
        /^\d+[\.\)]\s/.test(nextLine) ||
        nextLine.startsWith('> ') ||
        /^[-*_]{3,}\s*$/.test(nextLine) ||
        /^\*\*[^*]+\*\*\s*$/.test(nextLine) ||
        isTocEntryLine(nextLine) // ← prevent merging TOC entries into paragraphs
      ) {
        break;
      }
      paragraphContent += ' ' + nextLine;
      i++;
    }

    sections.push({ type: 'paragraph', content: cleanInlineMarkdown(paragraphContent) });
  }

  return sections;
}

// ====== INLINE MARKDOWN CLEANING ======

function cleanInlineMarkdown(text: string): string {
  // Bold **text** or __text__
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic *text* or _text_
  text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  text = text.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em>$1</em>');

  // Inline code `text`
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links [text](url)
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-indigo-600 underline">$1</a>'
  );

  // Clean up extra spaces
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

// ====== HTML GENERATION ======

export function sectionsToHtml(sections: FormattedSection[], docType: DocumentType): string {
  const styleClass =
    docType === 'ppt'
      ? 'ppt-style'
      : docType === 'makalah'
      ? 'makalah-style'
      : docType === 'artikel'
      ? 'artikel-style'
      : '';

  let html = `<div class="preview-content ${styleClass}">`;

  for (const section of sections) {
    switch (section.type) {
      case 'h1':
        html += `<h1>${section.content}</h1>`;
        break;
      case 'h2':
        html += `<h2>${section.content}</h2>`;
        break;
      case 'h3':
        html += `<h3>${section.content}</h3>`;
        break;
      case 'paragraph':
        html += `<p>${section.content}</p>`;
        break;
      case 'bullet':
        html += '<ul>';
        for (const item of section.items || []) {
          html += `<li>${item}</li>`;
        }
        html += '</ul>';
        break;
      case 'numbered':
        html += '<ol>';
        for (const item of section.items || []) {
          html += `<li>${item}</li>`;
        }
        html += '</ol>';
        break;
      case 'blockquote':
        html += `<blockquote><p class="no-indent">${section.content}</p></blockquote>`;
        break;
      case 'code':
        html += `<pre><code>${escapeHtml(section.content)}</code></pre>`;
        break;
      case 'hr':
        html += '<hr />';
        break;

      // ── TOC (Daftar Isi) ──
      case 'toc': {
        const dots = '. '.repeat(100);
        html += '<div class="toc-section">';
        for (const entry of section.tocEntries || []) {
          const boldClass = entry.bold ? ' toc-bold' : '';
          const indentClass = entry.indent > 0 ? ` toc-indent-${entry.indent}` : '';
          html += `<div class="toc-entry${boldClass}${indentClass}">`;
          html += `<span class="toc-title">${escapeHtml(entry.title)}</span>`;
          html += `<span class="toc-leader">${dots}</span>`;
          html += `<span class="toc-page">${escapeHtml(entry.page)}</span>`;
          html += '</div>';
        }
        html += '</div>';
        break;
      }
    }
  }

  html += '</div>';
  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ====== PLAIN TEXT GENERATION ======

export function sectionsToPlainText(sections: FormattedSection[], docType: DocumentType): string {
  let text = '';
  let numberedIndex = 1;

  for (const section of sections) {
    switch (section.type) {
      case 'h1':
        text += '\n' + stripHtml(section.content).toUpperCase() + '\n\n';
        break;
      case 'h2':
        text += '\n' + stripHtml(section.content) + '\n\n';
        break;
      case 'h3':
        text += '\n' + stripHtml(section.content) + '\n\n';
        break;
      case 'paragraph':
        if (docType === 'skripsi' || docType === 'makalah') {
          text += '\t' + stripHtml(section.content) + '\n\n';
        } else {
          text += stripHtml(section.content) + '\n\n';
        }
        break;
      case 'bullet':
        for (const item of section.items || []) {
          text += `  • ${stripHtml(item)}\n`;
        }
        text += '\n';
        break;
      case 'numbered':
        numberedIndex = 1;
        for (const item of section.items || []) {
          text += `  ${numberedIndex}. ${stripHtml(item)}\n`;
          numberedIndex++;
        }
        text += '\n';
        break;
      case 'blockquote':
        text += `  "${stripHtml(section.content)}"\n\n`;
        break;
      case 'code':
        text += '\n' + section.content + '\n\n';
        break;
      case 'hr':
        text += '\n' + '─'.repeat(60) + '\n\n';
        break;

      // ── TOC (Daftar Isi) ──
      case 'toc': {
        for (const entry of section.tocEntries || []) {
          const indent = '  '.repeat(entry.indent);
          const title = entry.title;
          const page = entry.page;
          const maxWidth = 70;
          const contentLen = indent.length + title.length;
          const dotsCount = Math.max(3, maxWidth - contentLen - page.length - 2);
          const dots = '.'.repeat(dotsCount);
          text += `${indent}${title} ${dots} ${page}\n`;
        }
        text += '\n';
        break;
      }
    }
  }

  return text.trim();
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '');
}
