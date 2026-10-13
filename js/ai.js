// Google Gemini API Integration for Chat, Quiz, and Modul Ajar RPP Generator

const GEMINI_MODEL = "gemini-2.5-flash";

// 1. Chat AI Guru Pintar
async function fetchGeminiChat(prompt) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error("API Key belum dipasang. Silakan klik ikon kunci di header untuk memasukkan API Key Gemini.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const systemPrompt = "Kamu adalah Ninna, seorang guru ramah, sabar, dan penuh semangat untuk anak Sekolah Dasar (SD). Jelaskan materi pembelajaran dengan singkat, ceria, dan kontekstual.";

    const bodyData = {
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nPertanyaan: ${prompt}` }] }]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Gagal menghubungi AI Gemini.");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// 2. Generator Soal Kuis Otomatis
async function fetchGeminiQuizGenerator(subject, phase, topic) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) throw new Error("API Key belum dipasang.");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const promptText = `Buatkan 5 soal kuis pilihan ganda untuk pelajaran ${subject}, ${phase}, topik "${topic}". 
    Kembalikan HANYA format JSON murni tanpa markdown.
    Format JSON:
    [
      {
        "q": "Pertanyaan?",
        "options": ["A", "B", "C", "D"],
        "correct": 0,
        "exp": "Penjelasan singkat."
      }
    ]`;

    const bodyData = { contents: [{ role: "user", parts: [{ text: promptText }] }] };
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
    });

    if (!response.ok) throw new Error("Gagal membuat soal AI.");

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text.trim();
    if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```(json)?/i, '').replace(/```\$/, '').trim();
    }
    return JSON.parse(rawText);
}

// 3. Generator Modul Ajar RPP Kurikulum Merdeka
async function fetchGeminiModulAjar(subject, phase, topic) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) throw new Error("API Key Gemini belum dipasang.");

    const url = `[https://generativelanguage.googleapis.com/v1beta/models/$](https://generativelanguage.googleapis.com/v1beta/models/$){GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const promptText = `Buatkan Modul Ajar / RPP Kurikulum Merdeka lengkap untuk:
    - Mata Pelajaran: ${subject}
    - Fase/Kelas: ${phase}
    - Topik Materi: ${topic}

    Sajikan dalam format HTML sederhana (gunakan tag <h3>, <p>, <ul>, <li>, <table>) dengan struktur lengkap:
    1. Identitas Modul
    2. Tujuan Pembelajaran (TP)
    3. Pemahaman Bermakna & Pertanyaan Pemantik
    4. Langkah-Langkah Kegiatan Pembelajaran (Pendahuluan, Inti, Penutup)
    5. Asesmen / Penilaian (Sikap, Pengetahuan, Keterampilan)
    6. Lembar Kerja Siswa Ringkas`;

    const bodyData = { contents: [{ role: "user", parts: [{ text: promptText }] }] };
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
    });

    if (!response.ok) throw new Error("Gagal menyusun Modul Ajar AI.");

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}