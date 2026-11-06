// ============================================================
// Efek Suara (Web Audio API) & Text-To-Speech
// ============================================================

class SoundFX {
    constructor() {
        this.ctx = null;
    }

    init() {
        try {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return null;
                this.ctx = new AudioCtx();
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }
            return this.ctx;
        } catch (err) {
            return null;
        }
    }

    playTone(frequency, startOffset, duration, type = 'sine', volume = 0.12) {
        const ctx = this.init();
        if (!ctx) return;

        const start = ctx.currentTime + startOffset;
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
    }

    playCorrect() {
        this.playTone(523.25, 0, 0.16, 'sine', 0.12);   // C5
        this.playTone(659.25, 0.09, 0.16, 'sine', 0.12); // E5
        this.playTone(783.99, 0.18, 0.22, 'sine', 0.12); // G5
    }

    playWrong() {
        this.playTone(220, 0, 0.18, 'sawtooth', 0.07);   // A3
        this.playTone(196, 0.14, 0.24, 'sawtooth', 0.06); // G3
    }

    playComplete() {
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        notes.forEach((note, index) => {
            this.playTone(note, index * 0.09, 0.2, 'triangle', 0.1);
        });
    }

    playClick() {
        this.playTone(440, 0, 0.06, 'sine', 0.05);
    }
}

const soundFX = new SoundFX();

// ------------------------------------------------------------
// Text-to-Speech
// ------------------------------------------------------------
let preferredIndonesianVoice = null;
let speechToken = 0;

function refreshSpeechVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices() || [];
    preferredIndonesianVoice =
        voices.find((voice) => /^id[-_]?ID$/i.test(voice.lang)) ||
        voices.find((voice) => /^id[-_]/i.test(voice.lang)) ||
        voices.find((voice) => /indonesia/i.test(voice.name)) ||
        null;
}

if ('speechSynthesis' in window) {
    refreshSpeechVoices();
    if (typeof window.speechSynthesis.addEventListener === 'function') {
        window.speechSynthesis.addEventListener('voiceschanged', refreshSpeechVoices);
    } else {
        window.speechSynthesis.onvoiceschanged = refreshSpeechVoices;
    }
}

function stopSpeaking() {
    speechToken++;
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    const readButtonLabel = document.querySelector('#btn-read-materi span');
    if (readButtonLabel) readButtonLabel.textContent = 'Bacakan';
}

function speakText(text, options = {}) {
    if (!('speechSynthesis' in window)) {
        if (typeof showToast === 'function') {
            showToast('Fitur suara tidak didukung di browser ini.', 'warning');
        }
        return false;
    }

    const cleanText = String(text || '').replace(/\s+/g, ' ').trim();
    if (!cleanText) return false;

    stopSpeaking();
    const currentToken = ++speechToken;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = Number(options.rate) || 0.92;
    utterance.pitch = Number(options.pitch) || 1;
    utterance.volume = 1;
    if (preferredIndonesianVoice) utterance.voice = preferredIndonesianVoice;

    utterance.onend = () => {
        if (currentToken !== speechToken) return;
        const readButtonLabel = document.querySelector('#btn-read-materi span');
        if (readButtonLabel) readButtonLabel.textContent = 'Bacakan';
    };

    utterance.onerror = () => {
        if (currentToken !== speechToken) return;
        const readButtonLabel = document.querySelector('#btn-read-materi span');
        if (readButtonLabel) readButtonLabel.textContent = 'Bacakan';
    };

    window.speechSynthesis.speak(utterance);
    return true;
}

function isSpeaking() {
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
}

window.addEventListener('beforeunload', () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
});
