// ============================================================
// Navigasi Horizontal Ramah Pengguna
// Panah geser, fade tepi, petunjuk sekali tampil, dan auto-scroll
// ke menu aktif saat berpindah bagian.
// ============================================================

const NAV_HINT_STORAGE_KEY = 'rba_nav_hint_seen';
let navHintTimer = null;
let navUpdateFrame = null;

function initNavScroll() {
    const scroller = document.getElementById('nav-scroll');
    if (!scroller) return;

    const prev = document.getElementById('nav-arrow-prev');
    const next = document.getElementById('nav-arrow-next');

    if (prev) prev.addEventListener('click', () => scrollNavBy(-1));
    if (next) next.addEventListener('click', () => scrollNavBy(1));

    scroller.addEventListener('scroll', () => {
        scheduleNavScrollUpdate();
        dismissNavHint();
    }, { passive: true });

    scroller.addEventListener('pointerdown', dismissNavHint, { passive: true });

    scroller.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            scrollNavBy(1);
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollNavBy(-1);
        } else if (event.key === 'Home') {
            event.preventDefault();
            scroller.scrollTo({ left: 0, behavior: 'smooth' });
            dismissNavHint();
        } else if (event.key === 'End') {
            event.preventDefault();
            scroller.scrollTo({ left: scroller.scrollWidth, behavior: 'smooth' });
            dismissNavHint();
        }
    });

    window.addEventListener('resize', () => scheduleNavScrollUpdate());

    if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(() => scheduleNavScrollUpdate());
        observer.observe(scroller);
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => scheduleNavScrollUpdate()).catch(() => {});
    }

    // Label menu berubah saat bahasa diganti, jadi ukuran konten ikut berubah.
    if ('MutationObserver' in window) {
        const mutation = new MutationObserver(() => scheduleNavScrollUpdate());
        mutation.observe(scroller, { childList: true, subtree: true, characterData: true });
    }

    updateNavScrollHints();
    window.setTimeout(showNavScrollHintOnce, 900);
}

function scheduleNavScrollUpdate() {
    if (navUpdateFrame !== null) return;
    navUpdateFrame = window.requestAnimationFrame(() => {
        navUpdateFrame = null;
        updateNavScrollHints();
    });
}

function updateNavScrollHints() {
    const scroller = document.getElementById('nav-scroll');
    if (!scroller) return;

    const prev = document.getElementById('nav-arrow-prev');
    const next = document.getElementById('nav-arrow-next');
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const overflowing = maxScroll > 4;
    const atStart = scroller.scrollLeft <= 4;
    const atEnd = scroller.scrollLeft >= maxScroll - 4;

    if (prev) prev.hidden = !overflowing || atStart;
    if (next) next.hidden = !overflowing || atEnd;

    scroller.classList.toggle('nav-fade-start', overflowing && !atStart);
    scroller.classList.toggle('nav-fade-end', overflowing && !atEnd);

    if (!overflowing || !atStart) hideNavHint();
}

function scrollNavBy(direction) {
    const scroller = document.getElementById('nav-scroll');
    if (!scroller) return;

    const amount = Math.max(180, Math.round(scroller.clientWidth * 0.7));
    scroller.scrollBy({ left: direction * amount, behavior: 'smooth' });
    dismissNavHint();
}

function ensureActiveNavVisible() {
    const scroller = document.getElementById('nav-scroll');
    if (!scroller) return;

    const active = scroller.querySelector('.nav-btn.active');
    if (!active) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const padding = 56;

    if (activeRect.left < scrollerRect.left + padding) {
        scroller.scrollBy({
            left: activeRect.left - scrollerRect.left - padding,
            behavior: 'smooth'
        });
    } else if (activeRect.right > scrollerRect.right - padding) {
        scroller.scrollBy({
            left: activeRect.right - scrollerRect.right + padding,
            behavior: 'smooth'
        });
    }

    scheduleNavScrollUpdate();
}

function showNavScrollHintOnce() {
    const scroller = document.getElementById('nav-scroll');
    const hint = document.getElementById('nav-scroll-hint');
    if (!scroller || !hint) return;
    if (hasSeenNavHint()) return;
    if (scroller.scrollWidth - scroller.clientWidth <= 4) return;
    if (scroller.scrollLeft > 4) return;

    hint.classList.add('is-visible');
    const next = document.getElementById('nav-arrow-next');
    if (next && !next.hidden) next.classList.add('is-nudging');

    window.clearTimeout(navHintTimer);
    navHintTimer = window.setTimeout(dismissNavHint, 8000);
}

function hideNavHint() {
    const hint = document.getElementById('nav-scroll-hint');
    if (!hint) return;

    hint.classList.remove('is-visible');
    const next = document.getElementById('nav-arrow-next');
    if (next) next.classList.remove('is-nudging');

    window.clearTimeout(navHintTimer);
    navHintTimer = null;
}

function dismissNavHint() {
    if (!document.getElementById('nav-scroll-hint')) return;
    if (hasSeenNavHint()) return;

    try {
        localStorage.setItem(NAV_HINT_STORAGE_KEY, '1');
    } catch (error) {
        // Mode privat atau penyimpanan penuh: abaikan.
    }

    hideNavHint();
}

function hasSeenNavHint() {
    try {
        return localStorage.getItem(NAV_HINT_STORAGE_KEY) === '1';
    } catch (error) {
        return true;
    }
}
