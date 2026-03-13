import { useState, useMemo } from 'react';
import Header from './components/Header';
import DocumentTypeSelector from './components/DocumentTypeSelector';
import TextInput from './components/TextInput';
import Preview from './components/Preview';
import ActionButtons from './components/ActionButtons';
import { DocumentType, parseAIText, sectionsToHtml } from './utils/textFormatter';
import {
  Wand2,
  ArrowDown,
  CheckCircle2,
  Lightbulb,
  Zap,
  Layout,
  Type,
  List,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [rawText, setRawText] = useState('');
  const [docType, setDocType] = useState<DocumentType>('skripsi');
  const [showPreview, setShowPreview] = useState(true);

  const sections = useMemo(() => {
    if (!rawText.trim()) return [];
    return parseAIText(rawText);
  }, [rawText]);

  const html = useMemo(() => {
    if (sections.length === 0) return '';
    return sectionsToHtml(sections, docType);
  }, [sections, docType]);

  const stats = useMemo(() => {
    let headings = 0;
    let paragraphs = 0;
    let lists = 0;
    let quotes = 0;
    let tocEntries = 0;

    for (const s of sections) {
      if (s.type === 'h1' || s.type === 'h2' || s.type === 'h3') headings++;
      if (s.type === 'paragraph') paragraphs++;
      if (s.type === 'bullet' || s.type === 'numbered') lists++;
      if (s.type === 'blockquote') quotes++;
      if (s.type === 'toc') tocEntries += s.tocEntries?.length || 0;
    }

    return { headings, paragraphs, lists, quotes, tocEntries, total: sections.length };
  }, [sections]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Step 1: Choose Document Type */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-7 h-7 bg-indigo-500 text-white rounded-full text-sm font-bold">
              1
            </div>
            <h2 className="text-lg font-bold text-gray-800">Pilih Jenis Dokumen</h2>
          </div>
          <DocumentTypeSelector selected={docType} onChange={setDocType} />
        </section>

        {/* Step 2: Input Text */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-7 h-7 bg-indigo-500 text-white rounded-full text-sm font-bold">
              2
            </div>
            <h2 className="text-lg font-bold text-gray-800">Paste Teks dari AI</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <TextInput value={rawText} onChange={setRawText} />
          </div>
        </section>

        {/* Format indicator */}
        {rawText.trim() && (
          <div className="flex justify-center animate-fade-in">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
              <Wand2 className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span className="text-sm font-medium text-indigo-600">
                Otomatis diformat!
              </span>
              <ArrowDown className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        )}

        {/* Stats */}
        {sections.length > 0 && (
          <section className="animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h3 className="text-sm font-semibold text-gray-700">
                  Terdeteksi {stats.total} elemen
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <StatCard
                  icon={<Type className="w-4 h-4" />}
                  label="Heading"
                  value={stats.headings}
                  color="blue"
                />
                <StatCard
                  icon={<Layout className="w-4 h-4" />}
                  label="Paragraf"
                  value={stats.paragraphs}
                  color="purple"
                />
                <StatCard
                  icon={<List className="w-4 h-4" />}
                  label="List"
                  value={stats.lists}
                  color="emerald"
                />
                <StatCard
                  icon={<Zap className="w-4 h-4" />}
                  label="Kutipan"
                  value={stats.quotes}
                  color="amber"
                />
                <StatCard
                  icon={<BookOpen className="w-4 h-4" />}
                  label="Daftar Isi"
                  value={stats.tocEntries}
                  color="rose"
                />
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Actions */}
        {sections.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-7 h-7 bg-indigo-500 text-white rounded-full text-sm font-bold">
                3
              </div>
              <h2 className="text-lg font-bold text-gray-800">Hasil & Ekspor</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-5">
              <ActionButtons sections={sections} docType={docType} html={html} />
              <Preview
                html={html}
                docType={docType}
                visible={showPreview}
                onToggle={() => setShowPreview(!showPreview)}
              />
            </div>
          </section>
        )}

        {/* Empty state with tips */}
        {!rawText.trim() && (
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-800 mb-2">💡 Tips Penggunaan</h3>
                  <ul className="space-y-2 text-sm text-amber-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">▸</span>
                      <span>
                        Copy teks dari <strong>ChatGPT, Gemini, Claude, Copilot</strong> atau AI lainnya,
                        lalu paste di kolom input
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">▸</span>
                      <span>
                        Format <strong>Markdown</strong> (heading #, bold **, italic *, list -, numbered 1.)
                        akan otomatis dikenali
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">▸</span>
                      <span>
                        <strong>Daftar Isi</strong> dengan titik-titik (dot leader) akan otomatis diformat rapi
                        dengan nomor halaman rata kanan
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">▸</span>
                      <span>
                        Pilih jenis dokumen yang sesuai untuk mendapatkan format yang tepat
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">▸</span>
                      <span>
                        Download sebagai <strong>.docx</strong> untuk langsung buka di MS Word
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">▸</span>
                      <span>
                        Klik <strong>"Contoh Teks"</strong> → <strong>"Contoh Daftar Isi"</strong> untuk melihat demo
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
              <FeatureCard
                icon="🎯"
                title="Auto-Format"
                desc="Heading, paragraf, list, bold, italic, kutipan otomatis dikenali"
              />
              <FeatureCard
                icon="📋"
                title="Daftar Isi"
                desc="Format Daftar Isi, Daftar Tabel, Gambar, Lampiran dengan dot leader rapi"
              />
              <FeatureCard
                icon="📄"
                title="Export .docx"
                desc="Download file Word dengan format standar akademik"
              />
              <FeatureCard
                icon="🎨"
                title="Multi Format"
                desc="Skripsi, Makalah, PPT, dan Artikel"
              />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-indigo-600">AI Text Formatter</span> — Rapikan
            teks AI untuk dokumen akademik dengan mudah ✨
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Mendukung output dari ChatGPT, Gemini, Claude, Copilot, dan AI lainnya
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${colors[color]}`}>
      {icon}
      <div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs opacity-75">{label}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
