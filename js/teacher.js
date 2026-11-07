// ============================================================
// Portal Guru
// Dashboard kelas, analisis butir soal, jurnal mengajar,
// paket modul ajar, mode proyektor, dan ekspor CSV.
// ============================================================

let projectorBaseSize = 22;

function renderTeacherDashboard() {
    renderClassDashboard();
    renderItemAnalysis();
    renderJournal();
    renderLessonPacks();
    renderSavedLessonPlans();
    populateJournalStudentOptions();
}

// ------------------------------------------------------------
// Dashboard kelas
// ------------------------------------------------------------
function getClassRows() {
    const students = getStudents();
    const scores = getScores();

    return students.map((student) => {
        const studentScores = scores[student.id] || {};
        const history = getHistory(student.id);
        const percentages = Object.values(studentScores)
            .map((item) => Number(item?.percentage))
            .filter((value) => Number.isFinite(value));
        const average = percentages.length
            ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length)
            : null;
        const best = percentages.length ? Math.max(...percentages) : null;
        const last = history[0] || null;

        return {
            student,
            average,
            best,
            attempts: history.length,
            last
        };
    }).sort((a, b) => (b.average ?? -1) - (a.average ?? -1));
}

function renderClassDashboard() {
    const summary = document.getElementById('class-summary');
    const body = document.getElementById('class-table-body');
    if (!summary && !body) return;

    const rows = getClassRows();
    const averages = rows.map((row) => row.average).filter((value) => value !== null);
    const classAverage = averages.length
        ? Math.round(averages.reduce((sum, value) => sum + value, 0) / averages.length)
        : null;
    const totalAttempts = rows.reduce((sum, row) => sum + row.attempts, 0);
    const needSupport = rows.filter((row) => row.average !== null && row.average < 60).length;

    if (summary) {
        summary.innerHTML = `
            <div class="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-3">
                <p class="text-[10px] font-extrabold uppercase text-indigo-600">Jumlah Siswa</p>
                <p class="text-2xl font-black text-indigo-800">${rows.length}</p>
            </div>
            <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3">
                <p class="text-[10px] font-extrabold uppercase text-emerald-600">Rata-rata Kelas</p>
                <p class="text-2xl font-black text-emerald-800">${classAverage === null ? '--' : `${classAverage}%`}</p>
            </div>
            <div class="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3">
                <p class="text-[10px] font-extrabold uppercase text-sky-600">Total Kuis</p>
                <p class="text-2xl font-black text-sky-800">${totalAttempts}</p>
            </div>
            <div class="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3">
                <p class="text-[10px] font-extrabold uppercase text-rose-600">Perlu Pendampingan</p>
                <p class="text-2xl font-black text-rose-800">${needSupport}</p>
            </div>
        `;
    }

    if (body) {
        if (!rows.length) {
            body.innerHTML = '<tr><td colspan="6" class="text-center p-4 text-slate-400 font-semibold">Belum ada siswa. Tambahkan siswa dari tombol di header.</td></tr>';
            return;
        }

        body.innerHTML = rows.map(({ student, average, best, attempts, last }) => {
            const tone = average === null ? 'slate' : average >= 80 ? 'emerald' : average >= 60 ? 'amber' : 'rose';
            const colorClass = {
                slate: 'bg-slate-100 text-slate-600',
                emerald: 'bg-emerald-100 text-emerald-700',
                amber: 'bg-amber-100 text-amber-700',
                rose: 'bg-rose-100 text-rose-700'
            }[tone];

            return `
                <tr class="border-b border-slate-100 hover:bg-slate-50">
                    <td class="px-3 py-2.5">
                        <p class="font-extrabold text-slate-800">${escapeHtml(student.nama)}</p>
                        <p class="text-[10px] font-semibold text-slate-400">${escapeHtml(student.kelas || '-')}</p>
                    </td>
                    <td class="px-3 py-2.5 text-center font-black ${colorClass.split(' ')[1]}">${average === null ? '--' : `${average}%`}</td>
                    <td class="px-3 py-2.5 text-center font-bold text-slate-600">${best === null ? '--' : `${best}%`}</td>
                    <td class="px-3 py-2.5 text-center font-bold text-slate-600">${attempts}</td>
                    <td class="px-3 py-2.5 text-center text-[10px] font-semibold text-slate-500">${last ? `${escapeHtml(last.dateLabel || '')} • ${escapeHtml(last.subject || '')}` : 'Belum ada'}</td>
                    <td class="px-3 py-2.5 text-center">
                        <button onclick="openStudentDetailFromClass('${escapeHtml(student.id)}')" class="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-2.5 py-1 transition">Lihat</button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

function openStudentDetailFromClass(studentId) {
    const rows = getClassRows();
    const row = rows.find((item) => item.student.id === studentId);
    if (!row) return;

    const history = getHistory(studentId).slice(0, 8);
    const body = document.getElementById('projector-body');
    const title = document.getElementById('projector-title');
    if (!body || !title) return;

    title.textContent = `Profil Belajar — ${row.student.nama}`;
    body.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-sm font-bold">
            <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
                <p class="text-[10px] uppercase text-emerald-600">Rata-rata</p>
                <p class="text-4xl font-black text-emerald-700">${row.average === null ? '--' : `${row.average}%`}</p>
            </div>
            <div class="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4">
                <p class="text-[10px] uppercase text-sky-600">Nilai Terbaik</p>
                <p class="text-4xl font-black text-sky-700">${row.best === null ? '--' : `${row.best}%`}</p>
            </div>
            <div class="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4">
                <p class="text-[10px] uppercase text-indigo-600">Kuis Dikerjakan</p>
                <p class="text-4xl font-black text-indigo-700">${row.attempts}</p>
            </div>
        </div>
        <h4 class="mt-5 text-lg font-extrabold text-indigo-950">Riwayat terakhir</h4>
        <div class="mt-2 space-y-2">
            ${history.length ? history.map((entry) => `
                <div class="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                    <p class="font-bold text-slate-700">${escapeHtml(entry.subject || '-')} • ${escapeHtml(entry.mode || 'Latihan')}</p>
                    <p class="font-black text-indigo-800">${escapeHtml(String(entry.score ?? 0))}/${escapeHtml(String(entry.total ?? 0))} <span class="text-emerald-600">(${escapeHtml(String(entry.percentage ?? 0))}%)</span></p>
                    <p class="text-[11px] text-slate-400">${escapeHtml(entry.dateLabel || '')}</p>
                </div>
            `).join('') : '<p class="text-slate-400 font-semibold">Belum ada riwayat kuis.</p>'}
        </div>
    `;
    document.getElementById('modal-proyektor')?.classList.remove('hidden');
}

function exportClassCsv() {
    const rows = getClassRows();
    if (!rows.length) {
        showToast('Belum ada data siswa untuk diekspor.', 'warning');
        return;
    }

    const header = ['Nama', 'Kelas', 'Rata-rata', 'Terbaik', 'Jumlah Kuis', 'Kuis Terakhir', 'Mapel Terakhir', 'Nilai Terakhir'];
    const lines = rows.map((row) => [
        row.student.nama,
        row.student.kelas || '',
        row.average === null ? '' : row.average,
        row.best === null ? '' : row.best,
        row.attempts,
        row.last?.dateLabel || '',
        row.last?.subject || '',
        row.last ? `${row.last.score}/${row.last.total}` : ''
    ]);

    const csv = [header, ...lines]
        .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

    downloadBlob(`\uFEFF${csv}`, `rekap-kelas-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8');
    showToast('Rekap kelas berhasil diunduh sebagai CSV.', 'success');
}

// ------------------------------------------------------------
// Analisis butir soal
// ------------------------------------------------------------
function renderItemAnalysis() {
    const container = document.getElementById('item-analysis');
    if (!container) return;

    const stats = Object.values(getItemStats())
        .filter((item) => item && item.attempts)
        .map((item) => ({
            ...item,
            accuracy: Math.round((Number(item.correct) / Number(item.attempts)) * 100)
        }))
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 8);

    if (!stats.length) {
        container.innerHTML = '<p class="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-2xl p-4">Belum ada data butir soal. Data muncul setelah siswa menjawab kuis atau misi petualangan.</p>';
        return;
    }

    container.innerHTML = stats.map((item) => {
        const subject = SUBJECTS[item.subject]?.short || item.subject;
        const phase = PHASES[item.phase]?.short || item.phase;
        const tone = item.accuracy < 50 ? 'rose' : item.accuracy < 75 ? 'amber' : 'emerald';
        return `
            <div class="border-2 border-slate-200 rounded-2xl p-3 bg-white">
                <div class="flex items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <span>${escapeHtml(subject)} • ${escapeHtml(phase)}</span>
                    <span class="text-${tone}-600">${item.accuracy}% benar</span>
                </div>
                <p class="text-xs font-bold text-slate-700 mt-1.5 leading-relaxed">${escapeHtml(item.q)}</p>
                <div class="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div class="h-full rounded-full bg-${tone}-500" style="width:${item.accuracy}%"></div>
                </div>
                <p class="text-[10px] font-semibold text-slate-400 mt-1">${item.correct}/${item.attempts} jawaban benar${item.accuracy < 50 ? ' • perlu dijelaskan ulang' : ''}</p>
            </div>
        `;
    }).join('');
}

// ------------------------------------------------------------
// Jurnal mengajar
// ------------------------------------------------------------
function populateJournalStudentOptions() {
    const select = document.getElementById('journal-student');
    if (!select) return;

    const current = select.value;
    const students = getStudents();
    select.innerHTML = `<option value="">Semua / umum</option>` + students.map((student) => `
        <option value="${escapeHtml(student.id)}">${escapeHtml(student.nama)}</option>
    `).join('');
    if (students.some((student) => student.id === current)) select.value = current;
}

function handleSaveJournal(event) {
    event.preventDefault();

    const value = (id) => document.getElementById(id)?.value || '';
    const entry = {
        date: value('journal-date') || new Date().toISOString().slice(0, 10),
        studentId: value('journal-student'),
        type: value('journal-type'),
        title: value('journal-title'),
        topic: value('journal-topic'),
        activity: value('journal-activity'),
        reflection: value('journal-reflection'),
        followUp: value('journal-followup'),
        mood: value('journal-mood'),
        minutes: value('journal-minutes')
    };

    if (!entry.title.trim()) {
        showToast('Isi judul catatan terlebih dahulu.', 'warning');
        return;
    }

    saveJournalEntry(entry);
    event.target.reset();
    const dateInput = document.getElementById('journal-date');
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
    renderJournal();
    showToast('Catatan mengajar tersimpan.', 'success');
}

function renderJournal() {
    const container = document.getElementById('journal-list');
    const counter = document.getElementById('journal-count');
    if (!container) return;

    const entries = getJournalEntries();
    if (counter) counter.textContent = `${entries.length} catatan`;

    if (!entries.length) {
        container.innerHTML = '<p class="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-2xl p-4">Belum ada catatan. Tulis refleksi singkat setelah pembelajaran.</p>';
        return;
    }

    const students = getStudents();
    container.innerHTML = entries.slice(0, 30).map((entry) => {
        const student = students.find((item) => item.id === entry.studentId);
        return `
            <div class="border-2 border-slate-200 rounded-2xl p-3.5 bg-white">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="text-[10px] font-extrabold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">${escapeHtml(entry.type || 'jurnal')}</span>
                        <span class="text-[10px] font-bold text-slate-400">${escapeHtml(entry.date)}</span>
                        ${student ? `<span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">${escapeHtml(student.nama)}</span>` : ''}
                        ${entry.minutes ? `<span class="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded-full">${entry.minutes} menit</span>` : ''}
                    </div>
                    <button onclick="removeJournalEntry('${escapeHtml(entry.id)}')" class="text-[10px] font-extrabold text-rose-500 hover:text-rose-700" aria-label="Hapus catatan">
                        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                    </button>
                </div>
                <p class="text-sm font-extrabold text-slate-800 mt-2">${escapeHtml(entry.title)}</p>
                ${entry.topic ? `<p class="text-[11px] font-bold text-slate-500">Topik: ${escapeHtml(entry.topic)}</p>` : ''}
                ${entry.activity ? `<p class="text-xs font-semibold text-slate-600 mt-1.5 leading-relaxed whitespace-pre-wrap">${escapeHtml(entry.activity)}</p>` : ''}
                ${entry.reflection ? `<p class="text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-xl p-2.5 mt-2 leading-relaxed whitespace-pre-wrap">Refleksi: ${escapeHtml(entry.reflection)}</p>` : ''}
                ${entry.followUp ? `<p class="text-[11px] font-bold text-amber-700 mt-2">Tindak lanjut: ${escapeHtml(entry.followUp)}</p>` : ''}
            </div>
        `;
    }).join('');
}

function removeJournalEntry(entryId) {
    if (!window.confirm('Hapus catatan ini?')) return;
    deleteJournalEntry(entryId);
    renderJournal();
    showToast('Catatan dihapus.', 'success');
}

function exportJournalCsv() {
    const entries = getJournalEntries();
    if (!entries.length) {
        showToast('Belum ada catatan untuk diekspor.', 'warning');
        return;
    }

    const students = getStudents();
    const header = ['Tanggal', 'Siswa', 'Jenis', 'Judul', 'Topik', 'Aktivitas', 'Refleksi', 'Tindak Lanjut', 'Menit'];
    const lines = entries.map((entry) => [
        entry.date,
        students.find((student) => student.id === entry.studentId)?.nama || 'Umum',
        entry.type,
        entry.title,
        entry.topic,
        entry.activity,
        entry.reflection,
        entry.followUp,
        entry.minutes
    ]);

    const csv = [header, ...lines]
        .map((line) => line.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

    downloadBlob(`\uFEFF${csv}`, `jurnal-mengajar-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8');
    showToast('Jurnal mengajar berhasil diunduh.', 'success');
}

// ------------------------------------------------------------
// Paket modul ajar
// ------------------------------------------------------------
function buildLessonPackHtml(pack) {
    const subject = SUBJECTS[pack.subject]?.label || pack.subject;
    const phase = PHASES[pack.phase]?.label || pack.phase;

    return `
        <div class="print-sheet space-y-4">
            <div class="text-center border-b-4 border-indigo-900 pb-3">
                <h1 class="text-2xl font-black uppercase text-indigo-900">Modul Ajar</h1>
                <p class="text-sm font-bold text-indigo-700">${escapeHtml(pack.title)}</p>
                <p class="text-[11px] font-semibold text-slate-500">${escapeHtml(subject)} • ${escapeHtml(phase)} • Kurikulum Merdeka</p>
            </div>
            <table class="w-full text-xs border-collapse">
                <tr><td class="border p-2 font-bold bg-slate-50 w-40">Mata Pelajaran</td><td class="border p-2">${escapeHtml(subject)}</td></tr>
                <tr><td class="border p-2 font-bold bg-slate-50">Fase / Kelas</td><td class="border p-2">${escapeHtml(phase)}</td></tr>
                <tr><td class="border p-2 font-bold bg-slate-50">Topik</td><td class="border p-2">${escapeHtml(pack.topic)}</td></tr>
                <tr><td class="border p-2 font-bold bg-slate-50">Capaian Pembelajaran</td><td class="border p-2">${escapeHtml(pack.cp)}</td></tr>
            </table>
            <div>
                <h2 class="text-sm font-extrabold text-indigo-900 uppercase tracking-wider">Tujuan Pembelajaran</h2>
                <ol class="list-decimal ml-5 text-xs space-y-1 mt-1">${pack.tp.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>
            </div>
            <div>
                <h2 class="text-sm font-extrabold text-indigo-900 uppercase tracking-wider">Langkah Pembelajaran</h2>
                <div class="space-y-2 mt-1">
                    ${pack.steps.map((step) => `
                        <div class="border rounded-xl p-2.5 text-xs">
                            <p class="font-extrabold text-indigo-800">${escapeHtml(step.title)}</p>
                            <p class="text-slate-600 mt-0.5">${escapeHtml(step.detail)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div>
                <h2 class="text-sm font-extrabold text-indigo-900 uppercase tracking-wider">Asesmen</h2>
                <p class="text-xs mt-1">${escapeHtml(pack.assessment)}</p>
            </div>
            <div>
                <h2 class="text-sm font-extrabold text-indigo-900 uppercase tracking-wider">Rubrik Penilaian</h2>
                <ul class="list-disc ml-5 text-xs space-y-1 mt-1">${pack.rubric.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            </div>
            <div class="grid grid-cols-2 gap-4 text-center text-[11px] font-bold pt-8">
                <div><p class="mb-12">Guru Mata Pelajaran</p><p class="border-t border-slate-400 w-3/4 mx-auto pt-1">( ................................ )</p></div>
                <div><p class="mb-12">Kepala Sekolah</p><p class="border-t border-slate-400 w-3/4 mx-auto pt-1">( ................................ )</p></div>
            </div>
        </div>
    `;
}

function renderLessonPacks() {
    const container = document.getElementById('lesson-pack-list');
    if (!container) return;

    container.innerHTML = LESSON_PACKS.map((pack) => {
        const subject = SUBJECTS[pack.subject]?.label || pack.subject;
        const phase = PHASES[pack.phase]?.short || pack.phase;
        return `
            <div class="bg-white rounded-3xl border-4 border-amber-100 p-5 shadow-md flex flex-col">
                <div class="flex items-start justify-between gap-2">
                    <span class="text-[10px] font-extrabold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">${escapeHtml(subject)} • ${escapeHtml(phase)}</span>
                    <i class="fa-solid fa-file-signature text-amber-400 text-xl" aria-hidden="true"></i>
                </div>
                <h4 class="text-base font-extrabold font-fredoka text-indigo-950 mt-2 leading-snug">${escapeHtml(pack.title)}</h4>
                <p class="text-[11px] font-semibold text-slate-500 mt-1 leading-relaxed flex-grow">${escapeHtml(pack.topic)}</p>
                <div class="flex flex-wrap gap-2 mt-3">
                    <button onclick="previewLessonPack('${pack.id}')" class="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-extrabold px-3 py-2 rounded-xl transition">
                        <i class="fa-solid fa-eye" aria-hidden="true"></i> Pratinjau
                    </button>
                    <button onclick="saveLessonPackToLibrary('${pack.id}')" class="bg-white hover:bg-amber-50 text-amber-700 border-2 border-amber-200 text-[11px] font-extrabold px-3 py-2 rounded-xl transition">
                        <i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Simpan
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function previewLessonPack(packId) {
    const pack = LESSON_PACKS.find((item) => item.id === packId);
    if (!pack) return;
    openProjector(pack.title, buildLessonPackHtml(pack));
}

function saveLessonPackToLibrary(packId) {
    const pack = LESSON_PACKS.find((item) => item.id === packId);
    if (!pack) return;

    saveLessonPlan({
        title: pack.title,
        subject: pack.subject,
        phase: pack.phase,
        topic: pack.topic,
        html: buildLessonPackHtml(pack)
    });
    renderSavedLessonPlans();
    showToast(`Paket "${pack.title}" disimpan ke perpustakaan modul.`, 'success');
}

function renderSavedLessonPlans() {
    const container = document.getElementById('lesson-plan-list');
    if (!container) return;

    const plans = getLessonPlans();
    if (!plans.length) {
        container.innerHTML = '<p class="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-2xl p-4">Belum ada modul tersimpan. Simpan paket di atas atau buat modul dari menu Modul Ajar AI.</p>';
        return;
    }

    container.innerHTML = plans.map((plan) => `
        <div class="flex flex-wrap items-center justify-between gap-2 border-2 border-slate-200 rounded-2xl p-3 bg-white">
            <div class="min-w-0 flex-1">
                <p class="text-sm font-extrabold text-slate-800 leading-snug break-words">${escapeHtml(plan.title)}</p>
                <p class="text-[10px] font-semibold text-slate-400">${escapeHtml(SUBJECTS[plan.subject]?.label || plan.subject)} • ${escapeHtml(PHASES[plan.phase]?.short || plan.phase)} • ${new Date(plan.createdAt).toLocaleDateString('id-ID')}</p>
            </div>
            <div class="flex flex-wrap gap-1.5">
                <button onclick="previewSavedLessonPlan('${escapeHtml(plan.id)}')" class="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-2.5 py-1.5 transition">Buka</button>
                <button onclick="printSavedLessonPlan('${escapeHtml(plan.id)}')" class="text-[10px] font-extrabold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg px-2.5 py-1.5 transition">Cetak</button>
                <button onclick="removeSavedLessonPlan('${escapeHtml(plan.id)}')" class="text-[10px] font-extrabold text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg px-2.5 py-1.5 transition">Hapus</button>
            </div>
        </div>
    `).join('');
}

function previewSavedLessonPlan(planId) {
    const plan = getLessonPlans().find((item) => item.id === planId);
    if (!plan) return;
    openProjector(plan.title, plan.html);
}

function printSavedLessonPlan(planId) {
    const plan = getLessonPlans().find((item) => item.id === planId);
    if (!plan) return;
    printHtml(plan.html);
}

function removeSavedLessonPlan(planId) {
    if (!window.confirm('Hapus modul ini dari perpustakaan?')) return;
    deleteLessonPlan(planId);
    renderSavedLessonPlans();
    showToast('Modul dihapus.', 'success');
}

// ------------------------------------------------------------
// Mode proyektor
// ------------------------------------------------------------
function openProjector(title, html) {
    const modal = document.getElementById('modal-proyektor');
    const titleEl = document.getElementById('projector-title');
    const body = document.getElementById('projector-body');
    if (!modal || !body) return;

    projectorBaseSize = 22;
    if (titleEl) titleEl.textContent = title || 'Mode Proyektor';
    body.innerHTML = html || '';
    body.style.fontSize = `${projectorBaseSize}px`;
    body.scrollTop = 0;
    modal.classList.remove('hidden');
}

function closeProjector() {
    document.getElementById('modal-proyektor')?.classList.add('hidden');
}

function projectorFontStep(delta) {
    projectorBaseSize = Math.max(14, Math.min(40, projectorBaseSize + delta));
    const body = document.getElementById('projector-body');
    if (body) body.style.fontSize = `${projectorBaseSize}px`;
}

function printProjector() {
    const body = document.getElementById('projector-body');
    if (!body) return;
    printHtml(`<div class="print-sheet">${body.innerHTML}</div>`);
}
