// ============================================================
// Mode Orang Tua
// Laporan 7/30 hari, grafik aktivitas, rekomendasi, dan cetak.
// ============================================================

let parentReportRange = 7;

function setParentReportRange(days) {
    parentReportRange = days === 30 ? 30 : 7;
    renderParentMode();
}

function getParentReportData(days = parentReportRange) {
    const active = getActiveStudent();
    if (!active) return null;

    const now = Date.now();
    const start = now - days * 24 * 60 * 60 * 1000;
    const history = getHistory(active.id).filter((entry) => Number(entry.timestamp) >= start);
    const percentages = history.map((entry) => Number(entry.percentage)).filter((value) => Number.isFinite(value));
    const minutes = Math.round(history.reduce((sum, entry) => sum + (Number(entry.durationSeconds) || 0), 0) / 60);
    const profile = getGamificationProfile();
    const scores = getScores()[active.id] || {};

    const subjectMap = {};
    history.forEach((entry) => {
        const key = entry.subject || 'lainnya';
        if (!subjectMap[key]) subjectMap[key] = { total: 0, count: 0 };
        subjectMap[key].total += Number(entry.percentage) || 0;
        subjectMap[key].count += 1;
    });

    const subjects = Object.entries(subjectMap)
        .map(([key, value]) => ({
            key,
            label: SUBJECTS[key]?.label || key,
            average: Math.round(value.total / value.count),
            count: value.count
        }))
        .sort((a, b) => b.average - a.average);

    const buckets = [];
    const bucketSize = days > 7 ? 3 : 1;
    for (let offset = days - 1; offset >= 0; offset -= bucketSize) {
        const bucketStart = new Date(now - offset * 24 * 60 * 60 * 1000);
        bucketStart.setHours(0, 0, 0, 0);
        const bucketEnd = new Date(bucketStart.getTime() + bucketSize * 24 * 60 * 60 * 1000);
        const items = history.filter((entry) => {
            const stamp = Number(entry.timestamp) || 0;
            return stamp >= bucketStart.getTime() && stamp < bucketEnd.getTime();
        });
        const values = items.map((entry) => Number(entry.percentage)).filter((value) => Number.isFinite(value));
        buckets.push({
            label: bucketStart.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            average: values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null,
            count: items.length
        });
    }

    return {
        active,
        days,
        history,
        sessions: history.length,
        average: percentages.length ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length) : null,
        best: percentages.length ? Math.max(...percentages) : null,
        minutes,
        streak: profile.streak,
        subjects,
        buckets,
        scores,
        readTopics: Object.keys(profile.readTopics || {}).length,
        badges: (profile.badges || []).length,
        adventures: Number(profile.stats.adventures) || 0,
        games: Number(profile.stats.games) || 0
    };
}

function renderParentMode() {
    const container = document.getElementById('parent-dashboard');
    if (!container) return;

    const data = getParentReportData();
    if (!data) {
        container.innerHTML = '<p class="text-sm font-semibold text-slate-500 bg-white border-4 border-amber-100 rounded-3xl p-6">Tambahkan siswa terlebih dahulu untuk melihat laporan orang tua.</p>';
        return;
    }

    const rangeLabel = document.getElementById('parent-range-label');
    if (rangeLabel) rangeLabel.textContent = `${data.days} hari terakhir`;

    document.querySelectorAll('.parent-range-btn').forEach((button) => {
        const active = Number(button.dataset.days) === data.days;
        button.className = `parent-range-btn px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition ${active ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'}`;
    });

    const summary = document.getElementById('parent-summary');
    if (summary) {
        summary.innerHTML = `
            <div class="rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-3">
                <p class="text-[10px] font-extrabold uppercase text-emerald-600">Rata-rata</p>
                <p class="text-2xl font-black text-emerald-800">${data.average === null ? '--' : `${data.average}%`}</p>
            </div>
            <div class="rounded-2xl bg-sky-50 border-2 border-sky-200 p-3">
                <p class="text-[10px] font-extrabold uppercase text-sky-600">Sesi Belajar</p>
                <p class="text-2xl font-black text-sky-800">${data.sessions}</p>
            </div>
            <div class="rounded-2xl bg-amber-50 border-2 border-amber-200 p-3">
                <p class="text-[10px] font-extrabold uppercase text-amber-600">Menit Belajar</p>
                <p class="text-2xl font-black text-amber-800">${data.minutes}</p>
            </div>
            <div class="rounded-2xl bg-purple-50 border-2 border-purple-200 p-3">
                <p class="text-[10px] font-extrabold uppercase text-purple-600">Streak</p>
                <p class="text-2xl font-black text-purple-800">${data.streak} hari</p>
            </div>
        `;
    }

    const chart = document.getElementById('parent-chart');
    if (chart) {
        chart.innerHTML = data.buckets.map((bucket) => {
            const height = bucket.average === null ? 4 : Math.max(4, bucket.average);
            const tone = bucket.average === null ? 'bg-slate-200' : bucket.average >= 80 ? 'bg-emerald-400' : bucket.average >= 60 ? 'bg-amber-400' : 'bg-rose-400';
            return `
                <div class="flex flex-col items-center justify-end gap-1 flex-grow min-w-0" title="${escapeHtml(bucket.label)}: ${bucket.average === null ? 'tidak ada kuis' : `${bucket.average}%`}">
                    <span class="text-[9px] font-extrabold text-slate-500">${bucket.average === null ? '' : `${bucket.average}%`}</span>
                    <div class="w-full max-w-[28px] rounded-t-lg ${tone}" style="height:${Math.round(height * 1.1)}px"></div>
                    <span class="text-[9px] font-bold text-slate-400 truncate w-full text-center">${escapeHtml(bucket.label)}</span>
                </div>
            `;
        }).join('');
    }

    const subjects = document.getElementById('parent-subjects');
    if (subjects) {
        subjects.innerHTML = data.subjects.length
            ? data.subjects.map((subject) => `
                <div class="flex items-center gap-3">
                    <span class="w-28 shrink-0 text-[11px] font-extrabold text-slate-600 truncate">${escapeHtml(subject.label)}</span>
                    <div class="flex-grow h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div class="h-full rounded-full bg-gradient-to-r from-indigo-400 to-pink-500" style="width:${subject.average}%"></div>
                    </div>
                    <span class="w-10 text-right text-[11px] font-extrabold text-indigo-700">${subject.average}%</span>
                </div>
            `).join('')
            : '<p class="text-[11px] font-semibold text-slate-400">Belum ada nilai mapel pada rentang ini.</p>';
    }

    const recommendations = document.getElementById('parent-recommendations');
    if (recommendations) {
        const weakest = [...data.subjects].sort((a, b) => a.average - b.average)[0];
        const items = [];
        if (!data.sessions) {
            items.push('Belum ada aktivitas kuis pada rentang ini. Ajak anak mencoba satu kuis singkat agar minat belajarnya tumbuh.');
        } else if (weakest && weakest.average < 70) {
            items.push(`Nilai ${weakest.label} masih ${weakest.average}%. Dampingi anak membaca ulang materi ${weakest.label}, lalu kerjakan kuis lagi bersama.`);
        } else {
            items.push('Perkembangan belajar anak sudah baik. Beri apresiasi dan tantang dengan mapel lain atau soal level HOTS.');
        }
        if (data.minutes < 60) items.push('Tambahkan sesi belajar singkat 10–15 menit setiap hari. Gunakan fitur "Belajar 10 Menit" di Beranda.');
        if (data.streak < 3) items.push('Bantu anak menjaga kebiasaan belajar harian agar streak dan rasa percaya dirinya meningkat.');
        if (data.readTopics < 3) items.push('Ajak anak membaca minimal satu materi atau cerita rakyat setiap hari untuk memperkaya kosakata.');
        items.push(`Aktivitas luring: ${PARENT_OFFLINE_ACTIVITIES[new Date().getDate() % PARENT_OFFLINE_ACTIVITIES.length]}`);

        recommendations.innerHTML = items.map((text) => `
            <li class="flex items-start gap-2"><i class="fa-solid fa-circle-check text-emerald-500 mt-1" aria-hidden="true"></i><span>${escapeHtml(text)}</span></li>
        `).join('');
    }

    const activity = document.getElementById('parent-activity');
    if (activity) {
        activity.innerHTML = data.history.slice(0, 6).length
            ? data.history.slice(0, 6).map((entry) => `
                <div class="flex items-center justify-between gap-2 border-b border-slate-100 py-2 last:border-0">
                    <div class="min-w-0">
                        <p class="text-[11px] font-extrabold text-slate-700 truncate">${escapeHtml(entry.subject || '-')} • ${escapeHtml(entry.mode || 'Latihan')}</p>
                        <p class="text-[10px] font-semibold text-slate-400">${escapeHtml(entry.dateLabel || '')}</p>
                    </div>
                    <span class="text-[11px] font-black text-indigo-700 shrink-0">${escapeHtml(String(entry.percentage ?? 0))}%</span>
                </div>
            `).join('')
            : '<p class="text-[11px] font-semibold text-slate-400">Belum ada aktivitas pada rentang ini.</p>';
    }
}

function printParentReport() {
    const data = getParentReportData();
    if (!data) {
        showToast('Belum ada data untuk dicetak.', 'warning');
        return;
    }

    const rows = data.subjects.length
        ? data.subjects.map((subject) => `
            <tr>
                <td>${escapeHtml(subject.label)}</td>
                <td style="text-align:center">${subject.count} kuis</td>
                <td style="text-align:center">${subject.average}%</td>
            </tr>
        `).join('')
        : '<tr><td colspan="3" style="text-align:center">Belum ada nilai</td></tr>';

    const activity = data.history.slice(0, 10).map((entry) => `
        <tr>
            <td>${escapeHtml(entry.dateLabel || '')}</td>
            <td>${escapeHtml(entry.subject || '')}</td>
            <td style="text-align:center">${escapeHtml(entry.mode || '')}</td>
            <td style="text-align:center">${escapeHtml(String(entry.score ?? 0))}/${escapeHtml(String(entry.total ?? 0))}</td>
            <td style="text-align:center">${escapeHtml(String(entry.percentage ?? 0))}%</td>
        </tr>
    `).join('');

    printHtml(`
        <div class="print-sheet space-y-4">
            <div class="text-center border-b-4 border-indigo-900 pb-3">
                <h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#312e81">Laporan Belajar Anak</h1>
                <p style="font-size:12px;font-weight:700;color:#4338ca">Ruang Belajar Abah — ${data.days} Hari Terakhir</p>
            </div>
            <table class="w-full text-xs border-collapse">
                <tr><td class="border p-2 font-bold bg-slate-50 w-40">Nama Anak</td><td class="border p-2">${escapeHtml(data.active.nama)}</td></tr>
                <tr><td class="border p-2 font-bold bg-slate-50">Kelas / Fase</td><td class="border p-2">${escapeHtml(data.active.kelas || '-')}</td></tr>
                <tr><td class="border p-2 font-bold bg-slate-50">Sekolah</td><td class="border p-2">${escapeHtml(data.active.sekolah || '-')}</td></tr>
                <tr><td class="border p-2 font-bold bg-slate-50">Tanggal Cetak</td><td class="border p-2">${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td></tr>
            </table>

            <div class="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                <div class="border rounded-xl p-2"><p>Rata-rata</p><p style="font-size:20px;font-weight:900">${data.average === null ? '--' : `${data.average}%`}</p></div>
                <div class="border rounded-xl p-2"><p>Sesi</p><p style="font-size:20px;font-weight:900">${data.sessions}</p></div>
                <div class="border rounded-xl p-2"><p>Menit</p><p style="font-size:20px;font-weight:900">${data.minutes}</p></div>
                <div class="border rounded-xl p-2"><p>Streak</p><p style="font-size:20px;font-weight:900">${data.streak} hari</p></div>
            </div>

            <div>
                <h2 style="font-size:13px;font-weight:800;color:#312e81;text-transform:uppercase">Ringkasan per Mata Pelajaran</h2>
                <table class="w-full text-xs border-collapse mt-1">
                    <thead><tr><th class="border p-2 text-left">Mata Pelajaran</th><th class="border p-2">Jumlah Kuis</th><th class="border p-2">Rata-rata</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>

            <div>
                <h2 style="font-size:13px;font-weight:800;color:#312e81;text-transform:uppercase">Aktivitas Terakhir</h2>
                <table class="w-full text-xs border-collapse mt-1">
                    <thead><tr><th class="border p-2 text-left">Tanggal</th><th class="border p-2 text-left">Mapel</th><th class="border p-2">Mode</th><th class="border p-2">Skor</th><th class="border p-2">Nilai</th></tr></thead>
                    <tbody>${activity || '<tr><td colspan="5" style="text-align:center">Belum ada aktivitas</td></tr>'}</tbody>
                </table>
            </div>

            <div class="grid grid-cols-2 gap-4 text-center text-[11px] font-bold pt-10">
                <div><p class="mb-12">Orang Tua / Wali</p><p class="border-t border-slate-400 w-3/4 mx-auto pt-1">( ................................ )</p></div>
                <div><p class="mb-12">Guru / Pendamping</p><p class="border-t border-slate-400 w-3/4 mx-auto pt-1">( ................................ )</p></div>
            </div>
        </div>
    `);
}
