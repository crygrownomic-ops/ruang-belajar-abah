// Web Audio Synthesizer (Sound Effects) & Text-To-Speech

class SoundFX {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playCorrect() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.2); // G5

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    playWrong() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.frequency.setValueAtTime(220, this.ctx.currentTime); // A3
        osc.frequency.setValueAtTime(196, this.ctx.currentTime + 0.15); // G3

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
    }
}

const soundFX = new SoundFX();

// Text-to-Speech (Read-Aloud)
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9; // Slightly slower for kids
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Fitur suara tidak didukung di browser ini.");
    }
}