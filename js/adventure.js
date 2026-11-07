// ============================================================
// Petualangan Nusantara & Perpustakaan Cerita
// Peta 7 wilayah, misi kuis, cerita rakyat, dan hadiah belajar.
// ============================================================

const adventureFlow = {
    type: null,
    regionId: null,
    storyId: null,
    stage: 'story',
    index: 0,
    qIndex: 0,
    score: 0,
    answered: false,
    firstTime: false
};

function getStudentAdventureState() {
    const active = getActiveStudent();
    const id = active?.id || 'guest';
    const all = getAdventureProgress();
    const existing = all[id] && typeof all[id] === 'object' ? all[id] : {};

    return {
        regions: existing.regions && typeof existing.regions === 'object' ? existing.regions : {},
        stories: existing.stories && typeof existing.stories === 'object' ? existing.stories : {}
    };
}

function saveStudentAdventureState(state) {
    const active = getActiveStudent();
    if (!active) return;
    const all = getAdventureProgress();
    all[active.id] = state;
    saveAdventureProgress(all);
}

function getAdventureRegion(regionId) {
    return ADVENTURE_REGIONS.find((region) => region.id === regionId);
}

function getStory(storyId) {
    return STORIES.find((story) => story.id === storyId);
}

// ------------------------------------------------------------
// Peta & daftar cerita
// ------------------------------------------------------------
function renderAdventure() {
    const map = document.getElementById('adventure-map');
    const progressBox = document.getElementById('adventure-progress');
    if (!map) return;

    const state = getStudentAdventureState();
    const completedCount = ADVENTURE_REGIONS.filter((region) => state.regions[region.id]?.completed).length;
    const percent = Math.round((completedCount / ADVENTURE_REGIONS.length) * 100);

    if (progressBox) {
        const badge = state.regions && Object.keys(state.regions).length
            ? `Penjelajah level ${Math.max(1, Math.floor(completedCount / 2) + 1)}`
            : 'Penjelajah Baru';

        progressBox.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <p class="text-[11px] font-extrabold uppercase tracking-widest text-teal-700">Progres Petualangan</p>
                    <p class="text-lg font-extrabold font-fredoka text-indigo-950">${completedCount} dari ${ADVENTURE_REGIONS.length} wilayah selesai</p>
                    <p class="text-[11px] font-bold text-slate-500">${escapeHtml(badge)} • Setiap misi memberi XP, koin, dan lencana.</p>
                </div>
                <span class="self-start bg-white border-2 border-teal-200 text-teal-700 font-extrabold text-xs px-3 py-1.5 rounded-full">${percent}%</span>
            </div>
            <div class="mt-3 h-3 rounded-full bg-white/70 border border-teal-200 overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all" style="width:${percent}%"></div>
            </div>
        `;
    }

    map.innerHTML = ADVENTURE_REGIONS.map((region, index) => {
        const progress = state.regions[region.id];
        const done = Boolean(progress?.completed);
        return `
            <button onclick="openAdventureRegion('${region.id}')" class="adventure-card text-left rounded-3xl border-4 ${done ? 'border-emerald-300 bg-emerald-50' : 'border-white bg-white'} shadow-lg hover:shadow-xl p-5 transition transform hover:-translate-y-1 relative overflow-hidden">
                <span class="absolute -right-3 -bottom-4 text-6xl opacity-15 select-none">${region.emoji}</span>
                <div class="flex items-center justify-between gap-2">
                    <span class="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br ${region.color} text-white text-2xl shadow">${region.emoji}</span>
                    ${done ? '<span class="text-[10px] font-extrabold bg-emerald-600 text-white px-2.5 py-1 rounded-full">Selesai ✓</span>' : `<span class="text-[10px] font-extrabold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">Misi ${index + 1}</span>`}
                </div>
                <p class="mt-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">${escapeHtml(region.name)}</p>
                <p class="text-base font-extrabold font-fredoka text-indigo-950 leading-snug mt-0.5">${escapeHtml(region.title)}</p>
                <p class="text-[11px] font-semibold text-slate-500 mt-2 leading-relaxed line-clamp-3">${escapeHtml(region.intro)}</p>
                <p class="mt-3 text-[10px] font-extrabold text-teal-700 flex items-center gap-1">
                    <i class="fa-solid fa-circle-play" aria-hidden="true"></i> ${done ? `Ulangi misi • skor terbaik ${progress?.bestScore ?? 0}/${progress?.total ?? region.questions.length}` : 'Mulai petualangan'}
                </p>
            </button>
        `;
    }).join('');
}

function renderStoryLibrary() {
    const container = document.getElementById('story-list');
    if (!container) return;

    const state = getStudentAdventureState();
    const readCount = STORIES.filter((story) => state.stories[story.id]?.completed).length;
    const counter = document.getElementById('story-progress');
    if (counter) counter.textContent = `${readCount}/${STORIES.length} cerita selesai`;

    container.innerHTML = STORIES.map((story) => {
        const done = Boolean(state.stories[story.id]?.completed);
        return `
            <button onclick="openStory('${story.id}')" class="text-left bg-white rounded-3xl border-4 ${done ? 'border-amber-300' : 'border-amber-100'} p-5 shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                <div class="flex items-center justify-between gap-2">
                    <span class="text-4xl">${story.emoji}</span>
                    ${done ? '<span class="text-[10px] font-extrabold bg-amber-500 text-white px-2.5 py-1 rounded-full">Sudah dibaca</span>' : `<span class="text-[10px] font-extrabold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">${escapeHtml(story.age)}</span>`}
                </div>
                <p class="mt-3 text-base font-extrabold font-fredoka text-indigo-950 leading-snug">${escapeHtml(story.title)}</p>
                <p class="text-[11px] font-bold text-amber-700">${escapeHtml(story.region)}</p>
                <p class="text-[11px] font-semibold text-slate-500 mt-2 leading-relaxed line-clamp-3">${escapeHtml(story.paragraphs[0])}</p>
                <p class="mt-3 text-[10px] font-extrabold text-indigo-600">Baca cerita & jawab 2 pertanyaan →</p>
            </button>
        `;
    }).join('');
}

// ------------------------------------------------------------
// Modal petualangan / cerita
// ------------------------------------------------------------
function openAdventureRegion(regionId) {
    const region = getAdventureRegion(regionId);
    if (!region) return;

    stopSpeaking();
    const state = getStudentAdventureState();
    adventureFlow.type = 'region';
    adventureFlow.regionId = regionId;
    adventureFlow.storyId = null;
    adventureFlow.stage = 'story';
    adventureFlow.index = 0;
    adventureFlow.qIndex = 0;
    adventureFlow.score = 0;
    adventureFlow.answered = false;
    adventureFlow.firstTime = !state.regions[regionId]?.completed;

    document.getElementById('modal-petualangan')?.classList.remove('hidden');
    renderAdventureModal();
}

function openStory(storyId) {
    const story = getStory(storyId);
    if (!story) return;

    stopSpeaking();
    const state = getStudentAdventureState();
    adventureFlow.type = 'story';
    adventureFlow.storyId = storyId;
    adventureFlow.regionId = null;
    adventureFlow.stage = 'story';
    adventureFlow.index = 0;
    adventureFlow.qIndex = 0;
    adventureFlow.score = 0;
    adventureFlow.answered = false;
    adventureFlow.firstTime = !state.stories[storyId]?.completed;

    document.getElementById('modal-petualangan')?.classList.remove('hidden');
    renderAdventureModal();
}

function closeAdventureModal() {
    stopSpeaking();
    document.getElementById('modal-petualangan')?.classList.add('hidden');
}

function getAdventureCurrent() {
    if (adventureFlow.type === 'region') return getAdventureRegion(adventureFlow.regionId);
    if (adventureFlow.type === 'story') return getStory(adventureFlow.storyId);
    return null;
}

function renderAdventureModal() {
    const body = document.getElementById('adventure-modal-body');
    const title = document.getElementById('adventure-modal-title');
    if (!body) return;

    const item = getAdventureCurrent();
    if (!item) {
        body.innerHTML = '<p class="text-sm font-bold text-slate-500">Petualangan tidak ditemukan.</p>';
        return;
    }

    const isRegion = adventureFlow.type === 'region';
    const paragraphs = isRegion ? item.story : item.paragraphs;
    const questions = Array.isArray(item.questions) ? item.questions : [];

    if (title) {
        title.innerHTML = `<span class="mr-2">${item.emoji}</span> ${escapeHtml(item.title)}`;
    }

    body.classList.remove('text-center');
    body.classList.add('text-left');

    if (adventureFlow.stage === 'story') {
        const paragraph = paragraphs[adventureFlow.index] || '';
        const total = paragraphs.length;
        body.innerHTML = `
            <div class="flex items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-widest text-teal-700">
                <span>${escapeHtml(isRegion ? item.name : item.region)}</span>
                <span>Bagian ${adventureFlow.index + 1}/${total}</span>
            </div>
            ${isRegion && adventureFlow.index === 0 ? `<p class="mt-3 text-xs font-semibold text-slate-500 bg-teal-50 border border-teal-200 rounded-2xl p-3 leading-relaxed">${escapeHtml(item.intro)}</p>` : ''}
            <p class="mt-4 text-base md:text-lg font-semibold text-slate-700 leading-relaxed">${escapeHtml(paragraph)}</p>
            ${!isRegion && adventureFlow.index === total - 1 ? `<p class="mt-4 text-xs font-extrabold text-amber-700 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3">Pesan moral: ${escapeHtml(item.moral)}</p>` : ''}
            ${isRegion && adventureFlow.index === total - 1 ? `<p class="mt-4 text-xs font-extrabold text-amber-700 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3">Pesan moral: ${escapeHtml(item.moral)}</p>` : ''}
            <div class="flex items-center gap-2 mt-4">
                <div class="flex-grow h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500" style="width:${Math.round(((adventureFlow.index + 1) / total) * 100)}%"></div>
                </div>
            </div>
            <div class="flex flex-wrap justify-end gap-2 mt-5">
                <button onclick="speakAdventureText()" class="bg-pink-100 hover:bg-pink-200 text-pink-700 font-extrabold px-4 py-2.5 rounded-2xl text-xs transition">
                    <i class="fa-solid fa-volume-high" aria-hidden="true"></i> Bacakan
                </button>
                ${adventureFlow.index > 0 ? '<button onclick="adventurePrevStory()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-4 py-2.5 rounded-2xl text-xs transition">Sebelumnya</button>' : ''}
                <button onclick="adventureNextStory()" class="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs transition">
                    ${adventureFlow.index >= total - 1 ? (questions.length ? 'Mulai Pertanyaan' : 'Selesai') : 'Lanjut'} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </button>
            </div>
        `;
        return;
    }

    if (adventureFlow.stage === 'question') {
        const question = questions[adventureFlow.qIndex];
        if (!question) {
            adventureFlow.stage = 'done';
            renderAdventureModal();
            return;
        }

        const optionButtons = question.options.map((option, index) => {
            let classes = 'bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50 text-slate-700';
            if (adventureFlow.answered) {
                if (index === question.correct) classes = 'bg-emerald-50 border-emerald-400 text-emerald-900';
                else if (index === adventureFlow.selected) classes = 'bg-rose-50 border-rose-400 text-rose-900';
                else classes = 'bg-white border-slate-200 text-slate-400';
            }
            return `
                <button onclick="adventureAnswer(${index})" ${adventureFlow.answered ? 'disabled' : ''} class="w-full text-left px-3.5 py-3 rounded-2xl border-2 font-bold text-sm transition flex items-start gap-3 ${classes}">
                    <span class="w-7 h-7 shrink-0 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-black">${String.fromCharCode(65 + index)}</span>
                    <span class="pt-0.5">${escapeHtml(option)}</span>
                </button>
            `;
        }).join('');

        body.innerHTML = `
            <div class="flex items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-widest text-teal-700">
                <span>Misi ${adventureFlow.qIndex + 1}/${questions.length}</span>
                <span>Benar ${adventureFlow.score}</span>
            </div>
            <p class="mt-3 text-base md:text-lg font-extrabold text-indigo-950 leading-relaxed">${escapeHtml(question.q)}</p>
            <div class="space-y-2 mt-4">${optionButtons}</div>
            ${adventureFlow.answered ? `
                <div class="mt-3 text-xs font-semibold rounded-2xl p-3 border-2 ${adventureFlow.lastCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'}">
                    <strong>${adventureFlow.lastCorrect ? 'Tepat sekali! 🎉' : 'Belum tepat 😊'}</strong>
                    <p class="mt-1">${escapeHtml(question.exp)}</p>
                </div>
                <div class="flex justify-end mt-4">
                    <button onclick="adventureNextQuestion()" class="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs transition">
                        ${adventureFlow.qIndex >= questions.length - 1 ? 'Lihat Hasil' : 'Soal Berikutnya'} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </button>
                </div>
            ` : ''}
        `;
        return;
    }

    if (adventureFlow.stage === 'done') {
        const total = questions.length;
        const percent = total ? Math.round((adventureFlow.score / total) * 100) : 100;
        const first = adventureFlow.firstTime;
        body.classList.add('text-center');
        body.classList.remove('text-left');
        body.innerHTML = `
            <div class="text-center result-pop">
                <div class="text-6xl">${percent >= 80 ? '🏆' : percent >= 50 ? '🌟' : '💪'}</div>
                <h4 class="text-2xl font-extrabold font-fredoka text-indigo-950 mt-1">${percent >= 80 ? 'Petualangan hebat!' : percent >= 50 ? 'Bagus, terus berlatih!' : 'Tetap semangat!'}</h4>
                <p class="text-xs font-semibold text-slate-500 mt-1">${escapeHtml(item.title)}</p>
                <p class="text-4xl font-black text-teal-600 mt-3">${total ? `${adventureFlow.score}/${total}` : 'Selesai'}</p>
                <p class="text-xs font-bold text-slate-500">${first ? 'Hadiah pertama sudah ditambahkan ke profilmu.' : 'Kamu mengulang misi ini. Hadiah kecil tetap diberikan.'}</p>
                <div class="flex flex-wrap justify-center gap-2 mt-4 text-xs font-extrabold">
                    <span class="bg-amber-100 text-amber-800 border border-amber-300 rounded-xl px-3 py-2">+${first ? (adventureFlow.type === 'region' ? 40 : 15) : 8} XP</span>
                    <span class="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-xl px-3 py-2">+${first ? (adventureFlow.type === 'region' ? 20 : 5) : 3} koin</span>
                </div>
                <div class="flex flex-wrap justify-center gap-2 mt-5">
                    <button onclick="restartAdventure()" class="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs transition">
                        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Ulangi
                    </button>
                    <button onclick="closeAdventureModal()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-5 py-2.5 rounded-2xl text-xs transition">Tutup</button>
                </div>
            </div>
        `;
        return;
    }
}

function speakAdventureText() {
    const item = getAdventureCurrent();
    if (!item) return;
    const paragraphs = adventureFlow.type === 'region' ? item.story : item.paragraphs;
    const paragraph = paragraphs[adventureFlow.index] || '';
    speakText(`${item.title}. ${paragraph}`);
}

function adventurePrevStory() {
    if (adventureFlow.stage !== 'story' || adventureFlow.index <= 0) return;
    stopSpeaking();
    adventureFlow.index -= 1;
    renderAdventureModal();
}

function adventureNextStory() {
    if (adventureFlow.stage !== 'story') return;

    const item = getAdventureCurrent();
    const paragraphs = adventureFlow.type === 'region' ? item.story : item.paragraphs;
    const questions = Array.isArray(item.questions) ? item.questions : [];

    if (adventureFlow.index < paragraphs.length - 1) {
        stopSpeaking();
        adventureFlow.index += 1;
        renderAdventureModal();
        return;
    }

    if (questions.length) {
        stopSpeaking();
        adventureFlow.stage = 'question';
        adventureFlow.qIndex = 0;
        adventureFlow.score = 0;
        adventureFlow.answered = false;
        renderAdventureModal();
    } else {
        completeAdventure();
    }
}

function adventureAnswer(index) {
    if (adventureFlow.stage !== 'question' || adventureFlow.answered) return;

    const item = getAdventureCurrent();
    const questions = Array.isArray(item.questions) ? item.questions : [];
    const question = questions[adventureFlow.qIndex];
    if (!question) return;

    const correct = index === question.correct;
    adventureFlow.answered = true;
    adventureFlow.selected = index;
    adventureFlow.lastCorrect = correct;

    if (correct) {
        adventureFlow.score += 1;
        soundFX.playCorrect();
    } else {
        soundFX.playWrong();
    }

    if (typeof recordQuestionAttempt === 'function') {
        recordQuestionAttempt(question, correct, { subject: 'ipas', phase: 'faseB' });
    }

    renderAdventureModal();
}

function adventureNextQuestion() {
    const item = getAdventureCurrent();
    const questions = Array.isArray(item.questions) ? item.questions : [];

    if (adventureFlow.qIndex < questions.length - 1) {
        adventureFlow.qIndex += 1;
        adventureFlow.answered = false;
        adventureFlow.selected = null;
        renderAdventureModal();
        return;
    }

    completeAdventure();
}

function completeAdventure() {
    const item = getAdventureCurrent();
    if (!item) return;

    const state = getStudentAdventureState();
    const isRegion = adventureFlow.type === 'region';
    const first = adventureFlow.firstTime;
    const total = Array.isArray(item.questions) ? item.questions.length : 0;

    if (isRegion) {
        const previous = state.regions[item.id] || {};
        state.regions[item.id] = {
            completed: true,
            bestScore: Math.max(Number(previous.bestScore) || 0, adventureFlow.score),
            total,
            completedAt: Date.now()
        };
    } else {
        state.stories[item.id] = { completed: true, completedAt: Date.now() };
    }
    saveStudentAdventureState(state);

    const profile = getGamificationProfile();
    const xp = first ? (isRegion ? 40 : 15) : 8;
    const coins = first ? (isRegion ? 20 : 5) : 3;
    addReward(profile, xp, coins);

    if (first) {
        if (isRegion) bumpMissionProgress(profile, 'adventures', 1);
        else bumpMissionProgress(profile, 'materials', 1);
        bumpMissionProgress(profile, 'correct', adventureFlow.score);
        if (isRegion) profile.stats.adventures = (Number(profile.stats.adventures) || 0) + 1;
        else profile.stats.materials = (Number(profile.stats.materials) || 0) + 1;
    }

    touchStreak(profile);
    checkNewBadges(profile);
    saveGamificationProfile(profile);
    renderGamification();
    burstConfetti();

    adventureFlow.stage = 'done';
    adventureFlow.firstTime = first;
    renderAdventureModal();
    renderAdventure();
    renderStoryLibrary();

    if (typeof showToast === 'function') {
        showToast(`Petualangan selesai! +${xp} XP dan +${coins} koin.`, 'success', 4000);
    }
}

function restartAdventure() {
    if (adventureFlow.type === 'region') openAdventureRegion(adventureFlow.regionId);
    else if (adventureFlow.type === 'story') openStory(adventureFlow.storyId);
}
