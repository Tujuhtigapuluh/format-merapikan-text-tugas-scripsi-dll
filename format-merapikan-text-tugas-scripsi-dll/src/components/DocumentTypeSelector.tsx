import { GraduationCap, BookOpen, Monitor, PenTool } from 'lucide-react';
import { DocumentType } from '../utils/textFormatter';

interface Props {
  selected: DocumentType;
  onChange: (type: DocumentType) => void;
}

const types: { value: DocumentType; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    value: 'skripsi',
    label: 'Skripsi / Tesis',
    icon: <GraduationCap className="w-5 h-5" />,
    desc: 'Times New Roman 12pt, spasi 2, indent paragraf, margin 4-3-4-3 cm',
  },
  {
    value: 'makalah',
    label: 'Makalah',
    icon: <BookOpen className="w-5 h-5" />,
    desc: 'Times New Roman 12pt, spasi 1.5, indent paragraf, rata kiri-kanan',
  },
  {
    value: 'ppt',
    label: 'PowerPoint',
    icon: <Monitor className="w-5 h-5" />,
    desc: 'Poin-poin ringkas, tanpa indent, judul berwarna',
  },
  {
    value: 'artikel',
    label: 'Artikel / Blog',
    icon: <PenTool className="w-5 h-5" />,
    desc: 'Tanpa indent, rata kiri, gaya modern',
  },
];

export default function DocumentTypeSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {types.map((type) => (
        <button
          key={type.value}
          onClick={() => onChange(type.value)}
          className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group hover:shadow-md ${
            selected === type.value
              ? 'border-indigo-500 bg-indigo-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-indigo-300'
          }`}
        >
          <div
            className={`inline-flex p-2 rounded-lg mb-2 ${
              selected === type.value
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
            } transition-colors`}
          >
            {type.icon}
          </div>
          <h3
            className={`font-semibold text-sm ${
              selected === type.value ? 'text-indigo-700' : 'text-gray-800'
            }`}
          >
            {type.label}
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{type.desc}</p>
          {selected === type.value && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
}
