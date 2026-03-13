// textFormatter.ts - VERSION 2.0 (Fixed & Enhanced)
export type DocumentType = 'skripsi' | 'makalah' | 'ppt' | 'artikel';

export interface TocEntry {
  title: string;
  page: string;
  bold: boolean;
  indent: number;
  rawLine?: string; // Keep original for reference
}

export interface FormattedSection {
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'bullet' | 'numbered' | 'blockquote' | 'code' | 'hr' | 'toc';
  content: string;
  items?: string[];
  tocEntries?: TocEntry[];
  startNumber?: number; // For continued numbering
}

// ====== ENHANCED TOC DETECTION ======

/**
 * Enhanced TOC detection with multiple pattern support
 * Supports:
 * - **BOLD TITLE** ......................... i
 * - 1.1 Sub Title .......................... 1
 * - Tabel 1.1 Name ......................... 25
 * - Lampiran A: Title ...................... 95
 */
function parseTocEntryLine(line: string): TocEntry | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Pattern 1: Standard with dots (3 or more)
  const dotPattern = /^(.+?)\s*\.{3,}[\s.]*([ivxlcdmIVXLCDM]+|\d+)\s*$/i;
  
  // Pattern 2: Tab-separated or spaced (for copy-paste from Word)
  const spacePattern = /^(.+?)\s{5,}([ivxlcdmIVXLCDM]+|\d+)\s*$/i;
  
  // Pattern 3: Mixed dots and spaces
  const mixedPattern = /^(.+?)[\s.]{4,}([ivxlcdmIVXLCDM]+|\d+)\s*$/i;

  let match = trimmed.match(dotPattern) || 
              trimmed.match(spacePattern) || 
              trimmed.match(mixedPattern);

  if (!match) return null;

  let title = match[1].trim();
  const page = match[2].trim();

  // Validate page number (1-10 chars, alphanumeric roman or numeric)
  if (!/^[ivxlcdmIVXLCDM\d]+$/.test(page) || page.length > 10) return null;

  // Detect bold markers
  let bold = false;
  const boldMarkers = ['**', '__'];
  for (const marker of boldMarkers) {
    if (title.startsWith(marker) && title.endsWith(marker)) {
      bold = true;
      title = title.slice(marker.length, -marker.length).trim();
      break;
    }
  }

  // Determine indent level based on content pattern
  let indent = 0;
  
  // Pattern: 1.1.1 (level 3)
  if (/^\d+\.\d+\.\d+/.test(title)) {
    indent = 2;
  } 
  // Pattern: 1.1 or A.1 or I.1 (level 2)
  else if (/^(\d+\.\d+|^[A-Z]\.\d+|^[IVX]+\.\d+)/.test(title)) {
    indent = 1;
  }
  // Pattern: Starts with space/tabs (preserve original indent)
  else if (/^\s+/.test(match[1])) {
    const leadingSpaces = match[1].match(/^\s+/)?.[0].length || 0;
    indent = Math.min(Math.floor(leadingSpaces / 2), 2);
  }

  return { 
    title, 
    page, 
    bold, 
    indent,
    rawLine: trimmed 
  };
}

function isTocEntryLine(line: string): boolean {
  return parseTocEntryLine(line) !== null;
}

// ====== ENHANCED MAIN PARSER ======

export function parseAIText(rawText: string): FormattedSection[] {
  const sections: FormattedSection[] = [];
  const lines = rawText.split('\n');

  let i = 0;
  let inCodeBlock = false;
  let codeContent = '';
  let lastNumberedIndex = 0; // Track numbering continuity

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines but track them for paragraph merging
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

    // ── TOC Entries Detection (PRIORITY) ──
    if (isTocEntryLine(trimmedLine)) {
      const tocEntries: TocEntry[] = [];
      let currentIndent = 0;
      
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        
        if (currentLine === '') {
          i++;
          continue;
        }
        
        const entry = parseTocEntryLine(currentLine);
        if (entry) {
          // Auto-correct indent based on previous entry for consistency
          if (tocEntries.length > 0) {
            const prev = tocEntries[tocEntries.length - 1];
            if (entry.indent < prev.indent && !currentLine.match(/^\d+\./)) {
              entry.indent = prev.indent; // Maintain indent for continuation
            }
          }
          tocEntries.push(entry);
          i++;
        } else {
          break;
        }
      }
      
      if (tocEntries.length > 0) {
        sections.push({ type: 'toc', content: '', tocEntries });
      }
      continue;
    }

    // ── Bold-only lines as headers ──
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

    // ── Enhanced Numbered lists ──
    const numberedMatch = trimmedLine.match(/^(\d+)[\.\)]\s+/);
    if (numberedMatch) {
      const items: string[] = [];
      const startNum = parseInt(numberedMatch[1], 10);
      
      while (i < lines.length) {
        const currentLine = lines[i];
        const currentTrimmed = currentLine.trim();
        
        // Check for continued numbered item
        const itemMatch = currentTrimmed.match(/^(\d+)[\.\)]\s+/);
        
        if (itemMatch) {
          const itemNum = parseInt(itemMatch[1], 10);
          const itemContent = currentTrimmed.replace(/^\d+[\.\)]\s*/, '');
          items.push(cleanInlineMarkdown(itemContent));
          lastNumberedIndex = itemNum;
          i++;
        } else if (currentTrimmed === '') {
          // Check if next line continues current item or starts new
          const nextLine = lines[i + 1]?.trim() || '';
          if (!nextLine.match(/^\d+[\.\)]\s+/) && nextLine !== '') {
            // Continue current item with blank line
            i++;
            continue;
          } else {
            break;
          }
        } else if (currentLine.startsWith('  ') || currentLine.startsWith('\t')) {
          // Continuation of previous item
          if (items.length > 0) {
            items[items.length - 1] += ' ' + cleanInlineMarkdown(currentTrimmed);
          }
          i++;
        } else {
          break;
        }
      }
      
      sections.push({ 
        type: 'numbered', 
        content: '', 
        items,
        startNumber: startNum 
      });
      continue;
    }

    // ── Bullet lists ──
    if (/^[-*•+]\s/.test(trimmedLine)) {
      const items: string[] = [];
      while (i < lines.length) {
        const currentLine = lines[i];
        const currentTrimmed = currentLine.trim();
        
        if (/^[-*•+]\s/.test(currentTrimmed)) {
          items.push(cleanInlineMarkdown(currentTrimmed.replace(/^[-*•+]\s*/, '')));
          i++;
        } else if (currentTrimmed === '') {
          const nextLine = lines[i + 1]?.trim() || '';
          if (!/^[-*•+]\s/.test(nextLine) && nextLine !== '') {
            i++;
            continue;
          } else {
            break;
          }
        } else if (currentLine.startsWith('  ') || currentLine.startsWith('\t')) {
          if (items.length > 0) {
            items[items.length - 1] += ' ' + cleanInlineMarkdown(currentTrimmed);
          }
          i++;
        } else {
          break;
        }
      }
      sections.push({ type: 'bullet', content: '', items });
      continue;
    }

    // ── Regular paragraphs with smart merging ──
    let paragraphContent = trimmedLine;
    i++;
    
    while (i < lines.length) {
      const nextLine = lines[i];
      const nextTrimmed = nextLine.trim();
      
      // Stop conditions
      if (
        nextTrimmed === '' ||
        nextTrimmed.startsWith('#') ||
        nextTrimmed.startsWith('```') ||
        /^[-*•+]\s/.test(nextTrimmed) ||
        /^\d+[\.\)]\s/.test(nextTrimmed) ||
        nextTrimmed.startsWith('> ') ||
        /^[-*_]{3,}\s*$/.test(nextTrimmed) ||
        /^\*\*[^*]+\*\*\s*$/.test(nextTrimmed) ||
        isTocEntryLine(nextTrimmed)
      ) {
        break;
      }
      
      paragraphContent += ' ' + nextTrimmed;
      i++;
    }

    sections.push({ type: 'paragraph', content: cleanInlineMarkdown(paragraphContent) });
  }

  return sections;
}

// ====== ENHANCED INLINE MARKDOWN ======

function cleanInlineMarkdown(text: string): string {
  // Protect code blocks first
  const codeBlocks: string[] = [];
  text = text.replace(/`([^`]+)`/g, (match, code) => {
    codeBlocks.push(code);
    return `\x00CODE${codeBlocks.length - 1}\x00`;
  });

  // Bold: **text** or __text__ (process first)
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ (avoid conflicts with bold)
  // Use negative lookbehind/ahead to ensure we're not inside bold tags
  text = text.replace(/(?<!<strong[^>]*>)\*(?!\*)(.+?)(?<!\*)\*(?!<\/strong>)/g, '<em>$1</em>');
  text = text.replace(/(?<!<strong[^>]*>)_(?!_)(.+?)(?<!_)_(?!<\/strong>)/g, '<em>$1</em>');

  // Links [text](url)
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-indigo-600 underline hover:text-indigo-800">$1</a>'
  );

  // Restore code blocks
  text = text.replace(/\x00CODE(\d+)\x00/g, (match, idx) => {
    return `<code>${escapeHtml(codeBlocks[parseInt(idx)])}</code>`;
  });

  // Clean up extra spaces but preserve intentional line breaks
  text = text.replace(/[ \t]+/g, ' ').trim();

  return text;
}

// ====== ENHANCED HTML GENERATION ======

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

      // ── ENHANCED TOC GENERATION ──
      case 'toc': {
        html += '<div class="toc-section">';
        
        // Calculate max width for alignment
        const entries = section.tocEntries || [];
        const maxTitleWidth = Math.max(...entries.map(e => {
          // Estimate visual width (approximate)
          return e.title.length + (e.indent * 4);
        }));
        
        // Fixed width for consistent alignment (in monospace units)
        const TOTAL_WIDTH = 75; // Characters for consistent copy-paste
        
        for (const entry of entries) {
          const boldClass = entry.bold ? ' toc-bold' : '';
          const indentClass = entry.indent > 0 ? ` toc-indent-${entry.indent}` : '';
          
          // Calculate dots dynamically
          const indentSpaces = entry.indent * 4;
          const titleVisualLen = entry.title.length + indentSpaces;
          const pageLen = entry.page.length;
          const availableSpace = TOTAL_WIDTH - titleVisualLen - pageLen - 2; // -2 for margins
          const dotCount = Math.max(3, availableSpace);
          
          // Use non-breaking spaces and special dot characters for better alignment
          const dots = '.\u200A'.repeat(dotCount); // hair space between dots
          
          html += `<div class="toc-entry${boldClass}${indentClass}">`;
          html += `<span class="toc-title">${escapeHtml(entry.title)}</span>`;
          html += `<span class="toc-leader" data-dots="${dotCount}">${dots}</span>`;
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
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ====== ENHANCED PLAIN TEXT GENERATION ======

export function sectionsToPlainText(sections: FormattedSection[], docType: DocumentType): string {
  let text = '';
  const TOTAL_WIDTH = 72; // Standard width for academic documents

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
          text += '        ' + stripHtml(section.content) + '\n\n'; // 8 spaces indent
        } else {
          text += stripHtml(section.content) + '\n\n';
        }
        break;
      case 'bullet':
        for (const item of section.items || []) {
          text += `    • ${stripHtml(item)}\n`;
        }
        text += '\n';
        break;
      case 'numbered': {
        let num = section.startNumber || 1;
        for (const item of section.items || []) {
          text += `    ${num}. ${stripHtml(item)}\n`;
          num++;
        }
        text += '\n';
        break;
      }
      case 'blockquote':
        text += `    "${stripHtml(section.content)}"\n\n`;
        break;
      case 'code':
        text += '\n' + section.content.split('\n').map(l => '    ' + l).join('\n') + '\n\n';
        break;
      case 'hr':
        text += '\n' + '─'.repeat(TOTAL_WIDTH) + '\n\n';
        break;

      // ── ENHANCED TOC PLAIN TEXT ──
      case 'toc': {
        for (const entry of section.tocEntries || []) {
          const indent = '    '.repeat(entry.indent + 1);
          const title = entry.title;
          const page = entry.page;
          
          // Calculate precise spacing
          const contentLen = indent.length + title.length;
          const remainingSpace = TOTAL_WIDTH - contentLen - page.length;
          const dots = '.'.repeat(Math.max(3, remainingSpace - 1));
          
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