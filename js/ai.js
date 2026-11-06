// ============================================================
// Integrasi Google Gemini API
// Chat AI, Generator Soal, dan Generator Modul Ajar
// ============================================================

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_TIMEOUT_MS = 60000;

const AI_SUBJECT_LABELS = {
    mtk: 'Matematika',
    ipas: 'IPAS',
    indo: 'Bahasa Indonesia',
    inggris: 'Bahasa Inggris'
};

const AI_PHASE_LABELS = {
    faseA: 'Fase A (Kelas 1-2 SD)',
    faseB: 'Fase B (Kelas 3-4 SD)',
    faseC: 'Fase C (Kelas 5-6 SD)'
};

const NINNA_SYSTEM_PROMPT = `Kamu adalah Ninna, guru AI yang ramah, sabar, ceria, dan penuh semangat untuk anak Sekolah Dasar di Indonesia.
Aturan menjawab:
1. Gunakan Bahasa Indonesia yang sederhana, hangat, dan mudah dipahami anak SD.
2. Jelaskan konsep dengan contoh konkret dari kehidupan sehari-hari.
3. Jawaban ringkas: maksimal 4 paragraf pendek atau 6 poin.
4. Jangan pernah meminta data pribadi anak (alamat, nomor telepon, nama sekolah lengkap, kata sandi).
5. Jika pertanyaan di luar pelajaran, arahkan kembali dengan sopan ke topik belajar.
6. Akhiri dengan satu pertanyaan pemantik singkat agar anak berpikir.
7. Jangan menampilkan HTML mentah. Gunakan teks biasa, boleh bullet dengan tanda "-".`;

let geminiChatHistory = [];

// ------------------------------------------------------------
// Helper
// ------------------------------------------------------------
function getGeminiApiKeyOrThrow() {
    const apiKey = typeof getGeminiApiKey === 'function' ? getGeminiApiKey() : '';
    if (!apiKey) {
        throw new Error('API Key Gemini belum dipasang. Klik ikon kunci di header untuk mengaturnya.');
    }
    return apiKey;
}

function mapGeminiError(status, message) {
    const detail = String(message || '').trim();

    if (status === 400) {
        return new Error(detail || 'Permintaan ke Gemini tidak valid. Periksa kembali API key dan coba lagi.');
    }
    if (status === 401 || status === 403) {
        return new Error('API key Gemini tidak memiliki akses. Pastikan key benar dan API Generative Language sudah aktif.');
    }
    if (status === 404) {
        return new Error('Model Gemini tidak ditemukan. Coba perbarui aplikasi atau gunakan model lain.');
    }
    if (status === 429) {
        return new Error('Kuota Gemini sedang habis atau terlalu banyak permintaan. Tunggu sebentar, lalu coba lagi.');
    }
    if (status === 500 || status === 502 || status === 503 || status === 504) {
        return new Error('Server Gemini sedang sibuk. Coba lagi dalam beberapa saat.');
    }
    return new Error(detail || `Gagal menghubungi Gemini (kode ${status}).`);
}

async function callGemini(contents, options = {}) {
    const apiKey = getGeminiApiKeyOrThrow();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    const payload = {
        contents: Array.isArray(contents) ? contents : [],
        generationConfig: {
            temperature: typeof options.temperature === 'number' ? options.temperature : 0.7,
            topP: typeof options.topP === 'number' ? options.topP : 0.95,
            maxOutputTokens: Number(options.maxOutputTokens) || 2048
        }
    };

    if (options.systemInstruction) {
        payload.systemInstruction = {
            role: 'system',
            parts: [{ text: options.systemInstruction }]
        };
    }

    if (options.responseMimeType) {
        payload.generationConfig.responseMimeType = options.responseMimeType;
    }

    let response;
    try {
        response = await fetch(`${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
    } catch (err) {
        if (err && err.name === 'AbortError') {
            throw new Error('Permintaan ke Gemini terlalu lama (timeout). Periksa koneksi internet, lalu coba lagi.');
        }
        throw new Error('Tidak dapat terhubung ke Gemini. Periksa koneksi internet kamu.');
    } finally {
        window.clearTimeout(timeoutId);
    }

    let data = null;
    try {
        data = await response.json();
    } catch (err) {
        data = null;
    }

    if (!response.ok) {
        throw mapGeminiError(response.status, data?.error?.message);
    }

    const candidate = data?.candidates?.[0];
    const parts = candidate?.content?.parts;
    const text = Array.isArray(parts)
        ? parts.map((part) => part?.text || '').filter(Boolean).join('\n').trim()
        : '';

    if (!text) {
        if (candidate?.finishReason === 'SAFETY') {
            throw new Error('Jawaban AI terhenti karena pengaturan keamanan. Coba ubah pertanyaan dengan bahasa yang lebih netral.');
        }
        if (candidate?.finishReason === 'MAX_TOKENS') {
            throw new Error('Jawaban AI terlalu panjang. Coba minta penjelasan yang lebih singkat.');
        }
        throw new Error('Gemini tidak mengembalikan jawaban. Coba lagi.');
    }

    return text;
}

function stripMarkdownFences(raw) {
    return String(raw || '')
        .trim()
        .replace(/^```(?:json|html|markdown)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
}

function parseJsonLoose(raw) {
    const cleaned = stripMarkdownFences(raw);

    try {
        return JSON.parse(cleaned);
    } catch (err) {
        // Coba ambil bagian JSON pertama yang seimbang.
    }

    const firstArray = cleaned.indexOf('[');
    const lastArray = cleaned.lastIndexOf(']');
    if (firstArray !== -1 && lastArray > firstArray) {
        try {
            return JSON.parse(cleaned.slice(firstArray, lastArray + 1));
        } catch (err) {
            // lanjut ke percobaan objek
        }
    }

    const firstObject = cleaned.indexOf('{');
    const lastObject = cleaned.lastIndexOf('}');
    if (firstObject !== -1 && lastObject > firstObject) {
        try {
            return JSON.parse(cleaned.slice(firstObject, lastObject + 1));
        } catch (err) {
            // gagal juga
        }
    }

    throw new Error('Format jawaban AI tidak dapat dibaca. Coba generate ulang.');
}

// ------------------------------------------------------------
// Sanitasi HTML hasil AI
// ------------------------------------------------------------
function sanitizeAiHtml(html) {
    const raw = String(html || '').trim();
    if (!raw) return '';

    if (window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
        return window.DOMPurify.sanitize(raw, {
            ALLOWED_TAGS: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u',
                'ul', 'ol', 'li', 'blockquote',
                'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
                'div', 'span', 'a'
            ],
            ALLOWED_ATTR: ['href', 'target', 'rel', 'colspan', 'rowspan', 'class'],
            ALLOW_DATA_ATTR: false,
            FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta', 'svg', 'math'],
            FORBID_ATTR: ['style', 'src', 'srcset', 'onerror', 'onload']
        });
    }

    // Fallback tanpa DOMPurify (misalnya CDN diblokir).
    const container = document.createElement('div');
    container.innerHTML = raw;
    container.querySelectorAll('script,style,iframe,object,embed,form,input,button,link,meta,svg,math').forEach((node) => node.remove());

    container.querySelectorAll('*').forEach((element) => {
        Array.from(element.attributes).forEach((attribute) => {
            const name = attribute.name.toLowerCase();
            const value = String(attribute.value || '').trim();

            if (name.startsWith('on') || name === 'style' || name === 'src' || name === 'srcset') {
                element.removeAttribute(attribute.name);
                return;
            }

            if ((name === 'href' || name === 'xlink:href') && /^javascript:/i.test(value)) {
                element.removeAttribute(attribute.name);
            }
        });

        if (element.tagName === 'A') {
            element.setAttribute('target', '_blank');
            element.setAttribute('rel', 'noopener noreferrer');
        }
    });

    return container.innerHTML;
}

// ------------------------------------------------------------
// 1. Chat AI Ninna
// ------------------------------------------------------------
async function fetchGeminiChat(prompt) {
    const cleanPrompt = String(prompt || '').trim();
    if (!cleanPrompt) throw new Error('Pertanyaan masih kosong.');

    geminiChatHistory.push({ role: 'user', parts: [{ text: cleanPrompt }] });
    // Batasi konteks agar tidak terlalu panjang.
    const recentHistory = geminiChatHistory.slice(-16);

    const reply = await callGemini(recentHistory, {
        systemInstruction: NINNA_SYSTEM_PROMPT,
        temperature: 0.8,
        maxOutputTokens: 1200
    });

    geminiChatHistory.push({ role: 'model', parts: [{ text: reply }] });
    if (geminiChatHistory.length > 24) {
        geminiChatHistory = geminiChatHistory.slice(-24);
    }

    return reply;
}

function resetGeminiChat() {
    geminiChatHistory = [];
}

async function testGeminiConnection() {
    const reply = await callGemini(
        [{ role: 'user', parts: [{ text: 'Balas hanya dengan satu kata: SIAP' }] }],
        {
            systemInstruction: 'Kamu adalah asisten yang menjawab sangat singkat.',
            temperature: 0,
            maxOutputTokens: 20
        }
    );
    return reply;
}

// ------------------------------------------------------------
// 2. Generator Soal Kuis
// ------------------------------------------------------------
function normalizeAiQuestion(item, index = 0) {
    if (!item || typeof item !== 'object') return null;

    const questionText = String(item.q || item.question || item.pertanyaan || '').trim();
    const rawOptions = Array.isArray(item.options)
        ? item.options
        : Array.isArray(item.pilihan)
            ? item.pilihan
            : null;

    if (!questionText || !rawOptions || rawOptions.length < 4) return null;

    const options = rawOptions.slice(0, 4).map((option) => String(option ?? '').trim());
    if (options.some((option) => !option)) return null;

    let correct = Number(item.correct);
    if (!Number.isInteger(correct) || correct < 0 || correct > 3) {
        const correctLetter = String(item.answer || item.kunci || '').trim().toUpperCase();
        const letterIndex = ['A', 'B', 'C', 'D'].indexOf(correctLetter);
        correct = letterIndex >= 0 ? letterIndex : 0;
    }

    return {
        q: questionText,
        options,
        correct,
        exp: String(item.exp || item.explanation || item.pembahasan || 'Pembahasan belum tersedia.').trim(),
        source: 'ai',
        aiIndex: index
    };
}

async function fetchGeminiQuizGenerator(subject, phase, topic, options = {}) {
    const subjectLabel = AI_SUBJECT_LABELS[subject] || subject || 'Matematika';
    const phaseLabel = AI_PHASE_LABELS[phase] || phase || 'Fase A (Kelas 1-2 SD)';
    const cleanTopic = String(topic || '').trim();
    const count = Math.max(1, Math.min(20, Number(options.count) || 5));
    const difficulty = ['Mudah', 'Sedang', 'HOTS'].includes(options.difficulty) ? options.difficulty : 'Sedang';

    if (!cleanTopic) throw new Error('Topik soal belum diisi.');

    const promptText = `Buatkan ${count} soal pilihan ganda untuk siswa Sekolah Dasar.
Mata pelajaran: ${subjectLabel}
Fase/kelas: ${phaseLabel}
Topik: ${cleanTopic}
Tingkat kesulitan: ${difficulty}

Aturan:
- Setiap soal memiliki tepat 4 pilihan jawaban (A, B, C, D).
- Hanya satu jawaban benar.
- Gunakan bahasa Indonesia yang sesuai usia anak SD.
- Sertakan pembahasan singkat yang mendidik.
- Hindari soal yang ambigu, menjebak, atau mengandung kekerasan.
- Kembalikan HANYA JSON valid tanpa markdown, tanpa komentar.

Format JSON yang wajib:
[
  {
    "q": "Teks pertanyaan?",
    "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
    "correct": 0,
    "exp": "Pembahasan singkat."
  }
]`;

    const raw = await callGemini(
        [{ role: 'user', parts: [{ text: promptText }] }],
        {
            systemInstruction: 'Kamu adalah guru SD berpengalaman yang menyusun soal berkualitas dan sesuai kurikulum Indonesia. Patuhi format JSON yang diminta.',
            temperature: 0.75,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json'
        }
    );

    const parsed = parseJsonLoose(raw);
    const rawQuestions = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.questions)
            ? parsed.questions
            : Array.isArray(parsed?.soal)
                ? parsed.soal
                : [];

    const questions = rawQuestions
        .map((item, index) => normalizeAiQuestion(item, index))
        .filter(Boolean)
        .slice(0, count);

    if (!questions.length) {
        throw new Error('AI tidak menghasilkan soal yang valid. Coba lagi dengan topik yang lebih spesifik.');
    }

    return questions;
}

// ------------------------------------------------------------
// 3. Generator Modul Ajar
// ------------------------------------------------------------
async function fetchGeminiModulAjar(subject, phase, topic, options = {}) {
    const subjectLabel = String(subject || '').trim() || 'Matematika';
    const phaseLabel = String(phase || '').trim() || 'Fase A (Kelas 1-2 SD)';
    const cleanTopic = String(topic || '').trim();
    const model = String(options.model || 'Problem Based Learning').trim();
    const meetings = String(options.meetings || '1 pertemuan').trim();
    const timeAllocation = String(options.timeAllocation || '2 x 35 menit').trim();

    if (!cleanTopic) throw new Error('Topik modul ajar belum diisi.');

    const promptText = `Buatkan Modul Ajar / RPP Kurikulum Merdeka yang lengkap dan siap pakai.

Identitas:
- Mata Pelajaran: ${subjectLabel}
- Fase/Kelas: ${phaseLabel}
- Topik Materi: ${cleanTopic}
- Model Pembelajaran: ${model}
- Jumlah Pertemuan: ${meetings}
- Alokasi Waktu: ${timeAllocation}

Struktur wajib:
1. Identitas Modul (tabel)
2. Capaian Pembelajaran (CP)
3. Tujuan Pembelajaran (TP)
4. Pemahaman Bermakna & Pertanyaan Pemantik
5. Langkah-Langkah Kegiatan Pembelajaran (Pendahuluan, Inti, Penutup) dengan alokasi waktu
6. Asesmen / Penilaian (Sikap, Pengetahuan, Keterampilan) beserta rubrik sederhana
7. Lembar Kerja Peserta Didik (LKPD) ringkas
8. Refleksi Guru dan Siswa

Aturan format:
- Kembalikan HANYA potongan HTML bersih, tanpa markdown, tanpa \`\`\`.
- Gunakan tag: h2, h3, p, ul, ol, li, table, thead, tbody, tr, th, td, strong, em.
- Jangan gunakan tag <script>, <style>, <html>, <head>, atau <body>.
- Gunakan bahasa Indonesia yang jelas dan profesional.
- Jangan mengarang kutipan atau sumber yang tidak ada.`;

    const raw = await callGemini(
        [{ role: 'user', parts: [{ text: promptText }] }],
        {
            systemInstruction: 'Kamu adalah pengembang kurikulum dan guru SD berpengalaman di Indonesia. Susun dokumen yang praktis, terstruktur, dan sesuai Kurikulum Merdeka.',
            temperature: 0.7,
            maxOutputTokens: 8192
        }
    );

    const cleaned = stripMarkdownFences(raw);
    return sanitizeAiHtml(cleaned);
}
