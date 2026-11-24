// Motor de SFX Arcade sin dependencias externas (Web Audio API)

class ArcadeSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('pokemind_muted') === 'true';
  }

  _getCtx() {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('pokemind_muted', String(this.muted));
    if (!this.muted) this.click();
    return this.muted;
  }

  _tone(freq, duration = 0.09, type = 'square', volume = 0.08, delay = 0, slideTo = null) {
    const ctx = this._getCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
      }
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.01);
    } catch {
      // Silencioso si el navegador bloquea autoplay
    }
  }

  click() {
    this._tone(520, 0.055, 'triangle', 0.07, 0, 740);
  }

  typeSwitch() {
    this._tone(360, 0.06, 'sine', 0.06, 0, 620);
  }

  chip() {
    this._tone(1100, 0.045, 'sine', 0.06, 0, 1480);
  }

  win() {
    this._tone(523.25, 0.1, 'square', 0.06, 0);
    this._tone(659.25, 0.1, 'square', 0.06, 0.08);
    this._tone(783.99, 0.16, 'square', 0.07, 0.16);
  }

  lose() {
    this._tone(240, 0.14, 'sawtooth', 0.07, 0, 150);
    this._tone(145, 0.24, 'sawtooth', 0.07, 0.13, 85);
  }

  scan() {
    this._tone(440, 0.12, 'sine', 0.05, 0, 880);
    this._tone(880, 0.12, 'sine', 0.05, 0.12, 660);
  }

  fanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this._tone(n, idx === 3 ? 0.35 : 0.11, 'square', 0.07, idx * 0.09);
    });
  }
}

export const sfx = new ArcadeSoundEngine();
