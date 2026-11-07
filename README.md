# 🎈 Ruang Belajar Abah

Aplikasi pembelajaran interaktif untuk siswa Sekolah Dasar berbasis **Kurikulum Merdeka** (Fase A, B, dan C). Dibuat sebagai web statis — cukup buka `index.html`, tanpa build tool, tanpa server khusus, dan tanpa instalasi paket.

## ✨ Fitur Utama

- **Materi pembelajaran** Fase A–C untuk Matematika, IPAS, Bahasa Indonesia, dan Bahasa Inggris.
- **Kuis interaktif** dengan mode latihan (tanpa batas waktu), **latihan adaptif** (soal yang sering salah muncul lebih dulu), dan mode ujian (soal diacak + timer).
- **Pembahasan otomatis** setiap soal setelah dijawab, plus rekap hasil, bintang, dan riwayat nilai.
- **Bank Soal Guru** untuk menambah, memfilter, dan menghapus soal sendiri. Soal otomatis masuk ke kuis sesuai fase dan mapel.
- **Generator Soal AI** (opsional, butuh Gemini API key) untuk membuat paket soal baru, langsung dimainkan atau disimpan ke bank soal.
- **Tanya AI Ninna** — asisten belajar ramah anak dengan riwayat percakapan.
- **Modul Ajar AI** — membuat draft modul/RPP, lalu bisa dicetak, disalin, atau diunduh sebagai HTML.
- **Cetak LKPD** dari bank soal atau hasil kuis, siap diberikan sebagai lembar kerja.
- **Rapor Digital & Diagnosis** — nilai per mapel, predikat, lencana, riwayat, analisis belajar, dan program remedial/pengayaan. Bisa dicetak menjadi PDF.
- **Gamifikasi** — XP, level, koin, streak harian, misi harian, lencana, avatar, dan toko hadiah.
- **Mini-games edukatif** — flashcard, matematika cepat, susun kata, dan jodohkan.
- **Petualangan Nusantara** — 7 wilayah misi belajar, 5 cerita rakyat, bacakan suara, dan hadiah.
- **Belajar Fokus 10 Menit** — sesi terpandu dengan timer, langkah belajar, dan refleksi.
- **Portal Guru & Kelas** — dashboard kelas, analisis butir soal, jurnal mengajar, paket modul ajar, mode proyektor, dan ekspor CSV.
- **Mode Orang Tua** — laporan 7/30 hari, grafik nilai, rekomendasi pendampingan, dan cetak laporan.
- **Aksesibilitas & dwibahasa** — teks besar, font ramah disleksia, kontras tinggi, kurangi animasi, auto-baca, serta antarmuka Indonesia/Inggris.
- **PWA & mode luring** — dapat dipasang di perangkat dan tetap terbuka saat offline setelah kunjungan pertama.
- **Multi-siswa** — kelola beberapa siswa, masing-masing dengan nilai dan riwayat sendiri.
- **Ekspor / Impor / Reset data** dalam format JSON (mencakup data gamifikasi, jurnal, dan pengaturan baru).
- **Efek suara & suara guru** memakai Web Audio API dan Web Speech API.
- **Responsif** untuk ponsel, tablet, dan desktop, dengan dukungan `prefers-reduced-motion`.

## 🚀 Cara Menjalankan

### Cara paling cepat
1. Buka folder proyek.
2. Klik dua kali `index.html`, atau buka dengan browser.

### Cara yang disarankan (VS Code)
1. Buka folder proyek di VS Code.
2. Pasang extension **Live Server** (lihat rekomendasi di `.vscode/extensions.json`).
3. Klik kanan `index.html` → **Open with Live Server**.

Alternatif tanpa extension:

```bash
python -m http.server 5173
```

Lalu buka `http://127.0.0.1:5173`.

> Catatan: menjalankan lewat Live Server atau `http.server` membuat fitur clipboard dan API browser berjalan lebih konsisten daripada membuka file `file://` langsung.

## 🔑 Mengatur Gemini API Key (opsional)

Kuis, materi, bank soal, LKPD, dan rapor **tidak memerlukan API key**. API key hanya dibutuhkan untuk fitur AI:

1. Buka menu **Tanya AI Ninna** atau klik tombol kunci di header.
2. Klik **Atur sekarang** / **Pengaturan AI**.
3. Tempel API key dari [Google AI Studio](https://aistudio.google.com/app/apikey).
4. Klik **Tes Koneksi** untuk memastikan key valid, lalu **Simpan API Key**.

API key disimpan di `localStorage` browser dan hanya dikirim langsung ke Google Gemini API. Key tidak dikirim ke server lain dan tidak ikut diekspor ke file cadangan.

## 🧭 Alur Penggunaan Singkat

### Untuk siswa
1. Pilih atau tambahkan profil siswa di header.
2. **Materi** — pilih fase dan mapel, lalu baca topik. Tandai materi selesai untuk mendapat XP.
3. **Kuis** — pilih latihan, latihan adaptif, atau ujian berwaktu.
4. **Bermain** — coba mini-games untuk mengumpulkan XP dan koin.
5. **Petualangan** — jelajahi wilayah Nusantara dan baca cerita rakyat.
6. Buka **profil** (avatar di header) untuk melihat misi, lencana, dan toko hadiah.

### Untuk guru
1. **Kelola Siswa** — tambahkan siswa beserta kelas/NISN/sekolah.
2. **Bank Soal Guru** — tambah soal manual atau buat soal dengan AI.
3. **Kelas** — pantau dashboard, analisis butir soal, tulis jurnal, dan siapkan modul ajar.
4. **Mode Proyektor** — tampilkan materi atau hasil kerja di depan kelas.
5. **Diagnosis & Rapor** — cetak rapor siswa aktif.
6. **Ekspor data** secara berkala sebagai cadangan.

### Untuk orang tua
1. Pilih anak yang aktif di header.
2. Buka **Orang Tua** untuk melihat laporan 7/30 hari, grafik, dan rekomendasi.
3. Gunakan tombol **Cetak** untuk menyimpan laporan sebagai PDF.

## 📱 PWA & Mode Luring

- Buka aplikasi melalui `http://` atau `https://` (Live Server / hosting statis) agar service worker aktif.
- Setelah kunjungan pertama, aset inti tersimpan di cache dan aplikasi bisa dibuka kembali tanpa internet.
- Tombol **Pasang aplikasi** muncul di header jika browser mendukung.
- Data belajar tetap tersimpan di `localStorage`; fitur AI memerlukan koneksi internet.

## 🗂️ Struktur Proyek

```text
ruang-belajar-abah/
├── index.html              # Struktur halaman & seluruh section
├── manifest.webmanifest    # Metadata PWA
├── sw.js                   # Service worker cache offline
├── css/
│   └── style.css           # Tema, animasi, aksesibilitas, dan aturan cetak
├── js/
│   ├── data.js             # Kurikulum & bank soal bawaan
│   ├── data-extra.js       # Konten gamifikasi, cerita, misi, i18n
│   ├── storage.js          # Penyimpanan & ekspor/impor data
│   ├── audio.js            # Efek suara & text-to-speech
│   ├── ai.js               # Integrasi Google Gemini
│   ├── gamification.js     # XP, level, koin, misi, lencana, toko
│   ├── games.js            # Mini-games edukatif
│   ├── adventure.js        # Petualangan Nusantara & cerita rakyat
│   ├── teacher.js          # Portal guru, jurnal, modul, proyektor
│   ├── parent.js           # Laporan orang tua
│   ├── focus.js            # Sesi belajar fokus 10 menit
│   ├── accessibility.js    # Aksesibilitas & dwibahasa
│   ├── pwa.js              # Registrasi PWA & status online
│   └── app.js              # Navigasi, kuis, timer, rapor, dan UI
├── icons/                  # Ikon PWA
├── docs/
│   └── ROADMAP-BACKEND.md  # Cetak biru fitur online (auth, sinkronisasi, AI proxy)
├── .vscode/                # Rekomendasi editor
└── README.md
```

## 🛠️ Teknologi

- HTML5, CSS3, dan JavaScript vanilla (ES6)
- [Tailwind CSS CDN](https://tailwindcss.com/) untuk utilitas styling
- [Font Awesome](https://fontawesome.com/) untuk ikon
- [DOMPurify](https://github.com/cure53/DOMPurify) untuk sanitasi HTML dari AI
- Google Fonts (Fredoka & Nunito)
- Google Gemini API (opsional)
- Web Audio API, Web Speech API, `localStorage`
- Service Worker + Web App Manifest untuk PWA/offline

## 🔒 Catatan Backend

Aplikasi ini dirancang **tanpa backend**: semua data belajar disimpan di perangkat.
Fitur yang membutuhkan akun, sinkronisasi antarperangkat, papan peringkat nyata,
atau AI bersama belum diaktifkan. Cetak biru implementasinya (skema Supabase,
Row Level Security, proxy Gemini, dan urutan pengerjaan) tersedia di
[`docs/ROADMAP-BACKEND.md`](docs/ROADMAP-BACKEND.md).

## 🐛 Troubleshooting

**Kuis tidak muncul setelah tombol "Mulai Kuis Sekarang" diklik**
1. Pastikan tidak ada pesan error di Console browser (F12 → Console).
2. Lakukan *hard refresh*: `Ctrl + F5` (Windows) atau `Cmd + Shift + R` (macOS) agar file JS terbaru dimuat.
3. Pastikan file `js/app.js` ada dan tidak kosong.
4. Coba jalankan lewat Live Server / `python -m http.server`.

**Fitur AI menampilkan pesan error**
- Periksa kembali API key di Google AI Studio.
- Pastikan kuota Gemini API masih tersedia dan koneksi internet stabil.
- Gunakan tombol **Tes Koneksi** di modal pengaturan AI.

**Data hilang setelah membersihkan browser**
- Data disimpan di `localStorage`. Gunakan fitur **Ekspor Data** sebelum membersihkan cache browser atau berganti perangkat.

## 🌐 Repository

<https://github.com/crygrownomic-ops/ruang-belajar-abah>

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pembelajaran. Silakan gunakan dan adaptasi untuk kebutuhan kelas, dengan tetap menyebutkan sumbernya.
