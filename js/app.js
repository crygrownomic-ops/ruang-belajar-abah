// ============================================================
// Application Logic
// Navigasi, materi, kuis, timer, LKPD, bank soal, AI, rapor
// ============================================================

const SUBJECTS = {
    mtk: { label: 'Matematika', short: 'Matematika', icon: 'fa-calculator' },
    ipas: { label: 'IPAS', short: 'IPAS', icon: 'fa-leaf' },
    indo: { label: 'Bahasa Indonesia', short: 'B. Indonesia', icon: 'fa-book' },
    inggris: { label: 'Bahasa Inggris', short: 'B. Inggris', icon: 'fa-language' }
};

const PHASES = {
    faseA: { label: 'Fase A (Kelas 1-2)', short: 'Fase A', modulValue: 'Fase A (Kelas 1-2 SD)' },
    faseB: { label: 'Fase B (Kelas 3-4)', short: 'Fase B', modulValue: 'Fase B (Kelas 3-4 SD)' },
    faseC: { label: 'Fase C (Kelas 5-6)', short: 'Fase C', modulValue: 'Fase C (Kelas 5-6 SD)' }
};

const SECTION_IDS = ['beranda', 'materi', 'kuis', 'ai', 'modul-ai', 'editor-kuis', 'rapor'];

const DEFAULT_CHAT_HTML = `
    <div class="flex items-start space-x-2">
        <div class="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-sm shrink-0"><i class="fa-solid fa-robot" aria-hidden="true"></i></div>
        <div class="bg-indigo-100 text-indigo-950 p-4 rounded-3xl rounded-tl-none max-w-[85%] text-sm font-medium leading-relaxed shadow-sm">
            Halo Teman Cilik & Bapak/Ibu Guru! Saya Ninna Guru AI. Ada materi yang perlu dijelaskan atau didiskusikan hari ini? 😊
        </div>
    </div>`;

let currentPhase = 'faseA';
let currentSubject = 'mtk';
let currentTopicId = null;

let customAIQuiz = [];
let generatedQuizMeta = null;
let generatedSaved = false;

let chatBusy = false;
let printCleanupTimer = null;

const quiz = {
    active: false,
    finished: false,
    list: [],
    index: 0,
    score: 0,
    answers: [],
    subject: 'mtk',
    phase: 'faseA',
    examMode: false,
    timeLimit: 0,
    remaining: 0,
    startedAt: 0,
    endedAt: 0,
    autoSubmitted: false,
    source: 'bank',
    timerId: null
};

// ------------------------------------------------------------
// Inisialisasi
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    const settings = getSettings();
    currentPhase = settings.phase;
    currentSubject = settings.subject;

    applyPhaseUI();
    syncSetupControls();
    updateStudentDisplay();
    renderSubjectTabs();
    renderMateri();
    renderCustomQuestions();
    renderHomeStats();
    updateApiKeyStatus();
    updateBankBadge();
    updateQuizSetupInfo();
    setupEnterKeyForChat();
    setupModalBackdrops();
    setupSelectListeners();
    setupNetworkListeners();

    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = String(new Date().getFullYear());

    const modulPhase = document.getElementById('modul-phase');
    if (modulPhase) modulPhase.value = PHASES[currentPhase]?.modulValue || PHASES.faseA.modulValue;

    const initialHash = window.location.hash.replace('#', '');
    const initialSection = SECTION_IDS.includes(initialHash) ? initialHash : 'beranda';
    showSection(initialSection, { skipHash: true });

    window.addEventListener('afterprint', cleanupPrintArea);
    window.addEventListener('beforeunload', (event) => {
        if (quiz.active) {
            event.preventDefault();
            event.returnValue = '';
        }
    });
}

function setupSelectListeners() {
    ['quiz-phase', 'quiz-subject', 'select-exam-time'].forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.addEventListener('change', updateQuizSetupInfo);
    });
}

function setupModalBackdrops() {
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.addEventListener('click', (event) => {
            if (event.target === backdrop) backdrop.classList.add('hidden');
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        ['modal-siswa', 'modal-apikey', 'modal-remedial'].forEach((id) => {
            const modal = document.getElementById(id);
            if (modal) modal.classList.add('hidden');
        });
    });
}

function setupNetworkListeners() {
    window.addEventListener('offline', () => {
        showToast('Koneksi internet terputus. Fitur AI dan pengambilan data online tidak tersedia.', 'warning', 5000);
    });
    window.addEventListener('online', () => {
        showToast('Koneksi internet kembali tersambung.', 'success');
    });
}

// ------------------------------------------------------------
// Navigasi
// ------------------------------------------------------------
function showSection(sectionId, options = {}) {
    if (!SECTION_IDS.includes(sectionId)) return;

    if (sectionId !== 'kuis' && quiz.active) {
        abandonQuiz(true);
        showToast('Kuis dihentikan karena kamu berpindah halaman.', 'warning');
    }

    document.querySelectorAll('main > section').forEach((section) => section.classList.add('hidden'));

    const target = document.getElementById(`sec-${sectionId}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach((button) => button.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${sectionId}`);
    if (activeNav) activeNav.classList.add('active');

    if (sectionId === 'materi') renderMateri();
    if (sectionId === 'kuis') renderQuizSection();
    if (sectionId === 'rapor') renderRaporAndDiagnostic();
    if (sectionId === 'editor-kuis') {
        renderCustomQuestions();
        updateBankBadge();
    }
    if (sectionId === 'ai') updateApiKeyStatus();
    if (sectionId === 'modul-ai') updateApiKeyStatus();

    saveSettings({ lastSection: sectionId });

    if (!options.skipHash) {
        try {
            window.history.replaceState(null, '', `#${sectionId}`);
        } catch (err) {
            // abaikan
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ------------------------------------------------------------
// Pengaturan Fase & Mata Pelajaran
// ------------------------------------------------------------
function setPhase(phaseKey) {
    if (!PHASES[phaseKey]) return;
    currentPhase = phaseKey;
    saveSettings({ phase: phaseKey });
    applyPhaseUI();
    renderSubjectTabs();
    renderMateri();
    updateSubjectCounts();
    updateQuizSetupInfo();
}

function selectSubject(subjectKey) {
    if (!SUBJECTS[subjectKey]) return;
    currentSubject = subjectKey;
    saveSettings({ subject: subjectKey });
    syncSetupControls();
    renderSubjectTabs();
    renderMateri();
    showSection('materi');
}

function applyPhaseUI() {
    Object.keys(PHASES).forEach((key) => {
        const button = document.getElementById(`btn-${key}`);
        if (button) button.classList.toggle('active', key === currentPhase);
    });

    const homePhase = document.getElementById('home-phase-select');
    if (homePhase) homePhase.value = currentPhase;

    const quizPhase = document.getElementById('quiz-phase');
    if (quizPhase) quizPhase.value = currentPhase;

    const quizSubject = document.getElementById('quiz-subject');
    if (quizSubject) quizSubject.value = currentSubject;

    const customPhase = document.getElementById('custom-phase');
    if (customPhase) customPhase.value = currentPhase;

    const customSubject = document.getElementById('custom-subject');
    if (customSubject) customSubject.value = currentSubject;

    const genPhase = document.getElementById('gen-phase');
    if (genPhase) genPhase.value = currentPhase;

    const genSubject = document.getElementById('gen-subject');
    if (genSubject) genSubject.value = currentSubject;

    const modulPhase = document.getElementById('modul-phase');
    if (modulPhase && !quiz.active) modulPhase.value = PHASES[currentPhase]?.modulValue || PHASES.faseA.modulValue;
}

function syncSetupControls() {
    const quizPhase = document.getElementById('quiz-phase');
    if (quizPhase) quizPhase.value = currentPhase;

    const quizSubject = document.getElementById('quiz-subject');
    if (quizSubject) quizSubject.value = currentSubject;
}

// ------------------------------------------------------------
// Siswa
// ------------------------------------------------------------
function updateStudentDisplay() {
    const active = getActiveStudent();
    if (!active) return;

    const display = document.getElementById('active-student-display');
    if (display) display.textContent = active.nama;

    const avatar = document.getElementById('active-student-avatar');
    if (avatar) avatar.textContent = (active.nama || '?').trim().charAt(0).toUpperCase() || '?';

    const welcome = document.getElementById('welcome-heading');
    if (welcome) welcome.textContent = `Halo ${active.nama}! 👋`;

    const button = display?.closest('button');
    if (button) button.title = `${active.nama} — ${active.kelas}`;
}

function openStudentModal() {
    const students = getStudents();
    const activeId = getActiveStudentId();
    const select = document.getElementById('student-select');

    if (select) {
        select.innerHTML = students.map((student) => `
            <option value="${escapeHtml(student.id)}" ${student.id === activeId ? 'selected' : ''}>
                ${escapeHtml(student.nama)} (${escapeHtml(student.kelas)})
            </option>
        `).join('');
    }

    document.getElementById('modal-siswa')?.classList.remove('hidden');
}

function closeStudentModal() {
    document.getElementById('modal-siswa')?.classList.add('hidden');
}

function changeActiveStudent() {
    const select = document.getElementById('student-select');
    if (!select || !select.value) return;

    setActiveStudentId(select.value);
    updateStudentDisplay();
    renderHomeStats();
    renderRaporAndDiagnostic();
    closeStudentModal();
    showToast(`Siswa aktif diganti ke ${getActiveStudent().nama}.`, 'success');
}

function handleSaveStudent(event) {
    event.preventDefault();

    const nama = document.getElementById('input-nama')?.value.trim() || '';
    const kelas = document.getElementById('input-kelas')?.value || 'Kelas 1 SD / Fase A';
    const nisn = document.getElementById('input-nisn')?.value.trim() || '-';
    const sekolah = document.getElementById('input-sekolah')?.value.trim() || '-';

    if (!nama) {
        showToast('Nama siswa wajib diisi.', 'error');
        return;
    }

    const duplicate = getStudents().some((student) => student.nama.toLowerCase() === nama.toLowerCase());
    if (duplicate && !window.confirm(`Siswa bernama "${nama}" sudah ada. Tetap tambahkan sebagai siswa baru?`)) {
        return;
    }

    saveStudent({ nama, kelas, nisn, sekolah });
    event.target.reset();
    updateStudentDisplay();
    renderHomeStats();
    closeStudentModal();
    showToast(`Siswa "${nama}" berhasil ditambahkan.`, 'success');
}

function deleteActiveStudent() {
    const active = getActiveStudent();
    if (!active) return;

    if (getStudents().length <= 1) {
        showToast('Minimal harus ada satu siswa. Tambahkan siswa lain sebelum menghapus.', 'warning');
        return;
    }

    if (!window.confirm(`Hapus siswa "${active.nama}" beserta semua nilai dan riwayatnya? Tindakan ini tidak bisa dibatalkan.`)) {
        return;
    }

    const deleted = deleteStudent(active.id);
    if (!deleted) {
        showToast('Siswa gagal dihapus.', 'error');
        return;
    }

    updateStudentDisplay();
    renderHomeStats();
    renderRaporAndDiagnostic();
    openStudentModal();
    showToast(`Siswa "${active.nama}" telah dihapus.`, 'success');
}

function resetActiveStudentProgress() {
    const active = getActiveStudent();
    if (!active) return;

    if (!window.confirm(`Reset semua nilai dan riwayat kuis untuk "${active.nama}"?`)) return;

    resetStudentProgress(active.id);
    renderHomeStats();
    renderRaporAndDiagnostic();
    showToast(`Nilai ${active.nama} berhasil direset.`, 'success');
}

function exportAppData() {
    const data = exportAllData();
    const date = new Date().toISOString().slice(0, 10);
    downloadBlob(
        JSON.stringify(data, null, 2),
        `ruang-belajar-abah-backup-${date}.json`,
        'application/json'
    );
    showToast('Data berhasil diekspor. Simpan file JSON di tempat yang aman.', 'success');
}

async function importAppData(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file terlalu besar. Maksimal 5 MB.', 'error');
        return;
    }

    try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!window.confirm('Impor data ini? Data siswa, nilai, dan bank soal saat ini akan diganti.')) return;

        const summary = importAllData(data);
        resetGeminiChat();
        resetChatUI();
        resetQuizState();
        closeStudentModal();
        refreshAllUI();
        showSection('beranda');
        showToast(`Impor berhasil: ${summary.students} siswa, ${summary.questions} soal.`, 'success', 5000);
    } catch (err) {
        showToast(err.message || 'File cadangan tidak valid.', 'error', 5000);
    }
}

function handleResetAllAppData() {
    if (!window.confirm('Reset SEMUA data aplikasi (siswa, nilai, riwayat, bank soal, dan API key)? Tindakan ini tidak bisa dibatalkan.')) {
        return;
    }

    resetAllAppData();
    resetGeminiChat();
    resetChatUI();
    resetQuizState();
    closeStudentModal();
    refreshAllUI();
    showSection('beranda');
    showToast('Semua data aplikasi telah direset.', 'success');
}

function refreshAllUI() {
    const settings = getSettings();
    currentPhase = settings.phase;
    currentSubject = settings.subject;

    applyPhaseUI();
    syncSetupControls();
    updateStudentDisplay();
    renderSubjectTabs();
    renderMateri();
    renderCustomQuestions();
    renderHomeStats();
    updateApiKeyStatus();
    updateBankBadge();
    updateQuizSetupInfo();
}

// ------------------------------------------------------------
// Materi
// ------------------------------------------------------------
function renderSubjectTabs() {
    const container = document.getElementById('materi-subject-tabs');
    if (!container) return;

    container.innerHTML = Object.entries(SUBJECTS).map(([key, subject]) => {
        const active = key === currentSubject;
        const classes = active
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700';
        return `
            <button onclick="selectSubject('${key}')" class="px-4 py-2 rounded-2xl border-2 text-xs font-extrabold transition flex items-center gap-2 ${classes}">
                <i class="fa-solid ${subject.icon}" aria-hidden="true"></i> ${subject.label}
            </button>
        `;
    }).join('');
}

function renderMateri() {
    const subjectData = KURIKULUM_DATA?.[currentPhase]?.[currentSubject];
    const topicList = document.getElementById('materi-topic-list');
    const topicCount = document.getElementById('materi-topic-count');
    const subjectLabel = document.getElementById('materi-subject-label');

    if (subjectLabel) {
        subjectLabel.textContent = `${SUBJECTS[currentSubject]?.label || currentSubject} • ${PHASES[currentPhase]?.short || currentPhase}`;
    }

    if (!subjectData || !Array.isArray(subjectData.topics) || !subjectData.topics.length) {
        if (topicList) {
            topicList.innerHTML = `<div class="text-xs text-slate-400 font-semibold p-3 bg-slate-50 rounded-2xl">Materi belum tersedia untuk pilihan ini.</div>`;
        }
        if (topicCount) topicCount.textContent = '0 topik';
        const title = document.getElementById('materi-title');
        const body = document.getElementById('materi-body');
        if (title) title.textContent = 'Materi Belum Tersedia';
        if (body) body.textContent = 'Silakan pilih fase atau mata pelajaran lain.';
        return;
    }

    const topics = subjectData.topics;
    const activeTopic = topics.find((topic) => topic.id === currentTopicId) || topics[0];
    currentTopicId = activeTopic.id;

    if (topicCount) topicCount.textContent = `${topics.length} topik`;

    if (topicList) {
        topicList.innerHTML = topics.map((topic, index) => `
            <button onclick="displayMateriContent('${escapeHtml(topic.id)}')" data-topic-id="${escapeHtml(topic.id)}" class="materi-topic-btn w-full text-left p-3 rounded-2xl text-xs font-bold border border-transparent hover:bg-indigo-50 hover:text-indigo-900 transition flex items-start gap-2">
                <span class="w-6 h-6 shrink-0 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black">${index + 1}</span>
                <span>${escapeHtml(topic.name)}</span>
            </button>
        `).join('');
    }

    displayMateriContent(activeTopic.id);
    updateSubjectCounts();
}

function displayMateriContent(topicId) {
    const subjectData = KURIKULUM_DATA?.[currentPhase]?.[currentSubject];
    if (!subjectData || !Array.isArray(subjectData.topics)) return;

    const topic = subjectData.topics.find((item) => item.id === topicId);
    if (!topic) return;

    currentTopicId = topic.id;

    const title = document.getElementById('materi-title');
    const body = document.getElementById('materi-body');
    if (title) title.textContent = topic.name;
    if (body) body.textContent = topic.content;

    document.querySelectorAll('#materi-topic-list .materi-topic-btn').forEach((button) => {
        button.classList.toggle('active', button.dataset.topicId === topic.id);
    });

    stopSpeaking();
}

function toggleReadAloudMateri() {
    if (isSpeaking()) {
        stopSpeaking();
        return;
    }

    const title = document.getElementById('materi-title')?.textContent || '';
    const body = document.getElementById('materi-body')?.textContent || '';
    const started = speakText(`${title}. ${body}`);

    if (started) {
        const label = document.querySelector('#btn-read-materi span');
        if (label) label.textContent = 'Berhenti';
    }
}

function readAloudMateri() {
    toggleReadAloudMateri();
}

function practiceCurrentSubject() {
    syncSetupControls();
    showSection('kuis');
    startQuizFromSetup();
}

// ------------------------------------------------------------
// Kuis: Persiapan
// ------------------------------------------------------------
function toggleExamMode() {
    const checkbox = document.getElementById('chk-mode-ujian');
    const timeSelect = document.getElementById('select-exam-time');
    const enabled = Boolean(checkbox?.checked);

    if (timeSelect) timeSelect.classList.toggle('hidden', !enabled);
    updateQuizSetupInfo();
}

function updateQuizSetupInfo() {
    const info = document.getElementById('quiz-setup-info');
    if (!info) return;

    const phase = document.getElementById('quiz-phase')?.value || currentPhase;
    const subject = document.getElementById('quiz-subject')?.value || currentSubject;
    const count = getQuizBank(phase, subject).length;
    const examMode = Boolean(document.getElementById('chk-mode-ujian')?.checked);
    const minutes = parseInt(document.getElementById('select-exam-time')?.value, 10) || 10;

    if (count === 0) {
        info.className = 'text-xs font-bold text-rose-700 bg-rose-50 rounded-2xl p-3 border border-rose-200';
        info.innerHTML = '<i class="fa-solid fa-circle-exclamation mr-1"></i> Belum ada soal untuk pilihan ini. Tambahkan soal di menu Bank Soal Guru.';
        return;
    }

    info.className = 'text-xs font-semibold text-slate-600 bg-slate-50 rounded-2xl p-3 border border-slate-200';
    info.innerHTML = `<i class="fa-solid fa-circle-info mr-1 text-indigo-500"></i> <strong>${count} soal</strong> tersedia untuk ${escapeHtml(SUBJECTS[subject]?.label || subject)} • ${escapeHtml(PHASES[phase]?.short || phase)}. ${examMode ? `Mode ujian: soal diacak dan waktu ${minutes} menit.` : 'Mode latihan: tanpa batas waktu, pembahasan langsung muncul.'}`;
}

function getQuizBank(phase = currentPhase, subject = currentSubject) {
    const base = KURIKULUM_DATA?.[phase]?.[subject]?.quiz || [];
    const custom = getCustomQuestions().filter((question) => question.phase === phase && question.subject === subject);
    return [...base, ...custom].map(normalizeQuizItem).filter(Boolean);
}

function normalizeQuizItem(item) {
    if (!item || typeof item !== 'object') return null;

    const questionText = String(item.q || '').trim();
    const options = Array.isArray(item.options) ? item.options.map((option) => String(option ?? '').trim()) : [];
    if (!questionText || options.length < 4 || options.slice(0, 4).some((option) => !option)) return null;

    let correct = Number(item.correct);
    if (!Number.isInteger(correct) || correct < 0 || correct > 3) correct = 0;

    return {
        q: questionText,
        options: options.slice(0, 4),
        correct,
        exp: String(item.exp || 'Pembahasan belum tersedia.').trim() || 'Pembahasan belum tersedia.',
        source: item.source || 'bank'
    };
}

function shuffleArray(list) {
    const array = [...list];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuizFromSetup() {
    const phase = document.getElementById('quiz-phase')?.value || currentPhase;
    const subject = document.getElementById('quiz-subject')?.value || currentSubject;
    const examMode = Boolean(document.getElementById('chk-mode-ujian')?.checked);
    const minutes = parseInt(document.getElementById('select-exam-time')?.value, 10) || 10;

    if (!PHASES[phase] || !SUBJECTS[subject]) return;

    currentPhase = phase;
    currentSubject = subject;
    saveSettings({ phase, subject });
    applyPhaseUI();
    renderSubjectTabs();
    renderMateri();

    startQuiz(subject, phase, { examMode, minutes, source: 'bank' });
}

function startQuiz(subjectKey, phaseKey, options = {}) {
    const subject = SUBJECTS[subjectKey] ? subjectKey : 'mtk';
    const phase = PHASES[phaseKey] ? phaseKey : 'faseA';
    const examMode = Boolean(options.examMode);
    const minutes = Math.max(1, parseInt(options.minutes, 10) || 10);
    const source = options.source === 'ai' ? 'ai' : 'bank';

    let list;
    if (Array.isArray(options.list)) {
        list = options.list.map(normalizeQuizItem).filter(Boolean);
    } else {
        list = getQuizBank(phase, subject);
    }

    if (!list.length) {
        showToast('Belum ada soal untuk pilihan ini. Tambahkan soal di Bank Soal Guru.', 'warning');
        showQuizSetup();
        return;
    }

    stopQuizTimer();
    stopSpeaking();

    quiz.active = true;
    quiz.finished = false;
    quiz.autoSubmitted = false;
    quiz.list = examMode ? shuffleArray(list) : list;
    quiz.index = 0;
    quiz.score = 0;
    quiz.answers = new Array(quiz.list.length).fill(null);
    quiz.subject = subject;
    quiz.phase = phase;
    quiz.examMode = examMode;
    quiz.timeLimit = examMode ? minutes * 60 : 0;
    quiz.remaining = quiz.timeLimit;
    quiz.startedAt = Date.now();
    quiz.endedAt = 0;
    quiz.source = source;

    currentPhase = phase;
    currentSubject = subject;
    saveSettings({ phase, subject });

    showQuizPlay();
    renderQuizQuestion();

    if (examMode) {
        startQuizTimer(quiz.timeLimit);
    } else {
        document.getElementById('quiz-timer-container')?.classList.add('hidden');
    }
}

function resetQuizState() {
    stopQuizTimer();
    stopSpeaking();
    quiz.active = false;
    quiz.finished = false;
    quiz.list = [];
    quiz.index = 0;
    quiz.score = 0;
    quiz.answers = [];
    quiz.subject = currentSubject;
    quiz.phase = currentPhase;
    quiz.examMode = false;
    quiz.timeLimit = 0;
    quiz.remaining = 0;
    quiz.startedAt = 0;
    quiz.endedAt = 0;
    quiz.autoSubmitted = false;
    quiz.source = 'bank';
    showQuizSetup();
}

function abandonQuiz(silent = false) {
    if (!quiz.active) return;
    resetQuizState();
    if (!silent) showToast('Kuis dihentikan. Progres kuis ini tidak disimpan.', 'warning');
}

function renderQuizSection() {
    if (quiz.active) {
        showQuizPlay();
        return;
    }
    if (quiz.finished) {
        showQuizResult();
        return;
    }
    showQuizSetup();
}

function showQuizSetup() {
    document.getElementById('quiz-setup')?.classList.remove('hidden');
    document.getElementById('quiz-play')?.classList.add('hidden');
    document.getElementById('quiz-result')?.classList.add('hidden');
    updateQuizSetupInfo();
}

function showQuizPlay() {
    document.getElementById('quiz-setup')?.classList.add('hidden');
    document.getElementById('quiz-play')?.classList.remove('hidden');
    document.getElementById('quiz-result')?.classList.add('hidden');
}

function showQuizResult() {
    document.getElementById('quiz-setup')?.classList.add('hidden');
    document.getElementById('quiz-play')?.classList.add('hidden');
    document.getElementById('quiz-result')?.classList.remove('hidden');
}

// ------------------------------------------------------------
// Kuis: Soal & Jawaban
// ------------------------------------------------------------
function renderQuizQuestion() {
    const question = quiz.list[quiz.index];
    if (!question) {
        finishQuiz(false);
        return;
    }

    const subjectLabel = SUBJECTS[quiz.subject]?.label || quiz.subject;
    const phaseLabel = PHASES[quiz.phase]?.short || quiz.phase;

    const subjectTag = document.getElementById('quiz-subject-tag');
    if (subjectTag) subjectTag.textContent = `${subjectLabel} • ${phaseLabel}`;

    const modeTag = document.getElementById('quiz-mode-tag');
    if (modeTag) {
        modeTag.textContent = quiz.examMode ? 'Mode Ujian' : 'Latihan';
        modeTag.className = quiz.examMode
            ? 'text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-1 rounded-full hidden sm:inline'
            : 'text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full hidden sm:inline';
    }

    const progressNum = document.getElementById('quiz-progress-num');
    if (progressNum) progressNum.textContent = `Soal ${quiz.index + 1} dari ${quiz.list.length}`;

    const progressBar = document.getElementById('quiz-progress-bar');
    if (progressBar) progressBar.style.width = `${((quiz.index + 1) / quiz.list.length) * 100}%`;

    const scoreLive = document.getElementById('quiz-score-live');
    if (scoreLive) scoreLive.textContent = `Benar: ${quiz.score}`;

    const questionText = document.getElementById('quiz-question');
    if (questionText) questionText.textContent = question.q;

    const explanation = document.getElementById('quiz-explanation');
    if (explanation) {
        explanation.classList.add('hidden');
        explanation.className = 'hidden p-4 rounded-2xl text-sm border-2 space-y-1';
        explanation.innerHTML = '';
    }

    const optionsContainer = document.getElementById('quiz-options');
    if (optionsContainer) {
        optionsContainer.innerHTML = question.options.map((option, index) => `
            <button onclick="checkAnswer(${index})" class="quiz-opt-btn w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 font-bold text-sm transition shadow-sm flex items-start gap-3">
                <span class="w-7 h-7 shrink-0 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-black">${String.fromCharCode(65 + index)}</span>
                <span class="pt-0.5">${escapeHtml(option)}</span>
            </button>
        `).join('');
    }

    const nextButton = document.getElementById('btn-next-quiz');
    if (nextButton) nextButton.disabled = true;

    const nextLabel = document.getElementById('btn-next-label');
    if (nextLabel) {
        nextLabel.textContent = quiz.index === quiz.list.length - 1 ? 'Lihat Hasil Kuis' : 'Lanjut Soal Berikutnya';
    }

    stopSpeaking();
}

function checkAnswer(selectedIndex) {
    if (!quiz.active) return;

    const question = quiz.list[quiz.index];
    if (!question) return;
    if (quiz.answers[quiz.index] !== null) return;

    const isCorrect = selectedIndex === question.correct;
    quiz.answers[quiz.index] = { selected: selectedIndex, isCorrect };

    const buttons = Array.from(document.querySelectorAll('#quiz-options .quiz-opt-btn'));
    buttons.forEach((button) => {
        button.disabled = true;
        button.classList.remove('hover:border-indigo-400', 'hover:bg-indigo-50');
    });

    if (isCorrect) {
        quiz.score += 1;
        soundFX.playCorrect();
    } else {
        soundFX.playWrong();
    }

    const selectedButton = buttons[selectedIndex];
    if (selectedButton) {
        selectedButton.style.backgroundColor = isCorrect ? '#d1fae5' : '#ffe4e6';
        selectedButton.style.borderColor = isCorrect ? '#10b981' : '#f43f5e';
        selectedButton.style.color = isCorrect ? '#064e3b' : '#881337';
    }

    if (!isCorrect && buttons[question.correct]) {
        buttons[question.correct].style.backgroundColor = '#d1fae5';
        buttons[question.correct].style.borderColor = '#10b981';
        buttons[question.correct].style.color = '#064e3b';
    }

    const explanation = document.getElementById('quiz-explanation');
    if (explanation) {
        explanation.classList.remove('hidden');
        explanation.className = isCorrect
            ? 'p-4 rounded-2xl text-sm border-2 bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
            : 'p-4 rounded-2xl text-sm border-2 bg-rose-50 border-rose-300 text-rose-900 font-semibold';
        explanation.innerHTML = isCorrect
            ? `<strong>Jawaban Benar! 🎉</strong><p class="mt-1">${escapeHtml(question.exp)}</p>`
            : `<strong>Kurang Tepat 😊</strong><p class="mt-1">Jawaban yang benar: <strong>${String.fromCharCode(65 + question.correct)}. ${escapeHtml(question.options[question.correct])}</strong></p><p class="mt-1">${escapeHtml(question.exp)}</p>`;
    }

    const scoreLive = document.getElementById('quiz-score-live');
    if (scoreLive) scoreLive.textContent = `Benar: ${quiz.score}`;

    const nextButton = document.getElementById('btn-next-quiz');
    if (nextButton) nextButton.disabled = false;
}

function nextQuestion() {
    if (!quiz.active) return;

    if (quiz.answers[quiz.index] === null) {
        showToast('Pilih salah satu jawaban dulu ya.', 'warning');
        return;
    }

    if (quiz.index < quiz.list.length - 1) {
        quiz.index += 1;
        renderQuizQuestion();
    } else {
        finishQuiz(false);
    }
}

function finishQuiz(autoSubmitted = false) {
    if (!quiz.active) return;

    stopExamTimerOnly();
    stopSpeaking();

    quiz.active = false;
    quiz.finished = true;
    quiz.autoSubmitted = Boolean(autoSubmitted);
    quiz.endedAt = Date.now();

    const total = quiz.list.length;
    const percentage = total ? Math.round((quiz.score / total) * 100) : 0;
    const durationSeconds = quiz.startedAt ? Math.max(1, Math.round((quiz.endedAt - quiz.startedAt) / 1000)) : 0;
    const active = getActiveStudent();

    if (active && total) {
        saveQuizScore(active.id, quiz.subject, quiz.score, total, {
            durationSeconds,
            mode: quiz.examMode ? 'exam' : 'practice',
            source: quiz.source
        });
    }

    if (percentage >= 60) soundFX.playComplete();
    else soundFX.playWrong();

    renderQuizResult();

    if (autoSubmitted) {
        showToast('Waktu ujian habis. Jawaban otomatis dikumpulkan.', 'warning', 5000);
    }

    renderHomeStats();
    if (!document.getElementById('sec-rapor')?.classList.contains('hidden')) {
        renderRaporAndDiagnostic();
    }
}

function renderQuizResult() {
    const body = document.getElementById('quiz-result-body');
    if (!body) return;

    const total = quiz.list.length;
    const percentage = total ? Math.round((quiz.score / total) * 100) : 0;
    const answered = quiz.answers.filter(Boolean).length;
    const unanswered = total - answered;
    const durationSeconds = quiz.startedAt && quiz.endedAt
        ? Math.max(1, Math.round((quiz.endedAt - quiz.startedAt) / 1000))
        : 0;
    const active = getActiveStudent();

    let tone = 'emerald';
    let emoji = '🏆';
    let title = 'Luar Biasa!';
    let message = 'Anak hebat, terus pertahankan semangat belajarnya!';

    if (percentage < 60) {
        tone = 'rose';
        emoji = '💪';
        title = 'Tetap Semangat!';
        message = 'Belum apa-apa, ini kesempatan bagus untuk belajar lagi.';
    } else if (percentage < 80) {
        tone = 'amber';
        emoji = '🌟';
        title = 'Bagus Sekali!';
        message = 'Sedikit lagi menuju nilai terbaik. Yuk latihan sekali lagi!';
    }

    const stars = '⭐'.repeat(Math.max(0, Math.round(percentage / 20))) || '—';
    const advice = percentage < 60
        ? `<strong>Rekomendasi:</strong> baca ulang materi ${escapeHtml(SUBJECTS[quiz.subject]?.label || quiz.subject)}, lalu kerjakan kuis lagi. Orang tua/guru bisa mendampingi bagian pembahasan yang masih salah.`
        : percentage >= 80
            ? `<strong>Rekomendasi pengayaan:</strong> beri tantangan soal HOTS atau coba mapel lain. Anak sudah siap naik level!`
            : `<strong>Rekomendasi:</strong> ulangi soal yang masih salah dan minta anak menjelaskan alasannya dengan bahasa sendiri.`;

    const review = quiz.list.map((question, index) => {
        const answer = quiz.answers[index];
        const selected = answer ? answer.selected : null;
        const isCorrect = Boolean(answer?.isCorrect);

        const options = question.options.map((option, optionIndex) => {
            const correctOption = optionIndex === question.correct;
            const selectedOption = selected === optionIndex;
            let classes = 'border-slate-200 bg-white text-slate-600';
            let mark = '';

            if (correctOption) {
                classes = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold';
                mark = '<i class="fa-solid fa-circle-check text-emerald-600"></i>';
            } else if (selectedOption) {
                classes = 'border-rose-300 bg-rose-50 text-rose-900 font-bold';
                mark = '<i class="fa-solid fa-circle-xmark text-rose-500"></i>';
            }

            return `
                <div class="border rounded-xl px-3 py-2 flex items-start justify-between gap-2 ${classes}">
                    <span>${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option)}</span>
                    <span class="shrink-0">${mark}</span>
                </div>
            `;
        }).join('');

        return `
            <div class="border border-slate-200 rounded-2xl p-4 bg-white space-y-2">
                <div class="flex items-start justify-between gap-2">
                    <p class="font-bold text-slate-800 text-sm">${index + 1}. ${escapeHtml(question.q)}</p>
                    <span class="shrink-0 text-[10px] font-extrabold px-2 py-1 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">${isCorrect ? 'Benar' : selected === null ? 'Kosong' : 'Salah'}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">${options}</div>
                <p class="text-[11px] text-slate-500 font-semibold bg-slate-50 rounded-xl p-2"><strong>Pembahasan:</strong> ${escapeHtml(question.exp)}</p>
            </div>
        `;
    }).join('');

    body.innerHTML = `
        <div class="text-center result-pop">
            <div class="text-6xl mb-1">${emoji}</div>
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Hasil ${quiz.examMode ? 'Ujian' : 'Latihan'} • ${escapeHtml(active?.nama || 'Siswa')}</p>
            <h3 class="text-2xl font-extrabold font-fredoka text-${tone}-700 mt-1">${title}</h3>
            <div class="text-6xl font-black text-${tone}-600 leading-none mt-3">${percentage}<span class="text-2xl">/100</span></div>
            <p class="text-2xl mt-2 tracking-wider">${stars}</p>
            <p class="text-xs font-semibold text-slate-500 mt-2">${message}</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 text-center text-xs font-bold">
            <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3">
                <p class="text-emerald-700 text-[10px] uppercase tracking-wider">Benar</p>
                <p class="text-2xl font-black text-emerald-700">${quiz.score}</p>
            </div>
            <div class="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3">
                <p class="text-rose-700 text-[10px] uppercase tracking-wider">Salah</p>
                <p class="text-2xl font-black text-rose-700">${Math.max(0, answered - quiz.score)}</p>
            </div>
            <div class="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3">
                <p class="text-slate-500 text-[10px] uppercase tracking-wider">Kosong</p>
                <p class="text-2xl font-black text-slate-700">${unanswered}</p>
            </div>
            <div class="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-3">
                <p class="text-indigo-700 text-[10px] uppercase tracking-wider">Durasi</p>
                <p class="text-lg font-black text-indigo-700">${formatDuration(durationSeconds)}</p>
            </div>
        </div>

        <div class="mt-4 p-4 rounded-2xl border-2 bg-${tone}-50 border-${tone}-200 text-${tone}-900 text-xs font-semibold leading-relaxed">
            ${advice}
        </div>

        <div class="flex flex-col sm:flex-row gap-2 mt-5">
            <button onclick="retryQuiz()" class="flex-grow bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold py-3 rounded-2xl text-sm transition shadow-md flex items-center justify-center gap-2">
                <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Ulangi Kuis
            </button>
            <button onclick="backToQuizSetup()" class="flex-grow bg-white hover:bg-slate-50 text-slate-700 font-extrabold py-3 rounded-2xl text-sm transition border-2 border-slate-200 flex items-center justify-center gap-2">
                <i class="fa-solid fa-sliders" aria-hidden="true"></i> Ganti Mapel / Fase
            </button>
            <button onclick="printCurrentQuizLKPD()" class="bg-white hover:bg-sky-50 text-sky-700 font-extrabold py-3 px-4 rounded-2xl text-sm transition border-2 border-sky-200 flex items-center justify-center gap-2">
                <i class="fa-solid fa-print" aria-hidden="true"></i> LKPD
            </button>
        </div>

        <details class="mt-5 border-2 border-slate-200 rounded-2xl overflow-hidden">
            <summary class="cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-4 py-3 text-xs font-extrabold text-slate-700 flex items-center gap-2">
                <i class="fa-solid fa-list-check" aria-hidden="true"></i> Lihat pembahasan semua soal (${total})
            </summary>
            <div class="p-3 space-y-2 max-h-[420px] overflow-y-auto bg-slate-50/50">${review}</div>
        </details>
    `;

    showQuizResult();
    document.getElementById('quiz-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function retryQuiz() {
    if (!quiz.list.length) {
        showQuizSetup();
        return;
    }

    const previous = {
        subject: quiz.subject,
        phase: quiz.phase,
        examMode: quiz.examMode,
        minutes: quiz.timeLimit ? Math.max(1, Math.round(quiz.timeLimit / 60)) : 10,
        source: quiz.source,
        list: quiz.source === 'ai' ? quiz.list.map((item) => ({ ...item })) : undefined
    };

    startQuiz(previous.subject, previous.phase, {
        examMode: previous.examMode,
        minutes: previous.minutes,
        source: previous.source,
        list: previous.list
    });
}

function backToQuizSetup() {
    resetQuizState();
    syncSetupControls();
    showQuizSetup();
}

function exitQuiz() {
    if (!quiz.active) {
        showQuizSetup();
        return;
    }

    if (!window.confirm('Keluar dari kuis? Progres kuis ini tidak akan disimpan.')) return;
    abandonQuiz(false);
}

function readAloudQuiz() {
    const question = quiz.list[quiz.index];
    if (!question) return;

    const optionsText = question.options
        .map((option, index) => `Pilihan ${String.fromCharCode(65 + index)}: ${option}`)
        .join('. ');

    speakText(`${question.q}. ${optionsText}.`);
}

// ------------------------------------------------------------
// Timer Ujian
// ------------------------------------------------------------
function startQuizTimer(totalSeconds) {
    stopExamTimerOnly();
    quiz.remaining = Math.max(1, Number(totalSeconds) || 600);

    const container = document.getElementById('quiz-timer-container');
    container?.classList.remove('hidden');
    updateTimerDisplay();

    quiz.timerId = window.setInterval(() => {
        quiz.remaining -= 1;
        updateTimerDisplay();

        if (quiz.remaining <= 0) {
            stopExamTimerOnly();
            finishQuiz(true);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const display = document.getElementById('quiz-timer-display');
    if (!display) return;

    const remaining = Math.max(0, quiz.remaining);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    display.classList.toggle('text-rose-700', remaining <= 60);
    display.classList.toggle('animate-pulse', remaining > 0 && remaining <= 30);
}

function stopExamTimerOnly() {
    if (quiz.timerId) {
        window.clearInterval(quiz.timerId);
        quiz.timerId = null;
    }
}

function stopQuizTimer() {
    stopExamTimerOnly();
    const container = document.getElementById('quiz-timer-container');
    container?.classList.add('hidden');
    const display = document.getElementById('quiz-timer-display');
    if (display) display.classList.remove('animate-pulse', 'text-rose-700');
}

// ------------------------------------------------------------
// Cetak LKPD & Print Helper
// ------------------------------------------------------------
function printCurrentQuizLKPD() {
    let list = [];
    let subject = currentSubject;
    let phase = currentPhase;

    if (quiz.list.length) {
        list = quiz.list;
        subject = quiz.subject;
        phase = quiz.phase;
    } else {
        subject = document.getElementById('quiz-subject')?.value || currentSubject;
        phase = document.getElementById('quiz-phase')?.value || currentPhase;
        list = getQuizBank(phase, subject);
    }

    if (!list.length) {
        showToast('Belum ada soal untuk dicetak. Pilih mapel yang memiliki soal dulu.', 'warning');
        return;
    }

    printHtml(buildLkpdHtml(list, subject, phase));
    showToast('Menyiapkan LKPD untuk dicetak...', 'info');
}

function buildLkpdHtml(list, subject, phase) {
    const active = getActiveStudent();
    const subjectLabel = SUBJECTS[subject]?.label || subject;
    const phaseLabel = PHASES[phase]?.label || phase;
    const dateLabel = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const questionsHtml = list.map((question, index) => `
        <div class="border-b border-slate-300 pb-3 mb-3 break-inside-avoid">
            <p class="font-bold text-slate-900">${index + 1}. ${escapeHtml(question.q)}</p>
            <div class="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 pl-4 text-slate-700">
                ${question.options.map((option, optionIndex) => `<p>${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option)}</p>`).join('')}
            </div>
            <p class="mt-2 pl-4 text-slate-500">Jawaban: ................................................</p>
        </div>
    `).join('');

    return `
        <div class="print-sheet text-slate-900">
            <div class="text-center border-b-2 border-slate-900 pb-3 mb-4">
                <p class="text-xs font-bold uppercase tracking-widest text-slate-500">Ruang Belajar Abah • Kurikulum Merdeka</p>
                <h1 class="text-xl font-black uppercase mt-1">Lembar Kerja Peserta Didik (LKPD)</h1>
                <p class="text-xs font-bold mt-1">${escapeHtml(subjectLabel)} — ${escapeHtml(phaseLabel)}</p>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs font-semibold border-b border-slate-300 pb-3 mb-4">
                <p>Nama Siswa: <strong>${escapeHtml(active?.nama || '-')}</strong></p>
                <p class="text-right">Kelas / Sekolah: <strong>${escapeHtml(active?.kelas || '-')} / ${escapeHtml(active?.sekolah || '-')}</strong></p>
                <p>Hari/Tanggal: <strong>${escapeHtml(dateLabel)}</strong></p>
                <p class="text-right">No. Absen / NISN: <strong>${escapeHtml(active?.nisn || '-')}</strong></p>
            </div>

            <div class="text-xs">${questionsHtml}</div>

            <div class="grid grid-cols-2 gap-4 text-xs font-bold mt-8">
                <div>
                    <p>Paraf Orang Tua / Wali:</p>
                    <div class="mt-10 border-t border-slate-400 w-3/4"></div>
                </div>
                <div class="text-right">
                    <p>Nilai / Paraf Guru:</p>
                    <div class="mt-10 border-t border-slate-400 w-3/4 ml-auto"></div>
                </div>
            </div>
            <p class="text-[9px] text-slate-400 text-center mt-6">Dicetak dari Ruang Belajar Abah — ${list.length} soal.</p>
        </div>
    `;
}

function printHtml(html) {
    const area = document.getElementById('print-area');
    if (!area) return;

    area.innerHTML = html;
    document.body.classList.add('printing');

    if (printCleanupTimer) window.clearTimeout(printCleanupTimer);
    printCleanupTimer = window.setTimeout(cleanupPrintArea, 120000);

    try {
        window.print();
    } catch (err) {
        cleanupPrintArea();
        showToast('Browser tidak dapat membuka dialog cetak.', 'error');
    }
}

function cleanupPrintArea() {
    if (printCleanupTimer) {
        window.clearTimeout(printCleanupTimer);
        printCleanupTimer = null;
    }
    document.body.classList.remove('printing');
    const area = document.getElementById('print-area');
    if (area) area.innerHTML = '';
}

// ------------------------------------------------------------
// Tanya AI Ninna
// ------------------------------------------------------------
function setupEnterKeyForChat() {
    const input = document.getElementById('chat-input');
    if (!input || input.dataset.listenerAttached === 'true') return;

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendChat();
        }
    });
    input.dataset.listenerAttached = 'true';
}

function renderSimpleMarkdown(text) {
    let safe = escapeHtml(text);
    safe = safe.replace(/```([\s\S]*?)```/g, (match, code) => (
        `<code class="block bg-slate-100 text-slate-700 rounded-xl p-2 my-1 whitespace-pre-wrap">${code.trim()}</code>`
    ));
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/(^|\n)\s*[-*]\s+/g, '$1• ');
    return safe;
}

function appendChatMessage(text, role = 'ai', options = {}) {
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) return null;

    const wrapper = document.createElement('div');

    if (role === 'user') {
        wrapper.className = 'flex justify-end';
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble-user bg-pink-500 text-white p-3.5 rounded-3xl rounded-tr-none max-w-[85%] text-sm font-medium shadow-sm';
        bubble.textContent = String(text);
        wrapper.appendChild(bubble);
    } else {
        wrapper.className = 'flex items-start space-x-2';

        const avatar = document.createElement('div');
        avatar.className = 'w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-sm shrink-0';
        avatar.innerHTML = '<i class="fa-solid fa-robot" aria-hidden="true"></i>';

        const bubble = document.createElement('div');
        if (role === 'error') {
            bubble.className = 'bg-rose-50 text-rose-700 border border-rose-200 p-3.5 rounded-3xl rounded-tl-none max-w-[85%] text-sm font-semibold leading-relaxed shadow-sm';
            bubble.textContent = String(text);
        } else {
            bubble.className = 'chat-bubble-ai bg-indigo-100 text-indigo-950 p-3.5 rounded-3xl rounded-tl-none max-w-[85%] text-sm font-medium leading-relaxed shadow-sm';
            if (options.plainText) bubble.textContent = String(text);
            else bubble.innerHTML = renderSimpleMarkdown(text);
        }

        wrapper.append(avatar, bubble);
    }

    chatWindow.appendChild(wrapper);
    scrollChatToBottom();
    return wrapper;
}

function scrollChatToBottom() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
}

function resetChatUI() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) chatWindow.innerHTML = DEFAULT_CHAT_HTML;
    const input = document.getElementById('chat-input');
    if (input) input.value = '';
    scrollChatToBottom();
}

function clearChat() {
    resetGeminiChat();
    resetChatUI();
    showToast('Percakapan dengan Ninna AI dibersihkan.', 'success');
}

async function handleSendChat() {
    if (chatBusy) return;

    const input = document.getElementById('chat-input');
    const sendButton = document.getElementById('btn-send-chat');
    const message = input?.value.trim() || '';

    if (!message) return;

    if (!getGeminiApiKey()) {
        showToast('Atur API Key Gemini dulu untuk mengobrol dengan Ninna AI.', 'warning', 4500);
        openApiKeyModal();
        return;
    }

    appendChatMessage(message, 'user');
    if (input) input.value = '';
    chatBusy = true;
    if (sendButton) sendButton.disabled = true;

    const typing = document.createElement('div');
    typing.className = 'flex items-start space-x-2';
    typing.id = 'chat-typing-indicator';
    typing.innerHTML = `
        <div class="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-sm shrink-0"><i class="fa-solid fa-robot" aria-hidden="true"></i></div>
        <div class="bg-slate-100 text-slate-500 p-3.5 rounded-3xl rounded-tl-none text-xs italic font-semibold">Ninna sedang berpikir... 🤖</div>
    `;
    document.getElementById('chat-window')?.appendChild(typing);
    scrollChatToBottom();

    try {
        const reply = await fetchGeminiChat(message);
        document.getElementById('chat-typing-indicator')?.remove();
        appendChatMessage(reply, 'ai');
    } catch (err) {
        document.getElementById('chat-typing-indicator')?.remove();
        appendChatMessage(err.message || 'Terjadi kesalahan saat menghubungi AI.', 'error');
    } finally {
        chatBusy = false;
        if (sendButton) sendButton.disabled = false;
        if (input) input.focus();
    }
}

function sendChatSuggestion(text) {
    const input = document.getElementById('chat-input');
    if (!input) return;
    input.value = text;
    input.focus();
    handleSendChat();
}

// ------------------------------------------------------------
// Modul Ajar AI
// ------------------------------------------------------------
async function handleGenerateModulAjar() {
    const subject = document.getElementById('modul-subject')?.value || 'Matematika';
    const phase = document.getElementById('modul-phase')?.value || 'Fase A (Kelas 1-2 SD)';
    const topic = document.getElementById('modul-topic')?.value.trim() || '';
    const model = document.getElementById('modul-model')?.value || 'Problem Based Learning';
    const meetings = document.getElementById('modul-meeting')?.value || '1 pertemuan';
    const timeAllocation = document.getElementById('modul-time')?.value || '2 x 35 menit';

    if (!topic) {
        showToast('Isi topik pembelajaran terlebih dahulu.', 'warning');
        document.getElementById('modul-topic')?.focus();
        return;
    }

    if (!getGeminiApiKey()) {
        showToast('Atur API Key Gemini dulu untuk membuat modul ajar.', 'warning', 4500);
        openApiKeyModal();
        return;
    }

    const button = document.getElementById('btn-generate-modul');
    const output = document.getElementById('modul-output-container');
    const content = document.getElementById('modul-content-body');

    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xl" aria-hidden="true"></i> <span>Menyusun Modul Ajar...</span>';
    }

    try {
        const html = await fetchGeminiModulAjar(subject, phase, topic, {
            model,
            meetings,
            timeAllocation
        });

        if (!html) throw new Error('AI tidak mengembalikan isi modul ajar.');

        if (content) content.innerHTML = html;
        output?.classList.remove('hidden');
        showToast('Modul ajar berhasil dibuat.', 'success');
        window.setTimeout(() => output?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    } catch (err) {
        showToast(err.message || 'Gagal membuat modul ajar.', 'error', 6000);
    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles text-xl" aria-hidden="true"></i> <span>Buat Modul Ajar Otomatis</span>';
        }
    }
}

function printModulAjar() {
    const content = document.getElementById('modul-content-body');
    if (!content || !content.innerHTML.trim()) {
        showToast('Belum ada modul ajar yang bisa dicetak.', 'warning');
        return;
    }

    const subject = document.getElementById('modul-subject')?.value || '-';
    const phase = document.getElementById('modul-phase')?.value || '-';
    const topic = document.getElementById('modul-topic')?.value.trim() || '-';

    printHtml(`
        <div class="print-sheet">
            <div class="text-center border-b-2 border-slate-900 pb-3 mb-5">
                <p class="text-xs font-bold uppercase tracking-widest text-slate-500">Ruang Belajar Abah • Kurikulum Merdeka</p>
                <h1 class="text-xl font-black uppercase mt-1">Modul Ajar / RPP</h1>
                <p class="text-xs font-bold mt-1">${escapeHtml(subject)} • ${escapeHtml(phase)} • ${escapeHtml(topic)}</p>
            </div>
            <div class="prose max-w-none text-slate-900">${content.innerHTML}</div>
        </div>
    `);
}

async function copyModulAjar() {
    const content = document.getElementById('modul-content-body');
    if (!content || !content.innerText.trim()) {
        showToast('Belum ada modul ajar untuk disalin.', 'warning');
        return;
    }

    const copied = await copyToClipboard(content.innerText);
    showToast(copied ? 'Teks modul ajar disalin ke clipboard.' : 'Gagal menyalin. Coba pilih teks secara manual.', copied ? 'success' : 'error');
}

function downloadModulAjar() {
    const content = document.getElementById('modul-content-body');
    if (!content || !content.innerHTML.trim()) {
        showToast('Belum ada modul ajar untuk diunduh.', 'warning');
        return;
    }

    const subject = document.getElementById('modul-subject')?.value || 'Modul';
    const topic = document.getElementById('modul-topic')?.value.trim() || 'Pembelajaran';
    const safeFileName = `${subject}-${topic}`.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();

    const standalone = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Modul Ajar - ${escapeHtml(topic)}</title>
<style>
    body { font-family: Arial, sans-serif; color: #1e293b; max-width: 900px; margin: 32px auto; padding: 0 20px; line-height: 1.65; }
    h1, h2, h3 { color: #312e81; line-height: 1.3; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 14px; }
    th, td { border: 1px solid #a5b4fc; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #eef2ff; }
    .meta { text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-bottom: 24px; }
    .meta p { margin: 4px 0; }
</style>
</head>
<body>
<div class="meta">
    <p><strong>RUANG BELAJAR ABAH • KURIKULUM MERDEKA</strong></p>
    <h1>Modul Ajar / RPP</h1>
    <p>${escapeHtml(subject)} • ${escapeHtml(document.getElementById('modul-phase')?.value || '')} • ${escapeHtml(topic)}</p>
</div>
${content.innerHTML}
</body>
</html>`;

    downloadBlob(standalone, `${safeFileName || 'modul-ajar'}.html`, 'text/html;charset=utf-8');
    showToast('Modul ajar diunduh sebagai file HTML.', 'success');
}

// ------------------------------------------------------------
// Bank Soal Guru
// ------------------------------------------------------------
function handleSaveCustomQuestion(event) {
    event.preventDefault();

    const phase = document.getElementById('custom-phase')?.value || 'faseA';
    const subject = document.getElementById('custom-subject')?.value || 'mtk';
    const questionText = document.getElementById('custom-q-text')?.value.trim() || '';
    const options = [0, 1, 2, 3].map((index) => document.getElementById(`custom-opt-${index}`)?.value.trim() || '');
    const correct = parseInt(document.getElementById('custom-correct-idx')?.value, 10) || 0;
    const explanation = document.getElementById('custom-exp')?.value.trim() || '';

    if (!questionText) {
        showToast('Teks pertanyaan wajib diisi.', 'warning');
        return;
    }
    if (options.some((option) => !option)) {
        showToast('Semua pilihan A, B, C, dan D wajib diisi.', 'warning');
        return;
    }
    if (!explanation) {
        showToast('Pembahasan singkat wajib diisi.', 'warning');
        return;
    }

    saveCustomQuestion({
        phase,
        subject,
        q: questionText,
        options,
        correct,
        exp: explanation,
        source: 'manual'
    });

    event.target.reset();
    const phaseSelect = document.getElementById('custom-phase');
    const subjectSelect = document.getElementById('custom-subject');
    if (phaseSelect) phaseSelect.value = phase;
    if (subjectSelect) subjectSelect.value = subject;

    renderCustomQuestions();
    updateBankBadge();
    renderHomeStats();
    showToast('Soal berhasil disimpan ke Bank Soal Guru.', 'success');
}

function renderCustomQuestions() {
    const container = document.getElementById('custom-questions-list');
    if (!container) return;

    const filterPhase = document.getElementById('filter-bank-phase')?.value || '';
    const filterSubject = document.getElementById('filter-bank-subject')?.value || '';
    const allQuestions = getCustomQuestions();

    const questions = allQuestions.filter((question) => (
        (!filterPhase || question.phase === filterPhase) &&
        (!filterSubject || question.subject === filterSubject)
    ));

    if (!questions.length) {
        container.innerHTML = `
            <div class="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div class="text-3xl mb-2">🗂️</div>
                <p class="text-xs font-extrabold text-slate-500">Belum ada soal buatan guru pada filter ini.</p>
                <p class="text-[11px] font-semibold text-slate-400 mt-1">Tambahkan soal manual di atas atau gunakan Generator Soal AI.</p>
            </div>
        `;
        updateBankBadge();
        return;
    }

    container.innerHTML = questions.map((question, index) => {
        const phaseLabel = PHASES[question.phase]?.short || question.phase;
        const subjectLabel = SUBJECTS[question.subject]?.label || question.subject;
        const sourceLabel = question.source === 'ai' ? 'AI' : 'Manual';
        const sourceClass = question.source === 'ai'
            ? 'bg-purple-100 text-purple-700 border-purple-200'
            : 'bg-sky-100 text-sky-700 border-sky-200';

        return `
            <div class="border-2 border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-2">
                <div class="flex items-start justify-between gap-2 flex-wrap">
                    <div class="flex flex-wrap items-center gap-1.5">
                        <span class="text-[10px] font-extrabold bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-full">${escapeHtml(phaseLabel)}</span>
                        <span class="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">${escapeHtml(subjectLabel)}</span>
                        <span class="text-[10px] font-extrabold border px-2 py-1 rounded-full ${sourceClass}">${sourceLabel}</span>
                    </div>
                    <button onclick="handleDeleteCustomQuestion('${escapeHtml(question.id)}')" class="text-rose-500 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 p-2 rounded-xl transition" title="Hapus soal" aria-label="Hapus soal">
                        <i class="fa-solid fa-trash-can text-xs" aria-hidden="true"></i>
                    </button>
                </div>
                <p class="text-sm font-bold text-slate-800">${index + 1}. ${escapeHtml(question.q)}</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    ${question.options.map((option, optionIndex) => {
                        const isCorrect = optionIndex === question.correct;
                        return `<div class="rounded-xl px-3 py-1.5 border ${isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200 text-slate-600'}">${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option)} ${isCorrect ? '✓' : ''}</div>`;
                    }).join('')}
                </div>
                <p class="text-[11px] font-semibold text-slate-500 bg-white rounded-xl p-2 border border-slate-100"><strong>Pembahasan:</strong> ${escapeHtml(question.exp)}</p>
            </div>
        `;
    }).join('');

    updateBankBadge();
}

function handleDeleteCustomQuestion(questionId) {
    const question = getCustomQuestions().find((item) => item.id === questionId);
    if (!question) return;

    if (!window.confirm('Hapus soal ini dari Bank Soal Guru?')) return;

    deleteCustomQuestion(questionId);
    renderCustomQuestions();
    updateBankBadge();
    renderHomeStats();
    showToast('Soal berhasil dihapus.', 'success');
}

function updateBankBadge() {
    const total = getCustomQuestions().length;
    const badge = document.getElementById('bank-total-badge');
    if (badge) badge.textContent = `${total} soal buatan guru`;
}

async function handleGenerateQuiz() {
    const subject = document.getElementById('gen-subject')?.value || 'mtk';
    const phase = document.getElementById('gen-phase')?.value || 'faseA';
    const topic = document.getElementById('gen-topic')?.value.trim() || '';
    const count = parseInt(document.getElementById('gen-count')?.value, 10) || 5;
    const difficulty = document.getElementById('gen-difficulty')?.value || 'Sedang';

    if (!topic) {
        showToast('Isi topik khusus terlebih dahulu.', 'warning');
        document.getElementById('gen-topic')?.focus();
        return;
    }

    if (!getGeminiApiKey()) {
        showToast('Atur API Key Gemini dulu untuk membuat soal dengan AI.', 'warning', 4500);
        openApiKeyModal();
        return;
    }

    const button = document.getElementById('btn-generate-ai');
    const resultArea = document.getElementById('gen-result-area');
    const listContainer = document.getElementById('gen-questions-list');
    const countBadge = document.getElementById('gen-result-count');

    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-lg" aria-hidden="true"></i> <span>Menyusun Soal...</span>';
    }

    resultArea?.classList.remove('hidden');
    if (countBadge) countBadge.textContent = 'Menyusun...';
    if (listContainer) {
        listContainer.innerHTML = '<div class="ai-loading h-20 rounded-2xl border border-purple-100"></div><div class="ai-loading h-20 rounded-2xl border border-purple-100"></div>';
    }

    try {
        const questions = await fetchGeminiQuizGenerator(subject, phase, topic, { count, difficulty });
        customAIQuiz = questions;
        generatedQuizMeta = { subject, phase, topic, difficulty };
        generatedSaved = false;
        renderGeneratedQuestions();
        showToast(`${questions.length} soal berhasil dibuat.`, 'success');
    } catch (err) {
        customAIQuiz = [];
        generatedQuizMeta = null;
        resultArea?.classList.add('hidden');
        showToast(err.message || 'Gagal membuat soal AI.', 'error', 6000);
    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fa-solid fa-gears text-lg" aria-hidden="true"></i> <span>Buat Soal Sekarang</span>';
        }
    }
}

function renderGeneratedQuestions() {
    const listContainer = document.getElementById('gen-questions-list');
    const countBadge = document.getElementById('gen-result-count');
    if (!listContainer) return;

    if (countBadge) countBadge.textContent = `${customAIQuiz.length} soal`;

    listContainer.innerHTML = customAIQuiz.map((question, index) => `
        <div class="bg-white rounded-2xl border border-purple-100 p-3 space-y-1.5">
            <p class="text-xs font-bold text-slate-800">${index + 1}. ${escapeHtml(question.q)}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px]">
                ${question.options.map((option, optionIndex) => {
                    const isCorrect = optionIndex === question.correct;
                    return `<span class="rounded-lg px-2 py-1 border ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-100 text-slate-500'}">${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option)}</span>`;
                }).join('')}
            </div>
            <p class="text-[10px] text-slate-500 font-semibold"><strong>Pembahasan:</strong> ${escapeHtml(question.exp)}</p>
        </div>
    `).join('');

    const saveButton = document.querySelector('#gen-result-area button[onclick="saveGeneratedToBank()"]');
    if (saveButton) {
        saveButton.disabled = false;
        saveButton.innerHTML = '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Simpan Semua ke Bank Soal';
    }
}

function startCustomGeneratedQuiz() {
    if (!customAIQuiz.length || !generatedQuizMeta) {
        showToast('Belum ada soal AI. Buat soal terlebih dahulu.', 'warning');
        return;
    }

    const meta = generatedQuizMeta;
    const examMode = Boolean(document.getElementById('chk-mode-ujian')?.checked);
    const minutes = parseInt(document.getElementById('select-exam-time')?.value, 10) || 10;

    currentPhase = meta.phase;
    currentSubject = meta.subject;
    saveSettings({ phase: meta.phase, subject: meta.subject });
    applyPhaseUI();
    renderSubjectTabs();
    renderMateri();

    showSection('kuis');
    startQuiz(meta.subject, meta.phase, {
        list: customAIQuiz.map((question) => ({ ...question })),
        source: 'ai',
        examMode,
        minutes
    });
    showToast('Kuis AI dimulai. Semangat!', 'success');
}

function saveGeneratedToBank() {
    if (!customAIQuiz.length || !generatedQuizMeta) {
        showToast('Belum ada soal AI untuk disimpan.', 'warning');
        return;
    }
    if (generatedSaved) {
        showToast('Soal ini sudah disimpan ke Bank Soal.', 'info');
        return;
    }

    const meta = generatedQuizMeta;
    saveCustomQuestions(customAIQuiz.map((question) => ({
        ...question,
        phase: meta.phase,
        subject: meta.subject,
        source: 'ai'
    })));

    generatedSaved = true;
    const saveButton = document.querySelector('#gen-result-area button[onclick="saveGeneratedToBank()"]');
    if (saveButton) {
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Tersimpan di Bank Soal';
    }

    renderCustomQuestions();
    updateBankBadge();
    renderHomeStats();
    showToast(`${customAIQuiz.length} soal AI disimpan ke Bank Soal Guru.`, 'success');
}

// ------------------------------------------------------------
// Ringkasan Beranda & API Key
// ------------------------------------------------------------
function renderHomeStats() {
    const active = getActiveStudent();
    const scores = active ? (getScores()[active.id] || {}) : {};
    const history = active ? getHistory(active.id) : [];

    const percentages = Object.values(scores)
        .map((data) => Number(data?.percentage))
        .filter((value) => Number.isFinite(value));

    const average = percentages.length
        ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length)
        : null;

    const averageEl = document.getElementById('home-stat-average');
    if (averageEl) averageEl.textContent = average === null ? '--' : `${average}%`;

    const attemptsEl = document.getElementById('home-stat-attempts');
    if (attemptsEl) attemptsEl.textContent = String(history.length);

    const bestBadge = percentages.some((value) => value >= 100)
        ? 'Bintang Sempurna'
        : average !== null && average >= 80
            ? 'Pembelajar Hebat'
            : history.length >= 3
                ? 'Siswa Rajin'
                : percentages.length
                    ? 'Terus Semangat'
                    : 'Belum ada';

    const badgeEl = document.getElementById('home-stat-badge');
    if (badgeEl) badgeEl.textContent = bestBadge;

    updateSubjectCounts();
}

function updateSubjectCounts() {
    Object.keys(SUBJECTS).forEach((subjectKey) => {
        const element = document.getElementById(`count-${subjectKey}`);
        if (!element) return;
        const count = getQuizBank(currentPhase, subjectKey).length;
        element.textContent = `${count} soal`;
    });
}

function updateApiKeyStatus() {
    const hasKey = Boolean(getGeminiApiKey());

    const dot = document.getElementById('api-key-status');
    if (dot) {
        dot.className = `absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${hasKey ? 'bg-emerald-500' : 'bg-slate-300'}`;
        dot.title = hasKey ? 'API key Gemini sudah diatur' : 'API key Gemini belum diatur';
    }

    const warning = document.getElementById('chat-api-warning');
    if (warning) warning.classList.toggle('hidden', hasKey);

    const badge = document.getElementById('modul-api-badge');
    if (badge) {
        badge.textContent = hasKey ? 'AI siap digunakan' : 'AI belum aktif';
        badge.className = hasKey
            ? 'text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200'
            : 'text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200';
    }
}

// ------------------------------------------------------------
// Diagnosis & Rapor Digital
// ------------------------------------------------------------
function getPredicate(percentage) {
    const value = Math.max(0, Math.min(100, Number(percentage) || 0));

    if (value >= 90) return { label: 'A — Sangat Baik', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (value >= 80) return { label: 'B — Baik', className: 'bg-sky-100 text-sky-700 border-sky-200' };
    if (value >= 70) return { label: 'C — Cukup', className: 'bg-amber-100 text-amber-700 border-amber-200' };
    if (value >= 60) return { label: 'D — Perlu Latihan', className: 'bg-orange-100 text-orange-700 border-orange-200' };
    return { label: 'E — Remedial', className: 'bg-rose-100 text-rose-700 border-rose-200' };
}

function getStudentRaporData(studentId) {
    const allScores = getScores();
    const subjectScores = allScores[studentId] && typeof allScores[studentId] === 'object'
        ? allScores[studentId]
        : {};

    const entries = Object.keys(subjectScores).map((subjectKey) => {
        const score = subjectScores[subjectKey] || {};
        return {
            key: subjectKey,
            label: SUBJECTS[subjectKey]?.label || subjectKey,
            percentage: Math.max(0, Math.min(100, Number(score.percentage) || 0)),
            bestPercentage: Math.max(0, Math.min(100, Number(score.bestPercentage) || 0)),
            bestScore: Number(score.bestScore) || 0,
            bestTotal: Number(score.bestTotal) || 0,
            stars: Math.max(0, Number(score.stars) || 0),
            attempts: Math.max(0, Number(score.attempts) || 0)
        };
    }).filter((entry) => entry.bestTotal > 0 || entry.attempts > 0);

    const history = getHistory(studentId);
    const attempts = entries.reduce((total, entry) => total + entry.attempts, 0);
    const average = entries.length
        ? Math.round(entries.reduce((total, entry) => total + entry.percentage, 0) / entries.length)
        : 0;
    const totalStars = entries.reduce((total, entry) => total + entry.stars, 0);

    const ranked = [...entries].sort((a, b) => b.bestPercentage - a.bestPercentage);
    const strongest = ranked[0] || null;
    const weakest = ranked.length > 1 ? ranked[ranked.length - 1] : null;

    return { entries, history, attempts, average, totalStars, strongest, weakest };
}

function renderRaporAndDiagnostic() {
    const active = getActiveStudent();
    if (!active) return;

    const data = getStudentRaporData(active.id);
    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setText('rap-nama', active.nama);
    setText('rap-kelas', active.kelas);
    setText('rap-nisn', active.nisn);
    setText('rap-sekolah', active.sekolah);
    setText('rap-tanggal', today);

    // Ringkasan diagnosis
    const summary = document.getElementById('diagnostic-summary-box');
    if (summary) {
        const cards = [
            { label: 'Total Kuis', value: String(data.attempts), icon: 'fa-list-check', tone: 'indigo' },
            { label: 'Rata-rata', value: data.entries.length ? `${data.average}/100` : '—', icon: 'fa-chart-line', tone: 'emerald' },
            { label: 'Mapel Terkuat', value: data.strongest ? data.strongest.label : '—', icon: 'fa-medal', tone: 'amber' },
            { label: 'Bintang', value: String(data.totalStars), icon: 'fa-star', tone: 'rose' }
        ];

        summary.innerHTML = cards.map((card) => `
            <div class="rounded-2xl border-2 border-${card.tone}-200 bg-${card.tone}-50 p-3 flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-white text-${card.tone}-600 flex items-center justify-center shrink-0">
                    <i class="fa-solid ${card.icon}" aria-hidden="true"></i>
                </span>
                <span class="min-w-0">
                    <span class="block text-[10px] uppercase tracking-wide text-${card.tone}-700/80">${card.label}</span>
                    <span class="block text-sm font-black text-${card.tone}-800 truncate">${escapeHtml(card.value)}</span>
                </span>
            </div>
        `).join('');
    }

    const insight = document.getElementById('diagnostic-insight');
    if (insight) {
        if (!data.entries.length) {
            insight.innerHTML = `
                <p><i class="fa-solid fa-seedling text-emerald-500 mr-1" aria-hidden="true"></i> <strong>Belum ada data nilai.</strong> Ajak ${escapeHtml(active.nama)} mengerjakan kuis pertama untuk mulai memantau perkembangan belajar.</p>
                <button onclick="showSection('kuis')" class="mt-2 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-3 py-2 rounded-xl text-[11px] transition">
                    <i class="fa-solid fa-play" aria-hidden="true"></i> Mulai Kuis Pertama
                </button>
            `;
        } else {
            const weakLine = data.weakest
                ? `Area yang perlu diperkuat: <strong>${escapeHtml(data.weakest.label)}</strong> (${data.weakest.percentage}/100).`
                : 'Perlu menambah data dari mata pelajaran lain untuk analisis yang lebih lengkap.';
            const tone = data.average >= 80 ? 'emerald' : data.average >= 60 ? 'amber' : 'rose';
            const verdict = data.average >= 80
                ? 'Perkembangan sangat baik. Berikan tantangan pengayaan agar tetap termotivasi.'
                : data.average >= 60
                    ? 'Perkembangan cukup baik. Ulangi materi yang masih lemah secara rutin.'
                    : 'Perlu pendampingan intensif. Fokus pada satu materi dasar terlebih dahulu.';

            insight.innerHTML = `
                <p class="text-${tone}-800"><strong>Analisis:</strong> ${verdict} ${weakLine}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                    <button onclick="showRemedialModal()" class="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 font-extrabold px-3 py-2 rounded-xl text-[11px] transition">
                        <i class="fa-solid fa-clipboard-list" aria-hidden="true"></i> Lihat Program Remedial
                    </button>
                    <button onclick="showSection('kuis')" class="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-3 py-2 rounded-xl text-[11px] transition">
                        <i class="fa-solid fa-play" aria-hidden="true"></i> Latihan Lagi
                    </button>
                </div>
            `;
        }
    }

    // Tabel nilai
    const scoresBody = document.getElementById('rap-scores-body');
    if (scoresBody) {
        if (!data.entries.length) {
            scoresBody.innerHTML = `
                <tr>
                    <td colspan="5" class="border border-indigo-200 px-3 py-6 text-center text-slate-400 font-semibold">
                        Belum ada nilai. Kerjakan kuis untuk mengisi rapor.
                    </td>
                </tr>
            `;
        } else {
            scoresBody.innerHTML = data.entries.map((entry) => {
                const predicate = getPredicate(entry.percentage);
                return `
                    <tr class="odd:bg-white even:bg-indigo-50/40">
                        <td class="border border-indigo-200 px-3 py-2.5 font-bold text-indigo-950">${escapeHtml(entry.label)}</td>
                        <td class="border border-indigo-200 px-3 py-2.5 text-center font-black text-slate-800">${entry.percentage}</td>
                        <td class="border border-indigo-200 px-3 py-2.5 text-center font-bold text-emerald-700">${entry.bestPercentage}</td>
                        <td class="border border-indigo-200 px-3 py-2.5 text-center text-sm tracking-tight">${'⭐'.repeat(entry.stars) || '—'}</td>
                        <td class="border border-indigo-200 px-3 py-2.5 text-center">
                            <span class="inline-block border px-2 py-1 rounded-full text-[10px] font-extrabold ${predicate.className}">${predicate.label}</span>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    // Lencana prestasi
    const badges = document.getElementById('rap-badges-list');
    if (badges) {
        const earned = [];

        if (data.entries.some((entry) => entry.percentage >= 100 || entry.bestPercentage >= 100)) {
            earned.push({ icon: 'fa-crown', label: 'Nilai Sempurna', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' });
        }
        if (data.attempts >= 5) {
            earned.push({ icon: 'fa-fire', label: 'Pembelajar Rajin', className: 'bg-orange-100 text-orange-700 border-orange-300' });
        }
        if (data.entries.length >= 3) {
            earned.push({ icon: 'fa-shapes', label: 'Penjelajah Mapel', className: 'bg-sky-100 text-sky-700 border-sky-300' });
        }
        if (data.entries.filter((entry) => entry.bestPercentage >= 80).length >= 3) {
            earned.push({ icon: 'fa-graduation-cap', label: 'Bintang Kelas', className: 'bg-emerald-100 text-emerald-700 border-emerald-300' });
        }
        if (data.history.some((item) => item.mode === 'Ujian' && Number(item.percentage) >= 80)) {
            earned.push({ icon: 'fa-trophy', label: 'Juara Ujian', className: 'bg-indigo-100 text-indigo-700 border-indigo-300' });
        }
        if (data.strongest && data.strongest.bestPercentage >= 90) {
            earned.push({ icon: 'fa-medal', label: `Ahli ${data.strongest.label}`, className: 'bg-purple-100 text-purple-700 border-purple-300' });
        }

        badges.innerHTML = earned.length
            ? earned.map((badge) => `
                <span class="inline-flex items-center gap-1.5 border px-3 py-1.5 rounded-full text-[11px] font-extrabold ${badge.className}">
                    <i class="fa-solid ${badge.icon}" aria-hidden="true"></i> ${escapeHtml(badge.label)}
                </span>
            `).join('')
            : '<p class="text-xs font-semibold text-slate-400">Belum ada lencana. Selesaikan kuis dengan nilai baik untuk meraihnya!</p>';
    }

    // Riwayat kuis
    const historyBox = document.getElementById('rap-history');
    if (historyBox) {
        if (!data.history.length) {
            historyBox.innerHTML = '<p class="text-slate-400 font-semibold">Belum ada riwayat kuis.</p>';
        } else {
            historyBox.innerHTML = data.history.slice(0, 8).map((item) => {
                const label = SUBJECTS[item.subject]?.label || item.subject || 'Kuis';
                const duration = item.durationSeconds ? ` • ${formatDuration(item.durationSeconds)}` : '';
                const emoji = item.mode === 'Ujian' ? '📝' : '🎯';
                return `
                    <div class="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                        <span class="min-w-0 truncate">${emoji} <strong class="text-slate-700">${escapeHtml(label)}</strong> <span class="text-slate-400">• ${escapeHtml(item.mode || 'Latihan')}${escapeHtml(duration)}</span></span>
                        <span class="shrink-0 flex items-center gap-2">
                            <span class="text-slate-400 text-[10px]">${escapeHtml(item.date || '')}</span>
                            <span class="font-black ${Number(item.percentage) >= 60 ? 'text-emerald-600' : 'text-rose-600'}">${Number(item.percentage) || 0}/100</span>
                        </span>
                    </div>
                `;
            }).join('');
        }
    }
}

function printRapor() {
    renderRaporAndDiagnostic();

    const paper = document.querySelector('#sec-rapor .rapor-paper');
    if (!paper) {
        showToast('Rapor belum siap dicetak.', 'warning');
        return;
    }

    printHtml(`<div class="print-sheet rapor-paper">${paper.innerHTML}</div>`);
    showToast('Menyiapkan rapor digital untuk dicetak...', 'info');
}

// ------------------------------------------------------------
// Modal Remedial / Pengayaan
// ------------------------------------------------------------
function showRemedialModal() {
    const active = getActiveStudent();
    if (!active) return;

    const data = getStudentRaporData(active.id);
    const body = document.getElementById('remedial-modal-body');
    const title = document.getElementById('remedial-modal-title');
    const modal = document.getElementById('modal-remedial');

    if (!body) return;

    if (title) {
        title.textContent = data.average >= 80
            ? `Program Pengayaan — ${active.nama}`
            : `Program Remedial — ${active.nama}`;
    }

    if (!data.entries.length) {
        body.innerHTML = `
            <p>Belum ada nilai yang bisa dianalisis. Mulailah dengan satu kuis singkat agar program belajar dapat disusun.</p>
            <ol class="list-decimal pl-5 space-y-1">
                <li>Pilih satu mapel yang paling disukai anak.</li>
                <li>Kerjakan 5-10 soal dalam mode latihan.</li>
                <li>Diskusikan pembahasan yang masih salah.</li>
            </ol>
        `;
    } else if (data.average >= 80) {
        body.innerHTML = `
            <p>Hasil belajar <strong>${escapeHtml(active.nama)}</strong> sudah sangat baik dengan rata-rata <strong>${data.average}/100</strong>. Berikut saran pengayaan:</p>
            <ol class="list-decimal pl-5 space-y-1">
                <li>Berikan soal HOTS atau studi kasus sederhana pada mapel terkuat: <strong>${escapeHtml(data.strongest?.label || '-')}</strong>.</li>
                <li>Minta anak menjelaskan cara menyelesaikan soal kepada anggota keluarga.</li>
                <li>Gabungkan dua mapel dalam satu proyek kecil, misalnya menulis cerita tentang percobaan IPAS.</li>
                <li>Jaga ritme latihan 10-15 menit per hari agar tidak jenuh.</li>
            </ol>
        `;
    } else {
        const weakLabel = data.weakest?.label || data.strongest?.label || 'materi dasar';
        const weakScore = data.weakest?.percentage ?? data.average;
        body.innerHTML = `
            <p>Rata-rata nilai <strong>${escapeHtml(active.nama)}</strong> saat ini <strong>${data.average}/100</strong>. Fokus pendampingan diarahkan ke <strong>${escapeHtml(weakLabel)}</strong> (${weakScore}/100).</p>
            <ol class="list-decimal pl-5 space-y-1">
                <li><strong>Hari 1-2:</strong> baca ulang materi ${escapeHtml(weakLabel)} dan minta anak menceritakan ulang dengan bahasanya sendiri.</li>
                <li><strong>Hari 3-4:</strong> kerjakan 5 soal latihan tanpa batas waktu, lalu bahas setiap jawaban yang salah.</li>
                <li><strong>Hari 5:</strong> ulangi kuis mapel tersebut dan bandingkan hasilnya dengan nilai sebelumnya.</li>
                <li>Berikan apresiasi atas usaha, bukan hanya nilai akhir, agar anak tetap percaya diri.</li>
            </ol>
        `;
    }

    modal?.classList.remove('hidden');
}

function closeRemedialModal() {
    document.getElementById('modal-remedial')?.classList.add('hidden');
}

// ------------------------------------------------------------
// Pengaturan API Key Gemini
// ------------------------------------------------------------
function openApiKeyModal() {
    const input = document.getElementById('input-api-key');
    const result = document.getElementById('api-test-result');
    const eye = document.getElementById('api-key-eye');

    if (input) {
        input.value = getGeminiApiKey();
        input.type = 'password';
    }
    if (eye) eye.className = 'fa-solid fa-eye';
    if (result) {
        result.className = 'hidden text-[11px] font-bold rounded-xl p-3 border';
        result.textContent = '';
    }

    document.getElementById('modal-apikey')?.classList.remove('hidden');
    window.setTimeout(() => input?.focus(), 80);
}

function closeApiKeyModal() {
    document.getElementById('modal-apikey')?.classList.add('hidden');
}

function toggleApiKeyVisibility() {
    const input = document.getElementById('input-api-key');
    const eye = document.getElementById('api-key-eye');
    if (!input) return;

    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    if (eye) eye.className = show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
}

function setApiTestResult(message, type) {
    const result = document.getElementById('api-test-result');
    if (!result) return;

    const tones = {
        success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        error: 'border-rose-200 bg-rose-50 text-rose-700',
        info: 'border-sky-200 bg-sky-50 text-sky-700'
    };
    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        info: 'fa-circle-info'
    };

    result.className = `text-[11px] font-bold rounded-xl p-3 border ${tones[type] || tones.info}`;
    result.innerHTML = `<i class="fa-solid ${icons[type] || icons.info} mr-1" aria-hidden="true"></i> ${escapeHtml(message)}`;
}

async function handleTestApiKey() {
    const input = document.getElementById('input-api-key');
    const button = document.getElementById('btn-test-api');
    const key = input?.value.trim() || '';

    if (!key) {
        setApiTestResult('Masukkan API key terlebih dahulu sebelum melakukan tes.', 'error');
        input?.focus();
        return;
    }

    const previousKey = getGeminiApiKey();

    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Menguji...';
    }
    setApiTestResult('Menghubungkan ke Gemini API...', 'info');

    saveGeminiApiKey(key);

    try {
        const reply = await testGeminiConnection();
        setApiTestResult(`Koneksi berhasil! Gemini merespons: "${reply}".`, 'success');
        updateApiKeyStatus();
    } catch (err) {
        saveGeminiApiKey(previousKey);
        setApiTestResult(err.message || 'Koneksi ke Gemini gagal. Periksa kembali API key dan kuota.', 'error');
        updateApiKeyStatus();
    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fa-solid fa-plug-circle-check" aria-hidden="true"></i> Tes Koneksi';
        }
    }
}

function handleSaveApiKey() {
    const input = document.getElementById('input-api-key');
    const key = input?.value.trim() || '';

    if (key && key.length < 20) {
        showToast('API key terlihat terlalu pendek. Periksa kembali key dari Google AI Studio.', 'error');
        setApiTestResult('API key tidak valid: panjang key terlalu pendek.', 'error');
        return;
    }

    saveGeminiApiKey(key);
    updateApiKeyStatus();
    closeApiKeyModal();

    if (key) {
        showToast('API key Gemini berhasil disimpan di browser ini.', 'success');
    } else {
        showToast('API key Gemini dihapus. Fitur AI dinonaktifkan.', 'info');
    }
}

// ------------------------------------------------------------
// Toast, Escape, Unduh, Clipboard, Format
// ------------------------------------------------------------
function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const safeType = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';
    const tones = {
        success: 'bg-emerald-600 border-emerald-400',
        error: 'bg-rose-600 border-rose-400',
        warning: 'bg-amber-500 border-amber-300',
        info: 'bg-sky-600 border-sky-400'
    };
    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        warning: 'fa-triangle-exclamation',
        info: 'fa-circle-info'
    };

    while (container.children.length >= 4) {
        container.removeChild(container.firstElementChild);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item flex items-start gap-2.5 text-white text-xs font-bold px-4 py-3 rounded-2xl border shadow-lg ${tones[safeType]}`;
    toast.setAttribute('role', safeType === 'error' ? 'alert' : 'status');
    toast.innerHTML = `<i class="fa-solid ${icons[safeType]} mt-0.5 shrink-0" aria-hidden="true"></i><span class="flex-1">${escapeHtml(message)}</span>`;

    container.appendChild(toast);

    const timeout = Math.max(1200, Number(duration) || 3500);
    window.setTimeout(() => {
        toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        window.setTimeout(() => toast.remove(), 220);
    }, timeout);
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDuration(totalSeconds) {
    const seconds = Math.max(0, Math.round(Number(totalSeconds) || 0));
    if (seconds < 60) return `${seconds} dtk`;

    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    if (minutes < 60) return remainder ? `${minutes} mnt ${remainder} dtk` : `${minutes} mnt`;

    const hours = Math.floor(minutes / 60);
    const restMinutes = minutes % 60;
    return restMinutes ? `${hours} jam ${restMinutes} mnt` : `${hours} jam`;
}

function downloadBlob(content, filename, mimeType = 'application/octet-stream') {
    const blob = content instanceof Blob
        ? content
        : new Blob([content], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'unduhan';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function copyToClipboard(text) {
    const value = String(text ?? '');

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
            return true;
        }
    } catch (err) {
        // lanjut ke fallback
    }

    try {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        return copied;
    } catch (err) {
        return false;
    }
}


