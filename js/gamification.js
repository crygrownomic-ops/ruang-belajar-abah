// ============================================================
// Gamifikasi
// Level, XP, koin, streak, misi harian, lencana, avatar & toko.
// ============================================================

let lastQuizReward = null;

const BADGE_CATALOG = [
    { id: 'first_quiz', icon: 'fa-shoe-prints', name: 'Langkah Pertama', desc: 'Menyelesaikan kuis pertama.', className: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    { id: 'quiz_10', icon: 'fa-fire', name: 'Pembelajar Rajin', desc: 'Menyelesaikan 10 kuis.', className: 'bg-orange-100 text-orange-700 border-orange-300' },
    { id: 'correct_100', icon: 'fa-bullseye', name: 'Seratus Benar', desc: 'Menjawab 100 soal dengan benar.', className: 'bg-sky-100 text-sky-700 border-sky-300' },
    { id: 'streak_3', icon: 'fa-calendar-check', name: 'Streak 3 Hari', desc: 'Belajar 3 hari berturut-turut.', className: 'bg-amber-100 text-amber-700 border-amber-300' },
    { id: 'streak_7', icon: 'fa-calendar-star', name: 'Streak 7 Hari', desc: 'Belajar 7 hari berturut-turut.', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { id: 'level_5', icon: 'fa-rocket', name: 'Naik Kelas', desc: 'Mencapai level 5.', className: 'bg-purple-100 text-purple-700 border-purple-300' },
    { id: 'adventure_1', icon: 'fa-map-location-dot', name: 'Penjelajah Nusantara', desc: 'Menyelesaikan satu misi petualangan.', className: 'bg-teal-100 text-teal-700 border-teal-300' },
    { id: 'adventure_all', icon: 'fa-earth-asia', name: 'Sahabat Nusantara', desc: 'Menyelesaikan semua misi petualangan.', className: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
    { id: 'games_10', icon: 'fa-dice', name: 'Jagoan Bermain', desc: 'Memainkan 10 mini-games.', className: 'bg-rose-100 text-rose-700 border-rose-300' },
    { id: 'perfect', icon: 'fa-crown', name: 'Nilai Sempurna', desc: 'Mendapat nilai 100 pada kuis.', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' }
];

function todayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getDefaultProfile() {
    return {
        avatar: '🦊',
        frame: 'default',
        xp: 0,
        coins: 0,
        streak: 0,
        bestStreak: 0,
        lastActiveDate: null,
        ownedAvatars: ['🦊', '🐼'],
        ownedFrames: ['default'],
        badges: [],
        stats: {
            quizzes: 0,
            correct: 0,
            materials: 0,
            games: 0,
            adventures: 0,
            focus: 0,
            minutes: 0
        },
        missions: {
            date: null,
            items: []
        },
        readTopics: {},
        createdAt: Date.now()
    };
}

function getGamificationProfile(studentId = null) {
    const active = getActiveStudent();
    const id = studentId || active?.id;
    if (!id) return getDefaultProfile();

    const all = getGamificationData();
    const existing = all[id] && typeof all[id] === 'object' ? all[id] : {};
    const profile = {
        ...getDefaultProfile(),
        ...existing,
        stats: { ...getDefaultProfile().stats, ...(existing.stats || {}) },
        missions: existing.missions && typeof existing.missions === 'object' ? existing.missions : { date: null, items: [] },
        readTopics: existing.readTopics && typeof existing.readTopics === 'object' ? existing.readTopics : {},
        ownedAvatars: Array.isArray(existing.ownedAvatars) && existing.ownedAvatars.length ? existing.ownedAvatars : ['🦊', '🐼'],
        ownedFrames: Array.isArray(existing.ownedFrames) && existing.ownedFrames.length ? existing.ownedFrames : ['default'],
        badges: Array.isArray(existing.badges) ? existing.badges : []
    };

    ensureDailyMissions(profile);
    return profile;
}

function saveGamificationProfile(profile, studentId = null) {
    const active = getActiveStudent();
    const id = studentId || active?.id;
    if (!id) return;

    const all = getGamificationData();
    all[id] = profile;
    saveGamificationData(all);
}

function getLevelInfo(profile) {
    const xp = Math.max(0, Number(profile?.xp) || 0);
    const level = Math.floor(xp / 100) + 1;
    const current = xp % 100;
    return {
        xp,
        level,
        current,
        target: 100,
        percentage: current,
        nextLevelXp: 100 - current
    };
}

function seededShuffle(list, seedText) {
    const array = [...list];
    let seed = 0;
    for (let i = 0; i < String(seedText).length; i += 1) {
        seed = (seed * 31 + String(seedText).charCodeAt(i)) >>> 0;
    }
    for (let i = array.length - 1; i > 0; i -= 1) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        const j = seed % (i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function ensureDailyMissions(profile) {
    const today = todayKey();
    if (profile.missions?.date === today && Array.isArray(profile.missions.items) && profile.missions.items.length) {
        return profile.missions;
    }

    const active = getActiveStudent();
    const picked = seededShuffle(DAILY_MISSION_TEMPLATES, `${today}-${active?.id || 'siswa'}`).slice(0, 3);

    profile.missions = {
        date: today,
        items: picked.map((template) => ({
            id: template.id,
            label: template.label,
            icon: template.icon,
            target: template.target,
            xp: template.xp,
            coins: template.coins,
            track: template.track,
            progress: 0,
            claimed: false
        }))
    };
    return profile.missions;
}

function touchStreak(profile) {
    const today = todayKey();
    if (profile.lastActiveDate === today) return profile.streak;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    profile.streak = profile.lastActiveDate === yesterdayKey ? (Number(profile.streak) || 0) + 1 : 1;
    profile.bestStreak = Math.max(Number(profile.bestStreak) || 0, profile.streak);
    profile.lastActiveDate = today;
    return profile.streak;
}

function bumpMissionProgress(profile, track, amount = 1) {
    ensureDailyMissions(profile);
    profile.missions.items.forEach((mission) => {
        if (mission.track !== track || mission.claimed) return;
        mission.progress = Math.min(mission.target, (Number(mission.progress) || 0) + Math.max(0, Number(amount) || 0));
    });
}

function recordLearningActivity(track, amount = 1, meta = {}) {
    const profile = getGamificationProfile();
    const value = Math.max(0, Number(amount) || 0);

    if (track === 'quizzes') profile.stats.quizzes += value;
    if (track === 'correct') profile.stats.correct += value;
    if (track === 'materials') profile.stats.materials += value;
    if (track === 'games') profile.stats.games += value;
    if (track === 'adventures') profile.stats.adventures += value;
    if (track === 'focus') profile.stats.focus += value;

    if (meta.minutes) profile.stats.minutes += Math.max(0, Number(meta.minutes) || 0);

    touchStreak(profile);
    bumpMissionProgress(profile, track, value);
    checkNewBadges(profile);
    saveGamificationProfile(profile);
    renderGamification();
    return profile;
}

function addReward(profile, xp = 0, coins = 0) {
    profile.xp = Math.max(0, Number(profile.xp) || 0) + Math.max(0, Number(xp) || 0);
    profile.coins = Math.max(0, Number(profile.coins) || 0) + Math.max(0, Number(coins) || 0);
}

function checkNewBadges(profile) {
    const earned = new Set(profile.badges || []);
    const history = getHistory(getActiveStudent()?.id);
    const newly = [];

    const conditions = {
        first_quiz: profile.stats.quizzes >= 1,
        quiz_10: profile.stats.quizzes >= 10,
        correct_100: profile.stats.correct >= 100,
        streak_3: profile.streak >= 3,
        streak_7: profile.streak >= 7,
        level_5: getLevelInfo(profile).level >= 5,
        adventure_1: profile.stats.adventures >= 1,
        adventure_all: profile.stats.adventures >= ADVENTURE_REGIONS.length,
        games_10: profile.stats.games >= 10,
        perfect: history.some((item) => Number(item.percentage) >= 100)
    };

    Object.keys(conditions).forEach((id) => {
        if (conditions[id] && !earned.has(id)) {
            earned.add(id);
            newly.push(id);
        }
    });

    profile.badges = [...earned];
    if (newly.length && typeof showToast === 'function') {
        newly.forEach((id) => {
            const badge = BADGE_CATALOG.find((item) => item.id === id);
            if (badge) showToast(`Lencana baru: ${badge.name}!`, 'success', 4500);
        });
        burstConfetti();
    }
    return newly;
}

function handleQuizCompletion({ correct = 0, total = 0, percentage = 0, durationSeconds = 0, subject = 'mtk', examMode = false, source = 'bank' } = {}) {
    const profile = getGamificationProfile();
    const levelBefore = getLevelInfo(profile).level;

    const baseXp = 10 + (Number(correct) || 0) * 2;
    const bonusXp = percentage >= 80 ? 10 : 0;
    const xp = baseXp + bonusXp;
    const coins = 5 + Math.floor((Number(correct) || 0) / 2) + (percentage >= 80 ? 5 : 0);

    addReward(profile, xp, coins);
    profile.stats.quizzes += 1;
    profile.stats.correct += Number(correct) || 0;
    profile.stats.minutes += Math.max(0, Math.round((Number(durationSeconds) || 0) / 60));

    touchStreak(profile);
    ensureDailyMissions(profile);
    bumpMissionProgress(profile, 'quizzes', 1);
    bumpMissionProgress(profile, 'correct', Number(correct) || 0);

    const newBadges = checkNewBadges(profile);
    const levelAfter = getLevelInfo(profile).level;
    saveGamificationProfile(profile);

    lastQuizReward = {
        xp,
        coins,
        levelBefore,
        levelAfter,
        newBadges,
        percentage,
        subject,
        examMode,
        source,
        streak: profile.streak
    };

    if (levelAfter > levelBefore) {
        burstConfetti();
        if (typeof showToast === 'function') showToast(`Naik ke level ${levelAfter}! Pertahankan semangat belajar.`, 'success', 5000);
    }

    renderGamification();
    return lastQuizReward;
}

function renderQuizRewards() {
    const box = document.getElementById('quiz-reward-box');
    if (!box) return;

    if (!lastQuizReward) {
        box.innerHTML = '';
        return;
    }

    const reward = lastQuizReward;
    const badgeHtml = reward.newBadges.length
        ? `<p class="mt-1 text-[11px] font-bold">Lencana baru: ${reward.newBadges.map((id) => {
            const badge = BADGE_CATALOG.find((item) => item.id === id);
            return badge ? escapeHtml(badge.name) : '';
        }).filter(Boolean).join(', ')}</p>`
        : '';

    box.innerHTML = `
        <div class="rounded-2xl border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 p-4 text-xs font-bold text-amber-900">
            <p class="flex items-center gap-2 text-sm font-extrabold"><i class="fa-solid fa-gift text-amber-500" aria-hidden="true"></i> Hadiah belajar</p>
            <div class="flex flex-wrap gap-2 mt-2">
                <span class="bg-white border border-amber-200 rounded-xl px-3 py-1.5">+${reward.xp} XP</span>
                <span class="bg-white border border-amber-200 rounded-xl px-3 py-1.5">+${reward.coins} koin</span>
                <span class="bg-white border border-amber-200 rounded-xl px-3 py-1.5">Streak ${reward.streak} hari</span>
                ${reward.levelAfter > reward.levelBefore ? `<span class="bg-indigo-600 text-white rounded-xl px-3 py-1.5">Naik ke level ${reward.levelAfter}</span>` : ''}
            </div>
            ${badgeHtml}
        </div>
    `;
}

function claimMission(missionId) {
    const profile = getGamificationProfile();
    ensureDailyMissions(profile);
    const mission = profile.missions.items.find((item) => item.id === missionId);
    if (!mission || mission.claimed) return;
    if (mission.progress < mission.target) {
        if (typeof showToast === 'function') showToast('Misi ini belum selesai. Semangat, sedikit lagi!', 'warning');
        return;
    }

    mission.claimed = true;
    addReward(profile, mission.xp, mission.coins);
    checkNewBadges(profile);
    saveGamificationProfile(profile);
    renderGamification();
    burstConfetti();
    if (typeof showToast === 'function') showToast(`Misi selesai! +${mission.xp} XP dan +${mission.coins} koin.`, 'success', 4000);
}

function renderGamification() {
    const active = getActiveStudent();
    if (!active) return;

    const profile = getGamificationProfile();
    const level = getLevelInfo(profile);

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    setText('header-level', `Lv ${level.level}`);
    setText('header-xp', `${level.current}/100 XP`);
    setText('header-coins', String(profile.coins));
    setText('header-streak', String(profile.streak));
    const xpBar = document.getElementById('header-xp-bar');
    if (xpBar) xpBar.style.width = `${level.percentage}%`;

    const avatar = document.getElementById('active-student-avatar');
    if (avatar) {
        avatar.textContent = profile.avatar || '🦊';
        avatar.classList.remove('ring-2', 'ring-4', 'ring-white/70', 'ring-yellow-300', 'ring-sky-400', 'ring-emerald-400', 'ring-purple-400');
        const frame = FRAME_SHOP.find((item) => item.id === profile.frame) || FRAME_SHOP[0];
        frame.className.split(' ').forEach((cls) => avatar.classList.add(cls));
    }

    const dashboard = document.getElementById('learn-dashboard');
    if (dashboard) {
        const missions = ensureDailyMissions(profile).items;
        const missionCards = missions.map((mission) => {
            const done = mission.progress >= mission.target;
            const percent = Math.round((mission.progress / mission.target) * 100);
            const status = mission.claimed
                ? '<span class="text-[10px] font-extrabold text-emerald-600">Selesai ✓</span>'
                : done
                    ? `<button onclick="claimMission('${mission.id}')" class="text-[10px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg">Klaim</button>`
                    : `<span class="text-[10px] font-bold text-slate-400">${mission.progress}/${mission.target}</span>`;

            return `
                <div class="bg-white/90 border border-white rounded-2xl p-3 shadow-sm">
                    <div class="flex items-start justify-between gap-2">
                        <span class="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-700 min-w-0">
                            <i class="fa-solid ${mission.icon} text-indigo-500" aria-hidden="true"></i>
                            <span class="truncate">${escapeHtml(mission.label)}</span>
                        </span>
                        ${status}
                    </div>
                    <div class="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" style="width:${percent}%"></div>
                    </div>
                    <p class="text-[10px] font-semibold text-slate-400 mt-1">Hadiah: ${mission.xp} XP • ${mission.coins} koin</p>
                </div>
            `;
        }).join('');

        const badges = (profile.badges || []).map((id) => BADGE_CATALOG.find((item) => item.id === id)).filter(Boolean);
        const badgePreview = badges.length
            ? badges.slice(0, 5).map((badge) => `<span class="inline-flex items-center justify-center w-8 h-8 rounded-xl border ${badge.className}" title="${escapeHtml(badge.name)}"><i class="fa-solid ${badge.icon}" aria-hidden="true"></i></span>`).join('')
            : '<span class="text-[11px] font-semibold text-slate-400">Belum ada lencana.</span>';

        dashboard.innerHTML = `
            <div class="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-5 md:p-6 text-white shadow-xl border-4 border-white">
                <div class="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shrink-0">${profile.avatar || '🦊'}</div>
                        <div class="min-w-0">
                            <p class="text-[11px] font-extrabold uppercase tracking-widest text-white/70">Profil Belajar</p>
                            <p class="text-xl font-extrabold font-fredoka truncate">${escapeHtml(active.nama)}</p>
                            <p class="text-[11px] font-bold text-white/80">Level ${level.level} • ${profile.streak} hari beruntun • ${profile.coins} koin</p>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="openProfileModal()" class="bg-white/20 hover:bg-white/30 border border-white/40 px-3.5 py-2 rounded-xl text-[11px] font-extrabold transition flex items-center gap-1.5">
                            <i class="fa-solid fa-user-pen" aria-hidden="true"></i> Profil & Toko
                        </button>
                        <button onclick="startFocusSession()" class="bg-yellow-400 hover:bg-yellow-300 text-indigo-950 px-3.5 py-2 rounded-xl text-[11px] font-extrabold transition flex items-center gap-1.5">
                            <i class="fa-solid fa-hourglass-half" aria-hidden="true"></i> Belajar 10 Menit
                        </button>
                    </div>
                </div>

                <div class="mt-4">
                    <div class="flex justify-between text-[10px] font-bold text-white/80">
                        <span>XP Level ${level.level}</span>
                        <span>${level.current}/100 • ${level.nextLevelXp} XP lagi ke level ${level.level + 1}</span>
                    </div>
                    <div class="mt-1 h-3 rounded-full bg-white/20 overflow-hidden">
                        <div class="h-full rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 transition-all" style="width:${level.percentage}%"></div>
                    </div>
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-white/70">Lencana:</span>
                    ${badgePreview}
                </div>

                <div class="mt-4">
                    <div class="flex items-center justify-between mb-2">
                        <p class="text-[11px] font-extrabold uppercase tracking-wider text-white/80">Misi hari ini</p>
                        <span class="text-[10px] font-bold text-white/60">${todayKey()}</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">${missionCards}</div>
                </div>
            </div>
        `;
    }

    renderProfileModal(profile, level);
    renderParentMode();
}

function renderProfileModal(profile = getGamificationProfile(), level = getLevelInfo(profile)) {
    const container = document.getElementById('profile-content');
    if (!container) return;

    const avatarButtons = AVATAR_SHOP.map((item) => {
        const owned = profile.ownedAvatars.includes(item.emoji);
        const selected = profile.avatar === item.emoji;
        return `
            <button onclick="chooseAvatar('${item.emoji}')" class="relative p-3 rounded-2xl border-2 transition text-center ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}">
                <span class="text-3xl block">${item.emoji}</span>
                <span class="text-[10px] font-extrabold text-slate-600 block mt-1">${escapeHtml(item.name)}</span>
                <span class="text-[9px] font-bold ${owned ? 'text-emerald-600' : 'text-amber-600'}">${owned ? (selected ? 'Dipakai' : 'Dimiliki') : `${item.cost} koin`}</span>
            </button>
        `;
    }).join('');

    const frameButtons = FRAME_SHOP.map((item) => {
        const owned = profile.ownedFrames.includes(item.id);
        const selected = profile.frame === item.id;
        return `
            <button onclick="chooseFrame('${item.id}')" class="p-3 rounded-2xl border-2 transition text-left ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}">
                <span class="inline-flex w-10 h-10 rounded-xl bg-amber-400 text-white items-center justify-center text-lg ${item.className}">${profile.avatar || '🦊'}</span>
                <span class="block text-[11px] font-extrabold text-slate-700 mt-1">${escapeHtml(item.name)}</span>
                <span class="text-[9px] font-bold ${owned ? 'text-emerald-600' : 'text-amber-600'}">${owned ? (selected ? 'Dipakai' : 'Dimiliki') : `${item.cost} koin`}</span>
            </button>
        `;
    }).join('');

    const badges = BADGE_CATALOG.map((badge) => {
        const owned = (profile.badges || []).includes(badge.id);
        return `
            <div class="rounded-2xl border-2 p-3 ${owned ? badge.className : 'border-slate-200 bg-slate-50 text-slate-400'}">
                <p class="text-sm font-extrabold flex items-center gap-2"><i class="fa-solid ${badge.icon}" aria-hidden="true"></i> ${escapeHtml(badge.name)}</p>
                <p class="text-[10px] font-semibold mt-1">${escapeHtml(badge.desc)}</p>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div class="rounded-2xl bg-indigo-50 border border-indigo-200 p-3"><p class="text-[10px] font-extrabold uppercase text-indigo-600">Level</p><p class="text-2xl font-black text-indigo-800">${level.level}</p></div>
            <div class="rounded-2xl bg-amber-50 border border-amber-200 p-3"><p class="text-[10px] font-extrabold uppercase text-amber-600">XP</p><p class="text-2xl font-black text-amber-800">${level.xp}</p></div>
            <div class="rounded-2xl bg-yellow-50 border border-yellow-200 p-3"><p class="text-[10px] font-extrabold uppercase text-yellow-700">Koin</p><p class="text-2xl font-black text-yellow-800">${profile.coins}</p></div>
            <div class="rounded-2xl bg-emerald-50 border border-emerald-200 p-3"><p class="text-[10px] font-extrabold uppercase text-emerald-600">Streak</p><p class="text-2xl font-black text-emerald-800">${profile.streak}</p></div>
        </div>

        <div>
            <p class="text-xs font-extrabold text-slate-700 mb-2">Pilih Avatar</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">${avatarButtons}</div>
        </div>

        <div>
            <p class="text-xs font-extrabold text-slate-700 mb-2">Pilih Bingkai</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">${frameButtons}</div>
        </div>

        <div>
            <p class="text-xs font-extrabold text-slate-700 mb-2">Koleksi Lencana (${(profile.badges || []).length}/${BADGE_CATALOG.length})</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">${badges}</div>
        </div>
    `;
}

function openProfileModal() {
    renderProfileModal();
    document.getElementById('modal-profil')?.classList.remove('hidden');
}

function closeProfileModal() {
    document.getElementById('modal-profil')?.classList.add('hidden');
}

function chooseAvatar(emoji) {
    const profile = getGamificationProfile();
    const item = AVATAR_SHOP.find((avatar) => avatar.emoji === emoji);
    if (!item) return;

    if (!profile.ownedAvatars.includes(emoji)) {
        if (profile.coins < item.cost) {
            if (typeof showToast === 'function') showToast(`Koin belum cukup. Butuh ${item.cost} koin untuk ${item.name}.`, 'warning');
            return;
        }
        profile.coins -= item.cost;
        profile.ownedAvatars.push(emoji);
    }

    profile.avatar = emoji;
    saveGamificationProfile(profile);
    renderGamification();
    if (typeof showToast === 'function') showToast(`${item.name} berhasil dipakai.`, 'success');
}

function chooseFrame(frameId) {
    const profile = getGamificationProfile();
    const item = FRAME_SHOP.find((frame) => frame.id === frameId);
    if (!item) return;

    if (!profile.ownedFrames.includes(frameId)) {
        if (profile.coins < item.cost) {
            if (typeof showToast === 'function') showToast(`Koin belum cukup. Butuh ${item.cost} koin untuk ${item.name}.`, 'warning');
            return;
        }
        profile.coins -= item.cost;
        profile.ownedFrames.push(frameId);
    }

    profile.frame = frameId;
    saveGamificationProfile(profile);
    renderGamification();
    if (typeof showToast === 'function') showToast(`Bingkai ${item.name} dipakai.`, 'success');
}

function markMaterialRead(topicId) {
    const profile = getGamificationProfile();
    const today = todayKey();
    const key = String(topicId || 'materi');

    if (profile.readTopics[key] === today) return;

    profile.readTopics[key] = today;
    addReward(profile, 5, 2);
    touchStreak(profile);
    bumpMissionProgress(profile, 'materials', 1);
    checkNewBadges(profile);
    saveGamificationProfile(profile);
    renderGamification();
}

function burstConfetti() {
    if (document.documentElement.classList.contains('a11y-reduce-motion')) return;

    const colors = ['#f59e0b', '#ec4899', '#6366f1', '#10b981', '#ef4444', '#0ea5e9'];
    for (let i = 0; i < 26; i += 1) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = `${Math.random() * 0.35}s`;
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(piece);
        window.setTimeout(() => piece.remove(), 2400);
    }
}
