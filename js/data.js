// Database Kurikulum & Bank Soal Bawaan
const KURIKULUM_DATA = {
    faseA: {
        mtk: {
            title: "Matematika Fase A (Kelas 1-2)",
            topics: [
                { id: "a_mtk_1", name: "Mengenal Bilangan 1-50", content: "Bilangan 1 sampai 50 digunakan untuk menghitung benda. Contoh: 12 dibaca 'dua belas'. Angka 1 adalah puluhan, dan 2 adalah satuan." },
                { id: "a_mtk_2", name: "Penjumlahan & Pengurangan Sederhana", content: "Penjumlahan artinya menambahkan (jumlah jadi lebih banyak). Contoh: 5 + 3 = 8. Pengurangan artinya mengambil (jumlah jadi lebih sedikit). Contoh: 10 - 4 = 6." }
            ],
            quiz: [
                { q: "Berapakah hasil dari 7 + 5?", options: ["10", "12", "15", "11"], correct: 1, exp: "7 ditambah 5 sama dengan 12." },
                { q: "Abah punya 15 apel. Dimakan Budi 5 apel. Sisa berapa apel Abah?", options: ["8", "10", "12", "5"], correct: 1, exp: "15 dikurangi 5 adalah 10 apel." }
            ]
        },
        ipas: {
            title: "IPAS Fase A (Kelas 1-2)",
            topics: [
                { id: "a_ipas_1", name: "Panca Indra Manusia", content: "Manusia memiliki 5 indra: Mata (melihat), Telinga (mendengar), Hidung (membaui), Lidah (Mengecap rasa), dan Kulit (meraba)." }
            ],
            quiz: [
                { q: "Anggota tubuh yang digunakan untuk mendengarkan musik adalah...", options: ["Mata", "Hidung", "Telinga", "Lidah"], correct: 2, exp: "Telinga adalah indra pendengaran." }
            ]
        },
        indo: {
            title: "Bahasa Indonesia Fase A (Kelas 1-2)",
            topics: [
                { id: "a_indo_1", name: "Membaca & Menyusun Kata", content: "Setiap kata terdiri dari suku kata. Contoh: Se-ko-lah (3 suku kata). Bintang (2 suku kata)." }
            ],
            quiz: [
                { q: "Kata 'M-A-K-A-N' dibaca menjadi...", options: ["Minum", "Makan", "Main", "Mandi"], correct: 1, exp: "M-A-K-A-N dibaca 'Makan'." }
            ]
        },
        inggris: {
            title: "Bahasa Inggris Fase A (Kelas 1-2)",
            topics: [
                { id: "a_ing_1", name: "Greetings & Numbers", content: "Greetings: Good Morning (Selamat Pagi). Numbers: One (1), Two (2), Three (3), Four (4), Five (5)." }
            ],
            quiz: [
                { q: "Bahasa Inggris dari angka '3' (Tiga) adalah...", options: ["One", "Two", "Three", "Four"], correct: 2, exp: "3 dalam bahasa Inggris adalah 'Three'." }
            ]
        }
    },
    faseB: {
        mtk: {
            title: "Matematika Fase B (Kelas 3-4)",
            topics: [
                { id: "b_mtk_1", name: "Perkalian & Pembagian Dasar", content: "Perkalian adalah penjumlahan berulang. Contoh: 3 x 4 = 4 + 4 + 4 = 12. Pembagian adalah pengurangan berulang sampai habis." }
            ],
            quiz: [
                { q: "Berapakah hasil dari 6 x 4?", options: ["20", "24", "28", "18"], correct: 1, exp: "6 dikali 4 sama dengan 24." }
            ]
        },
        ipas: {
            title: "IPAS Fase B (Kelas 3-4)",
            topics: [
                { id: "b_ipas_1", name: "Wujud Benda & Perubahannya", content: "Ada 3 wujud benda: Padat, Cair, dan Gas. Benda cair mengikuti bentuk wadahnya. Mencair adalah perubahan dari padat ke cair." }
            ],
            quiz: [
                { q: "Es batu yang didiamkan di tempat terbuka akan mencair. Ini adalah perubahan wujud dari...", options: ["Cair ke Padat", "Padat ke Cair", "Cair ke Gas", "Gas ke Padat"], correct: 1, exp: "Es batu (padat) berubah menjadi air (cair) saat mencair." }
            ]
        },
        indo: { title: "Bahasa Indonesia Fase B", topics: [], quiz: [] },
        inggris: { title: "Bahasa Inggris Fase B", topics: [], quiz: [] }
    },
    faseC: {
        mtk: {
            title: "Matematika Fase C (Kelas 5-6)",
            topics: [
                { id: "c_mtk_1", name: "Pecahan & Desimal", content: "Pecahan terdiri dari pembilang (atas) dan penyebut (bawah). Contoh: 1/2 sama nilainya dengan 0,5." }
            ],
            quiz: [
                { q: "Bentuk desimal dari 1/4 adalah...", options: ["0,5", "0,25", "0,75", "0,1"], correct: 1, exp: "1 dibagi 4 sama dengan 0,25." }
            ]
        },
        ipas: { title: "IPAS Fase C", topics: [], quiz: [] },
        indo: { title: "Bahasa Indonesia Fase C", topics: [], quiz: [] },
        inggris: { title: "Bahasa Inggris Fase C", topics: [], quiz: [] }
    }
};