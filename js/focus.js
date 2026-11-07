// ============================================================
// Belajar Fokus 10 Menit
// Sesi terpandu, timer, refleksi, dan hadiah.
// ============================================================

const FOCUS_STEPS = [
    { at: 0, icon: 'fa-chair', title: 'Siapkan diri', detail: 'Duduk nyaman, siapkan buku, alat tulis, dan air minum.' },
    { at: 2, icon: 'fa-book-open', title: 'Baca materi', detail: 'Baca satu topik pelajaran dengan tenang. Catat hal yang belum dipahami.' },
    { at: 4, icon: 'fa-pen-to-square', title: 'Latihan', detail: 'Kerjakan 3–5 soal atau tulis ulang contoh dengan bahasa sendiri.' },
    { at: 6, icon: 'fa-comments', title: 'Jelaskan', detail: 'Ceritakan apa yang baru dipelajari kepada orang tua, guru, atau teman.' },
    { at: 8, icon: 'fa-face-smile', title: 'Refleksi', detail: 'Tuliskan satu hal yang dikuasai dan satu hal yang ingin dipelajari lagi.' }
];

const focusState = {
    total: 600,
    remaining: 600,
    timerId: null,
    running: false,
    startedAt: 0,
    rewarded: false,
    stage: 'ready'
};

function getFocusStep(elapsedMinutes) {
    let current = FOCUS_STEPS[0];
    FOCUS_STEPS.forEach((step) => {
        if (elapsedMinutes >= step.at) current = step;
    });
    return current;
}

function startFocusSession() {
    stopSpeaking();
    clearFocusTimer();

    focusState.total = 600;
    focusState.remaining = 600;
    focusState.running = false;
    focusState.rewarded = false;
    focusState.stage = 'ready';

    document.getElementById('modal-fokus')?.classList.remove('hidden');
    renderFocusModal();
}

function clearFocusTimer() {
    if (focusState.timerId) {
        window.clearInterval(focusState.timerId);
        focusState.timerId = null;
    }
    focusState.running = false;
}

function beginFocusTimer() {
    clearFocusTimer();
    focusState.remaining = 600;
    focusState.startedAt = Date.now();
    focusState.running = true;
    focusState.stage = 'running';

    focusState.timerId = window.setInterval(() => {
        if (focusState.remaining > 0) {
            focusState.remaining -= 1;
            renderFocusTimerOnly();
            if (focusState.remaining === 0) {
                clearFocusTimer();
                focusState.stage = 'reflection';
                soundFX.playComplete();
                renderFocusModal();
            }
        }
    }, 1000);

    renderFocusModal();
}

function toggleFocusPause() {
    if (focusState.stage !== 'running') return;

    if (focusState.running) {
        clearFocusTimer();
        focusState.pausedRemaining = focusState.remaining;
        renderFocusModal();
    } else {
        focusState.running = true;
        focusState.timerId = window.setInterval(() => {
            if (focusState.remaining > 0) {
                focusState.remaining -= 1;
                renderFocusTimerOnly();
                if (focusState.remaining === 0) {
                    clearFocusTimer();
                    focusState.stage = 'reflection';
                    soundFX.playComplete();
                    renderFocusModal();
                }
            }
        }, 1000);
        renderFocusModal();
    }
}

function formatFocusTime(seconds) {
    const safe = Math.max(0, Number(seconds) || 0);
    return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

function renderFocusTimerOnly() {
    const display = document.getElementById('focus-timer-display');
    const bar = document.getElementById('focus-progress-bar');
    const stepTitle = document.getElementById('focus-step-title');
    const stepDetail = document.getElementById('focus-step-detail');
    const elapsed = focusState.total - focusState.remaining;
    const step = getFocusStep(Math.floor(elapsed / 60));

    if (display) display.textContent = formatFocusTime(focusState.remaining);
    if (bar) bar.style.width = `${Math.min(100, Math.round((elapsed / focusState.total) * 100))}%`;
    if (stepTitle) stepTitle.textContent = step.title;
    if (stepDetail) stepDetail.textContent = step.detail;
}

function renderFocusModal() {
    const body = document.getElementById('focus-modal-body');
    if (!body) return;

    if (focusState.stage === 'ready') {
        body.innerHTML = `
            <div class="text-center">
                <div class="text-6xl">⏳</div>
                <h4 class="text-xl font-extrabold font-fredoka text-indigo-950 mt-2">Belajar Fokus 10 Menit</h4>
                <p class="text-xs font-semibold text-slate-500 mt-1">Ikuti lima langkah terpandu. Fokus pada satu pelajaran saja.</p>
            </div>
            <div class="space-y-2 mt-4">
                ${FOCUS_STEPS.map((step, index) => `
                    <div class="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3">
                        <span class="w-8 h-8 shrink-0 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-black">${index + 1}</span>
                        <div>
                            <p class="text-xs font-extrabold text-slate-800">${escapeHtml(step.title)} <span class="text-[10px] font-bold text-slate-400">• menit ${step.at}–${step.at + 2}</span></p>
                            <p class="text-[11px] font-semibold text-slate-500 mt-0.5">${escapeHtml(step.detail)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button onclick="beginFocusTimer()" class="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold py-3 rounded-2xl text-sm transition shadow-md flex items-center justify-center gap-2">
                <i class="fa-solid fa-play" aria-hidden="true"></i> Mulai Sesi 10 Menit
            </button>
        `;
        return;
    }

    if (focusState.stage === 'running') {
        const elapsed = focusState.total - focusState.remaining;
        const step = getFocusStep(Math.floor(elapsed / 60));
        body.innerHTML = `
            <div class="text-center">
                <p class="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">Sesi belajar fokus</p>
                <p id="focus-timer-display" class="text-6xl font-black font-fredoka text-indigo-950 tabular-nums mt-2">${formatFocusTime(focusState.remaining)}</p>
                <div class="mt-4 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div id="focus-progress-bar" class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all" style="width:${Math.round((elapsed / focusState.total) * 100)}%"></div>
                </div>
            </div>
            <div class="mt-5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 text-center">
                <p class="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">Langkah saat ini</p>
                <p id="focus-step-title" class="text-base font-extrabold text-indigo-900 mt-1">${escapeHtml(step.title)}</p>
                <p id="focus-step-detail" class="text-xs font-semibold text-indigo-700 mt-1 leading-relaxed">${escapeHtml(step.detail)}</p>
            </div>
            <div class="flex flex-wrap justify-center gap-2 mt-5">
                <button onclick="toggleFocusPause()" class="bg-white hover:bg-slate-50 text-slate-700 font-extrabold px-5 py-2.5 rounded-2xl text-xs border-2 border-slate-200 transition">
                    <i class="fa-solid ${focusState.running ? 'fa-pause' : 'fa-play'}" aria-hidden="true"></i> ${focusState.running ? 'Jeda' : 'Lanjutkan'}
                </button>
                <button onclick="openFocusReflection()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs transition">
                    <i class="fa-solid fa-flag-checkered" aria-hidden="true"></i> Selesai & Refleksi
                </button>
            </div>
            <p class="text-center text-[10px] font-semibold text-slate-400 mt-3">Tips: jauhkan notifikasi dan mainan selama sesi berlangsung.</p>
        `;
        return;
    }

    if (focusState.stage === 'reflection') {
        const minutes = Math.max(1, Math.round((focusState.total - focusState.remaining) / 60));
        body.innerHTML = `
            <div class="text-center">
                <div class="text-5xl">🌟</div>
                <h4 class="text-xl font-extrabold font-fredoka text-indigo-950 mt-1">Sesi selesai!</h4>
                <p class="text-xs font-semibold text-slate-500">Kamu belajar fokus sekitar <strong>${minutes} menit</strong>. Luar biasa!</p>
            </div>
            <form onsubmit="saveFocusReflection(event)" class="space-y-3 mt-4 text-xs font-bold">
                <div>
                    <label for="focus-mood" class="block mb-1 text-slate-700">Bagaimana perasaanmu setelah belajar?</label>
                    <select id="focus-mood" class="w-full border-2 border-indigo-200 rounded-2xl p-2.5 bg-indigo-50">
                        <option value="senang">😄 Senang dan semangat</option>
                        <option value="biasa">🙂 Biasa saja</option>
                        <option value="lelah">😴 Cukup lelah</option>
                        <option value="bingung">🤔 Masih bingung</option>
                    </select>
                </div>
                <div>
                    <label for="focus-reflection" class="block mb-1 text-slate-700">Apa yang sudah kamu pelajari?</label>
                    <textarea id="focus-reflection" rows="3" placeholder="Contoh: Aku sudah memahami perkalian dua digit..." class="w-full border-2 border-indigo-200 rounded-2xl p-2.5 font-medium"></textarea>
                </div>
                <div>
                    <label for="focus-next" class="block mb-1 text-slate-700">Apa yang ingin dipelajari berikutnya?</label>
                    <input id="focus-next" type="text" placeholder="Contoh: Pembagian dengan sisa" class="w-full border-2 border-indigo-200 rounded-2xl p-2.5 font-medium">
                </div>
                <button type="submit" class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold py-3 rounded-2xl text-sm transition shadow-md">
                    <i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Simpan Refleksi & Klaim Hadiah
                </button>
            </form>
        `;
        return;
    }

    body.innerHTML = '<p class="text-sm font-semibold text-slate-500">Sesi fokus selesai. Terima kasih sudah belajar!</p>';
}

function openFocusReflection() {
    clearFocusTimer();
    focusState.stage = 'reflection';
    renderFocusModal();
}

function saveFocusReflection(event) {
    event.preventDefault();
    if (focusState.rewarded) {
        closeFocusModal();
        return;
    }

    const reflection = document.getElementById('focus-reflection')?.value.trim() || '';
    const mood = document.getElementById('focus-mood')?.value || '';
    const next = document.getElementById('focus-next')?.value.trim() || '';
    const minutes = Math.max(1, Math.round((focusState.total - focusState.remaining) / 60));

    saveJournalEntry({
        type: 'fokus',
        title: `Sesi Belajar Fokus ${minutes} Menit`,
        topic: 'Belajar mandiri',
        activity: 'Mengikuti sesi belajar terpandu 10 menit.',
        reflection: [reflection, next ? `Rencana berikutnya: ${next}` : ''].filter(Boolean).join('\n'),
        followUp: next,
        mood,
        minutes
    });

    const profile = getGamificationProfile();
    addReward(profile, 30, 15);
    profile.stats.focus = (Number(profile.stats.focus) || 0) + 1;
    profile.stats.minutes += minutes;
    touchStreak(profile);
    bumpMissionProgress(profile, 'focus', 1);
    checkNewBadges(profile);
    saveGamificationProfile(profile);

    focusState.rewarded = true;
    renderGamification();
    renderJournal();
    burstConfetti();

    if (typeof showToast === 'function') {
        showToast(`Sesi fokus selesai! +30 XP dan +15 koin.`, 'success', 4500);
    }

    closeFocusModal();
}

function closeFocusModal() {
    clearFocusTimer();
    document.getElementById('modal-fokus')?.classList.add('hidden');
    focusState.stage = 'ready';
}
