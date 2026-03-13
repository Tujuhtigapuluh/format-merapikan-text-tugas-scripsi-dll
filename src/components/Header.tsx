import { FileText, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              AI Text Formatter
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </h1>
            <p className="text-white/80 text-sm">
              Rapikan teks dari AI untuk Skripsi, Makalah, PPT & Artikel
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
