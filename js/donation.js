// ============================================================
// Dukungan / Donasi Developer
// Menampilkan info donasi sukarela dan menyalin nomor DANA.
// ============================================================

const DONATION_DANA_NUMBER = '082254127596';
let donationReturnFocus = null;

function openDonationModal() {
    const modal = document.getElementById('modal-donasi');
    if (!modal) return;

    donationReturnFocus = document.activeElement;
    modal.classList.remove('hidden');

    const closeButton = modal.querySelector('[data-donation-close]');
    if (closeButton) closeButton.focus();
}

function closeDonationModal() {
    const modal = document.getElementById('modal-donasi');
    if (!modal) return;

    modal.classList.add('hidden');

    if (donationReturnFocus && typeof donationReturnFocus.focus === 'function') {
        donationReturnFocus.focus();
    }
    donationReturnFocus = null;
}

async function copyDonationNumber() {
    const copied = typeof copyToClipboard === 'function'
        ? await copyToClipboard(DONATION_DANA_NUMBER)
        : false;

    if (typeof showToast === 'function') {
        showToast(
            copied
                ? 'Nomor DANA 0822 5412 7596 berhasil disalin. Terima kasih! ❤️'
                : 'Nomor DANA: 0822 5412 7596. Silakan salin secara manual.',
            copied ? 'success' : 'warning',
            4500
        );
    }
}
