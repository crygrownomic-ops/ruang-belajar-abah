// ============================================================
// Konten Tambahan
// Misi harian, toko avatar, petualangan Nusantara, cerita,
// paket modul ajar, mini-games, dan kamus dwibahasa.
// ============================================================

const DAILY_MISSION_TEMPLATES = [
    { id: 'quiz1', icon: 'fa-gamepad', label: 'Selesaikan 1 kuis', target: 1, xp: 20, coins: 10, track: 'quizzes' },
    { id: 'correct10', icon: 'fa-circle-check', label: 'Jawab 10 soal dengan benar', target: 10, xp: 30, coins: 15, track: 'correct' },
    { id: 'read1', icon: 'fa-book-open', label: 'Baca 1 materi pembelajaran', target: 1, xp: 15, coins: 5, track: 'materials' },
    { id: 'game1', icon: 'fa-puzzle-piece', label: 'Mainkan 1 mini-games', target: 1, xp: 20, coins: 10, track: 'games' },
    { id: 'adventure1', icon: 'fa-map-location-dot', label: 'Selesaikan 1 misi petualangan', target: 1, xp: 40, coins: 20, track: 'adventures' },
    { id: 'focus1', icon: 'fa-hourglass-half', label: 'Selesaikan sesi Belajar 10 Menit', target: 1, xp: 30, coins: 15, track: 'focus' }
];

const AVATAR_SHOP = [
    { emoji: '🦊', name: 'Rubah Cerdik', cost: 0 },
    { emoji: '🐼', name: 'Panda Tenang', cost: 0 },
    { emoji: '🐯', name: 'Macan Semangat', cost: 20 },
    { emoji: '🦉', name: 'Burung Hantu Bijak', cost: 30 },
    { emoji: '🐬', name: 'Lumba-lumba Ceria', cost: 40 },
    { emoji: '🦋', name: 'Kupu-kupu Kreatif', cost: 50 },
    { emoji: '🚀', name: 'Astronot Nusantara', cost: 80 },
    { emoji: '🐉', name: 'Naga Kecil', cost: 100 }
];

const FRAME_SHOP = [
    { id: 'default', name: 'Bingkai Dasar', cost: 0, className: 'ring-2 ring-white/70' },
    { id: 'sunny', name: 'Bingkai Mentari', cost: 25, className: 'ring-4 ring-yellow-300' },
    { id: 'ocean', name: 'Bingkai Samudra', cost: 35, className: 'ring-4 ring-sky-400' },
    { id: 'forest', name: 'Bingkai Hutan', cost: 45, className: 'ring-4 ring-emerald-400' },
    { id: 'royal', name: 'Bingkai Juara', cost: 70, className: 'ring-4 ring-purple-400' }
];

const ADVENTURE_REGIONS = [
    {
        id: 'sumatera',
        name: 'Sumatera',
        emoji: '🌋',
        color: 'from-emerald-400 to-teal-500',
        title: 'Danau Toba dan Ikan Emas',
        intro: 'Petualangan dimulai di tanah Sumatera. Bantu penduduk desa menghitung hasil panen dan menjaga Danau Toba tetap bersih.',
        story: [
            'Di sebuah desa dekat Danau Toba, hiduplah seorang pemuda bernama Toba. Ia menangkap seekor ikan emas yang ternyata bisa berbicara. Ikan itu meminta Toba melepaskannya, dan Toba pun menepati janjinya.',
            'Seiring waktu, Toba lupa pada janjinya. Alam pun menunjukkan akibatnya. Dari cerita ini kita belajar bahwa janji harus ditepati dan alam harus dijaga.',
            'Danau Toba sekarang menjadi danau vulkanik terbesar di dunia. Banyak anak belajar tentang gunung berapi, air, dan kehidupan di sekitarnya.'
        ],
        moral: 'Tepati janji dan jaga alam sekitar.',
        questions: [
            { q: 'Penduduk memanen 18 kg jagung dan 25 kg ubi. Berapa total hasil panen mereka?', options: ['33 kg', '43 kg', '53 kg', '63 kg'], correct: 1, exp: '18 + 25 = 43 kg.' },
            { q: 'Danau Toba terbentuk dari letusan gunung berapi. Gunung berapi termasuk contoh...', options: ['benda langit', 'kenampakan alam', 'alat musik', 'bangun datar'], correct: 1, exp: 'Gunung berapi adalah kenampakan alam.' },
            { q: 'Sikap yang sesuai dengan pesan cerita Danau Toba adalah...', options: ['menepati janji', 'membuang sampah ke danau', 'menangkap semua ikan', 'melupakan janji'], correct: 0, exp: 'Pesan utamanya adalah menepati janji.' }
        ]
    },
    {
        id: 'jawa',
        name: 'Jawa',
        emoji: '🏛️',
        color: 'from-amber-400 to-orange-500',
        title: 'Rahasia Candi Borobudur',
        intro: 'Jelajahi candi megah di Jawa Tengah. Hitung batu candi, pelajari bangun datar, dan temukan nilai gotong royong.',
        story: [
            'Candi Borobudur dibangun lebih dari seribu tahun lalu. Ribuan pekerja bergotong royong menyusun batu demi batu hingga membentuk candi yang megah.',
            'Dinding candi dipenuhi relief yang menceritakan ajaran kebaikan. Setiap tingkat candi memiliki makna tentang perjalanan manusia menuju kebijaksanaan.',
            'Hari ini Borobudur menjadi warisan dunia. Kita ikut menjaganya dengan tidak mencoret dinding dan tidak membuang sampah sembarangan.'
        ],
        moral: 'Gotong royong dan menjaga warisan budaya.',
        questions: [
            { q: 'Candi Borobudur berada di provinsi...', options: ['Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Bali'], correct: 1, exp: 'Borobudur terletak di Jawa Tengah.' },
            { q: 'Sebuah relief berbentuk persegi memiliki sisi 6 cm. Berapa kelilingnya?', options: ['12 cm', '24 cm', '36 cm', '48 cm'], correct: 1, exp: 'Keliling persegi = 4 × sisi = 4 × 6 = 24 cm.' },
            { q: 'Sikap yang tepat saat mengunjungi candi adalah...', options: ['mencoret dinding', 'membuang sampah', 'menjaga kebersihan', 'memanjat relief'], correct: 2, exp: 'Kita harus menjaga kebersihan dan kelestarian candi.' }
        ]
    },
    {
        id: 'kalimantan',
        name: 'Kalimantan',
        emoji: '🦧',
        color: 'from-lime-400 to-emerald-600',
        title: 'Hutan Hujan dan Orangutan',
        intro: 'Masuk ke hutan hujan Kalimantan. Pelajari rantai makanan, pengurangan, dan cara melindungi orangutan.',
        story: [
            'Hutan hujan Kalimantan adalah rumah bagi orangutan, burung enggang, dan ribuan jenis tumbuhan. Hutan ini disebut paru-paru dunia karena menghasilkan banyak oksigen.',
            'Orangutan membutuhkan pohon besar untuk bersarang. Ketika hutan dibakar atau ditebang sembarangan, mereka kehilangan rumah dan makanan.',
            'Kita bisa membantu dengan menghemat kertas, tidak membuang sampah plastik ke sungai, dan mendukung produk yang ramah lingkungan.'
        ],
        moral: 'Lindungi hutan dan makhluk hidup di dalamnya.',
        questions: [
            { q: 'Orangutan paling banyak hidup di pulau...', options: ['Jawa', 'Sumatera dan Kalimantan', 'Bali', 'Papua'], correct: 1, exp: 'Orangutan hidup di Sumatera dan Kalimantan.' },
            { q: 'Ada 42 pohon di hutan kecil. 15 pohon ditebang. Berapa pohon yang tersisa?', options: ['17', '27', '37', '57'], correct: 1, exp: '42 - 15 = 27 pohon.' },
            { q: 'Tindakan yang membantu menyelamatkan hutan adalah...', options: ['membakar lahan', 'menebang semua pohon', 'menghemat kertas', 'membuang sampah ke sungai'], correct: 2, exp: 'Menghemat kertas mengurangi kebutuhan menebang pohon.' }
        ]
    },
    {
        id: 'sulawesi',
        name: 'Sulawesi',
        emoji: '🐠',
        color: 'from-sky-400 to-blue-600',
        title: 'Tari Kipas dan Taman Laut Bunaken',
        intro: 'Menari bersama di Sulawesi, lalu menyelam virtual ke Bunaken. Hitung ikan dan pelajari ekosistem laut.',
        story: [
            'Di Sulawesi Selatan, penari memakai kipas dan bergerak lincah mengikuti irama. Tari Kipas Pakarena menggambarkan kelembutan dan kegembiraan masyarakat.',
            'Tidak jauh dari sana, Taman Laut Bunaken menyimpan terumbu karang warna-warni. Ikan kecil, penyu, dan bintang laut hidup bersama di sana.',
            'Terumbu karang mudah rusak. Kita tidak boleh menyentuh karang, membuang jaring sembarangan, atau mengambil hewan laut.'
        ],
        moral: 'Cintai budaya dan jaga laut Indonesia.',
        questions: [
            { q: 'Tari Kipas Pakarena berasal dari...', options: ['Sulawesi Selatan', 'Papua', 'Maluku', 'Jawa Barat'], correct: 0, exp: 'Tari Kipas Pakarena berasal dari Sulawesi Selatan.' },
            { q: 'Ada 4 kelompok penyelam, setiap kelompok 6 orang. Berapa jumlah penyelam seluruhnya?', options: ['10', '18', '24', '30'], correct: 2, exp: '4 × 6 = 24 penyelam.' },
            { q: 'Cara menjaga terumbu karang adalah...', options: ['menyentuh karang', 'membuang sampah ke laut', 'tidak mengambil hewan laut', 'menangkap penyu'], correct: 2, exp: 'Kita tidak boleh mengambil hewan laut dan harus menjaga kebersihan.' }
        ]
    },
    {
        id: 'bali-nt',
        name: 'Bali & Nusa Tenggara',
        emoji: '🌾',
        color: 'from-orange-400 to-rose-500',
        title: 'Subak, Sawah, dan Air yang Adil',
        intro: 'Belajar pembagian air di sawah Bali dan keindahan Nusa Tenggara. Hitung pecahan dan pahami hidup bersama.',
        story: [
            'Petani Bali menggunakan sistem irigasi bernama subak. Air dibagi secara adil ke semua sawah melalui saluran dan kesepakatan bersama.',
            'Subak bukan hanya tentang air. Di dalamnya ada gotong royong, musyawarah, dan rasa syukur kepada alam.',
            'Nusa Tenggara memiliki savana, pantai, dan hewan khas seperti komodo. Semua itu perlu dijaga agar tetap lestari.'
        ],
        moral: 'Berbagi secara adil dan bekerja sama.',
        questions: [
            { q: 'Sistem irigasi sawah di Bali disebut...', options: ['subak', 'terasering', 'joglo', 'batik'], correct: 0, exp: 'Sistem irigasi khas Bali adalah subak.' },
            { q: 'Sebuah sawah dibagi 4 bagian sama besar. Jika 1 bagian ditanami padi, berapa bagian yang belum ditanami?', options: ['1/4', '2/4', '3/4', '4/4'], correct: 2, exp: '4/4 - 1/4 = 3/4 bagian.' },
            { q: 'Nilai utama dalam sistem subak adalah...', options: ['berebut air', 'gotong royong', 'menutup saluran', 'membuang sampah'], correct: 1, exp: 'Subak mengutamakan gotong royong dan keadilan.' }
        ]
    },
    {
        id: 'maluku',
        name: 'Maluku',
        emoji: '🌶️',
        color: 'from-red-400 to-pink-600',
        title: 'Kepulauan Rempah dan Pelaut',
        intro: 'Berlayar ke kepulauan rempah. Pelajari pembagian, arah mata angin, dan sejarah perdagangan rempah.',
        story: [
            'Maluku dikenal sebagai kepulauan rempah. Pala, cengkih, dan lada tumbuh subur di sana dan pernah menjadi incaran pedagang dari berbagai negara.',
            'Para pelaut menggunakan arah mata angin dan bintang untuk menemukan jalan. Mereka juga membawa cerita dan budaya dari tempat yang jauh.',
            'Hari ini, rempah Maluku tetap berharga. Kita bangga pada kekayaan alam Indonesia dan harus memanfaatkannya dengan bijak.'
        ],
        moral: 'Bangga pada kekayaan alam dan berbagi dengan bijak.',
        questions: [
            { q: 'Rempah khas Maluku yang terkenal adalah...', options: ['pala dan cengkih', 'kopi dan teh', 'apel dan jeruk', 'jagung dan kedelai'], correct: 0, exp: 'Maluku terkenal dengan pala dan cengkih.' },
            { q: 'Arah yang berlawanan dengan timur adalah...', options: ['utara', 'selatan', 'barat', 'tenggara'], correct: 2, exp: 'Lawan arah timur adalah barat.' },
            { q: 'Ada 36 bungkus rempah dibagi rata ke 6 keranjang. Berapa bungkus setiap keranjang?', options: ['4', '5', '6', '7'], correct: 2, exp: '36 ÷ 6 = 6 bungkus.' }
        ]
    },
    {
        id: 'papua',
        name: 'Papua',
        emoji: '🦜',
        color: 'from-violet-400 to-purple-600',
        title: 'Burung Cendrawasih dan Hutan Papua',
        intro: 'Petualangan terakhir di tanah Papua. Kenali burung cendrawasih, pola warna, dan pentingnya menjaga hutan.',
        story: [
            'Burung cendrawasih dikenal karena bulunya yang indah. Ia hidup di hutan Papua dan menjadi simbol kekayaan hayati Indonesia.',
            'Hutan Papua juga menjadi rumah bagi banyak suku dengan budaya yang beragam. Mereka menjaga hutan dengan pengetahuan turun-temurun.',
            'Menjaga hutan berarti menjaga rumah bagi burung, tumbuhan, dan manusia. Kita bisa mulai dari hal kecil, seperti tidak membuang sampah sembarangan.'
        ],
        moral: 'Bangga dan jaga keberagaman hayati Indonesia.',
        questions: [
            { q: 'Burung cendrawasih berasal dari...', options: ['Papua', 'Jawa', 'Sumatera', 'Bali'], correct: 0, exp: 'Cendrawasih adalah burung khas Papua.' },
            { q: 'Pola warna: merah, kuning, merah, kuning, ... Warna berikutnya adalah...', options: ['merah', 'kuning', 'hijau', 'biru'], correct: 0, exp: 'Polanya bergantian merah-kuning, jadi berikutnya merah.' },
            { q: 'Tindakan yang menjaga hutan Papua adalah...', options: ['menebang sembarangan', 'membakar hutan', 'menanam pohon', 'menangkap burung'], correct: 2, exp: 'Menanam pohon membantu menjaga hutan.' }
        ]
    }
];

const STORIES = [
    {
        id: 'kancil-buaya',
        title: 'Kancil dan Buaya',
        region: 'Jawa',
        emoji: '🐊',
        age: 'Fase A',
        paragraphs: [
            'Kancil ingin menyeberangi sungai yang lebar. Di sungai itu banyak buaya yang sedang berjemur.',
            'Kancil berkata, "Hai Buaya, Raja hutan ingin menghitung jumlah kalian. Berbarislah agar aku bisa menghitungnya."',
            'Buaya-buaya pun berbaris. Kancil melompat dari punggung satu buaya ke punggung buaya lain sambil menghitung. Ia berhasil menyeberang dengan selamat.'
        ],
        moral: 'Kecerdikan harus digunakan untuk kebaikan, bukan untuk menipu.',
        questions: [
            { q: 'Siapa yang ingin menyeberangi sungai?', options: ['Kancil', 'Buaya', 'Harimau', 'Gajah'], correct: 0, exp: 'Tokoh utamanya adalah Kancil.' },
            { q: 'Bagaimana Kancil menyeberang?', options: ['berenang sendiri', 'melompat di punggung buaya', 'membuat jembatan', 'naik perahu'], correct: 1, exp: 'Kancil melompat dari punggung buaya ke punggung buaya lain.' }
        ]
    },
    {
        id: 'malin-kundang',
        title: 'Malin Kundang',
        region: 'Sumatera Barat',
        emoji: '⛵',
        age: 'Fase B',
        paragraphs: [
            'Malin Kundang pergi merantau untuk mengubah nasib. Setelah sukses, ia kembali ke kampung dengan kapal besar.',
            'Ibunya datang menyambut, tetapi Malin malu mengakui ibunya yang berpakaian sederhana. Ia berpura-pura tidak mengenalnya.',
            'Ibu Malin berdoa dengan sedih. Badai datang, dan kapal Malin berubah menjadi batu. Hingga kini kisah itu menjadi pengingat untuk menghormati orang tua.'
        ],
        moral: 'Hormati dan sayangi orang tua, jangan sombong setelah berhasil.',
        questions: [
            { q: 'Mengapa Malin Kundang dikutuk?', options: ['karena tidak mengakui ibunya', 'karena membantu ibu', 'karena berlayar', 'karena membangun kapal'], correct: 0, exp: 'Malin malu mengakui ibunya dan berlaku sombong.' },
            { q: 'Pesan utama cerita Malin Kundang adalah...', options: ['rajin berlayar', 'hormati orang tua', 'jangan berdagang', 'cari kapal besar'], correct: 1, exp: 'Kita harus menghormati orang tua.' }
        ]
    },
    {
        id: 'timun-mas',
        title: 'Timun Mas',
        region: 'Jawa Tengah',
        emoji: '🥒',
        age: 'Fase B',
        paragraphs: [
            'Timun Mas lahir dari sebuah mentimun emas yang diberikan kepada ibunya. Saat Timun Mas beranjak besar, raksasa datang menagih janji.',
            'Ibunya memberikan bekal: biji mentimun, jarum, garam, dan terasi. Timun Mas berlari dan melemparkan bekal itu satu per satu.',
            'Biji mentimun menjadi hutan lebat, jarum menjadi bambu, garam menjadi laut, dan terasi menjadi lumpur. Timun Mas akhirnya selamat.'
        ],
        moral: 'Keberanian dan akal sehat membantu menghadapi masalah.',
        questions: [
            { q: 'Bekal Timun Mas yang berubah menjadi laut adalah...', options: ['biji mentimun', 'jarum', 'garam', 'terasi'], correct: 2, exp: 'Garam berubah menjadi laut.' },
            { q: 'Sifat yang dimiliki Timun Mas adalah...', options: ['penakut', 'berani dan cerdas', 'sombong', 'malas'], correct: 1, exp: 'Timun Mas berani dan menggunakan akalnya.' }
        ]
    },
    {
        id: 'danau-toba',
        title: 'Legenda Danau Toba',
        region: 'Sumatera Utara',
        emoji: '🐟',
        age: 'Fase C',
        paragraphs: [
            'Toba menangkap ikan emas yang dapat berbicara. Ikan itu meminta dilepaskan, dan Toba berjanji tidak akan melanggar pesannya.',
            'Suatu hari Toba melanggar janjinya. Ia memakan hidangan yang dilarang, dan terbukalah asal-usul istrinya.',
            'Sang istri kembali ke wujud asalnya. Hujan deras turun dan membentuk Danau Toba. Kisah ini mengingatkan kita untuk menepati janji.'
        ],
        moral: 'Janji yang baik harus ditepati.',
        questions: [
            { q: 'Ikan yang ditangkap Toba berwarna...', options: ['merah', 'emas', 'biru', 'hitam'], correct: 1, exp: 'Ikan itu berwarna emas.' },
            { q: 'Akibat Toba melanggar janji adalah...', options: ['ia menjadi raja', 'terbentuknya Danau Toba', 'ikan kembali emas', 'hutan hilang'], correct: 1, exp: 'Hujan dan perubahan itu membentuk Danau Toba.' }
        ]
    },
    {
        id: 'cindelaras',
        title: 'Cindelaras dan Ayam Sakti',
        region: 'Jawa Timur',
        emoji: '🐓',
        age: 'Fase C',
        paragraphs: [
            'Cindelaras hidup di hutan bersama ibunya. Ia memelihara ayam jantan yang suaranya sangat merdu.',
            'Saat ayam itu berkokok, namanya disebut. Raja penasaran dan mengadakan sayembara. Cindelaras berhasil membuktikan kebenaran.',
            'Raja akhirnya menyadari kesalahannya. Cindelaras dan ibunya kembali ke istana dan hidup dengan adil.'
        ],
        moral: 'Kejujuran akan membawa kebaikan pada akhirnya.',
        questions: [
            { q: 'Hewan peliharaan Cindelaras adalah...', options: ['ayam jantan', 'kucing', 'kambing', 'burung'], correct: 0, exp: 'Cindelaras memelihara ayam jantan.' },
            { q: 'Nilai yang ditunjukkan Cindelaras adalah...', options: ['jujur dan berani', 'sombong', 'malas', 'curang'], correct: 0, exp: 'Cindelaras berani membuktikan kebenaran.' }
        ]
    }
];

const LESSON_PACKS = [
    {
        id: 'pack-mtk-a',
        title: 'Petualangan Angka 1–100',
        subject: 'mtk',
        phase: 'faseA',
        topic: 'Mengenal bilangan, nilai tempat, dan operasi dasar',
        cp: 'Peserta didik memahami bilangan cacah sampai 100 dan dapat melakukan penjumlahan serta pengurangan sederhana.',
        tp: [
            'Membaca dan menulis bilangan 1–100.',
            'Menentukan nilai tempat puluhan dan satuan.',
            'Menyelesaikan penjumlahan dan pengurangan dalam konteks sehari-hari.'
        ],
        steps: [
            { title: 'Pembuka (5 menit)', detail: 'Guru menyapa siswa, mengajak berhitung benda di kelas, dan menyampaikan tujuan belajar.' },
            { title: 'Eksplorasi (15 menit)', detail: 'Siswa mengelompokkan benda menjadi puluhan dan satuan. Guru memberi contoh seperti 35 = 3 puluhan + 5 satuan.' },
            { title: 'Latihan (15 menit)', detail: 'Siswa mengerjakan 5 soal kuis di Ruang Belajar Abah, lalu membahas jawaban bersama.' },
            { title: 'Refleksi (5 menit)', detail: 'Siswa menuliskan satu hal yang dipelajari dan satu hal yang masih sulit.' }
        ],
        assessment: 'Kuis 10 soal pilihan ganda dan observasi keaktifan siswa saat berhitung.',
        rubric: ['Sangat baik: 90–100, semua konsep tepat.', 'Baik: 80–89, hampir semua tepat.', 'Cukup: 60–79, masih perlu latihan.', 'Perlu bimbingan: <60, ulangi konsep dasar.']
    },
    {
        id: 'pack-ipas-b',
        title: 'Rantai Makanan di Sekitar Kita',
        subject: 'ipas',
        phase: 'faseB',
        topic: 'Makhluk hidup, rantai makanan, dan keseimbangan ekosistem',
        cp: 'Peserta didik menganalisis hubungan antarmakhluk hidup dan lingkungannya.',
        tp: [
            'Mengidentifikasi produsen, konsumen, dan pengurai.',
            'Membuat contoh rantai makanan di lingkungan sekitar.',
            'Menjelaskan akibat jika satu bagian rantai makanan hilang.'
        ],
        steps: [
            { title: 'Pembuka (5 menit)', detail: 'Guru menunjukkan gambar sawah dan bertanya: siapa makan siapa?' },
            { title: 'Eksplorasi (15 menit)', detail: 'Siswa membuat kartu makhluk hidup dan menyusun rantai makanan secara berkelompok.' },
            { title: 'Diskusi (10 menit)', detail: 'Kelompok mempresentasikan rantai makanan dan membahas apa yang terjadi jika ular hilang.' },
            { title: 'Refleksi (10 menit)', detail: 'Siswa mengerjakan kuis IPAS dan menuliskan satu tindakan menjaga ekosistem.' }
        ],
        assessment: 'Produk kartu rantai makanan, presentasi kelompok, dan kuis 10 soal.',
        rubric: ['Sangat baik: rantai makanan lengkap dan penjelasan tepat.', 'Baik: rantai makanan benar, penjelasan cukup.', 'Cukup: masih ada urutan yang keliru.', 'Perlu bimbingan: perlu pendampingan menyusun ulang.']
    },
    {
        id: 'pack-indo-c',
        title: 'Menulis Cerita Inspiratif',
        subject: 'indo',
        phase: 'faseC',
        topic: 'Struktur teks naratif dan penggunaan kalimat efektif',
        cp: 'Peserta didik mampu menulis teks naratif sederhana dengan struktur dan bahasa yang runtut.',
        tp: [
            'Mengenali struktur orientasi, komplikasi, dan resolusi.',
            'Menulis cerita pendek berdasarkan pengalaman atau cerita rakyat.',
            'Menggunakan kalimat efektif dan tanda baca yang tepat.'
        ],
        steps: [
            { title: 'Pembuka (5 menit)', detail: 'Guru membacakan cerita pendek dan bertanya tentang bagian awal, masalah, dan akhir cerita.' },
            { title: 'Eksplorasi (15 menit)', detail: 'Siswa memilih ide cerita dari pengalaman pribadi atau cerita rakyat Indonesia.' },
            { title: 'Menulis (20 menit)', detail: 'Siswa menyusun kerangka lalu menulis cerita 3–5 paragraf. Guru berkeliling memberi umpan balik.' },
            { title: 'Berbagi (10 menit)', detail: 'Beberapa siswa membacakan ceritanya. Teman memberi apresiasi dan saran.' }
        ],
        assessment: 'Draf cerita, rubrik penilaian tulisan, dan refleksi diri.',
        rubric: ['Sangat baik: struktur lengkap, bahasa hidup, tanda baca tepat.', 'Baik: struktur lengkap, sedikit kesalahan.', 'Cukup: struktur belum lengkap.', 'Perlu bimbingan: perlu bantuan menyusun kerangka.']
    },
    {
        id: 'pack-inggris-b',
        title: 'My Daily Activities',
        subject: 'inggris',
        phase: 'faseB',
        topic: 'Simple present tense untuk rutinitas harian',
        cp: 'Peserta didik mampu memperkenalkan rutinitas harian menggunakan kosakata dan tata bahasa sederhana.',
        tp: [
            'Menyebutkan aktivitas harian dalam bahasa Inggris.',
            'Menggunakan simple present tense dengan benar.',
            'Membuat kalimat tentang rutinitas sendiri.'
        ],
        steps: [
            { title: 'Warm-up (5 minutes)', detail: 'Teacher asks: What do you do in the morning? Students answer with pictures.' },
            { title: 'Explore (15 minutes)', detail: 'Students learn vocabulary: wake up, brush my teeth, go to school, study, sleep.' },
            { title: 'Practice (15 minutes)', detail: 'Students write five sentences about their daily routine and practice with a partner.' },
            { title: 'Reflection (5 minutes)', detail: 'Students read one sentence aloud and teacher gives feedback.' }
        ],
        assessment: 'Written sentences, speaking practice, and a 10-question quiz.',
        rubric: ['Excellent: correct grammar and varied vocabulary.', 'Good: minor errors, clear meaning.', 'Fair: some errors but understandable.', 'Needs support: requires sentence frames.']
    }
];

const WORD_SCRAMBLE_WORDS = [
    { word: 'MATEMATIKA', clue: 'Mata pelajaran tentang angka dan hitungan.', phase: 'faseB' },
    { word: 'BILANGAN', clue: 'Sesuatu yang digunakan untuk menghitung.', phase: 'faseA' },
    { word: 'PECAHAN', clue: 'Bilangan yang ditulis seperti 1/2.', phase: 'faseC' },
    { word: 'TUMBUHAN', clue: 'Makhluk hidup yang membuat makanannya sendiri.', phase: 'faseB' },
    { word: 'EKOSISTEM', clue: 'Hubungan makhluk hidup dengan lingkungannya.', phase: 'faseC' },
    { word: 'GRAVITASI', clue: 'Gaya yang membuat benda jatuh ke bawah.', phase: 'faseC' },
    { word: 'KALIMAT', clue: 'Kumpulan kata yang memiliki makna lengkap.', phase: 'faseA' },
    { word: 'PARAGRAF', clue: 'Kumpulan kalimat yang membahas satu ide.', phase: 'faseB' },
    { word: 'PUISI', clue: 'Karya sastra dengan baris dan rima.', phase: 'faseC' },
    { word: 'CANDI', clue: 'Bangunan bersejarah dari batu.', phase: 'faseB' },
    { word: 'DANAU', clue: 'Perairan luas yang dikelilingi daratan.', phase: 'faseA' },
    { word: 'PULAU', clue: 'Daratan yang dikelilingi air.', phase: 'faseB' },
    { word: 'CUACA', clue: 'Keadaan udara pada suatu tempat dan waktu.', phase: 'faseB' },
    { word: 'ENERGI', clue: 'Sesuatu yang membuat benda dapat bergerak.', phase: 'faseC' },
    { word: 'MAGNET', clue: 'Benda yang dapat menarik besi.', phase: 'faseC' }
];

const MATCH_SETS = [
    {
        id: 'match-mtk-a',
        subject: 'mtk',
        phase: 'faseA',
        title: 'Pasangkan Bilangan dan Nilai',
        pairs: [
            { term: '10 + 5', definition: '15' },
            { term: '20 - 4', definition: '16' },
            { term: '3 × 4', definition: '12' },
            { term: '8 + 7', definition: '15' },
            { term: '18 - 6', definition: '12' }
        ]
    },
    {
        id: 'match-ipas-b',
        subject: 'ipas',
        phase: 'faseB',
        title: 'Pasangkan Makhluk Hidup dan Perannya',
        pairs: [
            { term: 'Padi', definition: 'Produsen' },
            { term: 'Tikus', definition: 'Konsumen pertama' },
            { term: 'Ular', definition: 'Konsumen kedua' },
            { term: 'Jamur', definition: 'Pengurai' },
            { term: 'Matahari', definition: 'Sumber energi' }
        ]
    },
    {
        id: 'match-indo-c',
        subject: 'indo',
        phase: 'faseC',
        title: 'Pasangkan Istilah dan Artinya',
        pairs: [
            { term: 'Orientasi', definition: 'Bagian pengenalan cerita' },
            { term: 'Komplikasi', definition: 'Bagian munculnya masalah' },
            { term: 'Resolusi', definition: 'Bagian penyelesaian masalah' },
            { term: 'Tokoh', definition: 'Pelaku dalam cerita' },
            { term: 'Latar', definition: 'Tempat dan waktu cerita' }
        ]
    },
    {
        id: 'match-inggris-b',
        subject: 'inggris',
        phase: 'faseB',
        title: 'Match the Words',
        pairs: [
            { term: 'Wake up', definition: 'Bangun tidur' },
            { term: 'Brush teeth', definition: 'Menyikat gigi' },
            { term: 'Go to school', definition: 'Pergi ke sekolah' },
            { term: 'Study', definition: 'Belajar' },
            { term: 'Sleep', definition: 'Tidur' }
        ]
    }
];

const PARENT_OFFLINE_ACTIVITIES = [
    'Ajak anak berbelanja dan minta ia menghitung total harga serta kembalian.',
    'Bacakan cerita rakyat sebelum tidur, lalu minta anak menceritakan ulang dengan bahasa sendiri.',
    'Hitung jumlah langkah dari rumah ke gerbang sekolah dan bandingkan setiap hari.',
    'Ajak anak menanam kacang hijau di kapas dan catat pertumbuhannya selama seminggu.',
    'Buat permainan tebak kata dengan benda-benda di dapur.',
    'Minta anak membantu menimbang bahan masakan dan menuliskan hasilnya.',
    'Ajak anak menggambar peta sederhana lingkungan rumah dan beri nama tempatnya.'
];

const I18N_DICTIONARY = {
    id: {
        'nav.beranda': 'Beranda',
        'nav.materi': 'Materi',
        'nav.kuis': 'Kuis / Ujian',
        'nav.bermain': 'Bermain',
        'nav.petualangan': 'Petualangan',
        'nav.ai': 'Tanya AI Ninna',
        'nav.modul': 'Modul Ajar AI',
        'nav.bank': 'Bank Soal Guru',
        'nav.kelas': 'Kelas',
        'nav.rapor': 'Diagnosis & Rapor',
        'nav.orangtua': 'Orang Tua',
        'hero.badge': 'Selamat Datang Pendidik & Siswa!',
        'hero.title': 'Halo Anak Pintar! 👋',
        'hero.desc': 'Platform pembelajaran interaktif SD Kurikulum Merdeka. Dilengkapi kuis, ujian berwaktu, modul ajar AI, bank soal guru, cetak LKPD, dan analisis diagnosis belajar! 🚀',
        'hero.start': 'Mulai Kuis / Ujian',
        'hero.modul': 'Buat Modul Ajar',
        'common.learning': 'Belajar',
        'common.play': 'Main',
        'common.teacher': 'Guru',
        'common.parent': 'Orang Tua'
    },
    en: {
        'nav.beranda': 'Home',
        'nav.materi': 'Materials',
        'nav.kuis': 'Quiz / Exam',
        'nav.bermain': 'Play',
        'nav.petualangan': 'Adventure',
        'nav.ai': 'Ask Ninna AI',
        'nav.modul': 'AI Lesson Plan',
        'nav.bank': 'Question Bank',
        'nav.kelas': 'Classroom',
        'nav.rapor': 'Report',
        'nav.orangtua': 'Parents',
        'hero.badge': 'Welcome Teachers & Students!',
        'hero.title': 'Hello Smart Kids! 👋',
        'hero.desc': 'An interactive elementary learning platform based on Kurikulum Merdeka. Featuring quizzes, timed exams, AI lesson plans, a teacher question bank, printable worksheets, and learning diagnostics! 🚀',
        'hero.start': 'Start Quiz / Exam',
        'hero.modul': 'Create Lesson Plan',
        'common.learning': 'Learn',
        'common.play': 'Play',
        'common.teacher': 'Teacher',
        'common.parent': 'Parent'
    }
};
