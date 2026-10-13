// Google Gemini API Integration for Chat & Auto Quiz Generator

const GEMINI_MODEL = "gemini-2.5-flash";

// 1. Chat dengan AI Guru Pintar
async function fetchGeminiChat(prompt) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error("API Key belum dipasang. Silakan klik ikon kunci di header untuk memasukkan API Key Gemini Abah.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const systemPrompt = "Kamu adalah Ninna, seorang guru ramah, sabar, dan penuh semangat untuk anak Sekolah Dasar (SD). Jelaskan materi pembelajaran dengan singkat, menggunakan bahasa yang ceria, mudah dipahami anak usia 6-12 tahun, dan beri contoh kontekstual sehari-hari.";

    const bodyData = {
        contents: [
            {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nPertanyaan Anak: ${prompt}` }]
            }
        ]
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
    if (!apiKey) {
        throw new Error("API Key belum dipasang. Silakan isi API Key di menu header.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const promptText = `Buatkan 3 soal kuis pilihan ganda untuk pelajaran ${subject}, tingkat ${phase}, dengan topik khusus "${topic}". 
    Kembalikan HANYA format JSON murni tanpa simbol markdown tambahan seperti \`\`\`json.
    Format JSON harus persis seperti array berikut:
    [
      {
        "q": "Pertanyaan soal?",
        "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
        "correct": 0,
        "exp": "Penjelasan singkat jawaban yang benar."
      }
    ]`;

    const bodyData = {
        contents: [{ role: "user", parts: [{ text: promptText }] }]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
        throw new Error("Gagal membuat soal otomatis dari Gemini AI.");
    }

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text.trim();

    // Cleaning Markdown formatting if present
    if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
    }

    return JSON.parse(rawText);
}