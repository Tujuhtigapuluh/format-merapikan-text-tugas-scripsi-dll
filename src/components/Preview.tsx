import { Eye, EyeOff } from 'lucide-react';
import { DocumentType } from '../utils/textFormatter';

interface Props {
  html: string;
  docType: DocumentType;
  visible: boolean;
  onToggle: () => void;
}

const docTypeLabels: Record<DocumentType, string> = {
  skripsi: 'Skripsi / Tesis',
  makalah: 'Makalah',
  ppt: 'PowerPoint',
  artikel: 'Artikel / Blog',
};

export default function Preview({ html, docType, visible, onToggle }: Props) {
  if (!html) return null;

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-500" />
          Preview Hasil Format
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded-full font-medium">
            {docTypeLabels[docType]}
          </span>
        </h2>
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {visible ? 'Sembunyikan' : 'Tampilkan'}
        </button>
      </div>

      {visible && (
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-inner overflow-hidden">
          {/* Paper simulation */}
          <div className="bg-gray-100 p-4 sm:p-6 md:p-8">
            <div
              className="bg-white max-w-[210mm] mx-auto shadow-xl rounded-sm border border-gray-200"
              style={{
                padding: docType === 'skripsi' ? '60px 45px 45px 60px' : '40px',
                minHeight: '400px',
                fontFamily: docType === 'ppt' ? 'Arial, sans-serif' : "'Times New Roman', serif",
                fontSize: docType === 'ppt' ? '14px' : '12pt',
                lineHeight: docType === 'skripsi' ? '2' : docType === 'makalah' ? '1.5' : '1.6',
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
