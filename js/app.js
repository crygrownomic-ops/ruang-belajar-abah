// Application Logic & UI Router

let currentPhase = 'faseA';
let currentSubject = 'mtk';
let currentQuizList = [];
let currentQuizIndex = 0;
let currentScore = 0;
let customAIQuiz = null;

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    updateStudentDisplay();
    renderMateri();
    setupEnterKeyForChat();
});

// Navigation Router
function showSection(secId) {
    document.querySelectorAll('main > section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`sec-${secId}`).classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`nav-${secId}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (secId === 'rapor') renderRapor();
    if (secId === 'kuis') startSubjectQuiz(currentSubject);
}

// Student Management Modal
function openStudentModal() {
    const students = getStudents();
    const activeId = getActiveStudentId();
    const selectEl = document.getElementById('student-select');
    
    selectEl.innerHTML = students.map(s => 
        `<option value="${s.id}" ${s.id === activeId ? 'selected' : ''}>${s.nama} (${s.kelas})</option>`
    ).join('');

    document.getElementById('modal-siswa').classList.remove('hidden');
}

function closeStudentModal() {
    document.getElementById('modal-siswa').classList.add('hidden');
}

function changeActiveStudent() {
    const selectedId = document.getElementById('student-select').value;
    setActiveStudentId(selectedId);
    updateStudentDisplay();
}

function handleSaveStudent(e) {
    e.preventDefault();
    const newStudent = {
        id: 's_' + Date.now(),
        nama: document.getElementById('input-nama').value,
        kelas: document.getElementById('input-kelas').value,
        nisn: document.getElementById('input-nisn').value || '-',
        sekolah: document.getElementById('input-sekolah').value || '-'
    };
    saveStudent(newStudent);
    updateStudentDisplay();
    closeStudentModal();
}

function updateStudentDisplay() {
    const active = getActiveStudent();
    document.getElementById('active-student-display').textContent = active.nama;
    document.getElementById('welcome-heading').textContent = `Halo ${active.nama}! 👋`;
}

// API Key Modal
function openApiKeyModal() {
    document.getElementById('input-api-key').value = getGeminiApiKey();
    document.getElementById('modal-apikey').classList.remove('hidden');
}

function closeApiKeyModal() {
    document.getElementById('modal-apikey').classList.add('hidden');
}

function handleSaveApiKey() {
    const key = document.getElementById('input-api-key').value;
    saveGeminiApiKey(key);
    closeApiKeyModal();
    alert("API Key berhasil disimpan di browser!");
}

// Phase & Subject Selector
function setPhase(phaseKey) {
    currentPhase = phaseKey;
    document.querySelectorAll('.phase-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${phaseKey}`).classList.add('active');
    renderMateri();
}

function selectSubject(subKey) {
    currentSubject = subKey;
    showSection('materi');
}

function renderMateri() {
    const subData = KURIKULUM_DATA[currentPhase][currentSubject];
    const topicListEl = document.getElementById('materi-topic-list');

    if (!subData || !subData.topics.length) {
        topicListEl.innerHTML = `<p class="text-xs text-slate-400">Materi belum tersedia.</p>`;
        document.getElementById('materi-title').textContent = "Materi Belum Tersedia";
        document.getElementById('materi-body').textContent = "Silakan pilih mata pelajaran lain.";
        return;
    }

    topicListEl.innerHTML = subData.topics.map((t, idx) => `
        <button onclick="displayMateriContent('${t.id}')" class="w-full text-left p-2.5 rounded-xl text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-700 transition border border-transparent hover:border-indigo-200">
            ${idx + 1}. ${t.name}
        </button>
    `).join('');

    displayMateriContent(subData.topics[0].id);
}

function displayMateriContent(topicId) {
    const subData = KURIKULUM_DATA[currentPhase][currentSubject];
    const topic = subData.topics.find(t => t.id === topicId);
    if (topic) {
        document.getElementById('materi-title').textContent = topic.name;
        document.getElementById('materi-body').textContent = topic.content;
    }
}

function readAloudMateri() {
    const text = document.getElementById('materi-title').textContent + ". " + document.getElementById('materi-body').textContent;
    speakText(text);
}

// Quiz System
function startSubjectQuiz(subKey) {
    currentSubject = subKey;
    const subData = KURIKULUM_DATA[currentPhase][subKey];
    currentQuizList = (subData && subData.quiz.length) ? subData.quiz : [];
    
    if (currentQuizList.length === 0) {
        alert("Belum ada soal untuk mata pelajaran ini.");
        showSection('beranda');
        return;
    }

    currentQuizIndex = 0;
    currentScore = 0;
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = currentQuizList[currentQuizIndex];
    document.getElementById('quiz-subject-tag').textContent = `${currentSubject.toUpperCase()} - ${currentPhase.toUpperCase()}`;
    document.getElementById('quiz-progress-num').textContent = `Soal ${currentQuizIndex + 1} dari ${currentQuizList.length}`;
    document.getElementById('quiz-progress-bar').style.width = `${((currentQuizIndex + 1) / currentQuizList.length) * 100}%`;
    
    document.getElementById('quiz-question').textContent = q.q;
    document.getElementById('quiz-explanation').classList.add('hidden');
    document.getElementById('btn-next-quiz').disabled = true;

    const optEl = document.getElementById('quiz-options');
    optEl.innerHTML = q.options.map((opt, idx) => `
        <button onclick="checkAnswer(${idx})" class="quiz-opt-btn w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 font-medium text-sm transition">
            ${String.fromCharCode(65 + idx)}. ${opt}
        </button>
    `).join('');
}

function checkAnswer(selectedIdx) {
    const q = currentQuizList[currentQuizIndex];
    const btns = document.querySelectorAll('.quiz-opt-btn');
    btns.forEach(b => b.disabled = true);

    const expBox = document.getElementById('quiz-explanation');
    expBox.classList.remove('hidden');

    if (selectedIdx === q.correct) {
        soundFX.playCorrect();
        currentScore++;
        btns[selectedIdx].classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-900');
        expBox.className = "p-4 rounded-xl text-sm border bg-emerald-50 border-emerald-200 text-emerald-900";
        expBox.innerHTML = `<strong>Jawaban Benar! 🎉</strong><p class="mt-1">${q.exp}</p>`;
    } else {
        soundFX.playWrong();
        btns[selectedIdx].classList.add('bg-rose-100', 'border-rose-500', 'text-rose-900');
        btns[q.correct].classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-900');
        expBox.className = "p-4 rounded-xl text-sm border bg-rose-50 border-rose-200 text-rose-900";
        expBox.innerHTML = `<strong>Kurang Tepat 😊</strong><p class="mt-1">${q.exp}</p>`;
    }

    document.getElementById('btn-next-quiz').disabled = false;
}

function nextQuestion() {
    currentQuizIndex++;
    if (currentQuizIndex < currentQuizList.length) {
        renderQuizQuestion();
    } else {
        const active = getActiveStudent();
        saveQuizScore(active.id, currentSubject, currentScore, currentQuizList.length);
        alert(`Kuis Selesai! Skor ${active.nama}: ${currentScore} / ${currentQuizList.length}`);
        showSection('rapor');
    }
}

function readAloudQuiz() {
    const q = currentQuizList[currentQuizIndex];
    speakText(q.q);
}

// AI Chat - Enter Key Support
function setupEnterKeyForChat() {
    const input = document.getElementById('chat-input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendChat();
        }
    });
}

async function handleSendChat() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const chatWin = document.getElementById('chat-window');
    chatWin.innerHTML += `
        <div class="flex justify-end">
            <div class="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-none max-w-md text-sm">
                ${msg}
            </div>
        </div>
    `;
    input.value = '';
    chatWin.scrollTop = chatWin.scrollHeight;

    const loadingId = 'loading-' + Date.now();
    chatWin.innerHTML += `
        <div id="${loadingId}" class="flex items-start space-x-2">
            <div class="bg-slate-100 text-slate-500 p-3 rounded-2xl text-xs italic">
                Ninna sedang berpikir...
            </div>
        </div>
    `;

    try {
        const reply = await fetchGeminiChat(msg);
        document.getElementById(loadingId).remove();
        chatWin.innerHTML += `
            <div class="flex items-start space-x-2">
                <div class="bg-indigo-100 text-indigo-900 p-3.5 rounded-2xl rounded-tl-none max-w-md text-sm leading-relaxed">
                    ${reply}
                </div>
            </div>
        `;
    } catch (err) {
        document.getElementById(loadingId).remove();
        chatWin.innerHTML += `
            <div class="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs">
                ${err.message}
            </div>
        `;
    }
    chatWin.scrollTop = chatWin.scrollHeight;
}

// AI Quiz Generator
async function handleGenerateQuiz() {
    const sub = document.getElementById('gen-subject').value;
    const phase = document.getElementById('gen-phase').value;
    const topic = document.getElementById('gen-topic').value.trim();

    if (!topic) {
        alert("Harap masukkan topik khusus untuk soal AI.");
        return;
    }

    const btn = document.getElementById('btn-generate-ai');
    btn.disabled = true;
    btn.textContent = "Sedang Membuat Soal...";

    try {
        customAIQuiz = await fetchGeminiQuizGenerator(sub, phase, topic);
        const listEl = document.getElementById('gen-questions-list');
        listEl.innerHTML = customAIQuiz.map((q, idx) => `
            <div class="border-b pb-2">
                <p class="font-bold text-slate-700">${idx + 1}. ${q.q}</p>
                <p class="text-slate-500">Kunci: ${q.options[q.correct]}</p>
            </div>
        `).join('');
        document.getElementById('gen-result-area').classList.remove('hidden');
    } catch (err) {
        alert(err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-gears"></i> <span>Buat Kuis Sekarang</span>`;
    }
}

function startCustomGeneratedQuiz() {
    if (customAIQuiz && customAIQuiz.length) {
        currentQuizList = customAIQuiz;
        currentQuizIndex = 0;
        currentScore = 0;
        showSection('kuis');
    }
}

// Render Rapor Digital
function renderRapor() {
    const active = getActiveStudent();
    document.getElementById('rap-nama').textContent = active.nama;
    document.getElementById('rap-kelas').textContent = active.kelas;
    document.getElementById('rap-nisn').textContent = active.nisn;
    document.getElementById('rap-sekolah').textContent = active.sekolah;

    const allScores = getScores()[active.id] || {};
    const subjects = ['mtk', 'ipas', 'indo', 'inggris'];
    const labels = { mtk: 'Matematika', ipas: 'IPAS', indo: 'Bahasa Indonesia', inggris: 'Bahasa Inggris' };

    const tbody = document.getElementById('rap-scores-body');
    tbody.innerHTML = subjects.map(s => {
        const data = allScores[s];
        if (data) {
            const pct = Math.round((data.score / data.total) * 100);
            const pred = pct >= 80 ? 'Sangat Baik (A)' : pct >= 60 ? 'Baik (B)' : 'Cukup (C)';
            return `
                <tr>
                    <td class="border border-slate-300 px-3 py-2 font-medium">${labels[s]}</td>
                    <td class="border border-slate-300 px-3 py-2 text-center font-bold">${data.score} / ${data.total}</td>
                    <td class="border border-slate-300 px-3 py-2 text-center text-amber-500">${'⭐'.repeat(data.stars)}</td>
                    <td class="border border-slate-300 px-3 py-2 text-center font-semibold text-indigo-900">${pred}</td>
                </tr>
            `;
        }
        return `
            <tr>
                <td class="border border-slate-300 px-3 py-2 font-medium">${labels[s]}</td>
                <td class="border border-slate-300 px-3 py-2 text-center text-slate-400" colspan="3">Belum Mengikuti Kuis</td>
            </tr>
        `;
    }).join('');

    const badgesEl = document.getElementById('rap-badges-list');
    badgesEl.innerHTML = `
        <span class="bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs px-3 py-1 rounded-full font-bold">🎖️ Siswa Rajin</span>
        <span class="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1 rounded-full font-bold">⭐ Bintang Pembelajar</span>
        <span class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">🚀 Generasi Merdeka</span>
    `;
}