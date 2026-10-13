// Database Kurikulum & Bank Soal Lengkap Pembelajaran SD (15 Soal per Mata Pelajaran)
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
                { id: "a_mtk_3", name: "Mengenal Bangun Datar & Waktu", content: "Bangun datar: Segitiga (3 sisi), Persegi (4 sisi sama), Lingkaran (1 sisi melengkung). Jam analog digunakan untuk membaca waktu." }
            ],
            quiz: [
                { q: "Berapakah hasil dari 14 + 8?", options: ["20", "21", "22", "23"], correct: 2, exp: "14 ditambah 8 sama dengan 22." },
                { q: "Ayah membeli 25 buah jeruk. Dimakan adik 7 buah. Berapa sisa jeruk Ayah?", options: ["17", "18", "19", "20"], correct: 1, exp: "25 dikurangi 7 adalah 18 jeruk." },
                { q: "Pada angka 68, angka yang menempati nilai tempat puluhan adalah...", options: ["8", "6", "60", "80"], correct: 1, exp: "Angka 6 berada di posisi depan sebagai puluhan (bernilai 60)." },
                { q: "Bangun datar yang memiliki 3 buah sisi dan 3 sudut adalah...", options: ["Persegi", "Lingkaran", "Segitiga", "Trapesium"], correct: 2, exp: "Segitiga memiliki 3 sisi dan 3 titik sudut." },
                { q: "Bunda memiliki 12 telur. Membeli lagi 15 telur. Jumlah seluruh telur Bunda adalah...", options: ["25", "26", "27", "28"], correct: 2, exp: "12 + 15 = 27 telur." },
                { q: "Urutan bilangan dari yang terkecil di bawah ini adalah...", options: ["15, 12, 18", "12, 15, 18", "18, 15, 12", "15, 18, 12"], correct: 1, exp: "Urutan dari kecil ke besar adalah 12, lalu 15, kemudian 18." },
                { q: "Bentuk uang logam koin pada umumnya menyerupai bangun datar...", options: ["Persegi", "Segitiga", "Lingkaran", "Persegi Panjang"], correct: 2, exp: "Uang koin berbentuk bulat lingkaran." },
                { q: "Hasil dari 30 - 12 adalah...", options: ["16", "17", "18", "19"], correct: 2, exp: "30 dikurangi 12 adalah 18." },
                { q: "Lambang bilangan dari 'Empat Puluh Tujuh' adalah...", options: ["407", "47", "74", "40"], correct: 1, exp: "Empat puluh tujuh ditulis 47." },
                { q: "Jarum pendek jam menunjuk angka 7, jarum panjang menunjuk angka 12. Berarti jam...", options: ["07:00", "12:00", "07:12", "12:07"], correct: 0, exp: "Jarum pendek menentukan jam (07:00)." },
                { q: "Manakah bilangan yang lebih BESAR dari 42?", options: ["39", "40", "41", "45"], correct: 3, exp: "45 nilainya lebih besar dari 42." },
                { q: "Budi punya 9 kelereng, diberi Kakak 6 kelereng, lalu hilang 2 kelereng. Sisa kelereng Budi...", options: ["13", "14", "15", "12"], correct: 0, exp: "9 + 6 = 15, lalu 15 - 2 = 13 kelereng." },
                { q: "Bangun datar persegi memiliki sisi sebanyak...", options: ["2 sisi", "3 sisi", "4 sisi", "5 sisi"], correct: 2, exp: "Persegi memiliki 4 sisi sama panjang." },
                { q: "10 + 10 + 10 + 5 sama dengan...", options: ["25", "30", "35", "40"], correct: 2, exp: "10 + 10 + 10 = 30, ditambah 5 = 35." },
                { q: "20 dikurangi berapa agar menjadi 15?", options: ["3", "4", "5", "6"], correct: 2, exp: "20 - 5 = 15." }
            ]
        },
        ipas: {
            title: "IPAS Fase A (Kelas 1-2)",
            topics: [
                { id: "a_ipas_1", name: "Panca Indra & Merawat Tubuh", content: "Mata (melihat), Telinga (mendengar), Hidung (membaui), Lidah (mengecap rasa), dan Kulit (meraba). Tubuh perlu dirawat dengan mandi dan cuci tangan." },
                { id: "a_ipas_2", name: "Lingkungan & Benda Langit", content: "Matahari menyinari bumi pada siang hari. Bulan dan bintang menghiasi langit pada malam hari." }
            ],
            quiz: [
                { q: "Anggota tubuh yang berfungsi sebagai indra pendengaran adalah...", options: ["Mata", "Telinga", "Hidung", "Lidah"], correct: 1, exp: "Telinga digunakan untuk mendengarkan suara." },
                { q: "Bunda mencium aroma masakan yang harum menggunakan indra...", options: ["Kulit", "Mata", "Hidung", "Lidah"], correct: 2, exp: "Hidung berfungsi sebagai indra penciuman." },
                { q: "Agar gigi kita tetap bersih dan sehat, kita harus menggosok gigi sebanyak...", options: ["Seminggu sekali", "Minimal 2 kali sehari", "Saat mandi sore saja", "Sebulan sekali"], correct: 1, exp: "Menggosok gigi minimal 2 kali sehari menjaga kesehatan gigi." },
                { q: "Benda langit yang memancarkan cahaya terang pada siang hari adalah...", options: ["Bintang", "Bulan", "Awan", "Matahari"], correct: 3, exp: "Matahari menyinari bumi di siang hari." },
                { q: "Sikap yang baik ketika melihat sampah berserakan di halaman rumah adalah...", options: ["Membiarkannya", "Melihatnya saja", "Membuangnya ke tempat sampah", "Menendangnya"], correct: 2, exp: "Menjaga kebersihan adalah tanggung jawab bersama." },
                { q: "Indra yang digunakan untuk merasakan manisnya gula adalah...", options: ["Lidah", "Kulit", "Hidung", "Telinga"], correct: 0, exp: "Lidah berfungsi mengecap rasa manis, asin, asam, dan pahit." },
                { q: "Sebelum makan kita harus mencuci tangan menggunakan...", options: ["Air saja", "Sabun dan air mengalir", "Minyak", "Tisu kering"], correct: 1, exp: "Sabun dan air mengalir membunuh kuman di tangan." },
                { q: "Hewan yang bergerak dengan cara terbang menggunakan sayap adalah...", options: ["Kucing", "Burung", "Ikan", "Kelinci"], correct: 1, exp: "Burung terbang mengangkasa menggunakan sayapnya." },
                { q: "Suasana pada malam hari biasanya terasa...", options: ["Terang benderang", "Gelap dan sejuk", "Panas terik", "Silau"], correct: 1, exp: "Malam hari gelap karena matahari sudah terbenam." },
                { q: "Bagian tubuh yang digunakan untuk berjalan dan berlari adalah...", options: ["Tangan", "Kaki", "Kepala", "Dada"], correct: 1, exp: "Kaki digunakan untuk menopang tubuh saat berjalan dan berlari." },
                { q: "Tanaman agar tumbuh subur harus disiram dengan...", options: ["Minyak goreng", "Susu", "Air bersih", "Sirup"], correct: 2, exp: "Tanaman membutuhkan air untuk tumbuh subur." },
                { q: "Hewan yang menghasilkan susu untuk kita minum adalah...", options: ["Ayam", "Sapi", "Bebek", "Ikan"], correct: 1, exp: "Sapi perah menghasilkan susu yang menyehatkan." },
                { q: "Untuk meraba tekstur kain yang halus atau kasar kita menggunakan...", options: ["Mata", "Kulit", "Telinga", "Lidah"], correct: 1, exp: "Kulit adalah indra peraba." },
                { q: "Matahari terbit di sebelah...", options: ["Barat", "Timur", "Utara", "Selatan"], correct: 1, exp: "Matahari terbit dari arah timur setiap pagi." },
                { q: "Buah pisang yang sudah matang biasanya berwarna...", options: ["Hijau", "Merah", "Kuning", "Biru"], correct: 2, exp: "Pisang matang berwarna kuning dan terasa manis." }
            ]
        },
        indo: {
            title: "Bahasa Indonesia Fase A (Kelas 1-2)",
            topics: [
                { id: "a_indo_1", name: "Suku Kata & Kalimat", content: "Suku kata adalah bagian kata. Kalimat ajakan menggunakan kata 'Ayo' atau 'Mari'. Kalimat tanya diakhiri tanda tanya (?)." }
            ],
            quiz: [
                { q: "Kata 'B-E-L-A-J-A-R' jika digabungkan dibaca...", options: ["Bermain", "Belajar", "Bekerja", "Berjalan"], correct: 1, exp: "B-E-L-A-J-A-R membentuk kata 'Belajar'." },
                { q: "Kata tanya yang digunakan untuk menanyakan nama seseorang adalah...", options: ["Di mana", "Siapa", "Berapa", "Kapan"], correct: 1, exp: "'Siapa' digunakan untuk menanyakan nama orang." },
                { q: "Contoh kalimat ajakan yang benar di bawah ini adalah...", options: ["Siapa namamu?", "Ayo kita menjaga kebersihan kelas!", "Tolong ambilkan buku itu.", "Aduh, kakiku sakit!"], correct: 1, exp: "Kalimat ajakan diawali kata 'Ayo' atau 'Mari'." },
                { q: "Kata 'P-E-M-A-N-D-A-N-G-A-N' memiliki berapa suku kata?", options: ["3 suku kata", "4 suku kata", "5 suku kata", "2 suku kata"], correct: 1, exp: "Pe-man-da-ngan terdiri dari 4 suku kata." },
                { q: "Tanda baca yang digunakan pada akhir kalimat berita adalah...", options: ["Tanda tanya (?)", "Tanda seru (!)", "Tanda titik (.)", "Tanda koma (,)"], correct: 2, exp: "Kalimat berita diakhiri dengan tanda titik." },
                { q: "Kalimat perintah biasanya diakhiri dengan tanda...", options: ["Titik (.)", "Tanya (?)", "Seru (!)", "Koma (,)"], correct: 2, exp: "Kalimat perintah atau ajakan diakhiri tanda seru (!)." },
                { q: "Ungkapan yang kita ucapkan saat diberi bantuan oleh orang lain adalah...", options: ["Maaf", "Terima kasih", "Permisi", "Sama-sama"], correct: 1, exp: "Mengucapkan 'Terima kasih' adalah bentuk kesopanan." },
                { q: "Lawan kata (antonim) dari kata 'Besar' adalah...", options: ["Tinggi", "Kecil", "Panjang", "Lebar"], correct: 1, exp: "Lawan kata besar adalah kecil." },
                { q: "Kata 'K-E-L-I-N-C-I' diawali dengan huruf...", options: ["K", "L", "C", "I"], correct: 0, exp: "Huruf pertama kata Kelinci adalah K." },
                { q: "Budi merasa lapar, maka Budi harus...", options: ["Minum", "Tidur", "Makan", "Mandi"], correct: 2, exp: "Rasa lapar diatasi dengan makan makanan sehat." },
                { q: "Ibu memasak di...", options: ["Kamar tidur", "Dapur", "Garasi", "Kamar mandi"], correct: 1, exp: "Dapur adalah tempat memasak." },
                { q: "Persamaan kata (sinonim) dari kata 'Rajin' adalah...", options: ["Giat", "Malas", "Bodoh", "Lambat"], correct: 0, exp: "Rajin sama artinya dengan giat." },
                { q: "Jika kita tidak sengaja merusakkan mainan teman, kita harus mengucapkan...", options: ["Terima kasih", "Minta maaf", "Halo", "Selamat tinggal"], correct: 1, exp: "Meminta maaf saat berbuat salah." },
                { q: "Tempat anak-anak menuntut ilmu dan belajar bersama guru adalah...", options: ["Pasar", "Sekolah", "Rumah sakit", "Stasiun"], correct: 1, exp: "Sekolah adalah tempat belajar." },
                { q: "Penulisan huruf pertama pada nama orang harus menggunakan huruf...", options: ["Kecil", "Kapital (Besar)", "Miring", "Tebal"], correct: 1, exp: "Nama orang diawali huruf kapital." }
            ]
        },
        inggris: {
            title: "Bahasa Inggris Fase A (Kelas 1-2)",
            topics: [
                { id: "a_ing_1", name: "Greetings, Colors & Animals", content: "Greetings: Good Morning, Good Night. Colors: Red, Blue, Yellow. Numbers 1-10. Animals: Cat, Dog, Bird, Fish." }
            ],
            quiz: [
                { q: "Bahasa Inggris dari warna 'Kuning' adalah...", options: ["Red", "Green", "Blue", "Yellow"], correct: 3, exp: "Kuning = Yellow." },
                { q: "Apa arti dari ungkapan 'Good Morning'?", options: ["Selamat Malam", "Selamat Pagi", "Selamat Sore", "Selamat Tinggal"], correct: 1, exp: "Good Morning = Selamat Pagi." },
                { q: "Bahasa Inggris dari angka '7' adalah...", options: ["Five", "Six", "Seven", "Eight"], correct: 2, exp: "7 = Seven." },
                { q: "Hewan 'Kucing' dalam bahasa Inggris disebut...", options: ["Dog", "Cat", "Bird", "Fish"], correct: 1, exp: "Kucing = Cat." },
                { q: "Warna dari buah Apel merah dalam bahasa Inggris adalah...", options: ["Red", "Green", "Yellow", "Blue"], correct: 0, exp: "Merah = Red." },
                { q: "Bahasa Inggris dari kata 'Ibu' adalah...", options: ["Father", "Mother", "Brother", "Sister"], correct: 1, exp: "Ibu = Mother." },
                { q: "Bagaimana cara menyapa teman sebelum tidur di malam hari?", options: ["Good Afternoon", "Good Morning", "Good Night", "Good Day"], correct: 2, exp: "Good Night = Selamat tidur/malam." },
                { q: "Bahasa Inggris dari angka '10' adalah...", options: ["Eight", "Nine", "Ten", "Seven"], correct: 2, exp: "10 = Ten." },
                { q: "Hewan 'Anjing' dalam bahasa Inggris disebut...", options: ["Cat", "Dog", "Duck", "Cow"], correct: 1, exp: "Anjing = Dog." },
                { q: "Warna daun pada umumnya adalah hijau. Hijau dalam bahasa Inggris adalah...", options: ["Green", "White", "Black", "Pink"], correct: 0, exp: "Hijau = Green." },
                { q: "Bahasa Inggris dari 'Buku' adalah...", options: ["Pencil", "Ruler", "Book", "Bag"], correct: 2, exp: "Buku = Book." },
                { q: "Arti dari ucapan 'Thank You' adalah...", options: ["Selamat datang", "Terima kasih", "Sampai jumpa", "Maafkan saya"], correct: 1, exp: "Thank you = Terima kasih." },
                { q: "Bahasa Inggris dari anggota tubuh 'Mata' adalah...", options: ["Eye", "Ear", "Nose", "Hand"], correct: 0, exp: "Mata = Eye." },
                { q: "Bahasa Inggris dari angka '3' adalah...", options: ["One", "Two", "Three", "Four"], correct: 2, exp: "3 = Three." },
                { q: "Hewan yang hidup di air dan berenang adalah...", options: ["Bird", "Fish", "Cat", "Horse"], correct: 1, exp: "Ikan = Fish." }
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
                { id: "b_mtk_1", name: "Perkalian, Pembagian & Pecahan", content: "Perkalian adalah penjumlahan berulang. Pembagian adalah kebalikan dari perkalian. Pecahan senilai: 1/2 = 2/4 = 4/8." },
                { id: "b_mtk_2", name: "Keliling & Luas Bangun Datar", content: "Keliling Persegi = 4 x Sisi. Luas Persegi Panjang = Panjang x Lebar." }
            ],
            quiz: [
                { q: "Berapakah hasil dari 8 x 7?", options: ["48", "54", "56", "64"], correct: 2, exp: "8 dikali 7 sama dengan 56." },
                { q: "Ayah membagikan 45 kue secara merata kepada 5 anaknya. Berapa kue per anak?", options: ["7", "8", "9", "10"], correct: 2, exp: "45 : 5 = 9 kue." },
                { q: "Sebuah persegi memiliki panjang sisi 6 cm. Berapakah kelilingnya?", options: ["12 cm", "18 cm", "24 cm", "36 cm"], correct: 2, exp: "Keliling = 4 x 6 = 24 cm." },
                { q: "Bentuk pecahan yang senilai dengan 1/2 adalah...", options: ["2/4", "2/3", "3/5", "1/4"], correct: 0, exp: "1/2 senilai dengan 2/4." },
                { q: "Luas persegi panjang dengan panjang 10 cm dan lebar 5 cm adalah...", options: ["15 cm²", "30 cm²", "50 cm²", "100 cm²"], correct: 2, exp: "Luas = 10 x 5 = 50 cm²." },
                { q: "Hasil perkalian dari 12 x 4 adalah...", options: ["44", "46", "48", "52"], correct: 2, exp: "12 x 4 = 48." },
                { q: "64 dibagi 8 hasilnya adalah...", options: ["6", "7", "8", "9"], correct: 2, exp: "64 : 8 = 8." },
                { q: "Sudut yang besarnya tepat 90 derajat disebut sudut...", options: ["Lancip", "Tumpul", "Siku-siku", "Lurus"], correct: 2, exp: "Sudut siku-siku besarnya tepat 90°." },
                { q: "Nilai dari pecahan 3/4 dalam bentuk gambar dapat diartikan...", options: ["3 bagian diarsir dari total 4 bagian", "4 bagian diarsir dari total 3 bagian", "1 bagian diarsir dari 3", "2 bagian diarsir dari 4"], correct: 0, exp: "3/4 artinya 3 dari 4 bagian." },
                { q: "Panjang pita Bunda 2 meter. Sama dengan berapa centimeter (cm)?", options: ["20 cm", "200 cm", "2000 cm", "2 cm"], correct: 1, exp: "1 meter = 100 cm, maka 2 m = 200 cm." },
                { q: "Berapa jumlah titik sudut pada bangun persegi panjang?", options: ["3", "4", "5", "6"], correct: 1, exp: "Persegi panjang memiliki 4 titik sudut." },
                { q: "Hasil dari 150 + 250 - 100 adalah...", options: ["200", "250", "300", "350"], correct: 2, exp: "150 + 250 = 400, lalu 400 - 100 = 300." },
                { q: "Jam 03:00 sore jika ditulis dalam format 24 jam adalah jam...", options: ["13:00", "14:00", "15:00", "16:00"], correct: 2, exp: "03:00 sore = 12 + 3 = 15:00." },
                { q: "Bentuk desimal dari pecahan 1/10 adalah...", options: ["0,1", "0,01", "1,0", "0,5"], correct: 0, exp: "1/10 = 0,1." },
                { q: "Keliling segitiga sama sisi yang panjang sisinya 9 cm adalah...", options: ["18 cm", "27 cm", "36 cm", "81 cm"], correct: 1, exp: "Keliling = 9 + 9 + 9 = 27 cm." }
            ]
        },
        ipas: {
            title: "IPAS Fase B (Kelas 3-4)",
            topics: [
                { id: "b_ipas_1", name: "Wujud Benda & Perubahannya", content: "Wujud benda: Padat, Cair, dan Gas. Perubahan wujud: Mencair, Membeku, Menguap, Mengembun, Menyublim." },
                { id: "b_ipas_2", name: "Daur Hidup & Rantai Makanan", content: "Daur hidup hewan. Rantai makanan: Produsen (Tumbuhan) -> Konsumen I (Herbivora) -> Konsumen II (Karnivora)." }
            ],
            quiz: [
                { q: "Es batu di tempat terbuka berubah menjadi air. Proses ini disebut...", options: ["Membeku", "Mencair", "Menguap", "Mengembun"], correct: 1, exp: "Mencair = padat ke cair." },
                { q: "Tumbuhan hijau dalam rantai makanan berperan sebagai...", options: ["Konsumen I", "Konsumen II", "Produsen", "Pengurai"], correct: 2, exp: "Tumbuhan menghasilkan makanan sendiri (produsen)." },
                { q: "Hewan yang mengalami metamorfosis sempurna adalah...", options: ["Ayam", "Kupu-kupu", "Kucing", "Kambing"], correct: 1, exp: "Kupu-kupu melewati telur-ulat-kepompong-dewasa." },
                { q: "Bagian tumbuhan yang menyerap air dari tanah adalah...", options: ["Daun", "Batang", "Bunga", "Akar"], correct: 3, exp: "Akar menyerap air di dalam tanah." },
                { q: "Perubahan cair menjadi gas saat air mendidih disebut...", options: ["Menguap", "Mencair", "Membeku", "Menyublim"], correct: 0, exp: "Menguap = cair ke gas." },
                { q: "Perubahan air menjadi es di dalam freezer disebut...", options: ["Mencair", "Membeku", "Menguap", "Mengembun"], correct: 1, exp: "Membeku = cair ke padat." },
                { q: "Titik-titik air di luar gelas dingin pada pagi hari adalah contoh...", options: ["Mengembun", "Menguap", "Mencair", "Menyublim"], correct: 0, exp: "Mengembun = gas ke cair." },
                { q: "Hewan pemakan tumbuhan saja disebut...", options: ["Karnivora", "Herbivora", "Omnivora", "Insektivora"], correct: 1, exp: "Herbivora = pemakan tumbuhan." },
                { q: "Proses pembuatan makanan pada tumbuhan hijau dengan bantuan sinar matahari dinamakan...", options: ["Respirasi", "Fotosintesis", "Adaptasi", "Oksidasi"], correct: 1, exp: "Fotosintesis menghasilkan zat gula dan oksigen." },
                { q: "Bagian tumbuhan yang berfungsi sebagai tempat fotosintesis adalah...", options: ["Akar", "Batang", "Daun", "Bunga"], correct: 2, exp: "Daun mengandung klorofil untuk fotosintesis." },
                { q: "Hewan pemakan daging dan tumbuhan (pemakan segala) disebut...", options: ["Herbivora", "Karnivora", "Omnivora", "Pengurai"], correct: 2, exp: "Omnivora = pemakan segala." },
                { q: "Gas yang kita hirup saat bernapas adalah...", options: ["Karbondioksida", "Oksigen", "Nitrogen", "Helium"], correct: 1, exp: "Oksigen dibutuhkan tubuh untuk bernapas." },
                { q: "Benda padat memiliki ciri-ciri...", options: ["Bentuk dan volumenya tetap", "Bentuknya berubah sesuai wadah", "Tidak dapat dipegang", "Volumenya selalu berubah"], correct: 0, exp: "Benda padat bentuk dan volumenya tetap." },
                { q: "Pembangkit Listrik Tenaga Air (PLTA) memanfaatkan energi...", options: ["Angin", "Matahari", "Aliran air", "Panas bumi"], correct: 2, exp: "PLTA memanfaatkan dorongan aliran air." },
                { q: "Gaya yang menyebabkan buah mangga jatuh dari pohon ke tanah adalah...", options: ["Gaya gesek", "Gaya otot", "Gaya gravitasi", "Gaya magnet"], correct: 2, exp: "Gravitasi bumi menarik benda ke bawah." }
            ]
        },
        indo: {
            title: "Bahasa Indonesia Fase B (Kelas 3-4)",
            topics: [
                { id: "b_indo_1", name: "Ide Pokok, Teks Petunjuk & Imbuhan", content: "Ide pokok adalah gagasan utama paragraf. Teks petunjuk memuat langkah-langkah runtut. Imbuhan ber- dan me-." }
            ],
            quiz: [
                { q: "Gagasan utama yang menjadi inti pembahasan paragraf disebut...", options: ["Kalimat penjelas", "Ide pokok", "Judul", "Kesimpulan"], correct: 1, exp: "Ide pokok merupakan inti paragraf." },
                { q: "Kata berimbuhan 'ber-' pada kata 'berjalan' berarti...", options: ["Saling", "Melakukan tindakan", "Membuat", "Menjadi"], correct: 1, exp: "Berjalan = melakukan aktivitas jalan." },
                { q: "Teks yang memberikan petunjuk pembuatan sesuatu disebut...", options: ["Teks Narasi", "Teks Petunjuk/Prosedur", "Teks Puisi", "Teks Dongeng"], correct: 1, exp: "Teks petunjuk memuat langkah kerja." },
                { q: "Persamaan kata (sinonim) dari 'Pintar' adalah...", options: ["Rajin", "Pandai", "Tekun", "Cermat"], correct: 1, exp: "Pintar = pandai." },
                { q: "Lawan kata (antonim) dari 'Hemat' adalah...", options: ["Pelit", "Boros", "Cermat", "Sederhana"], correct: 1, exp: "Lawan kata hemat adalah boros." },
                { q: "Kalimat utama yang berada di awal paragraf disebut paragraf...", options: ["Induktif", "Deduktif", "Campuran", "Narasi"], correct: 1, exp: "Deduktif = utama di depan/awal." },
                { q: "Dongeng tentang kisah kehidupan hewan yang bertingkah seperti manusia disebut...", options: ["Mite", "Legenda", "Fabel", "Epos"], correct: 2, exp: "Fabel = dongeng tokoh hewan." },
                { q: "Kata dasar dari kata 'Menyapu' adalah...", options: ["Nyapu", "Sapu", "Menyapu", "Sapuan"], correct: 1, exp: "Me- + sapu menjadi menyapu." },
                { q: "Tokoh utama yang memiliki sifat baik dalam cerita disebut tokoh...", options: ["Antagonis", "Protagonis", "Figuran", "Tritagonis"], correct: 1, exp: "Protagonis = tokoh berwatak baik." },
                { q: "Kegiatan bertanya jawab untuk memperoleh informasi dari narasumber disebut...", options: ["Pidato", "Wawancara", "Diskusi", "Musyawarah"], correct: 1, exp: "Wawancara = tanya jawab informasi." },
                { q: "Anak yang suka membaca buku dan menuntut ilmu dijuluki...", options: ["Kutu buku", "Panjang tangan", "Bintang lapangan", "Tangan kanan"], correct: 0, exp: "Kutu buku = gemar membaca." },
                { q: "Tanda baca yang digunakan untuk memisahkan item dalam daftar adalah...", options: ["Titik", "Koma", "Tanda tanya", "Tanda seru"], correct: 1, exp: "Koma (,) memisahkan unsur rincian." },
                { q: "Penulisan kalimat tempat dan tanggal lahir yang benar adalah...", options: ["Jakarta 12 Mei 2014", "Jakarta, 12 Mei 2014", "Jakarta; 12 Mei 2014", "Jakarta. 12 Mei 2014"], correct: 1, exp: "Menggunakan tanda koma setelah nama kota." },
                { q: "Cerita rakyat tentang asal-usul suatu tempat dinamakan...", options: ["Fabel", "Legenda", "Mite", "Jenaka"], correct: 1, exp: "Legenda = asal-usul daerah/tempat." },
                { q: "Pesan moral yang ingin disampaikan pengarang dalam cerita dinamakan...", options: ["Tema", "Amanat", "Latar", "Alur"], correct: 1, exp: "Amanat = pesan kebaikan cerita." }
            ]
        },
        inggris: {
            title: "Bahasa Inggris Fase B (Kelas 3-4)",
            topics: [
                { id: "b_ing_1", name: "Time, Daily Activities & Places", content: "Time (o'clock, half past). Daily routines (eat breakfast, study). Places around school and home." }
            ],
            quiz: [
                { q: "How do you say 'Jam 07:00 tepat' in English?", options: ["Seven o'clock", "Eight o'clock", "Six o'clock", "Nine o'clock"], correct: 0, exp: "07:00 = Seven o'clock." },
                { q: "My father is reading a newspaper in the...", options: ["Bathroom", "Living room", "Kitchen", "Garage"], correct: 1, exp: "Living room = ruang tamu." },
                { q: "We buy books and stationary in the...", options: ["Canteen", "Library", "Bookstore", "Hospital"], correct: 2, exp: "Bookstore = toko buku." },
                { q: "What is the English word for 'Pergi ke sekolah'?", options: ["Go home", "Go to school", "Play football", "Eat lunch"], correct: 1, exp: "Go to school = Pergi ke sekolah." },
                { q: "The day after Monday is...", options: ["Sunday", "Tuesday", "Wednesday", "Friday"], correct: 1, exp: "Monday -> Tuesday." },
                { q: "What is 'Kitchen' in Indonesian?", options: ["Kamar tidur", "Dapur", "Kamar mandi", "Halaman"], correct: 1, exp: "Kitchen = Dapur." },
                { q: "I eat breakfast in the...", options: ["Night", "Morning", "Evening", "Afternoon"], correct: 1, exp: "Breakfast = sarapan pagi." },
                { q: "An elephant is very big, but a mouse is...", options: ["Big", "Small", "Tall", "Long"], correct: 1, exp: "Small = kecil." },
                { q: "How many days are there in a week?", options: ["Five", "Six", "Seven", "Ten"], correct: 2, exp: "Seven days in a week." },
                { q: "What do you use to write on a notebook?", options: ["Shoes", "Pencil", "Hat", "Spoon"], correct: 1, exp: "Pencil = pensil." },
                { q: "'Library' is a place where students can...", options: ["Buy food", "Read and borrow books", "Swim", "Play football"], correct: 1, exp: "Library = perpustakaan." },
                { q: "What is the first month of the year?", options: ["February", "March", "December", "January"], correct: 3, exp: "January = Januari." },
                { q: "The color of the sky on a sunny day is...", options: ["Blue", "Red", "Black", "Yellow"], correct: 0, exp: "Blue = biru." },
                { q: "The opposite of 'Happy' is...", options: ["Glad", "Sad", "Smart", "Tall"], correct: 1, exp: "Sad = sedih (lawan kata happy)." },
                { q: "What is 'Doctor's work place'?", options: ["School", "Hospital", "Market", "Bank"], correct: 1, exp: "Hospital = rumah sakit." }
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
                { id: "c_mtk_1", name: "Pecahan, Desimal, Persen & Skala", content: "Pecahan ke desimal/persen. Skala peta = Jarak Peta : Jarak Sebenarnya." },
                { id: "c_mtk_2", name: "Volume Kubus, Balok & Pengolahan Data", content: "Volume Kubus = s x s x s. Volume Balok = p x l x t. Mean (Rata-rata) & Modus." }
            ],
            quiz: [
                { q: "Bentuk desimal dari pecahan 3/5 adalah...", options: ["0,3", "0,5", "0,6", "0,75"], correct: 2, exp: "3 : 5 = 0,6." },
                { q: "Berapakah hasil dari 1/4 + 2/4?", options: ["2/4", "3/4", "3/8", "1/2"], correct: 1, exp: "1/4 + 2/4 = 3/4." },
                { q: "Kubus dengan panjang rusuk 5 cm memiliki volume sebesar...", options: ["25 cm³", "75 cm³", "100 cm³", "125 cm³"], correct: 3, exp: "Volume = 5 x 5 x 5 = 125 cm³." },
                { q: "Bentuk persen (%) dari 0,45 adalah...", options: ["4,5%", "45%", "450%", "0,45%"], correct: 1, exp: "0,45 x 100% = 45%." },
                { q: "Jarak peta 2 cm, skala 1 : 500.000. Jarak sebenarnya adalah...", options: ["1 km", "10 km", "100 km", "5 km"], correct: 1, exp: "2 cm x 500.000 = 1.000.000 cm = 10 km." },
                { q: "Volume balok dengan panjang 8 cm, lebar 5 cm, dan tinggi 4 cm adalah...", options: ["160 cm³", "120 cm³", "80 cm³", "200 cm³"], correct: 0, exp: "Volume = 8 x 5 x 4 = 160 cm³." },
                { q: "Rata-rata (mean) dari nilai test: 6, 7, 8, 9, 10 adalah...", options: ["7", "8", "8,5", "9"], correct: 1, exp: "(6+7+8+9+10)/5 = 40/5 = 8." },
                { q: "Angka yang paling sering muncul dalam sekumpulan data dinamakan...", options: ["Mean", "Median", "Modus", "Diagram"], correct: 2, exp: "Modus = nilai paling sering muncul." },
                { q: "Hasil dari 3/4 x 2/5 adalah...", options: ["5/9", "6/20", "6/9", "5/20"], correct: 1, exp: "(3x2)/(4x5) = 6/20." },
                { q: "Akar pangkat tiga dari 1.000 (³√1000) adalah...", options: ["10", "100", "5", "20"], correct: 0, exp: "10 x 10 x 10 = 1.000." },
                { q: "Hasil dari (-15) + 20 adalah...", options: ["-5", "5", "-35", "35"], correct: 1, exp: "-15 + 20 = 5." },
                { q: "Sebuah lingkaran memiliki diameter 14 cm. Jari-jarinya (r) adalah...", options: ["7 cm", "28 cm", "14 cm", "21 cm"], correct: 0, exp: "Jari-jari = setengah diameter = 14 / 2 = 7 cm." },
                { q: "Hasil dari 2,5 + 1,75 adalah...", options: ["3,25", "4,25", "4,15", "3,75"], correct: 1, exp: "2,50 + 1,75 = 4,25." },
                { q: "Bangun ruang yang memiliki 6 sisi berbentuk persegi yang identik adalah...", options: ["Balok", "Kubus", "Prisma", "Tabung"], correct: 1, exp: "Kubus memiliki 6 sisi persegi kongruen." },
                { q: "Bentuk pecahan biasa paling sederhana dari 75% adalah...", options: ["1/2", "2/3", "3/4", "4/5"], correct: 2, exp: "75/100 dibagi 25/25 = 3/4." }
            ]
        },
        ipas: {
            title: "IPAS Fase C (Kelas 5-6)",
            topics: [
                { id: "c_ipas_1", name: "Sistem Organ Manusia & Tata Surya", content: "Sistem pencernaan, pernapasan, dan peredaran darah. Tata Surya (8 planet, rotasi & revolusi bumi)." },
                { id: "c_ipas_2", name: "Listrik, Magnet & Ekosistem", content: "Rangkaian listrik seri & paralel. Sifat magnet. Penyesuaian diri makhluk hidup (adaptasi)." }
            ],
            quiz: [
                { q: "Organ pencernaan dengan bantuan asam lambung untuk melumat makanan adalah...", options: ["Mulut", "Lambung", "Usus Besar", "Kerongkongan"], correct: 1, exp: "Lambung menggunakan asam HCl." },
                { q: "Planet terdekat dari Matahari dalam sistem Tata Surya adalah...", options: ["Venus", "Bumi", "Merkurius", "Mars"], correct: 2, exp: "Merkurius = planet pertama terdekat." },
                { q: "Pertukaran gas Oksigen dan Karbondioksida di paru-paru terjadi pada...", options: ["Bronkus", "Trakea", "Alveolus", "Hidung"], correct: 2, exp: "Alveolus = tempat pertukaran O2 dan CO2." },
                { q: "Sifat magnet yang benar di bawah ini adalah...", options: ["Kutub senama tarik-menarik", "Kutub tidak senama tolak-menolak", "Kutub tidak senama tarik-menarik", "Magnet menarik plastik"], correct: 2, exp: "Kutub berbeda (Utara-Selatan) tarik-menarik." },
                { q: "Peristiwa berputarnya Bumi pada porosnya sendiri disebut...", options: ["Revolusi Bumi", "Rotasi Bumi", "Eklips", "Orbit"], correct: 1, exp: "Rotasi = berputar pada porosnya." },
                { q: "Rotasi Bumi menyebabkan terjadinya peristiwa...", options: ["Pergantian musim", "Siang dan malam", "Gerhana matahari", "Pasang surut air laut"], correct: 1, exp: "Rotasi bumi memicu pergantian siang-malam." },
                { q: "Pembuluh darah yang mengalirkan darah bersih kaya oksigen dari jantung ke seluruh tubuh disebut...", options: ["Pembuluh Vena", "Pembuluh Arteri (Nadi)", "Kapiler", "Serambi"], correct: 1, exp: "Arteri membawakan darah kaya oksigen." },
                { q: "Komponen listrik yang berfungsi untuk menyambung atau memutuskan aliran listrik adalah...", options: ["Kabel", "Baterai", "Sakelar", "Bohlam"], correct: 2, exp: "Sakelar menyambung/memutus listrik." },
                { q: "Cara unta beradaptasi di gurun pasir yang panas adalah dengan memiliki...", options: ["Punuk berisi cadangan lemak", "Bulu tebal berbintik", "Gigi yang tajam", "Sayap lebar"], correct: 0, exp: "Punuk memuat cadangan lemak unta." },
                { q: "Planet terbesar dalam sistem Tata Surya kita adalah...", options: ["Saturnus", "Jupiter", "Uranus", "Neptunus"], correct: 1, exp: "Jupiter = planet terbesar." },
                { q: "Rangkaian listrik yang disusun secara sejajar bercabang disebut rangkaian...", options: ["Seri", "Paralel", "Campuran", "Tunggal"], correct: 1, exp: "Rangkaian paralel bercabang sejajar." },
                { q: "Kemampuan bunglon mengubah warna kulit sesuai lingkungan dinamakan...", options: ["Autotomi", "Mimikri", "Ekolokasi", "Hibernasi"], correct: 1, exp: "Mimikri = mengubah warna kulit." },
                { q: "Kemampuan kelelawar mendeteksi benda dengan gelombang bunyi dinamakan...", options: ["Ekolokasi", "Mimikri", "Autotomi", "Adaptasi"], correct: 0, exp: "Ekolokasi = radar bunyi kelelawar." },
                { q: "Proses peredaran darah besar mengalir dari...", options: ["Bilik kiri -> Seluruh tubuh -> Serambi kanan", "Jantung -> Paru-paru -> Jantung", "Paru-paru -> Seluruh tubuh", "Bilik kanan -> Paru-paru"], correct: 0, exp: "Peredaran darah besar ke seluruh tubuh." },
                { q: "Peristiwa mengelilingnya Bumi pada Matahari disebut...", options: ["Rotasi Bumi", "Revolusi Bumi", "Gerhana", "Eklips"], correct: 1, exp: "Revolusi Bumi membutuhkan waktu 365,25 hari." }
            ]
        },
        indo: {
            title: "Bahasa Indonesia Fase C (Kelas 5-6)",
            topics: [
                { id: "c_indo_1", name: "Teks Eksplanasi, Kalimat Efektif & Majas", content: "Teks eksplanasi ilmiah. Syarat kalimat efektif (SPOK). Majas personifikasi dan hiperbola. Kata baku KBBI." }
            ],
            quiz: [
                { q: "Teks yang berisi penjelasan fenomena alam secara ilmiah disebut...", options: ["Teks Narasi", "Teks Eksplanasi", "Teks Deskripsi", "Teks Dongeng"], correct: 1, exp: "Teks eksplanasi menerangkan ilmiah." },
                { q: "Syarat utama kalimat efektif sekurang-kurangnya memiliki...", options: ["Subjek dan Predikat", "Hanya Keterangan", "Judul", "Hanya Objek"], correct: 0, exp: "Kalimat efektif wajib memuat Subjek & Predikat." },
                { q: "Kata baku yang tepat sesuai KBBI di bawah ini adalah...", options: ["Apotik", "Apotek", "Apotekh", "Apotikn"], correct: 1, exp: "Kata baku yang benar adalah Apotek." },
                { q: "Gaya bahasa yang menganggap benda mati dapat berprilaku seperti manusia adalah majas...", options: ["Hiperbola", "Personifikasi", "Metafora", "Ironi"], correct: 1, exp: "Personifikasi = menginsankan benda mati." },
                { q: "Bagian surat resmi yang berisi identitas lembaga/instansi pengirim disebut...", options: ["Kop Surat", "Salam Pembuka", "Isi Surat", "Salam Penutup"], correct: 0, exp: "Kop surat terletak paling atas surat resmi." },
                { q: "Kalimat 'Ninna menyiram bunga di halaman' yang bertindak sebagai Objek adalah...", options: ["Ninna", "Menyiram", "Bunga", "Di halaman"], correct: 2, exp: "Bunga adalah penderita/objek yang disiram." },
                { q: "Ungkapan 'Tinggi hati' memiliki arti...", options: ["Sombong", "Baik hati", "Pintar", "Jujur"], correct: 0, exp: "Tinggi hati = sombong/congkak." },
                { q: "Singkatan dari kalimat yang memuat unsur Tempat dan Waktu peristiwa adalah...", options: ["SPOK", "KBBI", "EYD", "PUEBI"], correct: 0, exp: "Subjek, Predikat, Objek, Keterangan (SPOK)." },
                { q: "Kata berimbuhan yang menyatakan 'paling' adalah...", options: ["Terpintar", "Memintarkan", "Pintar-pintar", "Kepintaran"], correct: 0, exp: "Awalan ter- berarti paling (terpintar = paling pintar)." },
                { q: "Ringkasan cerita pendek tanpa mengubah urutan isi dinamakan...", options: ["Sinopsis", "Amanat", "Tema", "Latar"], correct: 0, exp: "Sinopsis = ikhtisar/ringkasan cerita." },
                { q: "Kata baku dari 'Ijin' yang benar adalah...", options: ["Izin", "Isin", "Idjin", "Ijin"], correct: 0, exp: "Bentuk baku menurut KBBI adalah 'Izin'." },
                { q: "Pidato pembukaan yang disampaikan oleh ketua panitia dinamakan...", options: ["Kata sambutan", "Doa", "Penutup", "Amanat"], correct: 0, exp: "Kata sambutan disampaikan di awal acara." },
                { q: "Penggunaan tanda baca titik dua (:) yang tepat adalah pada...", options: ["Akhir kalimat berita", "Awal kalimat", "Sebelum rincian/pilihan", "Pemisah kata"], correct: 2, exp: "Titik dua digunakan sebelum pemerincian." },
                { q: "Lawan kata (antonim) dari kata 'Optimis' adalah...", options: ["Pesimis", "Humoris", "Kritis", "Dramatis"], correct: 0, exp: "Optimis (yakin) vs Pesimis (ragu/putus asa)." },
                { q: "Isi kutipan formulir pendaftaran yang wajib diisi menggunakan angka adalah...", options: ["Nama Lengkap", "Tanggal Lahir & Tanggal", "Alamat Rumah", "Nama Sekolah"], correct: 1, exp: "Tanggal dan tahun diisi angka numerik." }
            ]
        },
        inggris: {
            title: "Bahasa Inggris Fase C (Kelas 5-6)",
            topics: [
                { id: "c_ing_1", name: "Comparisons & Simple Past Tense", content: "Degree of comparison (Bigger, Tallest). Simple Past Tense for past events (went, played, ate)." }
            ],
            quiz: [
                { q: "An elephant is ... than a cat.", options: ["smaller", "bigger", "shorter", "thinner"], correct: 1, exp: "Elephant is bigger than cat." },
                { q: "Yesterday, I ... to the museum with my family.", options: ["go", "went", "going", "gone"], correct: 1, exp: "Past tense of go = went." },
                { q: "Which animal is the FASTEST in the world?", options: ["Cheetah", "Turtle", "Rabbit", "Snail"], correct: 0, exp: "Cheetah is the fastest runner." },
                { q: "My sister is the ... student in her class. She always gets rank 1.", options: ["smartest", "smarter", "small", "slowest"], correct: 0, exp: "Superlative = smartest." },
                { q: "What is the past form (Verb 2) of 'Eat'?", options: ["Eaten", "Ate", "Eating", "Eats"], correct: 1, exp: "Eat -> Ate." },
                { q: "A giraffe has a ... neck than a horse.", options: ["shorter", "longer", "smaller", "wider"], correct: 1, exp: "Giraffe neck is longer." },
                { q: "What is the opposite of 'Difficult'?", options: ["Hard", "Easy", "Slow", "Fast"], correct: 1, exp: "Opposite of difficult = easy." },
                { q: "Last night, my brother ... a funny movie.", options: ["watch", "watched", "watching", "watches"], correct: 1, exp: "Past tense = watched." },
                { q: "Mount Everest is the ... mountain in the world.", options: ["highest", "higher", "high", "short"], correct: 0, exp: "Superlative = highest." },
                { q: "We use an umbrella when it is...", options: ["Sunny", "Rainy", "Windy", "Snowy"], correct: 1, exp: "Umbrella in rainy weather." },
                { q: "What do you call a person who flies an airplane?", options: ["Doctor", "Pilot", "Driver", "Chef"], correct: 1, exp: "Airplane operator = Pilot." },
                { q: "What is 'Doctor's tool to check heartbeat'?", options: ["Stethoscope", "Thermometer", "Microscope", "Telescope"], correct: 0, exp: "Stethoscope checks heartbeat." },
                { q: "The past form (Verb 2) of 'Buy' is...", options: ["Buyed", "Bought", "Buying", "Buys"], correct: 1, exp: "Buy -> Bought." },
                { q: "Where do you go if you have a toothache?", options: ["Dentist", "Teacher", "Farmer", "Police"], correct: 0, exp: "Dentist = dokter gigi." },
                { q: "Indonesia has two seasons: Dry season and ... season.", options: ["Rainy", "Winter", "Autumn", "Spring"], correct: 0, exp: "Dry season & Rainy season." }
            ]
        }
    }
};