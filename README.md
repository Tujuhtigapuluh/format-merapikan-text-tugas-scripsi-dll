<div align="center">

# 📝 AI Text Formatter

### Rapikan Teks dari AI untuk Skripsi, Makalah, PPT & Tugas Akademik

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Klik_Disini-blue?style=for-the-badge)](https://tujuhtigapuluh.github.io/format-merapikan-text-tugas-scripsi-dll/)
[![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-222?style=for-the-badge&logo=github)](https://tujuhtigapuluh.github.io/format-merapikan-text-tugas-scripsi-dll/)

<br/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />

---

**Pernah copy-paste dari ChatGPT / Gemini / Claude ke MS Word, hasilnya berantakan?** 😫

**AI Text Formatter** hadir untuk menyelesaikan masalah itu! ✨

Cukup **paste → pilih format → copy/download** — teks langsung rapi sesuai standar akademik!

</div>

---

## 🎯 Masalah yang Diselesaikan

| 😫 Sebelum | ✅ Sesudah |
|-----------|-----------|
| Teks dari AI berantakan di Word | Teks rapi sesuai format akademik |
| Heading `##` masih ada tanda markdown | Heading otomatis jadi format Word |
| Bold `**teks**` tidak terbaca | Bold langsung terformat |
| Numbered list `1.` berantakan | Numbering rapi dengan indentasi |
| Daftar Isi titik-titik kacau | Daftar Isi rapi dengan dot leader |
| Harus format manual satu per satu | Otomatis dalam 1 klik! |

---

## ✨ Fitur Utama

### 🎓 4 Jenis Format Dokumen

| Format | Font | Spasi | Margin | Cocok Untuk |
|--------|------|-------|--------|-------------|
| **📚 Skripsi/Tesis** | Times New Roman 12pt | 2.0 | 4-3-4-3 cm | Tugas Akhir, Tesis, Disertasi |
| **📄 Makalah** | Times New Roman 12pt | 1.5 | 3-3-3-3 cm | Paper, Laporan, Jurnal |
| **📊 PowerPoint** | Sans-serif | 1.2 | - | Presentasi, Slide |
| **📰 Artikel/Blog** | Sans-serif | 1.6 | - | Blog, Konten Online |

### 🔍 Auto-Deteksi Cerdas

Aplikasi ini secara otomatis mengenali dan memformat:

- ✅ **Heading** — `#`, `##`, `###` → jadi heading Word yang proper
- ✅ **Bold & Italic** — `**bold**`, `*italic*` → format langsung
- ✅ **Numbered List** — `1.`, `2.`, `1.1` → numbering rapi dengan indent
- ✅ **Bullet List** — `-`, `•`, `*` → bullet point yang konsisten
- ✅ **Blockquote** — `> kutipan` → format kutipan
- ✅ **Code Block** — ` ``` kode ``` ` → blok kode dengan monospace
- ✅ **Daftar Isi** — `Judul ........... 1` → TOC dengan dot leader rapi
- ✅ **Daftar Tabel/Gambar/Lampiran** → format akademik yang benar

### 📤 4 Cara Export

| Cara | Kegunaan |
|------|----------|
| 📋 **Copy Teks Rapi** | Plain text bersih tanpa markdown |
| 📋 **Copy untuk MS Word** | Paste ke Word dengan format (rich text) |
| 📥 **Download .docx** | File Word siap pakai dengan margin & font benar |
| 🖨️ **Print / PDF** | Cetak langsung atau simpan sebagai PDF |

---

## 🚀 Demo Langsung

### 👉 [Klik di sini untuk mencoba!](https://scared-scarlet-tuweei2f9w.edgeone.app/)

**Cara pakai:**

```
1. Buka website
2. Paste teks dari AI (ChatGPT, Gemini, Claude, Copilot, dll)
3. Pilih jenis dokumen (Skripsi/Makalah/PPT/Artikel)
4. Klik "Format Sekarang"
5. Copy atau Download hasilnya
6. Paste ke MS Word — DONE! ✅
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="40"/><br><b>React 19</b></td>
<td align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="40"/><br><b>TypeScript</b></td>
<td align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="40"/><br><b>Tailwind 4</b></td>
<td align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg" width="40"/><br><b>Vite 7</b></td>
</tr>
</table>

- ⚛️ **React 19** — UI framework
- 🔷 **TypeScript** — Type safety
- 🎨 **Tailwind CSS 4** — Styling
- ⚡ **Vite 7** — Build tool
- 📄 **docx** — Generate file Word (.docx)
- 💾 **file-saver** — Download file
- 🎯 **Lucide React** — Icons
- 📦 **vite-plugin-singlefile** — Bundle jadi 1 file HTML

---

## 💻 Development Lokal

### Prerequisites

- Node.js 18+ 
- npm 9+

### Instalasi

```bash
# Clone repository
git clone https://github.com/tujuhtigapuluh/format-merapikan-text-tugas-scripsi-dll.git

# Masuk ke folder project
cd format-merapikan-text-tugas-scripsi-dll

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka `http://localhost:5173` di browser.

### Build Production

```bash
# Build untuk production
npm run build

# Preview hasil build
npm run preview
```

---

## 📁 Struktur Project

```
📦 format-merapikan-text-tugas-scripsi-dll/
├── 📂 .github/
│   └── 📂 workflows/
│       └── 📄 deploy.yml          # GitHub Actions auto-deploy
├── 📂 public/
│   └── 📄 .nojekyll              # Disable Jekyll processing
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📄 ActionButtons.tsx   # Tombol Copy, Download, Print
│   │   ├── 📄 FormatPreview.tsx   # Preview hasil format
│   │   └── 📄 TextInput.tsx       # Input teks & pilihan format
│   ├── 📂 utils/
│   │   ├── 📄 textFormatter.ts    # Logic auto-format teks
│   │   └── 📄 docxExporter.ts     # Export ke file .docx
│   ├── 📄 App.tsx                 # Komponen utama
│   ├── 📄 index.css               # Global styles & TOC
│   └── 📄 main.tsx                # Entry point
├── 📄 index.html                  # HTML template
├── 📄 package.json
├── 📄 vite.config.ts
├── 📄 tsconfig.json
└── 📄 README.md                   # File ini!
```

---

## 🚀 Deploy ke GitHub Pages

### Cara Otomatis (Recommended)

Project ini sudah dikonfigurasi dengan **GitHub Actions**. Setiap kali push ke branch `main`, website otomatis di-deploy!

1. **Push kode ke GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Aktifkan GitHub Pages:**
   - Buka repository di GitHub
   - Pergi ke **Settings** → **Pages**
   - Di bagian **Source**, pilih **GitHub Actions**
   - Tunggu workflow selesai (± 1-2 menit)

3. **Selesai!** 🎉 Website live di:
   ```
   https://tujuhtigapuluh.github.io/format-merapikan-text-tugas-scripsi-dll/
   ```

### Cara Manual

```bash
# Build project
npm run build

# Upload isi folder `dist/` ke GitHub Pages
```

---

## 📝 Cara Penggunaan Detail

### Format Teks Biasa (Paragraf, Heading, List)

```markdown
## Judul Bab
Paste teks paragraf dari AI di sini...

### Sub Judul
1. Item pertama
2. Item kedua

- Bullet satu
- Bullet dua

**Teks tebal** dan *teks miring*
```

### Format Daftar Isi

```markdown
## DAFTAR ISI

**HALAMAN JUDUL** ........................... i
**ABSTRAK** ................................. iii
**BAB I PENDAHULUAN** ....................... 1
1.1 Latar Belakang ......................... 1
1.2 Rumusan Masalah ........................ 5
**BAB II TINJAUAN PUSTAKA** ................. 12
**DAFTAR PUSTAKA** .......................... 90
```

### Format Daftar Tabel/Gambar

```markdown
## DAFTAR TABEL

Tabel 1.1 Perbandingan Metode .............. 4
Tabel 2.1 Hasil Pengujian .................. 25

## DAFTAR GAMBAR

Gambar 1.1 Arsitektur Sistem ............... 3
Gambar 2.1 Flowchart ....................... 14
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika kamu ingin berkontribusi:

1. **Fork** repository ini
2. Buat **branch** baru (`git checkout -b fitur-baru`)
3. **Commit** perubahan (`git commit -m 'Tambah fitur baru'`)
4. **Push** ke branch (`git push origin fitur-baru`)
5. Buat **Pull Request**

### 💡 Ide Fitur yang Bisa Dikembangkan

- [ ] 🌙 Dark mode
- [ ] 🌐 Multi-bahasa (English support)
- [ ] 📊 Format khusus untuk tabel data
- [ ] 📑 Template siap pakai (proposal, laporan, dll)
- [ ] 📎 Upload file .txt langsung
- [ ] 🔄 Undo/Redo
- [ ] 💾 Simpan history format
- [ ] 📱 Progressive Web App (PWA)

---

## 📜 Lisensi

Project ini menggunakan lisensi **MIT** — bebas digunakan, dimodifikasi, dan didistribusikan.

---

## ⭐ Support

Jika project ini membantu kamu, berikan ⭐ **star** di GitHub!

Setiap star membantu project ini ditemukan oleh lebih banyak mahasiswa yang membutuhkan 🎓

---

<div align="center">

### Dibuat dengan ❤️ untuk Mahasiswa Indonesia

**[tujuhtigapuluh](https://github.com/tujuhtigapuluh)**

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-tujuhtigapuluh-181717?style=for-the-badge&logo=github)](https://github.com/tujuhtigapuluh)

<br/>

*"Biar AI yang nulis, kita yang rapiin!"* 😎

</div>
