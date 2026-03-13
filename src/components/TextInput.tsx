import { useState } from 'react';
import { ClipboardPaste, Trash2, FileText, BookOpen, ChevronDown } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const sampleText = `# Pengaruh Media Sosial Terhadap Prestasi Belajar Mahasiswa

## BAB I: PENDAHULUAN

### 1.1 Latar Belakang

Perkembangan teknologi informasi dan komunikasi telah membawa perubahan signifikan dalam berbagai aspek kehidupan, termasuk dalam dunia pendidikan. **Media sosial** merupakan salah satu produk teknologi yang paling banyak digunakan oleh mahasiswa di era digital ini.

Menurut *Kaplan dan Haenlein (2010)*, media sosial didefinisikan sebagai sekelompok aplikasi berbasis internet yang dibangun atas dasar ideologi dan teknologi Web 2.0, yang memungkinkan penciptaan dan pertukaran konten yang dihasilkan pengguna.

### 1.2 Rumusan Masalah

Berdasarkan latar belakang di atas, maka rumusan masalah dalam penelitian ini adalah:

1. Bagaimana pola penggunaan media sosial di kalangan mahasiswa?
2. Apakah terdapat pengaruh signifikan antara penggunaan media sosial terhadap prestasi belajar mahasiswa?
3. Faktor-faktor apa saja yang mempengaruhi hubungan antara penggunaan media sosial dan prestasi belajar?

### 1.3 Tujuan Penelitian

Tujuan dari penelitian ini adalah:

- Mengidentifikasi pola penggunaan media sosial di kalangan mahasiswa
- Menganalisis pengaruh penggunaan media sosial terhadap prestasi belajar
- Mengetahui faktor-faktor yang mempengaruhi hubungan tersebut

## BAB II: TINJAUAN PUSTAKA

### 2.1 Media Sosial

Media sosial adalah platform digital yang memfasilitasi interaksi sosial, berbagi konten, dan kolaborasi antar pengguna. Beberapa jenis media sosial yang populer meliputi:

- **Facebook** - Platform jejaring sosial terbesar di dunia
- **Instagram** - Platform berbagi foto dan video
- **Twitter/X** - Platform microblogging
- **TikTok** - Platform video pendek
- **WhatsApp** - Aplikasi pesan instan

> "Media sosial telah mengubah cara manusia berkomunikasi dan berinteraksi secara fundamental" - Boyd & Ellison (2007)

### 2.2 Prestasi Belajar

Prestasi belajar merupakan hasil yang dicapai oleh seseorang setelah melakukan kegiatan belajar. Menurut **Bloom (1956)**, prestasi belajar mencakup tiga ranah utama:

1. Ranah kognitif (pengetahuan)
2. Ranah afektif (sikap)
3. Ranah psikomotorik (keterampilan)`;

const sampleTocText = `## DAFTAR ISI

**HALAMAN JUDUL** ......................................................... i
**HALAMAN PENGESAHAN** .................................................. ii
**ABSTRAK** .............................................................. iii
**KATA PENGANTAR** ...................................................... iv
**DAFTAR ISI** .......................................................... vi
**DAFTAR TABEL** ........................................................ viii
**DAFTAR GAMBAR** ....................................................... ix
**DAFTAR LAMPIRAN** ..................................................... x

**BAB I PENDAHULUAN** .................................................... 1
1.1 Latar Belakang ...................................................... 1
1.2 Identifikasi Masalah ................................................ 5
1.3 Rumusan Masalah ..................................................... 6
1.4 Tujuan Penelitian ................................................... 7
1.5 Manfaat Penelitian .................................................. 8

**BAB II TINJAUAN PUSTAKA** .............................................. 12
2.1 Computer Vision ..................................................... 12
2.2 Object Detection .................................................... 15
2.3 Deep Learning untuk Deteksi Objek ................................... 18
2.4 Algoritma Deteksi Objek ............................................. 22
2.5 Sistem CCTV berbasis AI ............................................. 28
2.6 Dataset dan Pelatihan Model ......................................... 32
2.7 Penelitian Terdahulu ................................................ 35

**BAB III METODE PENELITIAN** ............................................ 49
**BAB IV HASIL DAN PEMBAHASAN** .......................................... 62
**BAB V KESIMPULAN DAN SARAN** ........................................... 85

**DAFTAR PUSTAKA** ....................................................... 90
**LAMPIRAN** ............................................................. 95

---

## DAFTAR TABEL

Tabel 1.1 Perbandingan Metode Deteksi Objek ............................ 4
Tabel 2.1 Karakteristik Algoritma Deteksi Objek ........................ 25
Tabel 2.2 Perbandingan Dataset untuk Object Detection .................. 34
Tabel 3.1 Spesifikasi Hardware dan Software ............................ 52
Tabel 3.2 Komposisi Dataset Penelitian ................................. 55

---

## DAFTAR GAMBAR

Gambar 1.1 Arsitektur Sistem Deteksi Objek pada CCTV ................... 3
Gambar 2.1 Proses Computer Vision Pipeline .............................. 14
Gambar 2.2 Arsitektur Convolutional Neural Network ...................... 20
Gambar 2.3 Perbandingan Algoritma YOLO, Faster R-CNN, dan SSD .......... 27
Gambar 3.1 Flowchart Metodologi Penelitian .............................. 50
Gambar 3.2 Arsitektur Sistem yang Dikembangkan .......................... 53

---

## DAFTAR LAMPIRAN

Lampiran A Dataset dan Anotasi .......................................... 95
Lampiran B Kode Program Implementasi .................................... 98
Lampiran C Hasil Pengujian Model ........................................ 105
Lampiran D Dokumentasi Eksperimen ....................................... 110`;

export default function TextInput({ value, onChange }: Props) {
  const [showSampleMenu, setShowSampleMenu] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch {
      document.getElementById('text-input')?.focus();
    }
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;
  const lineCount = value.trim() ? value.split('\n').filter((l) => l.trim()).length : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <ClipboardPaste className="w-4 h-4 text-indigo-500" />
          Paste Teks dari AI di sini
        </label>
        <div className="flex gap-2 flex-wrap">
          {/* Sample dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSampleMenu(!showSampleMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Contoh Teks
              <ChevronDown className="w-3 h-3" />
            </button>
            {showSampleMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSampleMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 min-w-[200px] overflow-hidden animate-fade-in">
                  <button
                    onClick={() => {
                      onChange(sampleText);
                      setShowSampleMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-indigo-50 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <div>
                      <div className="font-medium">Contoh Skripsi/Makalah</div>
                      <div className="text-xs text-gray-400">BAB, paragraf, list, kutipan</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onChange(sampleTocText);
                      setShowSampleMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-indigo-50 transition-colors border-t border-gray-100"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-medium">Contoh Daftar Isi</div>
                      <div className="text-xs text-gray-400">Daftar Isi, Tabel, Gambar, Lampiran</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handlePaste}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            Paste
          </button>
          {value && (
            <button
              onClick={() => onChange('')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          id="text-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste teks dari ChatGPT, Gemini, Claude, atau AI lainnya di sini...

Contoh format yang didukung:
# Judul Utama
## Sub Judul
### Sub Sub Judul

**Teks tebal** dan *teks miring*

1. List bernomor
2. Item kedua

- Bullet point
- Item kedua

> Kutipan / Blockquote

**JUDUL** .................. halaman  (← Format Daftar Isi)
1.1 Sub Judul .............. halaman

\`kode inline\`
\`\`\`
blok kode
\`\`\``}
          className="w-full h-72 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-y text-sm font-mono text-gray-700 bg-gray-50/50 transition-all placeholder:text-gray-400"
          spellCheck={false}
        />
      </div>

      {value && (
        <div className="flex gap-4 text-xs text-gray-500 animate-fade-in">
          <span>📝 {wordCount} kata</span>
          <span>🔤 {charCount} karakter</span>
          <span>📄 {lineCount} baris</span>
        </div>
      )}
    </div>
  );
}
