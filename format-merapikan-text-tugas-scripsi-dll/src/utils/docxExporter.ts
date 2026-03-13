import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  convertInchesToTwip,
  TabStopType,
  LeaderType,
} from 'docx';
// @ts-ignore
import { saveAs } from 'file-saver';
import { FormattedSection, DocumentType } from './textFormatter';

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '');
}

interface TextSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
}

function parseInlineFormatting(content: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const regex = /<(strong|em|code)>(.*?)<\/\1>/g;
  let lastIndex = 0;
  let match;

  const cleanContent = content;

  while ((match = regex.exec(cleanContent)) !== null) {
    if (match.index > lastIndex) {
      const beforeText = cleanContent.slice(lastIndex, match.index).replace(/<[^>]+>/g, '');
      if (beforeText) {
        segments.push({ text: beforeText });
      }
    }

    const tag = match[1];
    const innerText = match[2].replace(/<[^>]+>/g, '');

    segments.push({
      text: innerText,
      bold: tag === 'strong',
      italic: tag === 'em',
      code: tag === 'code',
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < cleanContent.length) {
    const remaining = cleanContent.slice(lastIndex).replace(/<[^>]+>/g, '');
    if (remaining) {
      segments.push({ text: remaining });
    }
  }

  if (segments.length === 0) {
    segments.push({ text: stripHtml(content) });
  }

  return segments;
}

function createTextRuns(content: string, baseOptions: Record<string, unknown> = {}): TextRun[] {
  const segments = parseInlineFormatting(content);
  return segments.map(
    (seg) =>
      new TextRun({
        text: seg.text,
        bold: seg.bold || (baseOptions.bold as boolean),
        italics: seg.italic || (baseOptions.italics as boolean),
        font: seg.code ? 'Courier New' : (baseOptions.font as string) || 'Times New Roman',
        size: seg.code ? 20 : (baseOptions.size as number) || 24,
      })
  );
}

// Calculate usable page width in inches for each doc type
function getUsableWidth(docType: DocumentType): number {
  // A4 = 8.27 inches wide
  const margins: Record<DocumentType, { left: number; right: number }> = {
    skripsi: { left: 1.57, right: 1.18 }, // 4cm, 3cm
    makalah: { left: 1.18, right: 1.18 }, // 3cm, 3cm
    ppt: { left: 1, right: 1 },
    artikel: { left: 1, right: 1 },
  };
  const m = margins[docType];
  return 8.27 - m.left - m.right;
}

export async function exportToDocx(
  sections: FormattedSection[],
  docType: DocumentType,
  fileName: string = 'document'
) {
  const paragraphs: Paragraph[] = [];

  const fontName = 'Times New Roman';
  const fontSize = docType === 'ppt' ? 28 : 24; // 12pt = 24 half-points
  const lineSpacing = docType === 'skripsi' ? 480 : docType === 'makalah' ? 360 : 276;

  // For TOC tab stops
  const usableWidth = getUsableWidth(docType);
  const rightTabPosition = convertInchesToTwip(usableWidth);

  for (const section of sections) {
    switch (section.type) {
      case 'h1':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: stripHtml(section.content).toUpperCase(),
                bold: true,
                font: fontName,
                size: docType === 'ppt' ? 36 : 28,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            alignment: docType === 'artikel' ? AlignmentType.LEFT : AlignmentType.CENTER,
            spacing: { before: 360, after: 240, line: lineSpacing },
          })
        );
        break;

      case 'h2':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: stripHtml(section.content),
                bold: true,
                font: fontName,
                size: fontSize + 2,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
            spacing: { before: 280, after: 160, line: lineSpacing },
          })
        );
        break;

      case 'h3':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: stripHtml(section.content),
                bold: true,
                font: fontName,
                size: fontSize,
              }),
            ],
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.LEFT,
            spacing: { before: 240, after: 120, line: lineSpacing },
          })
        );
        break;

      case 'paragraph': {
        const useIndent = docType === 'skripsi' || docType === 'makalah';
        const textRuns = createTextRuns(section.content, {
          font: fontName,
          size: fontSize,
        });

        paragraphs.push(
          new Paragraph({
            children: textRuns,
            alignment: AlignmentType.JUSTIFIED,
            indent: useIndent ? { firstLine: convertInchesToTwip(0.5) } : undefined,
            spacing: { after: 200, line: lineSpacing },
          })
        );
        break;
      }

      case 'bullet':
        for (const item of section.items || []) {
          paragraphs.push(
            new Paragraph({
              children: createTextRuns(item, {
                font: fontName,
                size: fontSize,
              }),
              bullet: { level: 0 },
              spacing: { after: 80, line: lineSpacing },
              indent: { left: convertInchesToTwip(0.5) },
            })
          );
        }
        break;

      case 'numbered':
        for (let idx = 0; idx < (section.items || []).length; idx++) {
          const item = section.items![idx];
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${idx + 1}. ${stripHtml(item)}`,
                  font: fontName,
                  size: fontSize,
                }),
              ],
              spacing: { after: 80, line: lineSpacing },
              indent: { left: convertInchesToTwip(0.5) },
            })
          );
        }
        break;

      case 'blockquote':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: stripHtml(section.content),
                italics: true,
                font: fontName,
                size: fontSize,
              }),
            ],
            indent: { left: convertInchesToTwip(0.5), right: convertInchesToTwip(0.5) },
            spacing: { before: 200, after: 200, line: lineSpacing },
          })
        );
        break;

      case 'code':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content,
                font: 'Courier New',
                size: 20,
              }),
            ],
            spacing: { before: 200, after: 200, line: 276 },
          })
        );
        break;

      case 'hr':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '─'.repeat(60),
                font: fontName,
                size: fontSize,
                color: 'CCCCCC',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          })
        );
        break;

      // ── TOC (Daftar Isi) with dot leaders ──
      case 'toc': {
        for (const entry of section.tocEntries || []) {
          const indentInches = entry.indent * 0.5;
          // Adjust tab position for indented entries
          const adjustedTabPos = rightTabPosition - convertInchesToTwip(indentInches);

          paragraphs.push(
            new Paragraph({
              tabStops: [
                {
                  type: TabStopType.RIGHT,
                  position: adjustedTabPos,
                  leader: LeaderType.DOT,
                },
              ],
              children: [
                new TextRun({
                  text: entry.title,
                  bold: entry.bold,
                  font: fontName,
                  size: fontSize,
                }),
                new TextRun({
                  text: '\t',
                  font: fontName,
                  size: fontSize,
                }),
                new TextRun({
                  text: entry.page,
                  font: fontName,
                  size: fontSize,
                }),
              ],
              indent: entry.indent > 0
                ? { left: convertInchesToTwip(indentInches) }
                : undefined,
              spacing: { after: 40, line: lineSpacing },
            })
          );
        }
        break;
      }
    }
  }

  const marginConfig = {
    skripsi: {
      top: convertInchesToTwip(1.57),
      bottom: convertInchesToTwip(1.18),
      left: convertInchesToTwip(1.57),
      right: convertInchesToTwip(1.18),
    },
    makalah: {
      top: convertInchesToTwip(1.18),
      bottom: convertInchesToTwip(1.18),
      left: convertInchesToTwip(1.18),
      right: convertInchesToTwip(1.18),
    },
    ppt: {
      top: convertInchesToTwip(1),
      bottom: convertInchesToTwip(1),
      left: convertInchesToTwip(1),
      right: convertInchesToTwip(1),
    },
    artikel: {
      top: convertInchesToTwip(1),
      bottom: convertInchesToTwip(1),
      left: convertInchesToTwip(1),
      right: convertInchesToTwip(1),
    },
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: marginConfig[docType],
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${fileName}.docx`);
}
