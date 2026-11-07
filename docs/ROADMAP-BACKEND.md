# Roadmap Backend & Fitur Online

Aplikasi saat ini berjalan sepenuhnya statis di browser. Semua data siswa, nilai,
jurnal, dan pengaturan disimpan di `localStorage` sehingga aman dipakai tanpa server,
tetapi belum bisa tersinkron antarperangkat, dipakai multi-kelas, atau menampilkan
papan peringkat nyata.

Dokumen ini menjadi cetak biru bila fitur online ingin diaktifkan.

---

## 1. Yang sudah bisa dipakai tanpa backend

- Materi, kuis, ujian berwaktu, LKPD cetak, rapor, diagnosis.
- Gamifikasi: XP, level, koin, streak, misi harian, lencana, avatar, bingkai.
- Mini-games: flashcard, matematika cepat, susun kata, jodohkan.
- Petualangan Nusantara 7 wilayah, perpustakaan 5 cerita rakyat, bacakan suara.
- Portal guru: dashboard kelas, analisis butir soal, jurnal, paket modul, CSV, proyektor.
- Mode orang tua: laporan 7/30 hari, grafik, rekomendasi, cetak.
- Belajar Fokus 10 Menit, aksesibilitas, dwibahasa ID/EN, PWA/offline.
- AI Gemini memakai API key milik pengguna sendiri (disimpan lokal).

---

## 2. Fitur yang membutuhkan backend

| Fitur | Kebutuhan |
| --- | --- |
| Login guru/siswa/orang tua | Auth (Supabase Auth / Firebase Auth) |
| Sinkronisasi antarperangkat | Database + API |
| Papan peringkat nyata | Tabel skor + aturan anti-curang |
| Kelas & undangan siswa | Tabel kelas, kode undangan, peran |
| AI bersama tanpa key pengguna | Proxy server yang menyimpan API key |
| Bank soal bersama | Tabel soal + moderasi |
| CMS konten | Tabel materi/cerita + panel admin |
| Laporan otomatis ke orang tua | Email/push + jadwal |

---

## 3. Rekomendasi stack

- **Database & Auth:** Supabase (PostgreSQL + Row Level Security) — cepat, gratis untuk skala sekolah.
- **Hosting statis:** Vercel / Netlify / Cloudflare Pages (aplikasi ini sudah statis).
- **Serverless API:** Vercel Functions, Netlify Functions, atau Supabase Edge Functions.
- **Email:** Resend / Supabase SMTP.
- **AI:** Gemini API dipanggil dari serverless function, bukan dari browser.

---

## 4. Skema database (Supabase/PostgreSQL)

```sql
-- Profil pengguna (terhubung ke auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('guru','siswa','orangtua')) default 'siswa',
  full_name text not null,
  school text,
  created_at timestamptz default now()
);

-- Kelas yang dikelola guru
create table classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  phase text not null check (phase in ('faseA','faseB','faseC')),
  join_code text unique not null,
  created_at timestamptz default now()
);

-- Siswa di dalam kelas
create table students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  name text not null,
  nisn text,
  created_at timestamptz default now()
);

-- Nilai terakhir per mapel
create table scores (
  student_id uuid not null references students(id) on delete cascade,
  subject text not null,
  score int not null,
  total int not null,
  percentage int not null,
  best_percentage int not null default 0,
  attempts int not null default 1,
  updated_at timestamptz default now(),
  primary key (student_id, subject)
);

-- Riwayat kuis
create table quiz_history (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  subject text not null,
  score int not null,
  total int not null,
  percentage int not null,
  mode text not null default 'Latihan',
  duration_seconds int default 0,
  source text default 'bank',
  created_at timestamptz default now()
);

-- Gamifikasi
create table gamification (
  student_id uuid primary key references students(id) on delete cascade,
  avatar text default '🦊',
  frame text default 'default',
  xp int not null default 0,
  coins int not null default 0,
  streak int not null default 0,
  best_streak int not null default 0,
  badges jsonb not null default '[]'::jsonb,
  stats jsonb not null default '{}'::jsonb,
  missions jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Petualangan
create table adventure_progress (
  student_id uuid primary key references students(id) on delete cascade,
  regions jsonb not null default '{}'::jsonb,
  stories jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Jurnal guru
create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  student_id uuid references students(id) on delete set null,
  entry_date date not null default current_date,
  type text not null default 'jurnal',
  title text not null,
  topic text,
  activity text,
  reflection text,
  follow_up text,
  mood text,
  minutes int default 0,
  created_at timestamptz default now()
);

-- Modul ajar tersimpan
create table lesson_plans (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  subject text,
  phase text,
  topic text,
  html text not null,
  created_at timestamptz default now()
);

-- Statistik butir soal
create table item_stats (
  id text primary key,
  question text not null,
  subject text,
  phase text,
  attempts int not null default 0,
  correct int not null default 0,
  last_at timestamptz default now()
);
```

### Row Level Security (contoh)

```sql
alter table classes enable row level security;
alter table students enable row level security;
alter table quiz_history enable row level security;
alter table journal_entries enable row level security;

create policy "guru melihat kelasnya"
on classes for select
using (teacher_id = auth.uid());

create policy "guru mengelola kelasnya"
on classes for all
using (teacher_id = auth.uid())
with check (teacher_id = auth.uid());

create policy "siswa terdaftar di kelasnya"
on students for select
using (
  exists (
    select 1 from classes c
    where c.id = students.class_id and c.teacher_id = auth.uid()
  )
  or profile_id = auth.uid()
);

create policy "riwayat milik siswa atau gurunya"
on quiz_history for select
using (
  student_id in (select id from students where profile_id = auth.uid())
  or student_id in (
    select s.id from students s
    join classes c on c.id = s.class_id
    where c.teacher_id = auth.uid()
  )
);
```

---

## 5. Papan peringkat nyata

```sql
create or replace view leaderboard_weekly as
select
  s.id as student_id,
  s.name,
  c.name as class_name,
  count(h.id) as quizzes,
  round(avg(h.percentage)) as average,
  sum(h.score) as total_correct
from students s
join classes c on c.id = s.class_id
left join quiz_history h
  on h.student_id = s.id
  and h.created_at >= now() - interval '7 days'
group by s.id, s.name, c.name
order by total_correct desc, average desc;
```

Aturan anti-curang:
- Skor dikirim ke server setelah kuis selesai, bukan saat menjawab.
- Server memvalidasi `score <= total`, durasi wajar, dan jumlah soal sesuai bank.
- Batasi satu pengiriman per `quiz_session_id` agar tidak dobel.
- Tampilkan papan peringkat per kelas, bukan global, untuk mengurangi tekanan anak.

---

## 6. Sinkronisasi data lokal ke cloud

Strategi yang disarankan:

1. Tetap pakai `localStorage` sebagai sumber utama saat offline.
2. Tambahkan `syncQueue` berisi perubahan (`upsert`, `delete`) dengan timestamp.
3. Saat online, kirim antrean ke API; gunakan `updated_at` untuk konflik terakhir menang.
4. Saat login pertama, tawarkan "Gabungkan data perangkat ini" atau "Mulai dari cloud".
5. Jangan pernah menghapus data lokal sebelum server mengonfirmasi.

Contoh bentuk antrean:

```js
{
  id: 'queue_123',
  entity: 'quiz_history',
  action: 'upsert',
  payload: { student_id, subject, score, total, percentage, mode },
  createdAt: 1730000000000
}
```

---

## 7. Proxy AI Gemini (tanpa membocorkan API key)

Jangan pernah menaruh API key di file statis. Buat serverless function:

```js
// api/gemini.js — contoh Vercel Function (Node.js)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, history = [], mode = 'chat' } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || prompt.length > 4000) {
    return res.status(400).json({ error: 'Prompt tidak valid' });
  }

  // TODO: verifikasi sesi pengguna (Supabase JWT) dan rate limit per user.
  const apiKey = process.env.GEMINI_API_KEY;
  const model = 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      generationConfig: {
        temperature: mode === 'module' ? 0.4 : 0.7,
        maxOutputTokens: 2048
      }
    })
  });

  const data = await response.json();
  return res.status(response.ok ? 200 : 502).json(data);
}
```

Langkah produksi:
- Simpan `GEMINI_API_KEY` di environment variable.
- Tambahkan rate limit (mis. 20 permintaan/jam/siswa).
- Filter prompt agar tidak keluar dari konteks pendidikan.
- Catat penggunaan token untuk anggaran sekolah.
- Ganti `getGeminiApiKey()` di `js/ai.js` agar memanggil proxy saat tersedia, dengan fallback ke key lokal.

---

## 8. Peran & alur pengguna

### Guru
1. Daftar/login.
2. Buat kelas → dapat kode undangan.
3. Siswa bergabung dengan kode atau guru menambah manual.
4. Guru melihat dashboard, analisis butir soal, jurnal, dan modul.
5. Unduh rekap CSV atau cetak laporan.

### Siswa
1. Login dengan kode kelas / akun sekolah.
2. Belajar, kuis, petualangan, mini-games.
3. Progres tersinkron otomatis.

### Orang tua
1. Login dengan kode akses anak.
2. Hanya bisa melihat laporan, bukan mengubah nilai.
3. Menerima ringkasan mingguan lewat email.

---

## 9. Privasi & keamanan anak

- Kumpulkan data minimal: nama panggilan, kelas, dan progres belajar.
- Hindari email pribadi anak; gunakan akun kelas milik guru.
- Minta persetujuan orang tua/wali sesuai kebijakan sekolah.
- Sediakan tombol hapus data dan ekspor data (sudah tersedia versi lokal).
- Jangan tampilkan papan peringkat publik tanpa izin.
- Enkripsi transport (HTTPS) dan aktifkan RLS di semua tabel.
- Audit akses guru ke data siswa.

---

## 10. Urutan implementasi yang disarankan

1. **Fase 1:** Auth + tabel `profiles`, `classes`, `students`; login guru.
2. **Fase 2:** Sinkronisasi nilai & riwayat; dashboard kelas online.
3. **Fase 3:** Jurnal dan modul ajar tersimpan di cloud.
4. **Fase 4:** Papan peringkat per kelas + laporan orang tua via email.
5. **Fase 5:** Proxy AI bersama + rate limit.
6. **Fase 6:** CMS materi/cerita dan bank soal bersama dengan moderasi.

Setiap fase sebaiknya tetap mempertahankan mode luring agar sekolah dengan internet
terbatas tidak kehilangan fitur utama.
