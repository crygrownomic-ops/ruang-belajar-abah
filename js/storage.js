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
    SETTINGS: 'rba_settings',
    GAMIFICATION: 'rba_gamification_profiles',
    JOURNAL: 'rba_teaching_journal',
    ITEM_STATS: 'rba_item_stats',
    LESSON_PLANS: 'rba_lesson_plans',
    ACCESSIBILITY: 'rba_accessibility_settings',
    ADVENTURE: 'rba_adventure_progress'
};

const STORAGE_VERSION = 3;
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
// 5. Gamifikasi, Jurnal, Statistik Soal, Paket Modul, Aksesibilitas
// ------------------------------------------------------------
function readJsonArray(key) {
    const parsed = safeParse(readRaw(key), []);
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item === 'object') : [];
}

function getGamificationData() {
    return safeReadObject(STORAGE_KEYS.GAMIFICATION, {});
}

function saveGamificationData(data) {
    writeRaw(STORAGE_KEYS.GAMIFICATION, JSON.stringify(data && typeof data === 'object' ? data : {}));
}

function getAdventureProgress() {
    return safeReadObject(STORAGE_KEYS.ADVENTURE, {});
}

function saveAdventureProgress(data) {
    writeRaw(STORAGE_KEYS.ADVENTURE, JSON.stringify(data && typeof data === 'object' ? data : {}));
}

function getJournalEntries() {
    return readJsonArray(STORAGE_KEYS.JOURNAL)
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

function saveJournalEntry(entry) {
    const list = getJournalEntries();
    const normalized = {
        id: String(entry.id || makeId('j')),
        date: String(entry.date || new Date().toISOString().slice(0, 10)),
        studentId: String(entry.studentId || ''),
        type: String(entry.type || 'jurnal'),
        title: String(entry.title || '').trim() || 'Catatan belajar',
        topic: String(entry.topic || '').trim(),
        activity: String(entry.activity || '').trim(),
        reflection: String(entry.reflection || '').trim(),
        followUp: String(entry.followUp || '').trim(),
        mood: String(entry.mood || ''),
        minutes: Math.max(0, Number(entry.minutes) || 0),
        createdAt: Number(entry.createdAt) || Date.now()
    };

    const index = list.findIndex((item) => item.id === normalized.id);
    if (index >= 0) list[index] = normalized;
    else list.unshift(normalized);

    writeRaw(STORAGE_KEYS.JOURNAL, JSON.stringify(list.slice(0, 500)));
    return normalized;
}

function deleteJournalEntry(entryId) {
    const list = getJournalEntries();
    const next = list.filter((item) => item.id !== entryId);
    if (next.length === list.length) return false;
    writeRaw(STORAGE_KEYS.JOURNAL, JSON.stringify(next));
    return true;
}

function hashString(value) {
    let hash = 5381;
    const text = String(value || '');
    for (let i = 0; i < text.length; i += 1) {
        hash = ((hash << 5) + hash) ^ text.charCodeAt(i);
    }
    return (hash >>> 0).toString(36);
}

function getQuestionKey(questionText) {
    return `q_${hashString(String(questionText || '').trim().toLowerCase())}`;
}

function getItemStats() {
    return safeReadObject(STORAGE_KEYS.ITEM_STATS, {});
}

function recordQuestionAttempt(question, isCorrect, meta = {}) {
    if (!question || !question.q) return null;

    const stats = getItemStats();
    const key = getQuestionKey(question.q);
    const previous = stats[key] && typeof stats[key] === 'object' ? stats[key] : {};
    const entry = {
        id: key,
        q: String(question.q),
        subject: String(meta.subject || previous.subject || 'mtk'),
        phase: String(meta.phase || previous.phase || 'faseA'),
        attempts: (Number(previous.attempts) || 0) + 1,
        correct: (Number(previous.correct) || 0) + (isCorrect ? 1 : 0),
        lastAt: Date.now()
    };

    stats[key] = entry;
    writeRaw(STORAGE_KEYS.ITEM_STATS, JSON.stringify(stats));
    return entry;
}

function getLessonPlans() {
    return readJsonArray(STORAGE_KEYS.LESSON_PLANS)
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

function saveLessonPlan(plan) {
    const list = getLessonPlans();
    const normalized = {
        id: String(plan.id || makeId('lp')),
        title: String(plan.title || 'Modul Ajar').trim() || 'Modul Ajar',
        subject: String(plan.subject || 'mtk'),
        phase: String(plan.phase || 'faseA'),
        topic: String(plan.topic || '').trim(),
        html: String(plan.html || ''),
        createdAt: Number(plan.createdAt) || Date.now()
    };

    const index = list.findIndex((item) => item.id === normalized.id);
    if (index >= 0) list[index] = normalized;
    else list.unshift(normalized);

    writeRaw(STORAGE_KEYS.LESSON_PLANS, JSON.stringify(list.slice(0, 100)));
    return normalized;
}

function deleteLessonPlan(planId) {
    const list = getLessonPlans();
    const next = list.filter((item) => item.id !== planId);
    if (next.length === list.length) return false;
    writeRaw(STORAGE_KEYS.LESSON_PLANS, JSON.stringify(next));
    return true;
}

function getAccessibilitySettings() {
    const saved = safeReadObject(STORAGE_KEYS.ACCESSIBILITY, {});
    return {
        largeText: Boolean(saved.largeText),
        dyslexiaFont: Boolean(saved.dyslexiaFont),
        highContrast: Boolean(saved.highContrast),
        reduceMotion: Boolean(saved.reduceMotion),
        autoRead: Boolean(saved.autoRead),
        language: saved.language === 'en' ? 'en' : 'id'
    };
}

function saveAccessibilitySettings(patch) {
    const next = { ...getAccessibilitySettings(), ...(patch || {}) };
    writeRaw(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(next));
    return next;
}

// ------------------------------------------------------------
// 6. Ekspor / Impor / Reset
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
        settings: getSettings(),
        gamification: getGamificationData(),
        adventure: getAdventureProgress(),
        journal: getJournalEntries(),
        itemStats: getItemStats(),
        lessonPlans: getLessonPlans(),
        accessibility: getAccessibilitySettings()
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

    if (data.gamification && typeof data.gamification === 'object') {
        writeRaw(STORAGE_KEYS.GAMIFICATION, JSON.stringify(data.gamification));
    }
    if (data.adventure && typeof data.adventure === 'object') {
        writeRaw(STORAGE_KEYS.ADVENTURE, JSON.stringify(data.adventure));
    }
    if (Array.isArray(data.journal)) {
        writeRaw(STORAGE_KEYS.JOURNAL, JSON.stringify(data.journal));
    }
    if (data.itemStats && typeof data.itemStats === 'object') {
        writeRaw(STORAGE_KEYS.ITEM_STATS, JSON.stringify(data.itemStats));
    }
    if (Array.isArray(data.lessonPlans)) {
        writeRaw(STORAGE_KEYS.LESSON_PLANS, JSON.stringify(data.lessonPlans));
    }
    if (data.accessibility && typeof data.accessibility === 'object') {
        writeRaw(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(data.accessibility));
    }

    const activeId = students.some((student) => student.id === data.activeStudentId)
        ? data.activeStudentId
        : students[0].id;
    setActiveStudentId(activeId);

    return { students: students.length, questions: customQuestions.length, history: history.length };
}

function resetAllAppData() {
    Object.values(STORAGE_KEYS).forEach(removeRaw);
}
