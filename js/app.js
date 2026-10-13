// Application Logic, Exam Timer, LKPD Printing, Diagnostic, & Custom Question CRUD

let currentPhase = 'faseA';
let currentSubject = 'mtk';
let currentQuizList = [];
let currentQuizIndex = 0;
let currentScore = 0;
let customAIQuiz = null;

// Timer & Exam Mode Variables
let isExamMode = false;
let examTimerInterval = null;
let examTimeSeconds = 600; // 10 minutes default

document.addEventListener('DOMContentLoaded', () => {
    updateStudentDisplay();
    renderMateri();
    setupEnterKeyForChat();
});

// Router Navigasi
function showSection(secId) {
    document.querySelectorAll('main > section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`sec-${secId}`).classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`nav-${secId}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (secId === 'rapor') renderRaporAndDiagnostic();
    if (secId === 'kuis') startSubjectQuiz(currentSubject);
}

// Student Modal
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
    alert("API Key berhasil disimpan!");
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
        <button onclick="displayMateriContent('${t.id}')" class="w-full text-left p-3 rounded-2xl text-xs font-bold hover:bg-indigo-100 hover:text-indigo-900 transition border border-transparent hover:border-indigo-300">
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

// Quiz & Mode Ujian Logic
function toggleExamMode() {
    isExamMode = document.getElementById('chk-mode-ujian').checked;
    const timeSelect = document.getElementById('select-exam-time');
    if (isExamMode) {
        timeSelect.classList.remove('hidden');
    } else {
        timeSelect.classList.add('hidden');
    }
}

function startSubjectQuiz(subKey) {
    currentSubject = subKey;
    const subData = KURIKULUM_DATA[currentPhase][subKey];
    
    // Merge Built-in questions + Custom Questions from Teacher
    let baseList = (subData && subData.quiz.length) ? [...subData.quiz] : [];
    const customList = getCustomQuestions().filter(q => q.phase === currentPhase && q.subject === subKey);
    currentQuizList = [...baseList, ...customList];

    if (currentQuizList.length === 0) {
        alert("Belum ada soal untuk mata pelajaran ini.");
        showSection('beranda');
        return;
    }

    // Shuffle Questions if Exam Mode is checked
    if (isExamMode) {
        currentQuizList.sort(() => Math.random() - 0.5);
        startExamTimer();
    } else {
        stopExamTimer();
        document.getElementById('quiz-timer-container').classList.add('hidden');
    }

    currentQuizIndex = 0;
    currentScore = 0;
    renderQuizQuestion();
}

function startExamTimer() {
    stopExamTimer();
    const minutes = parseInt(document.getElementById('select-exam-time').value) || 10;
    examTimeSeconds = minutes * 60;

    const timerBox = document.getElementById('quiz-timer-container');
    const timerDisplay = document.getElementById('quiz-timer-display');
    timerBox.classList.remove('hidden');

    examTimerInterval = setInterval(() => {
        examTimeSeconds--;
        const m = Math.floor(examTimeSeconds / 60);
        const s = examTimeSeconds % 60;
        timerDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        if (examTimeSeconds <= 0) {
            stopExamTimer();
            alert("⏰ Waktu Ujian Telah Habis! Kuis otomatis dikumpulkan.");
            finishQuiz();
        }
    }, 1000);
}

function stopExamTimer() {
    if (examTimerInterval) clearInterval(examTimerInterval);
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
        <button onclick="checkAnswer(${idx})" class="quiz-opt-btn w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 font-bold text-sm transition shadow-sm">
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
        expBox.className = "p-4 rounded-2xl text-sm border-2 bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold";
        expBox.innerHTML = `<strong>Jawaban Benar! 🎉</strong><p class="mt-1">${q.exp}</p>`;
    } else {
        soundFX.playWrong();
        btns[selectedIdx].classList.add('bg-rose-100', 'border-rose-500', 'text-rose-900');
        btns[q.correct].classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-900');
        expBox.className = "p-4 rounded-2xl text-sm border-2 bg-rose-50 border-rose-300 text-rose-900 font-semibold";
        expBox.innerHTML = `<strong>Kurang Tepat 😊</strong><p class="mt-1">${q.exp}</p>`;
    }

    document.getElementById('btn-next-quiz').disabled = false;
}

function nextQuestion() {
    currentQuizIndex++;
    if (currentQuizIndex < currentQuizList.length) {
        renderQuizQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    stopExamTimer();
    const active = getActiveStudent();
    saveQuizScore(active.id, currentSubject, currentScore, currentQuizList.length);
    
    const pct = Math.round((currentScore / currentQuizList.length) * 100);
    alert(`Kuis Selesai!\nNilai ${active.nama}: ${pct} / 100 (${currentScore} benar dari ${currentQuizList.length} soal)`);

    // Automatic Remedial / Enrichment Trigger
    if (pct < 60) {
        showRemedialModal("Program Remedial Otomatis 📖", `
            <p class="text-rose-600 font-bold">Skor anak (${pct}) masih di bawah standar ketuntasan (60).</p>
            <p class="mt-2"><strong>Rekomendasi Pendidik:</strong> Disarankan untuk membaca kembali materi dasar topik ini di menu Materi Pembelajaran, atau minta bimbingan ulang dari Ayah/Bunda/Guru.</p>
        `);
    } else if (pct >= 80) {
        showRemedialModal("Program Pengayaan HOTS ⭐", `
            <p class="text-emerald-600 font-bold">Luar Biasa! Skor anak (${pct}) sangat tinggi!</p>
            <p class="mt-2"><strong>Rekomendasi Pendidik:</strong> Anak siap mengikuti tantangan soal HOTS atau berpindah ke Fase kelas berikutnya di Generator Soal AI!</p>
        `);
    }

    showSection('rapor');
}

function showRemedialModal(title, contentHtml) {
    document.getElementById('remedial-modal-title').textContent = title;
    document.getElementById('remedial-modal-body').innerHTML = contentHtml;
    document.getElementById('modal-remedial').classList.remove('hidden');
}

function closeRemedialModal() {
    document.getElementById('modal-remedial').classList.add('hidden');
}

function readAloudQuiz() {
    const q = currentQuizList[currentQuizIndex];
    speakText(q.q);
}

// Print Offline LKPD (Lembar Kerja Siswa Printable)
function printCurrentQuizLKPD() {
    const active = getActiveStudent();
    const subName = currentSubject.toUpperCase();
    const lkpdArea = document.getElementById('lkpd-print-area');

    lkpdArea.innerHTML = `
        <div class="text-center border-b-2 border-black pb-4 mb-4">
            <h2 class="text-2xl font-bold uppercase">LEMBAR KERJA PESERTA DIDIK (LKPD)</h2>
            <p class="text-xs font-bold">MATA PELAJARAN: ${subName} - ${currentPhase.toUpperCase()}</p>
        </div>
        <div class="grid grid-cols-2 text-xs font-bold mb-6 border-b pb-2">
            <p>Nama Siswa: ${active.nama}</p>
            <p class="text-right">Kelas / Sekolah: ${active.kelas} / ${active.sekolah}</p>
            <p>Hari/Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
            <p class="text-right">Paraf Guru/Orang Tua: ..................</p>
        </div>
        <div class="space-y-4 text-xs font-semibold">
            ${currentQuizList.map((q, idx) => `
                <div class="border-b pb-2">
                    <p class="font-bold">${idx + 1}.${q.q}</p>
                    <div class="grid grid-cols-2 gap-1 mt-1 pl-4">
                        ${q.options.map((opt, oIdx) => `<p>${String.fromCharCode(65 + oIdx)}. ${opt}</p>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    window.print();
}

// Custom Question Editor (Guru)
function handleSaveCustomQuestion(e) {
    e.preventDefault();
    const qObj = {
        phase: document.getElementById('custom-phase').value,
        subject: document.getElementById('custom-subject').value,
        q: document.getElementById('custom-q-text').value,
        options: [
            document.getElementById('custom-opt-0').value,
            document.getElementById('custom-opt-1').value,
            document.getElementById('custom-opt-2').value,
            document.getElementById('custom-opt-3').value
        ],
        correct: parseInt(document.getElementById('custom-correct-idx').value),
        exp: document.getElementById('custom-exp').value
    };

    saveCustomQuestion(qObj);
    alert("Soal berhasil disimpan ke Bank Soal Guru!");
    e.target.reset();
}

// Modul Ajar AI Generator (Guru)
async function handleGenerateModulAjar() {
    const sub = document.getElementById('modul-subject').value;
    const phase = document.getElementById('modul-phase').value;
    const topic = document.getElementById('modul-topic').value.trim();

    if (!topic) {
        alert("Harap isi topik pembelajaran untuk Modul Ajar.");
        return;
    }

    const btn = document.getElementById('btn-generate-modul');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Menyusun Modul Ajar...</span>`;

    try {
        const resultHtml = await fetchGeminiModulAjar(sub, phase, topic);
        document.getElementById('modul-content-body').innerHTML = resultHtml;
        document.getElementById('modul-output-container').classList.remove('hidden');
    } catch (err) {
        alert(err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles text-xl"></i> <span>Buat Modul Ajar Otomatis</span>`;
    }
}

function printModulAjar() {
    window.print();
}

// Rapor & Diagnostic Dashboard
function renderRaporAndDiagnostic() {
    const active = getActiveStudent();
    document.getElementById('rap-nama').textContent = active.nama;
    document.getElementById('rap-kelas').textContent = active.kelas;
    document.getElementById('rap-nisn').textContent = active.nisn;
    document.getElementById('rap-sekolah').textContent = active.sekolah;

    const allScores = getScores()[active.id] || {};
    const subjects = ['mtk', 'ipas', 'indo', 'inggris'];
    const labels = { mtk: 'Matematika', ipas: 'IPAS', indo: 'Bahasa Indonesia', inggris: 'Bahasa Inggris' };

    // Diagnostic Summary Box
    const diagBox = document.getElementById('diagnostic-summary-box');
    let totalPct = 0;
    let count = 0;

    diagBox.innerHTML = subjects.map(s => {
        const data = allScores[s];
        if (data) {
            totalPct += data.percentage;
            count++;
            const status = data.percentage >= 80 ? 'Sangat Baik ✅' : data.percentage >= 60 ? 'Perlu Latihan ⚠️' : 'Butuh Perhatian ❌';
            const color = data.percentage >= 80 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : data.percentage >= 60 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-rose-50 border-rose-300 text-rose-900';
            return `
                <div class="p-3.5 rounded-2xl border-2 ${color}">
                    <p class="font-extrabold">${labels[s]}</p>
                    <p class="text-lg font-black mt-1">${data.percentage}% (${data.score}/${data.total})</p>
                    <p class="mt-1">${status}</p>
                </div>
            `;
        }
        return `
            <div class="p-3.5 rounded-2xl border-2 bg-slate-50 border-slate-200 text-slate-500">
                <p class="font-extrabold">${labels[s]}</p>
                <p class="text-xs mt-1">Belum Mengikuti Test</p>
            </div>
        `;
    }).join('');

    // Rapor Scores Table
    const tbody = document.getElementById('rap-scores-body');
    tbody.innerHTML = subjects.map(s => {
        const data = allScores[s];
        if (data) {
            const pred = data.percentage >= 80 ? 'Sangat Baik (A)' : data.percentage >= 60 ? 'Baik (B)' : 'Cukup (C)';
            return `
                <tr>
                    <td class="border border-indigo-200 px-3 py-2 font-bold">${labels[s]}</td>
                    <td class="border border-indigo-200 px-3 py-2 text-center font-black">${data.score} / ${data.total} (${data.percentage}%)</td>
                    <td class="border border-indigo-200 px-3 py-2 text-center text-amber-500">${'⭐'.repeat(data.stars)}</td>
                    <td class="border border-indigo-200 px-3 py-2 text-center font-bold text-indigo-900">${pred}</td>
                </tr>
            `;
        }
        return `
            <tr>
                <td class="border border-indigo-200 px-3 py-2 font-bold">${labels[s]}</td>
                <td class="border border-indigo-200 px-3 py-2 text-center text-slate-400" colspan="3">Belum Ada Catatan Nilai</td>
            </tr>
        `;
    }).join('');

    const badgesEl = document.getElementById('rap-badges-list');
    badgesEl.innerHTML = `
        <span class="bg-indigo-100 border-2 border-indigo-300 text-indigo-900 text-xs px-3 py-1 rounded-full font-bold">🎖️ Siswa Rajin SD</span>
        <span class="bg-amber-100 border-2 border-amber-300 text-amber-900 text-xs px-3 py-1 rounded-full font-bold">⭐ Bintang Pembelajar</span>
        <span class="bg-emerald-100 border-2 border-emerald-300 text-emerald-900 text-xs px-3 py-1 rounded-full font-bold">🚀 Generasi Merdeka</span>
    `;
}

// AI Chat Enter Key Setup
function setupEnterKeyForChat() {
    const input = document.getElementById('chat-input');
    if (!input) return;
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
            <div class="bg-pink-500 text-white p-3.5 rounded-3xl rounded-tr-none max-w-md text-sm font-medium shadow-sm">
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
                Ninna sedang berpikir... 🤖
            </div>
        </div>
    `;

    try {
        const reply = await fetchGeminiChat(msg);
        document.getElementById(loadingId).remove();
        chatWin.innerHTML += `
            <div class="flex items-start space-x-2">
                <div class="bg-indigo-100 text-indigo-950 p-3.5 rounded-3xl rounded-tl-none max-w-md text-sm font-medium leading-relaxed shadow-sm">
                    ${reply}
                </div>
            </div>
        `;
    } catch (err) {
        document.getElementById(loadingId).remove();
        chatWin.innerHTML += `
            <div class="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold">
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
        alert("Harap masukkan topik khusus.");
        return;
    }

    const btn = document.getElementById('btn-generate-ai');
    btn.disabled = true;
    btn.textContent = "Menyusun Soal AI...";

    try {
        customAIQuiz = await fetchGeminiQuizGenerator(sub, phase, topic);
        const listEl = document.getElementById('gen-questions-list');
        listEl.innerHTML = customAIQuiz.map((q, idx) => `
            <div class="border-b pb-2">
                <p class="font-bold text-slate-800">${idx + 1}. ${q.q}</p>
                <p class="text-slate-500">Kunci: ${q.options[q.correct]}</p>
            </div>
        `).join('');
        document.getElementById('gen-result-area').classList.remove('hidden');
    } catch (err) {
        alert(err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-gears text-xl"></i> <span>Buat Kuis Sekarang</span>`;
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