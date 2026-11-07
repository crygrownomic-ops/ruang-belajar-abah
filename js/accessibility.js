// ============================================================
// Aksesibilitas & Dwibahasa
// Teks besar, font disleksia, kontras tinggi, kurangi animasi,
// auto-baca, dan terjemahan antarmuka ID/EN.
// ============================================================

function applyAccessibilitySettings() {
    const settings = getAccessibilitySettings();
    const html = document.documentElement;
    const body = document.body;

    html.classList.toggle('a11y-large-text', settings.largeText);
    html.classList.toggle('a11y-dyslexia', settings.dyslexiaFont);
    html.classList.toggle('a11y-high-contrast', settings.highContrast);
    html.classList.toggle('a11y-reduce-motion', settings.reduceMotion);
    html.classList.toggle('a11y-auto-read', settings.autoRead);
    html.lang = settings.language;

    if (body) {
        body.classList.toggle('a11y-large-text', settings.largeText);
        body.classList.toggle('a11y-dyslexia', settings.dyslexiaFont);
    }

    applyLanguage(settings.language);
    renderAccessibilityControls(settings);
}

function renderAccessibilityControls(settings = getAccessibilitySettings()) {
    const map = {
        'a11y-large-text': settings.largeText,
        'a11y-dyslexia': settings.dyslexiaFont,
        'a11y-high-contrast': settings.highContrast,
        'a11y-reduce-motion': settings.reduceMotion,
        'a11y-auto-read': settings.autoRead
    };

    Object.entries(map).forEach(([id, checked]) => {
        const input = document.getElementById(id);
        if (input) input.checked = Boolean(checked);
    });

    document.querySelectorAll('.lang-btn').forEach((button) => {
        const active = button.dataset.lang === settings.language;
        button.className = `lang-btn px-4 py-2 rounded-xl text-xs font-extrabold transition ${active ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'}`;
    });

    const status = document.getElementById('a11y-status');
    if (status) {
        const active = [];
        if (settings.largeText) active.push('teks besar');
        if (settings.dyslexiaFont) active.push('font disleksia');
        if (settings.highContrast) active.push('kontras tinggi');
        if (settings.reduceMotion) active.push('animasi dikurangi');
        if (settings.autoRead) active.push('auto-baca');
        status.textContent = active.length ? `Aktif: ${active.join(', ')}` : 'Semua pengaturan standar.';
    }
}

function toggleA11y(key, value) {
    const patch = {};
    patch[key] = Boolean(value);
    saveAccessibilitySettings(patch);
    applyAccessibilitySettings();
    showToast('Pengaturan aksesibilitas diperbarui.', 'success', 2200);
}

function setLanguage(language) {
    saveAccessibilitySettings({ language: language === 'en' ? 'en' : 'id' });
    applyAccessibilitySettings();
    showToast(language === 'en' ? 'Language switched to English.' : 'Bahasa antarmuka kembali ke Indonesia.', 'success', 2200);
}

function applyLanguage(language = getAccessibilitySettings().language) {
    const dictionary = I18N_DICTIONARY[language] || I18N_DICTIONARY.id;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        const value = dictionary[key];
        if (value) element.textContent = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const key = element.dataset.i18nPlaceholder;
        const value = dictionary[key];
        if (value) element.setAttribute('placeholder', value);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
        const key = element.dataset.i18nAria;
        const value = dictionary[key];
        if (value) element.setAttribute('aria-label', value);
    });

    const title = document.querySelector('title');
    if (title) {
        title.textContent = language === 'en'
            ? 'Ruang Belajar Abah - Interactive Elementary Learning'
            : 'Ruang Belajar Abah - Aplikasi Pembelajaran SD Interaktif';
    }
}

function openAccessibilityModal() {
    applyAccessibilitySettings();
    document.getElementById('modal-aksesibilitas')?.classList.remove('hidden');
}

function closeAccessibilityModal() {
    document.getElementById('modal-aksesibilitas')?.classList.add('hidden');
}
