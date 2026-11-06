// ============================================================
// LocalStorage Management
// Siswa, nilai, riwayat, bank soal guru, pengaturan, dan API key
// ============================================================

const STORAGE_KEYS = {
    STUDENTS: 'rba_students_list',
    ACTIVE_STUDENT: 'rba_active_student_id',
    SCORES: 'rba_student_scores',
    HISTORY: 'rba_quiz_history',
    CUSTOM_QUESTIONS: 'rba_custom_questions',
    API_KEY: 'rba_gemini_api_key',
    SETTINGS: 'rba_settings'
};

const STORAGE_VERSION = 2;
const memoryStore = new Map();

function makeId(prefix = 'id') {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return `${prefix}_${window.crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function readRaw(key) {
    try {
        return window.localStorage.getItem(key);
    } catch (err) {
        return memoryStore.has(key) ? memoryStore.get(key) : null;
    }
}

function writeRaw(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch (err) {
        // Mode privat / storage penuh: tetap bisa dipakai selama sesi berlangsung.
        memoryStore.set(key, value);
    }
}

function removeRaw(key) {
    try {
        window.localStorage.removeItem(key);
    } catch (err) {
        // abaikan
    }
    memoryStore.delete(key);
}

function safeParse(raw, fallback) {
    if (!raw) return fallback;
    try {
        const parsed = JSON.parse(raw);
        return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (err) {
        return fallback;
    }
}

function safeReadObject(key, fallback) {
    const parsed = safeParse(readRaw(key), fallback);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
}

// ------------------------------------------------------------
// 1. Siswa
// ------------------------------------------------------------
function normalizeStudent(student) {
    const source = student && typeof student === 'object' ? student : {};
    return {
        id: String(source.id || makeId('s')),
        nama: String(source.nama || 'Siswa Baru').trim() || 'Siswa Baru',
        kelas: String(source.kelas || 'Kelas 1 SD / Fase A').trim() || 'Kelas 1 SD / Fase A',
        nisn: String(source.nisn || '-').trim() || '-',
        sekolah: String(source.sekolah || '-').trim() || '-'
    };
}

function createDefaultStudent() {
    return {
        id: 's_1',
        nama: 'Budi Santoso',
        kelas: 'Kelas 2 SD / Fase A',
        nisn: '01',
        sekolah: 'SD Negeri Merdeka'
    };
}

function getStudents() {
    const parsed = safeParse(readRaw(STORAGE_KEYS.STUDENTS), null);
    let students = Array.isArray(parsed) ? parsed.map(normalizeStudent) : [];

    if (!students.length) {
        students = [normalizeStudent(createDefaultStudent())];
        writeRaw(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
        writeRaw(STORAGE_KEYS.ACTIVE_STUDENT, students[0].id);
    }

    // Pastikan tidak ada ID ganda.
    const seen = new Set();
    students = students.map((student) => {
        if (seen.has(student.id)) {
            student = { ...student, id: makeId('s') };
        }
        seen.add(student.id);
        return student;
    });

    // Pastikan siswa aktif valid.
    const activeId = readRaw(STORAGE_KEYS.ACTIVE_STUDENT);
    if (!activeId || !students.some((student) => student.id === activeId)) {
        writeRaw(STORAGE_KEYS.ACTIVE_STUDENT, students[0].id);
    }

    return students;
}

function saveStudents(students) {
    const normalized = (Array.isArray(students) ? students : []).map(normalizeStudent);
    writeRaw(STORAGE_KEYS.STUDENTS, JSON.stringify(normalized));
    return normalized;
}

function saveStudent(studentObj) {
    const students = getStudents();
    const student = normalizeStudent(studentObj);
    students.push(student);
    saveStudents(students);
    setActiveStudentId(student.id);
    return student;
}

function updateStudent(studentId, patch) {
    const students = getStudents().map((student) => (
        student.id === studentId ? normalizeStudent({ ...student, ...patch, id: student.id }) : student
    ));
    saveStudents(students);
    return students.find((student) => student.id === studentId) || null;
}

function deleteStudent(studentId) {
    const students = getStudents();
    const remaining = students.filter((student) => student.id !== studentId);

    if (!remaining.length) {
        return false;
    }

    saveStudents(remaining);

    const scores = getScores();
    delete scores[studentId];
    writeRaw(STORAGE_KEYS.SCORES, JSON.stringify(scores));

    const history = getHistory().filter((item) => item.studentId !== studentId);
    writeRaw(STORAGE_KEYS.HISTORY, JSON.stringify(history));

    if (getActiveStudentId() === studentId) {
        setActiveStudentId(remaining[0].id);
    }

    return true;
}

function getActiveStudentId() {
    const id = readRaw(STORAGE_KEYS.ACTIVE_STUDENT);
    if (id) return id;
    const students = getStudents();
    return students[0] ? students[0].id : 's_1';
}

function setActiveStudentId(id) {
    writeRaw(STORAGE_KEYS.ACTIVE_STUDENT, String(id));
}

function getActiveStudent() {
    const students = getStudents();
    const activeId = getActiveStudentId();
    return students.find((student) => student.id === activeId) || students[0];
}

// ------------------------------------------------------------
// 2. Nilai & Riwayat
// ------------------------------------------------------------
function getScores() {
    return safeReadObject(STORAGE_KEYS.SCORES, {});
}

function getHistory(studentId = null) {
    const parsed = safeParse(readRaw(STORAGE_KEYS.HISTORY), []);
    const history = Array.isArray(parsed) ? parsed.filter((item) => item && typeof item === 'object') : [];
    const filtered = studentId ? history.filter((item) => item.studentId === studentId) : history;
    return filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

function saveQuizScore(studentId, subjectName, score, totalQuestions, meta = {}) {
    const total = Math.max(0, Number(totalQuestions) || 0);
    const correct = Math.max(0, Math.min(Number(score) || 0, total));
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const dateLabel = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const timestamp = Date.now();

    const scores = getScores();
    if (!scores[studentId] || typeof scores[studentId] !== 'object') {
        scores[studentId] = {};
    }

    const previous = scores[studentId][subjectName] || {};
    const previousBest = Number(previous.bestPercentage);
    const isNewBest = !Number.isFinite(previousBest) || percentage >= previousBest;

    scores[studentId][subjectName] = {
        score: correct,
        total,
        percentage,
        stars: Math.max(0, Math.round(percentage / 20)),
        date: dateLabel,
        timestamp,
        bestScore: isNewBest ? correct : Number(previous.bestScore) || 0,
        bestTotal: isNewBest ? total : Number(previous.bestTotal) || total,
        bestPercentage: isNewBest ? percentage : previousBest,
        attempts: (Number(previous.attempts) || 0) + 1
    };
    writeRaw(STORAGE_KEYS.SCORES, JSON.stringify(scores));

    const history = getHistory();
    history.unshift({
        id: makeId('h'),
        studentId,
        subject: subjectName,
        score: correct,
        total,
        percentage,
        stars: Math.max(0, Math.round(percentage / 20)),
        date: dateLabel,
        timestamp,
        durationSeconds: Math.max(0, Number(meta.durationSeconds) || 0),
        mode: meta.mode === 'exam' ? 'Ujian' : 'Latihan',
        source: meta.source || 'bank'
    });
    writeRaw(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 200)));

    return scores[studentId][subjectName];
}

function resetStudentProgress(studentId) {
    const scores = getScores();
    delete scores[studentId];
    writeRaw(STORAGE_KEYS.SCORES, JSON.stringify(scores));

    const history = getHistory().filter((item) => item.studentId !== studentId);
    writeRaw(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

// ------------------------------------------------------------
// 3. Bank Soal Guru
// ------------------------------------------------------------
function normalizeQuestion(question, index = 0) {
    const source = question && typeof question === 'object' ? question : {};
    const rawOptions = Array.isArray(source.options) ? source.options : [];
    const options = [0, 1, 2, 3].map((i) => String(rawOptions[i] ?? '').trim());
    const correct = Number(source.correct);

    return {
        id: String(source.id || makeId('q')),
        phase: ['faseA', 'faseB', 'faseC'].includes(source.phase) ? source.phase : 'faseA',
        subject: ['mtk', 'ipas', 'indo', 'inggris'].includes(source.subject) ? source.subject : 'mtk',
        q: String(source.q || `Soal ${index + 1}`).trim() || `Soal ${index + 1}`,
        options,
        correct: Number.isInteger(correct) && correct >= 0 && correct <= 3 ? correct : 0,
        exp: String(source.exp || 'Pembahasan belum diisi.').trim() || 'Pembahasan belum diisi.',
        source: source.source === 'ai' ? 'ai' : 'manual',
        createdAt: source.createdAt || new Date().toISOString()
    };
}

function getCustomQuestions() {
    const parsed = safeParse(readRaw(STORAGE_KEYS.CUSTOM_QUESTIONS), []);
    return Array.isArray(parsed)
        ? parsed
            .filter((question) => question && typeof question === 'object')
            .map((question, index) => normalizeQuestion(question, index))
        : [];
}

function saveCustomQuestion(questionObj) {
    const list = getCustomQuestions();
    const question = normalizeQuestion(questionObj, list.length);
    list.push(question);
    writeRaw(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(list));
    return question;
}

function saveCustomQuestions(questionList) {
    const list = getCustomQuestions();
    const added = (Array.isArray(questionList) ? questionList : []).map((question, index) => (
        normalizeQuestion(question, list.length + index)
    ));
    writeRaw(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify([...list, ...added]));
    return added;
}

function deleteCustomQuestion(questionId) {
    const list = getCustomQuestions();
    const next = list.filter((question) => question.id !== questionId);
    if (next.length === list.length) return false;
    writeRaw(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(next));
    return true;
}

// ------------------------------------------------------------
// 4. API Key & Pengaturan
// ------------------------------------------------------------
function getGeminiApiKey() {
    return String(readRaw(STORAGE_KEYS.API_KEY) || '').trim();
}

function saveGeminiApiKey(key) {
    writeRaw(STORAGE_KEYS.API_KEY, String(key || '').trim());
}

function getSettings() {
    const settings = safeReadObject(STORAGE_KEYS.SETTINGS, {});
    return {
        phase: ['faseA', 'faseB', 'faseC'].includes(settings.phase) ? settings.phase : 'faseA',
        subject: ['mtk', 'ipas', 'indo', 'inggris'].includes(settings.subject) ? settings.subject : 'mtk',
        lastSection: typeof settings.lastSection === 'string' ? settings.lastSection : 'beranda'
    };
}

function saveSettings(patch) {
    const next = { ...getSettings(), ...(patch || {}) };
    writeRaw(STORAGE_KEYS.SETTINGS, JSON.stringify(next));
    return next;
}

// ------------------------------------------------------------
// 5. Ekspor / Impor / Reset
// ------------------------------------------------------------
function exportAllData() {
    return {
        app: 'ruang-belajar-abah',
        version: STORAGE_VERSION,
        exportedAt: new Date().toISOString(),
        students: getStudents(),
        activeStudentId: getActiveStudentId(),
        scores: getScores(),
        history: getHistory(),
        customQuestions: getCustomQuestions(),
        settings: getSettings()
    };
}

function importAllData(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('File cadangan tidak valid.');
    }

    const students = Array.isArray(data.students) ? data.students.map(normalizeStudent) : [];
    if (!students.length) {
        throw new Error('File cadangan tidak berisi data siswa.');
    }

    const scores = data.scores && typeof data.scores === 'object' && !Array.isArray(data.scores) ? data.scores : {};
    const history = Array.isArray(data.history) ? data.history : [];
    const customQuestions = Array.isArray(data.customQuestions) ? data.customQuestions : [];
    const settings = data.settings && typeof data.settings === 'object' ? data.settings : {};

    saveStudents(students);
    writeRaw(STORAGE_KEYS.SCORES, JSON.stringify(scores));
    writeRaw(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    writeRaw(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(customQuestions.map((question, index) => normalizeQuestion(question, index))));
    writeRaw(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...getSettings(), ...settings }));

    const activeId = students.some((student) => student.id === data.activeStudentId)
        ? data.activeStudentId
        : students[0].id;
    setActiveStudentId(activeId);

    return { students: students.length, questions: customQuestions.length, history: history.length };
}

function resetAllAppData() {
    Object.values(STORAGE_KEYS).forEach(removeRaw);
}
