// Database Kurikulum & Bank Soal Bawaan Lengkap (Fase A, B, C)
const KURIKULUM_DATA = {
    faseA: {
        mtk: {
            title: "Matematika Fase A (Kelas 1-2)",
            topics: [
                { id: "a_mtk_1", name: "Mengenal Bilangan & Nilai Tempat", content: "Bilangan 1 sampai 100 digunakan untuk menghitung benda. Contoh: Angka 25 dibaca 'dua puluh lima'. Angka 2 sebagai puluhan (20) dan angka 5 sebagai satuan (5)." },
                { id: "a_mtk_2", name: "Penjumlahan & Pengurangan Sederhana", content: "Penjumlahan membuat jumlah benda bertambah. Pengurangan membuat jumlah benda berkurang. Contoh: 8 + 6 = 14, dan 15 - 7 = 8." }
            ],
            quiz: [
                { q: "Berapakah hasil dari 9 + 7?", options: ["14", "15", "16", "17"], correct: 2, exp: "9 ditambah 7 sama dengan 16." },
                { q: "Ayah membeli 18 buah jeruk. Dimakan adik 6 buah. Sisa berapa jeruk Ayah?", options: ["10", "11", "12", "13"], correct: 2, exp: "18 dikurangi 6 adalah 12 jeruk." },
                { q: "Pada angka 47, angka yang menempati nilai tempat puluhan adalah...", options: ["7", "4", "40", "47"], correct: 1, exp: "Angka 4 berada di depan sehingga bernilai 4 puluhan." }
            ]
        },
        ipas: {
            title: "IPAS Fase A (Kelas 1-2)",
            topics: [
                { id: "a_ipas_1", name: "Panca Indra & Fungsinya", content: "Manusia memiliki 5 indra utama: Mata (melihat), Telinga (mendengar), Hidung (membaui), Lidah (merasakan makanan), dan Kulit (meraba rasa halus/kasar)." }
            ],
            quiz: [
                { q: "Anggota tubuh yang berfungsi untuk mendengarkan suara adalah...", options: ["Mata", "Telinga", "Hidung", "Lidah"], correct: 1, exp: "Telinga adalah indra pendengaran." },
                { q: "Bunda mencium aroma hidangan yang harum menggunakan...", options: ["Kulit", "Mata", "Hidung", "Lidah"], correct: 2, exp: "Hidung berfungsi sebagai indra penciuman." }
            ]
        },
        indo: {
            title: "Bahasa Indonesia Fase A (Kelas 1-2)",
            topics: [
                { id: "a_indo_1", name: "Membaca Suku Kata & Kalimat", content: "Kata terbentuk dari gabungan suku kata. Contoh: 'Se-ko-lah' (3 suku kata). Kalimat tanya selalu diakhiri tanda tanya (?)." }
            ],
            quiz: [
                { q: "Kata 'B-E-L-A-J-A-R' jika digabungkan dibaca...", options: ["Bermain", "Belajar", "Bekerja", "Berjalan"], correct: 1, exp: "B-E-L-A-J-A-R dibaca 'Belajar'." },
                { q: "Kata tanya yang digunakan untuk menanyakan tempat adalah...", options: ["Siapa", "Di mana", "Berapa", "Kapan"], correct: 1, exp: "'Di mana' digunakan untuk menanyakan lokasi atau tempat." }
            ]
        },
        inggris: {
            title: "Bahasa Inggris Fase A (Kelas 1-2)",
            topics: [
                { id: "a_ing_1", name: "Greetings & Basic Vocabulary", content: "Greetings: Good Morning (Selamat Pagi), Good Afternoon (Selamat Siang). Colors: Red (Merah), Blue (Biru), Yellow (Kuning)." }
            ],
            quiz: [
                { q: "Bahasa Inggris dari warna 'Kuning' adalah...", options: ["Red", "Green", "Blue", "Yellow"], correct: 3, exp: "Kuning dalam bahasa Inggris adalah 'Yellow'." },
                { q: "Apa arti dari ungkapan 'Good Morning'?", options: ["Selamat Malam", "Selamat Pagi", "Selamat Sore", "Selamat Tinggal"], correct: 1, exp: "'Good Morning' artinya Selamat Pagi." }
            ]
        }
    },
    faseB: {
        mtk: {
            title: "Matematika Fase B (Kelas 3-4)",
            topics: [
                { id: "b_mtk_1", name: "Perkalian & Pembagian Dasar", content: "Perkalian adalah penjumlahan berulang. Contoh: 4 x 5 = 5 + 5 + 5 + 5 = 20. Pembagian adalah kebalikan dari perkalian." }
            ],
            quiz: [
                { q: "Berapakah hasil dari 7 x 8?", options: ["48", "54", "56", "64"], correct: 2, exp: "7 dikali 8 sama dengan 56." },
                { q: "Ibu memiliki 36 kue yang dibagi rata kepada 4 anaknya. Berapa kue yang didapat setiap anak?", options: ["8", "9", "10", "12"], correct: 1, exp: "36 dibagi 4 hasilnya adalah 9 kue." }
            ]
        },
        ipas: {
            title: "IPAS Fase B (Kelas 3-4)",
            topics: [
                { id: "b_ipas_1", name: "Wujud Benda & Perubahannya", content: "Terdapat 3 wujud benda: Padat, Cair, dan Gas. Mencair = padat menjadi cair. Membeku = cair menjadi padat. Menguap = cair menjadi gas." }
            ],
            quiz: [
                { q: "Es batu yang diletakkan di tempat terbuka berubah menjadi air. Proses ini disebut...", options: ["Membeku", "Mencair", "Menguap", "Mengembun"], correct: 1, exp: "Mencair adalah perubahan wujud dari benda padat menjadi cair." },
                { q: "Benda yang bentuknya selalu berubah mengikuti bentuk wadahnya adalah benda...", options: ["Padat", "Cair", "Keras", "Tetap"], correct: 1, exp: "Benda cair menyesuaikan bentuk tempat atau wadahnya." }
            ]
        },
        indo: {
            title: "Bahasa Indonesia Fase B (Kelas 3-4)",
            topics: [
                { id: "b_indo_1", name: "Ide Pokok & Paragraf", content: "Ide pokok adalah gagasan utama dalam sebuah paragraf. Kalimat utama biasanya terletak di awal atau akhir paragraf." }
            ],
            quiz: [
                { q: "Gagasan utama yang menjadi inti pembahasan dalam suatu paragraf disebut...", options: ["Kalimat penjelas", "Ide pokok", "Judul", "Kata kunci"], correct: 1, exp: "Ide pokok merupakan gagasan utama dalam paragraf." }
            ]
        },
        inggris: {
            title: "Bahasa Inggris Fase B (Kelas 3-4)",
            topics: [
                { id: "b_ing_1", name: "Daily Activities & Time", content: "Time: 07:00 (Seven o'clock). Activities: Eat breakfast (Makan pagi), Go to school (Pergi ke sekolah)." }
            ],
            quiz: [
                { q: "Bahasa Inggris dari 'Pergi ke sekolah' adalah...", options: ["Go home", "Go to school", "Play games", "Sleep early"], correct: 1, exp: "'Go to school' berarti pergi ke sekolah." }
            ]
        }
    },
    faseC: {
        mtk: {
            title: "Matematika Fase C (Kelas 5-6)",
            topics: [
                { id: "c_mtk_1", name: "Pecahan, Desimal, & Persen", content: "Pecahan dapat diubah menjadi bentuk desimal atau persen. Contoh: 1/2 = 0,5 = 50%. 3/4 = 0,75 = 75%." }
            ],
            quiz: [
                { q: "Bentuk desimal dari pecahan 3/5 adalah...", options: ["0,3", "0,5", "0,6", "0,75"], correct: 2, exp: "3 dibagi 5 sama dengan 0,6." },
                { q: "Berapakah hasil penjumlahan dari 1/4 + 1/2?", options: ["2/4", "3/4", "2/6", "1/8"], correct: 1, exp: "1/4 + 2/4 = 3/4." }
            ]
        },
        ipas: {
            title: "IPAS Fase C (Kelas 5-6)",
            topics: [
                { id: "c_ipas_1", name: "Sistem Organ Manusia & Ekosistem", content: "Organ pencernaan meliputi: Mulut -> Kerongkongan -> Lambung -> Usus Halus -> Usus Besar. Ekosistem adalah hubungan timbal balik antara makhluk hidup dengan lingkungannya." }
            ],
            quiz: [
                { q: "Organ pencernaan manusia yang berfungsi mencerna makanan secara kimiawi dengan bantuan asam lambung adalah...", options: ["Mulut", "Lambung", "Usus Besar", "Kerongkongan"], correct: 1, exp: "Lambung menghasilkan asam untuk mencerna makanan secara kimiawi." }
            ]
        },
        indo: {
            title: "Bahasa Indonesia Fase C (Kelas 5-6)",
            topics: [
                { id: "c_indo_1", name: "Teks Eksplanasi & Kalimat Efektif", content: "Teks eksplanasi menjelaskan proses terjadinya suatu fenomena alam atau sosial. Kalimat efektif adalah kalimat yang hemat kata dan jelas maknanya." }
            ],
            quiz: [
                { q: "Teks yang berisi penjelasan mengenai proses terjadinya fenomena alam atau sosial disebut teks...", options: ["Narasi", "Eksplanasi", "Deskripsi", "Prosedur"], correct: 1, exp: "Teks eksplanasi menjelaskan alasan dan proses fenomena terjadi." }
            ]
        },
        inggris: {
            title: "Bahasa Inggris Fase C (Kelas 5-6)",
            topics: [
                { id: "c_ing_1", name: "Comparative & Simple Past Tense", content: "Comparisons: Taller (Lebih tinggi), Bigger (Lebih besar). Past tense: Walked, Played, Ate." }
            ],
            quiz: [
                { q: "An elephant is ... than a cat.", options: ["smaller", "bigger", "shorter", "thinner"], correct: 1, exp: "Gajah lebih besar (bigger) daripada kucing." }
            ]
        }
    }
};