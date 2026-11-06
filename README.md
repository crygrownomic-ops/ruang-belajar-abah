# 🎈 Ruang Belajar Abah

Aplikasi pembelajaran interaktif untuk siswa Sekolah Dasar berbasis **Kurikulum Merdeka** (Fase A, B, dan C). Dibuat sebagai web statis — cukup buka `index.html`, tanpa build tool, tanpa server khusus, dan tanpa instalasi paket.

## ✨ Fitur Utama

- **Materi pembelajaran** Fase A–C untuk Matematika, IPAS, Bahasa Indonesia, dan Bahasa Inggris.
- **Kuis interaktif** dengan mode latihan (tanpa batas waktu) dan mode ujian (soal diacak + timer).
- **Pembahasan otomatis** setiap soal setelah dijawab, plus rekap hasil, bintang, dan riwayat nilai.
- **Bank Soal Guru** untuk menambah, memfilter, dan menghapus soal sendiri. Soal otomatis masuk ke kuis sesuai fase dan mapel.
- **Generator Soal AI** (opsional, butuh Gemini API key) untuk membuat paket soal baru, langsung dimainkan atau disimpan ke bank soal.
- **Tanya AI Ninna** — asisten belajar ramah anak dengan riwayat percakapan.
- **Modul Ajar AI** — membuat draft modul/RPP, lalu bisa dicetak, disalin, atau diunduh sebagai HTML.
- **Cetak LKPD** dari bank soal atau hasil kuis, siap diberikan sebagai lembar kerja.
- **Rapor Digital & Diagnosis** — nilai per mapel, predikat, lencana, riwayat, analisis belajar, dan program remedial/pengayaan. Bisa dicetak menjadi PDF.
- **Multi-siswa** — kelola beberapa siswa, masing-masing dengan nilai dan riwayat sendiri.
- **Ekspor / Impor / Reset data** dalam format JSON.
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

## 🧭 Alur Penggunaan untuk Guru

1. **Kelola Siswa** — klik nama siswa di header, tambahkan siswa dan data kelas/NISN/sekolah.
2. **Materi** — pilih fase dan mapel, lalu pilih topik.
3. **Kuis** — pilih fase, mapel, mode latihan/ujian, lalu **Mulai Kuis Sekarang**.
4. **Bank Soal Guru** — tambah soal manual atau buat soal dengan AI.
5. **Diagnosis & Rapor** — lihat analisis dan cetak rapor siswa aktif.
6. **Ekspor data** secara berkala sebagai cadangan.

## 🗂️ Struktur Proyek

```text
ruang-belajar-abah/
├── index.html          # Struktur halaman & seluruh section
├── css/
│   └── style.css       # Tema, animasi, dan aturan cetak
├── js/
│   ├── data.js         # Kurikulum & bank soal bawaan
│   ├── storage.js      # Penyimpanan siswa, nilai, riwayat, bank soal
│   ├── audio.js        # Efek suara & text-to-speech
│   ├── ai.js           # Integrasi Google Gemini
│   └── app.js          # Navigasi, kuis, timer, rapor, dan UI
├── .vscode/            # Rekomendasi editor
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
