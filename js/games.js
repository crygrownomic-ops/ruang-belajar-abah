// ============================================================
// Mini-games Edukatif
// Flashcard, Matematika Cepat, Susun Kata, dan Jodohkan.
// ============================================================

const miniGameState = {
    type: null,
    timer: null,
    timeLeft: 0,
    score: 0,
    round: 0,
    totalRounds: 0,
    deck: [],
    index: 0,
    flipped: false,
    viewed: 0,
    rewarded: false,
    math: null,
    scramble: null,
    match: null,
    busy: false
};

function stopMiniGame() {
    if (miniGameState.timer) {
        window.clearInterval(miniGameState.timer);
        miniGameState.timer = null;
    }
}

function startMiniGame(type) {
    stopMiniGame();
    stopSpeaking();
    miniGameState.type = type;
    miniGameState.score = 0;
    miniGameState.round = 0;
    miniGameState.rewarded = false;
    miniGameState.busy = false;

    if (type === 'flashcard') startFlashcards();
    else if (type === 'math') startMathSprint();
    else if (type === 'scramble') startScramble();
    else if (type === 'match') startMatchGame();
}

function getGameStage() {
    return document.getElementById('game-stage');
}

function awardMiniGame(label, xp, coins, correct = 0) {
    const profile = getGamificationProfile();
    addReward(profile, xp, coins);
    touchStreak(profile);
    ensureDailyMissions(profile);
    bumpMissionProgress(profile, 'games', 1);
    bumpMissionProgress(profile, 'correct', correct);
    const newBadges = checkNewBadges(profile);
    saveGamificationProfile(profile);
    renderGamification();
    burstConfetti();
    if (typeof showToast === 'function') showToast(`${label}: +${xp} XP dan +${coins} koin!`, 'success', 4000);
    return newBadges;
}

function renderGameSummary(title, emoji, detail, xp, coins, againType) {
    const stage = getGameStage();
    if (!stage) return;

    stage.innerHTML = `
        <div class="text-center bg-white rounded-3xl border-4 border-yellow-300 p-6 shadow-xl result-pop">
            <div class="text-6xl mb-2">${emoji}</div>
            <h3 class="text-2xl font-extrabold font-fredoka text-indigo-900">${escapeHtml(title)}</h3>
            <p class="text-sm font-semibold text-slate-600 mt-2">${detail}</p>
            <div class="flex flex-wrap justify-center gap-2 mt-4 text-xs font-extrabold">
                <span class="bg-amber-100 text-amber-800 border border-amber-300 rounded-xl px-3 py-2">+${xp} XP</span>
                <span class="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-xl px-3 py-2">+${coins} koin</span>
            </div>
            <div class="flex flex-wrap justify-center gap-2 mt-5">
                <button onclick="startMiniGame('${againType}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-sm transition">
                    <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Main Lagi
                </button>
                <button onclick="showSection('beranda')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-5 py-2.5 rounded-2xl text-sm transition">
                    Kembali ke Beranda
                </button>
            </div>
        </div>
    `;
}

// ------------------------------------------------------------
// 1. Flashcard
// ------------------------------------------------------------
function startFlashcards() {
    const subjectData = KURIKULUM_DATA?.[currentPhase]?.[currentSubject];
    const topics = Array.isArray(subjectData?.topics) ? subjectData.topics : [];

    miniGameState.deck = topics.length
        ? topics.map((topic) => ({ front: topic.name, back: topic.content }))
        : [{ front: 'Ruang Belajar Abah', back: 'Tempat belajar yang menyenangkan untuk anak Indonesia.' }];

    miniGameState.index = 0;
    miniGameState.flipped = false;
    miniGameState.viewed = 0;
    miniGameState.rewarded = false;
    renderFlashcard();
}

function renderFlashcard() {
    const stage = getGameStage();
    if (!stage) return;

    const card = miniGameState.deck[miniGameState.index];
    const progress = Math.round(((miniGameState.index + 1) / miniGameState.deck.length) * 100);

    stage.innerHTML = `
        <div class="bg-white rounded-3xl border-4 border-sky-200 p-5 shadow-lg">
            <div class="flex items-center justify-between gap-2 mb-3">
                <p class="text-xs font-extrabold text-slate-500">Kartu ${miniGameState.index + 1} dari ${miniGameState.deck.length}</p>
                <p class="text-xs font-extrabold text-sky-700">${SUBJECTS[currentSubject]?.label || currentSubject} • ${PHASES[currentPhase]?.short || currentPhase}</p>
            </div>
            <div class="h-2 rounded-full bg-slate-200 overflow-hidden mb-4">
                <div class="h-full bg-sky-500 rounded-full" style="width:${progress}%"></div>
            </div>

            <button onclick="flipFlashcard()" class="w-full min-h-[220px] rounded-3xl border-2 border-dashed border-sky-300 bg-gradient-to-br from-sky-50 to-indigo-50 p-6 text-left transition hover:border-sky-500">
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-sky-600">${miniGameState.flipped ? 'Jawaban' : 'Pertanyaan — klik untuk membalik'}</span>
                <span class="block mt-3 text-xl font-extrabold font-fredoka text-indigo-950 leading-snug">${escapeHtml(miniGameState.flipped ? card.back : card.front)}</span>
            </button>

            <div class="flex flex-wrap items-center justify-between gap-2 mt-4">
                <button onclick="prevFlashcard()" ${miniGameState.index === 0 ? 'disabled' : ''} class="bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-extrabold px-4 py-2.5 rounded-2xl text-xs transition">
                    <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Sebelumnya
                </button>
                <button onclick="speakFlashcard()" class="bg-pink-100 hover:bg-pink-200 text-pink-700 font-extrabold px-4 py-2.5 rounded-2xl text-xs transition">
                    <i class="fa-solid fa-volume-high" aria-hidden="true"></i> Bacakan
                </button>
                <button onclick="nextFlashcard()" class="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs transition">
                    ${miniGameState.index === miniGameState.deck.length - 1 ? 'Selesai' : 'Berikutnya'} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    `;
}

function flipFlashcard() {
    miniGameState.flipped = !miniGameState.flipped;
    if (miniGameState.flipped) miniGameState.viewed += 1;
    renderFlashcard();
}

function nextFlashcard() {
    if (miniGameState.index >= miniGameState.deck.length - 1) {
        finishFlashcards();
        return;
    }
    miniGameState.index += 1;
    miniGameState.flipped = false;
    renderFlashcard();
}

function prevFlashcard() {
    if (miniGameState.index <= 0) return;
    miniGameState.index -= 1;
    miniGameState.flipped = false;
    renderFlashcard();
}

function speakFlashcard() {
    const card = miniGameState.deck[miniGameState.index];
    if (card) speakText(`${card.front}. ${card.back}`);
}

function finishFlashcards() {
    if (miniGameState.rewarded) return;
    miniGameState.rewarded = true;
    const xp = 10;
    const coins = 5;
    awardMiniGame('Flashcard selesai', xp, coins, 0);
    renderGameSummary('Hebat, kartu selesai!', '🃏', `Kamu sudah menjelajahi ${miniGameState.deck.length} kartu materi.`, xp, coins, 'flashcard');
}

// ------------------------------------------------------------
// 2. Matematika Cepat
// ------------------------------------------------------------
function makeMathProblem() {
    const phase = currentPhase;
    let a = 0;
    let b = 0;
    let operator = '+';
    let answer = 0;

    if (phase === 'faseA') {
        if (Math.random() < 0.5) {
            a = Math.floor(Math.random() * 15) + 1;
            b = Math.floor(Math.random() * (20 - a)) + 1;
            operator = '+';
            answer = a + b;
        } else {
            a = Math.floor(Math.random() * 18) + 3;
            b = Math.floor(Math.random() * (a - 1)) + 1;
            operator = '−';
            answer = a - b;
        }
    } else if (phase === 'faseB') {
        const type = Math.random();
        if (type < 0.45) {
            a = Math.floor(Math.random() * 8) + 2;
            b = Math.floor(Math.random() * 8) + 2;
            operator = '×';
            answer = a * b;
        } else if (type < 0.75) {
            a = Math.floor(Math.random() * 60) + 20;
            b = Math.floor(Math.random() * 30) + 5;
            operator = '+';
            answer = a + b;
        } else {
            a = Math.floor(Math.random() * 70) + 20;
            b = Math.floor(Math.random() * 20) + 5;
            operator = '−';
            answer = a - b;
        }
    } else {
        const type = Math.random();
        if (type < 0.35) {
            a = Math.floor(Math.random() * 40) + 20;
            b = Math.floor(Math.random() * 600) + 100;
            operator = '+';
            answer = a + b;
        } else if (type < 0.65) {
            a = Math.floor(Math.random() * 800) + 100;
            b = Math.floor(Math.random() * 300) + 50;
            operator = '−';
            answer = a - b;
        } else {
            b = Math.floor(Math.random() * 8) + 3;
            answer = Math.floor(Math.random() * 9) + 3;
            a = b * answer;
            operator = '÷';
        }
    }

    const options = new Set([answer]);
    while (options.size < 4) {
        const delta = Math.floor(Math.random() * 9) - 4;
        const candidate = Math.max(0, answer + (delta === 0 ? 3 : delta));
        if (candidate !== answer) options.add(candidate);
    }

    return {
        text: `${a} ${operator} ${b} = ?`,
        answer,
        options: shuffleArray([...options])
    };
}

function startMathSprint() {
    miniGameState.score = 0;
    miniGameState.timeLeft = 60;
    miniGameState.math = makeMathProblem();
    renderMathSprint();
    miniGameState.timer = window.setInterval(() => {
        miniGameState.timeLeft -= 1;
        const timerEl = document.getElementById('math-timer');
        if (timerEl) timerEl.textContent = `${miniGameState.timeLeft} dtk`;
        if (miniGameState.timeLeft <= 0) {
            stopMiniGame();
            finishMathSprint();
        }
    }, 1000);
}

function renderMathSprint() {
    const stage = getGameStage();
    if (!stage) return;
    const problem = miniGameState.math;

    stage.innerHTML = `
        <div class="bg-white rounded-3xl border-4 border-emerald-200 p-5 shadow-lg">
            <div class="flex items-center justify-between gap-2">
                <p class="text-xs font-extrabold text-emerald-700"><i class="fa-solid fa-bolt" aria-hidden="true"></i> Matematika Cepat</p>
                <div class="flex items-center gap-2 text-xs font-extrabold">
                    <span class="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl" id="math-timer">${miniGameState.timeLeft} dtk</span>
                    <span class="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl">Skor ${miniGameState.score}</span>
                </div>
            </div>
            <div class="text-center my-6">
                <p class="text-4xl md:text-5xl font-black text-indigo-950 font-fredoka">${escapeHtml(problem.text)}</p>
                <p class="text-[11px] font-bold text-slate-400 mt-2">Pilih jawaban yang benar</p>
            </div>
            <div class="grid grid-cols-2 gap-2" id="math-options">
                ${problem.options.map((option) => `
                    <button onclick="answerMath(${option})" class="bg-slate-50 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-400 text-slate-800 font-black text-lg py-4 rounded-2xl transition">${option}</button>
                `).join('')}
            </div>
        </div>
    `;
}

function answerMath(value) {
    if (miniGameState.busy || miniGameState.timeLeft <= 0) return;
    const problem = miniGameState.math;
    const correct = Number(value) === problem.answer;
    const buttons = Array.from(document.querySelectorAll('#math-options button'));
    miniGameState.busy = true;

    buttons.forEach((button) => {
        button.disabled = true;
        if (Number(button.textContent) === problem.answer) {
            button.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
        } else if (Number(button.textContent) === Number(value)) {
            button.classList.add('bg-rose-500', 'border-rose-500', 'text-white');
        }
    });

    if (correct) {
        miniGameState.score += 1;
        soundFX.playCorrect();
    } else {
        soundFX.playWrong();
    }

    window.setTimeout(() => {
        miniGameState.busy = false;
        if (miniGameState.timeLeft <= 0) return;
        miniGameState.math = makeMathProblem();
        renderMathSprint();
    }, correct ? 260 : 600);
}

function finishMathSprint() {
    const score = miniGameState.score;
    const xp = 5 + score * 2;
    const coins = 3 + score;
    awardMiniGame('Matematika Cepat', xp, coins, score);
    renderGameSummary('Waktu habis!', '⚡', `Kamu menjawab benar ${score} soal dalam 60 detik.`, xp, coins, 'math');
}

// ------------------------------------------------------------
// 3. Susun Kata
// ------------------------------------------------------------
function startScramble() {
    const words = seededShuffle(
        WORD_SCRAMBLE_WORDS.filter((item) => item.phase === currentPhase),
        `${todayKey()}-${currentSubject}`
    ).slice(0, 5);

    miniGameState.scramble = {
        list: words.length ? words : seededShuffle(WORD_SCRAMBLE_WORDS, todayKey()).slice(0, 5),
        index: 0,
        score: 0
    };
    renderScramble();
}

function renderScramble() {
    const stage = getGameStage();
    const state = miniGameState.scramble;
    if (!stage || !state) return;

    const item = state.list[state.index];
    if (!item) {
        finishScramble();
        return;
    }

    const letters = seededShuffle(item.word.split(''), item.word + state.index);

    stage.innerHTML = `
        <div class="bg-white rounded-3xl border-4 border-violet-200 p-5 shadow-lg">
            <div class="flex items-center justify-between gap-2">
                <p class="text-xs font-extrabold text-violet-700"><i class="fa-solid fa-spell-check" aria-hidden="true"></i> Susun Kata ${state.index + 1}/${state.list.length}</p>
                <span class="bg-violet-100 text-violet-700 px-3 py-1.5 rounded-xl text-xs font-extrabold">Benar ${state.score}</span>
            </div>
            <p class="text-xs font-semibold text-slate-500 mt-3">Petunjuk: ${escapeHtml(item.clue)}</p>
            <div class="flex flex-wrap justify-center gap-2 my-5">
                ${letters.map((letter) => `<span class="w-10 h-10 rounded-xl bg-violet-100 border-2 border-violet-200 text-violet-800 font-black text-lg flex items-center justify-center">${escapeHtml(letter)}</span>`).join('')}
            </div>
            <form onsubmit="checkScramble(event)" class="flex flex-col sm:flex-row gap-2">
                <input id="scramble-input" type="text" autocomplete="off" placeholder="Tulis jawaban..." class="flex-grow border-2 border-violet-200 rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-violet-500">
                <button type="submit" class="bg-violet-600 hover:bg-violet-700 text-white font-extrabold px-5 py-3 rounded-2xl text-sm transition">Periksa</button>
            </form>
            <p id="scramble-feedback" class="text-xs font-bold mt-2 min-h-[20px]"></p>
        </div>
    `;
    window.setTimeout(() => document.getElementById('scramble-input')?.focus(), 50);
}

function checkScramble(event) {
    event.preventDefault();
    const state = miniGameState.scramble;
    const item = state.list[state.index];
    const input = document.getElementById('scramble-input');
    const feedback = document.getElementById('scramble-feedback');
    if (!item || !input) return;

    const answer = input.value.trim().toUpperCase();
    if (answer === item.word) {
        state.score += 1;
        soundFX.playCorrect();
        if (feedback) feedback.innerHTML = '<span class="text-emerald-600"><i class="fa-solid fa-circle-check"></i> Benar! Hebat.</span>';
    } else {
        soundFX.playWrong();
        if (feedback) feedback.innerHTML = `<span class="text-rose-600"><i class="fa-solid fa-circle-xmark"></i> Belum tepat. Jawaban: <strong>${escapeHtml(item.word)}</strong></span>`;
    }

    input.disabled = true;
    window.setTimeout(() => {
        state.index += 1;
        if (state.index >= state.list.length) finishScramble();
        else renderScramble();
    }, 900);
}

function finishScramble() {
    const state = miniGameState.scramble;
    const score = state?.score || 0;
    const total = state?.list?.length || 5;
    const xp = 8 + score * 2;
    const coins = 4 + score;
    awardMiniGame('Susun Kata', xp, coins, score);
    renderGameSummary('Kata tersusun!', '🔤', `Kamu menjawab benar ${score} dari ${total} kata.`, xp, coins, 'scramble');
}

// ------------------------------------------------------------
// 4. Jodohkan
// ------------------------------------------------------------
function startMatchGame() {
    const set = MATCH_SETS.find((item) => item.subject === currentSubject)
        || MATCH_SETS.find((item) => item.phase === currentPhase)
        || MATCH_SETS[0];

    miniGameState.match = {
        set,
        terms: seededShuffle(set.pairs.map((pair, index) => ({ text: pair.term, pair: index, matched: false })), set.id),
        definitions: seededShuffle(set.pairs.map((pair, index) => ({ text: pair.definition, pair: index, matched: false })), set.id + '-def'),
        selectedTerm: null,
        moves: 0
    };
    renderMatchGame();
}

function renderMatchGame() {
    const stage = getGameStage();
    const state = miniGameState.match;
    if (!stage || !state) return;

    if (state.terms.every((item) => item.matched)) {
        finishMatchGame();
        return;
    }

    stage.innerHTML = `
        <div class="bg-white rounded-3xl border-4 border-amber-200 p-5 shadow-lg">
            <div class="flex items-center justify-between gap-2">
                <p class="text-xs font-extrabold text-amber-700"><i class="fa-solid fa-link" aria-hidden="true"></i> ${escapeHtml(state.set.title)}</p>
                <span class="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-xl text-xs font-extrabold">Langkah ${state.moves}</span>
            </div>
            <p class="text-[11px] font-semibold text-slate-500 mt-2">Klik satu istilah di kiri, lalu pasangannya di kanan.</p>
            <div class="grid grid-cols-2 gap-2 mt-3">
                <div class="space-y-2">
                    ${state.terms.map((item, index) => `
                        <button onclick="selectMatchTerm(${index})" ${item.matched ? 'disabled' : ''} class="w-full text-left px-3 py-3 rounded-xl border-2 text-xs font-extrabold transition ${item.matched ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : state.selectedTerm === index ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'}">
                            ${escapeHtml(item.text)} ${item.matched ? '✓' : ''}
                        </button>
                    `).join('')}
                </div>
                <div class="space-y-2">
                    ${state.definitions.map((item, index) => `
                        <button onclick="selectMatchDefinition(${index})" ${item.matched ? 'disabled' : ''} class="w-full text-left px-3 py-3 rounded-xl border-2 text-xs font-extrabold transition ${item.matched ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'}">
                            ${escapeHtml(item.text)} ${item.matched ? '✓' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
            <p id="match-feedback" class="text-xs font-bold mt-3 min-h-[18px]"></p>
        </div>
    `;
}

function selectMatchTerm(index) {
    const state = miniGameState.match;
    if (!state || state.terms[index]?.matched) return;
    state.selectedTerm = state.selectedTerm === index ? null : index;
    renderMatchGame();
}

function selectMatchDefinition(index) {
    const state = miniGameState.match;
    if (!state || state.selectedTerm === null || state.definitions[index]?.matched) return;

    state.moves += 1;
    const term = state.terms[state.selectedTerm];
    const definition = state.definitions[index];
    const feedback = document.getElementById('match-feedback');
    const isMatch = term.pair === definition.pair;

    if (isMatch) {
        state.terms[state.selectedTerm].matched = true;
        state.definitions[index].matched = true;
        state.selectedTerm = null;
        soundFX.playCorrect();
        renderMatchGame();
        const nextFeedback = document.getElementById('match-feedback');
        if (nextFeedback) nextFeedback.innerHTML = '<span class="text-emerald-600">Pasangan tepat!</span>';
    } else {
        soundFX.playWrong();
        if (feedback) feedback.innerHTML = '<span class="text-rose-600">Belum cocok. Coba pasangan lain.</span>';
        state.selectedTerm = null;
        window.setTimeout(renderMatchGame, 550);
    }
}

function finishMatchGame() {
    const moves = miniGameState.match?.moves || 0;
    const xp = 15;
    const coins = 8;
    awardMiniGame('Jodohkan', xp, coins, 5);
    renderGameSummary('Semua pasangan cocok!', '🧩', `Kamu menyelesaikannya dalam ${moves} langkah.`, xp, coins, 'match');
}
