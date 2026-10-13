// Database Kurikulum & Bank Soal Lengkap Pembelajaran SD (Fase A, B, C)
const KURIKULUM_DATA = {
    // ==========================================
    // FASE A (KELAS 1 - 2 SD)
    // ==========================================
    faseA: {
        mtk: {
            title: "Matematika Fase A (Kelas 1-2)",
            topics: [
                { id: "a_mtk_1", name: "Mengenal Bilangan 1-100 & Nilai Tempat", content: "Bilangan 1 sampai 100 digunakan untuk menghitung benda. Setiap angka memiliki nilai tempat: Puluhan dan Satuan. Contoh: Pada angka 35, 3 adalah puluhan (30) dan 5 adalah satuan." },
                { id: "a_mtk_2", name: "Penjumlahan & Pengurangan Dasar", content: "Penjumlahan menggabungkan dua kelompok benda sehingga nilainya bertambah. Pengurangan mengambil sebagian benda sehingga nilainya berkurang." },
                { id: "a_mtk_3", name: "Mengenal Bangun Datar & Pola Gambar", content: "Bangun datar di sekitar kita antara lain: Segitiga (3 sisi), Persegi (4 sisi sama panjang), Persegi Panjang, dan Lingkaran (1 sisi melengkung)." }
            ],
            quiz: [
                { q: "Berapakah hasil dari 14 + 8?", options: ["20", "21", "22", "23"], correct: 2, exp: "14 ditambah 8 sama dengan 22." },
                { q: "Ayah membeli 25 buah jeruk. Dimakan adik 7 buah. Berapa sisa jeruk Ayah?", options: ["17", "18", "19", "20"], correct: 1, exp: "25 dikurangi 7 adalah 18 jeruk." },
                { q: "Pada angka 68, angka yang menempati nilai tempat puluhan adalah...", options: ["8", "6", "60", "80"], correct: 1, exp: "Angka 6 berada di posisi depan sebagai puluhan (bernilai 60)." },
                { q: "Bangun datar yang memiliki 3 buah sisi dan 3 sudut adalah...", options: ["Persegi", "Lingkaran", "Segitiga", "Trapesium"], correct: 2, exp: "Segitiga memiliki 3 sisi dan 3 titik sudut." },
                { q: "Bunda memiliki 12 telur. Membeli lagi 15 telur. Jumlah seluruh telur Bunda adalah...", options: ["25", "26", "27", "28"], correct: 2, exp: "12 + 15 = 27 telur." }
            ]
        },
        ipas: {
            title: "IPAS Fase A (Kelas 1-2)",
            topics: [
                { id: "a_ipas_1", name: "Panca Indra & Merawat Tubuh", content: "Manusia memiliki 5 indra: Mata (melihat), Telinga (mendengar), Hidung (membaui), Lidah (merasakan makanan), dan Kulit (meraba rasa halus/kasar)." },
                { id: "a_ipas_2", name: "Lingkungan Rumah & Sekolah", content: "Lingkungan yang bersih membuat tubuh sehat. Kita wajib menjaga kebersihan rumah dan sekolah dengan membuang sampah pada tempatnya." }
            ],
            quiz: [
                { q: "Anggota tubuh yang berfungsi sebagai indra pendengaran adalah...", options: ["Mata", "Telinga", "Hidung", "Lidah"], correct: 1, exp: "Telinga digunakan untuk mendengarkan suara." },
                { q: "Bunda mencium aroma masakan yang harum menggunakan indra...", options: ["Kulit", "Mata", "Hidung", "Lidah"], correct: 2, exp: "Hidung berfungsi sebagai indra penciuman." },
                { q: "Agar gigi kita tetap bersih dan sehat, kita harus menggosok gigi sebanyak...", options: ["Seminggu sekali", "Minimal 2 kali sehari", "Saat mandi sore saja", "Sebulan sekali"], correct: 1, exp: "Menggosok gigi minimal 2 kali sehari menjaga kesehatan gigi dari kuman." },
                { q: "Benda langit yang memancarkan cahaya terang pada siang hari adalah...", options: ["Bintang", "Bulan", "Awan", "Matahari"], correct: 3, exp: "Matahari terbit di pagi hari dan menyinari bumi di siang hari." },
                { q: "Sikap yang baik ketika melihat sampah berserakan di halaman rumah adalah...", options: ["Membiarkannya", "Melihatnya saja", "Membuangnya ke tempat sampah", "Menendangnya"], correct: 2, exp: "Menjaga kebersihan adalah tanggung jawab bersama." }
            ]
        },
        indo: {
            title: "Bahasa Indonesia Fase A (Kelas 1-2)",
            topics: [
                { id: "a_indo_1", name: "Suku Kata & Membaca Nyaring", content: "Membaca suku kata membantu kita lancar membaca. Contoh: Se-ko-lah (3 suku kata), Bintang (2 suku kata)." },
                { id: "a_indo_2", name: "Ungkapan Sederhana & Tanda Baca", content: "Kalimat ajakan menggunakan kata 'Ayo' atau 'Mari'. Kalimat tanya diakhiri dengan tanda tanya (?)." }
            ],
            quiz: [
                { q: "Kata 'B-E-L-A-J-A-R' jika digabungkan dibaca...", options: ["Bermain", "Belajar", "Bekerja", "Berjalan"], correct: 1, exp: "Huruf B-E-L-A-J-A-R membentuk kata 'Belajar'." },
                { q: "Kata tanya yang digunakan untuk menanyakan nama seseorang adalah...", options: ["Di mana", "Siapa", "Berapa", "Kapan"], correct: 1, exp: "'Siapa' digunakan untuk menanyakan nama atau identitas orang." },
                { q: "Contoh kalimat ajakan yang benar di bawah ini adalah...", options: ["Siapa namamu?", "Ayo kita menjaga kebersihan kelas!", "Tolong ambilkan buku itu.", "Aduh, kakiku sakit!"], correct: 1, exp: "Kalimat ajakan diawali dengan kata 'Ayo' atau 'Mari'." },
                { q: "Kata 'P-E-M-A-N-D-A-N-G-A-N' memiliki berapa suku kata?", options: ["3 suku kata", "4 suku kata", "5 suku kata", "2 suku kata"], correct: 1, exp: "Pe-man-da-ngan terdiri dari 4 suku kata." },
                { q: "Tanda baca yang digunakan pada akhir kalimat berita atau pernyataan adalah...", options: ["Tanda tanya (?)", "Tanda seru (!)", "Tanda titik (.)", "Tanda koma (,)"], correct: 2, exp: "Setiap akhir kalimat berita diakhiri dengan tanda titik." }
            ]
        },
        inggris: {
            title: "Bahasa Inggris Fase A (Kelas 1-2)",
            topics: [
                { id: "a_ing_1", name: "Greetings, Colors & Numbers", content: "Greetings: Good Morning (Selamat Pagi), Good Afternoon (Selamat Siang). Colors: Red (Merah), Blue (Biru), Yellow (Kuning). Numbers: One (1) to Ten (10)." }
            ],
            quiz: [
                { q: "Bahasa Inggris dari warna 'Kuning' adalah...", options: ["Red", "Green", "Blue", "Yellow"], correct: 3, exp: "Kuning dalam bahasa Inggris adalah 'Yellow'." },
                { q: "Apa arti dari ungkapan 'Good Morning'?", options: ["Selamat Malam", "Selamat Pagi", "Selamat Sore", "Selamat Tinggal"], correct: 1, exp: "'Good Morning' berarti Selamat Pagi." },
                { q: "Bahasa Inggris dari angka '7' adalah...", options: ["Five", "Six", "Seven", "Eight"], correct: 2, exp: "Angka 7 adalah 'Seven'." },
                { q: "Hewan 'Kucing' dalam bahasa Inggris disebut...", options: ["Dog", "Cat", "Bird", "Fish"], correct: 1, exp: "Kucing adalah 'Cat'." },
                { q: "Jika kita ingin menguraikan warna apel yang berwarna merah, kita menyebutnya...", options: ["Red Apple", "Green Apple", "Yellow Apple", "Blue Apple"], correct: 0, exp: "Merah = Red, Apple = Apel." }
            ]
        }
    },

    // ==========================================
    // FASE B (KELAS 3 - 4 SD)
    // ==========================================
    faseB: {
        mtk: {
            title: "Matematika Fase B (Kelas 3-4)",
            topics: [
                { id: "b_mtk_1", name: "Perkalian & Pembagian Operasi Hitung", content: "Perkalian adalah penjumlahan berulang (Contoh: 4 x 6 = 6 + 6 + 6 + 6 = 24). Pembagian adalah pengurangan berulang hingga habis." },
                { id: "b_mtk_2", name: "Pecahan Senilai & Bangun Datar", content: "Pecahan menyatakan bagian dari keseluruhan. Keliling persegi = 4 x sisi. Luas persegi panjang = panjang x lebar." }
            ],
            quiz: [
                { q: "Berapakah hasil dari 8 x 7?", options: ["48", "54", "56", "64"], correct: 2, exp: "8 dikali 7 sama dengan 56." },
                { q: "Ayah membagikan 45 kue secara merata kepada 5 anaknya. Berapa kue yang didapat setiap anak?", options: ["7", "8", "9", "10"], correct: 2, exp: "45 dibagi 5 adalah 9 kue." },
                { q: "Sebuah persegi memiliki panjang sisi 6 cm. Berapakah keliling persegi tersebut?", options: ["12 cm", "18 cm", "24 cm", "36 cm"], correct: 2, exp: "Keliling persegi = 4 x sisi = 4 x 6 = 24 cm." },
                { q: "Bentuk pecahan yang senilai dengan 1/2 adalah...", options: ["2/4", "2/3", "3/5", "1/4"], correct: 0, exp: "1/2 dikali 2/2 sama dengan 2/4." },
                { q: "Luas persegi panjang dengan panjang 10 cm dan lebar 5 cm adalah...", options: ["15 cm²", "30 cm²", "50 cm²", "100 cm²"], correct: 2, exp: "Luas = panjang x lebar = 10 x 5 = 50 cm²." }
            ]
        },
        ipas: {
            title: "IPAS Fase B (Kelas 3-4)",
            topics: [
                { id: "b_ipas_1", name: "Wujud Benda & Perubahannya", content: "Benda padat, cair, dan gas. Perubahan wujud: Mencair (padat -> cair), Membeku (cair -> padat), Menguap (cair -> gas)." },
                { id: "b_ipas_2", name: "Daur Hidup Hewan & Rantai Makanan", content: "Daur hidup adalah tahap pertumbuhan hewan. Rantai makanan menunjukkan hubungan makan dan dimakan antar makhluk hidup." }
            ],
            quiz: [
                { q: "Es batu yang diletakkan di tempat terbuka berubah menjadi air. Perubahan ini disebut...", options: ["Membeku", "Mencair", "Menguap", "Mengembun"], correct: 1, exp: "Mencair adalah perubahan dari padat menjadi cair." },
                { q: "Tumbuhan hijau dalam rantai makanan berperan sebagai...", options: ["Konsumen I", "Konsumen II", "Produsen", "Pengurai"], correct: 2, exp: "Tumbuhan menghasilkan makanan sendiri melalui fotosintesis sehingga disebut produsen." },
                { q: "Hewan yang mengalami metamorfosis sempurna dalam daur hidupnya adalah...", options: ["Ayam", "Kupu-kupu", "Kucing", "Kambing"], correct: 1, exp: "Kupu-kupu mengalami tahap telur - ulat - kepompong - kupu-kupu dewasa." },
                { q: "Bagian tumbuhan yang berfungsi menyerap air dan zat hara dari dalam tanah adalah...", options: ["Daun", "Batang", "Bunga", "Akar"], correct: 3, exp: "Akar berada di dalam tanah untuk menyerap air dan nutrisi." },
                { q: "Perubahan wujud dari zat cair menjadi zat gas saat air dimasak sampai mendidih disebut...", options: ["Menguap", "Mencair", "Membeku", "Menyublim"], correct: 0, exp: "Menguap adalah perubahan dari cair menjadi gas." }
            ]
        },
        indo: {
            title: "Bahasa Indonesia Fase B (Kelas 3-4)",
            topics: [
                { id: "b_indo_1", name: "Ide Pokok Paragraf & Teks Petunjuk", content: "Ide pokok adalah gagasan utama yang menjadi inti paragraf. Teks petunjuk berisi langkah-langkah melakukan sesuatu secara runtut." }
            ],
            quiz: [
                { q: "Inti atau gagasan utama yang dibahas dalam suatu paragraf disebut...", options: ["Kalimat penjelas", "Ide pokok", "Judul", "Kesimpulan"], correct: 1, exp: "Ide pokok merupakan inti dari keseluruhan isi paragraf." },
                { q: "Kata berimbuhan 'ber-' pada kata 'berjalan' memiliki arti...", options: ["Saling", "Melakukan gerakan/tindakan", "Membuat", "Menjadi"], correct: 1, exp: "Imbuhan ber- menyatakan melakukan kegiatan/aktivitas." },
                { q: "Teks yang memberikan panduan atau langkah-langkah membuat sesuatu disebut...", options: ["Teks Narasi", "Teks Petunjuk/Prosedur", "Teks Puisi", "Teks Dongeng"], correct: 1, exp: "Teks petunjuk memuat petunjuk penggunaan atau pembuatan secara runtut." },
                { q: "Persamaan kata (sinonim) dari kata 'Pintar' adalah...", options: ["Rajin", "Pandai", "Tekun", "Cermat"], correct: 1, exp: "Pintar dan pandai memiliki makna yang sama." },
                { q: "Lawan kata (antonim) dari kata 'Hemat' adalah...", options: ["Pelit", "Boros", "Cermat", "Sederhana"], correct: 1, exp: "Lawan kata dari hemat adalah boros." }
            ]
        },
        inggris: {
            title: "Bahasa Inggris Fase B (Kelas 3-4)",
            topics: [
                { id: "b_ing_1", name: "Time, Daily Activities & Places", content: "Expressing time (What time is it?), telling daily routines (eat breakfast, study), and places around school." }
            ],
            quiz: [
                { q: "How do you say 'Jam 07:00 tepat' in English?", options: ["Seven o'clock", "Eight o'clock", "Six o'clock", "Nine o'clock"], correct: 0, exp: "07:00 dinyatakan dengan 'Seven o'clock'." },
                { q: "My father is reading a newspaper in the...", options: ["Bathroom", "Living room", "Kitchen", "Garage"], correct: 1, exp: "Membaca koran biasa dilakukan di ruang tamu (Living room)." },
                { q: "We buy books and stationary in the...", options: ["Canteen", "Library", "Bookstore", "Hospital"], correct: 2, exp: "Toko buku dalam bahasa Inggris adalah 'Bookstore'." },
                { q: "What is the English word for 'Pergi ke sekolah'?", options: ["Go home", "Go to school", "Play football", "Eat lunch"], correct: 1, exp: "Go to school = Pergi ke sekolah." },
                { q: "The day after Monday is...", options: ["Sunday", "Tuesday", "Wednesday", "Friday"], correct: 1, exp: "Hari setelah Senin (Monday) adalah Selasa (Tuesday)." }
            ]
        }
    },

    // ==========================================
    // FASE C (KELAS 5 - 6 SD)
    // ==========================================
    faseC: {
        mtk: {
            title: "Matematika Fase C (Kelas 5-6)",
            topics: [
                { id: "c_mtk_1", name: "Operasi Pecahan, Desimal, & Persen", content: "Mengubah pecahan biasa ke bentuk desimal/persen. Memahami perbandingan, skala peta, dan operasi hitung campuran." },
                { id: "c_mtk_2", name: "Volume Bangun Ruang (Kubus & Balok)", content: "Volume Kubus = s x s x s. Volume Balok = p x l x t. Unit satuan volume menggunakan kubik (cm³, m³)." }
            ],
            quiz: [
                { q: "Bentuk desimal dari pecahan 3/5 adalah...", options: ["0,3", "0,5", "0,6", "0,75"], correct: 2, exp: "3 dibagi 5 sama dengan 0,6." },
                { q: "Berapakah hasil dari 1/4 + 2/4?", options: ["2/4", "3/4", "3/8", "1/2"], correct: 1, exp: "1/4 + 2/4 = 3/4." },
                { q: "Sebuah kubus memiliki panjang rusuk 5 cm. Volume kubus tersebut adalah...", options: ["25 cm³", "75 cm³", "100 cm³", "125 cm³"], correct: 3, exp: "Volume kubus = 5 x 5 x 5 = 125 cm³." },
                { q: "Bentuk persen (%) dari angka 0,45 adalah...", options: ["4,5%", "45%", "450%", "0,45%"], correct: 1, exp: "0,45 x 100% = 45%." },
                { q: "Jarak pada peta 2 cm. Skala peta 1 : 500.000. Jarak sebenarnya di lapangan adalah...", options: ["1 km", "10 km", "100 km", "5 km"], correct: 1, exp: "Jarak sebenarnya = 2 cm x 500.000 = 1.000.000 cm = 10 km." }
            ]
        },
        ipas: {
            title: "IPAS Fase C (Kelas 5-6)",
            topics: [
                { id: "c_ipas_1", name: "Sistem Organ Manusia & Tata Surya", content: "Sistem Organ: Organ Pencernaan, Pernapasan, dan Peredaran Darah. Tata Surya: Delapan planet yang mengelilingi Matahari." }
            ],
            quiz: [
                { q: "Organ pencernaan manusia yang berfungsi mencerna makanan secara kimiawi dengan bantuan asam lambung adalah...", options: ["Mulut", "Lambung", "Usus Besar", "Kerongkongan"], correct: 1, exp: "Lambung menghasilkan asam lambung untuk melumatkan makanan secara kimiawi." },
                { q: "Planet terdekat dari Matahari dalam sistem Tata Surya adalah...", options: ["Venus", "Bumi", "Merkurius", "Mars"], correct: 2, exp: "Merkurius adalah planet urutan pertama paling dekat dengan Matahari." },
                { q: "Proses pertukaran gas Oksigen (O2) dan Karbondioksida (CO2) terjadi pada paru-paru di bagian...", options: ["Bronkus", "Trakea", "Alveolus", "Hidung"], correct: 2, exp: "Alveolus adalah kantung udara tempat terjadinya pertukaran gas." },
                { q: "Sifat magnet yang benar di bawah ini adalah...", options: ["Kutub senama tarik-menarik", "Kutub tidak senama tolak-menolak", "Kutub tidak senama tarik-menarik", "Magnet menarik semua jenis plastik"], correct: 2, exp: "Kutub magnet yang berbeda (Utara - Selatan) akan saling tarik-menarik." },
                { q: "Peristiwa berputarnya Bumi pada porosnya sendiri disebut...", options: ["Revolusi Bumi", "Rotasi Bumi", "Eklips", "Orbit"], correct: 1, exp: "Rotasi Bumi menyebabkan terjadinya siang dan malam." }
            ]
        },
        indo: {
            title: "Bahasa Indonesia Fase C (Kelas 5-6)",
            topics: [
                { id: "c_indo_1", name: "Teks Eksplanasi & Kalimat Efektif", content: "Teks eksplanasi menjelaskan fenomena alam/sosial secara ilmiah. Kalimat efektif memuat unsur SPOK secara lengkap dan hemat kata." }
            ],
            quiz: [
                { q: "Teks ilmiah yang berisi penjelasan sebab-akibat terjadinya suatu fenomena alam disebut...", options: ["Teks Narasi", "Teks Eksplanasi", "Teks Deskripsi", "Teks Dongeng"], correct: 1, exp: "Teks eksplanasi memuat uraian ilmiah tentang sebab terjadinya fenomena." },
                { q: "Unsur wajib yang memuat syarat kalimat efektif adalah...", options: ["Subjek dan Predikat", "Hanya Keterangan", "Judul saja", "Hanya Objek"], correct: 0, exp: "Kalimat sekurang-kurangnya harus memiliki Subjek (S) dan Predikat (P)." },
                { q: "Kata baku yang tepat di bawah ini adalah...", options: ["Apotik", "Apotek", "Apotekh", "Apotikn"], correct: 1, exp: "Berdasarkan KBBI, kata yang baku adalah 'Apotek'." },
                { q: "Gaya bahasa yang membandingkan benda mati seolah-olah memiliki sifat hidup disebut majas...", options: ["Hiperbola", "Personifikasi", "Metfora", "Ironi"], correct: 1, exp: "Majas personifikasi menginsankan benda mati (contoh: Nyiur melambai-lambai)." },
                { q: "Bagian penutup dalam surat resmi dinamakan...", options: ["Kop Surat", "Salam Pembuka", "Isi Surat", "Salam Penutup"], correct: 3, exp: "Salam penutup diakhiri dengan tanda tangan dan nama terang pengirim." }
            ]
        },
        inggris: {
            title: "Bahasa Inggris Fase C (Kelas 5-6)",
            topics: [
                { id: "c_ing_1", name: "Comparisons & Simple Past Tense", content: "Degree of comparison: Bigger, Tallest, More expensive. Simple Past Tense for completed actions: Played, Went, Studied." }
            ],
            quiz: [
                { q: "An elephant is ... than a cat.", options: ["smaller", "bigger", "shorter", "thinner"], correct: 1, exp: "Comparative degree untuk gajah vs kucing adalah 'bigger' (lebih besar)." },
                { q: "Yesterday, I ... to the museum with my family.", options: ["go", "went", "going", "gone"], correct: 1, exp: "Kejadian masa lalu (Yesterday) menggunakan Past Tense 'went'." },
                { q: "Which animal is the FASTEST in the world?", options: ["Cheetah", "Turtle", "Rabbit", "Snail"], correct: 0, exp: "Cheetah adalah hewan tercepat (fastest)." },
                { q: "My sister is the ... student in her class. She always gets rank 1.", options: ["smartest", "smarter", "small", "slowest"], correct: 0, exp: "Superlative degree untuk paling pintar adalah 'smartest'." },
                { q: "What is the past form (Verb 2) of 'Eat'?", options: ["Eaten", "Ate", "Eating", "Eats"], correct: 1, exp: "Bentuk Verb 2 dari 'Eat' adalah 'Ate'." }
            ]
        }
    }
};