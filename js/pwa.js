// ============================================================
// PWA & Mode Luring
// Registrasi service worker, tombol instal, dan status koneksi.
// ============================================================

let deferredInstallPrompt = null;

function setupPwa() {
    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        const button = document.getElementById('btn-install-app');
        if (button) button.classList.remove('hidden');
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        const button = document.getElementById('btn-install-app');
        if (button) button.classList.add('hidden');
        if (typeof showToast === 'function') showToast('Aplikasi berhasil dipasang di perangkat.', 'success');
    });

    const version = document.getElementById('app-version');
    if (version) version.textContent = 'v2.2';

    if ('serviceWorker' in navigator && /^https?:$/.test(window.location.protocol)) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(() => {
                // Pendaftaran gagal (mis. file:// atau browser lama) — aplikasi tetap berjalan.
            });
        });
    }
}

function installPwa() {
    if (!deferredInstallPrompt) {
        if (typeof showToast === 'function') {
            showToast('Gunakan menu browser "Tambahkan ke layar utama" untuk memasang aplikasi.', 'info', 4500);
        }
        return;
    }

    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.finally(() => {
        deferredInstallPrompt = null;
        const button = document.getElementById('btn-install-app');
        if (button) button.classList.add('hidden');
    });
}

function updateOnlineStatus() {
    const online = navigator.onLine;
    const banner = document.getElementById('offline-banner');
    if (banner) banner.classList.toggle('hidden', online);

    const dot = document.getElementById('online-status-dot');
    if (dot) {
        dot.className = `w-2.5 h-2.5 rounded-full ${online ? 'bg-emerald-400' : 'bg-rose-500'}`;
        dot.title = online ? 'Online' : 'Offline';
    }
}

document.addEventListener('DOMContentLoaded', setupPwa);
