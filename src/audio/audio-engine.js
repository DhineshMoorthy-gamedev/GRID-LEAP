/**
 * Grid Leap — Procedural Audio Engine
 *
 * Real-time synthesis via Web Audio API.
 * Zero external audio assets (no MP3/OGG/WAV).
 * Fully self-disconnecting audio nodes with strict concurrency and throttling limits.
 */

import { GameState } from "../state/game-state.js";

class ProceduralAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.unlocked = false;
    this.throttles = new Map();
    this.activeNodes = 0;
    this.MAX_ACTIVE_NODES = 32;
    this.masterVolume = 1.0;
  }

  /**
   * Initializes audio engine and registers unlock listeners for mobile / iOS / Capacitor.
   */
  init() {
    if (typeof window === "undefined") return;

    const unlockEvents = ["pointerdown", "touchstart", "touchend", "click", "keydown"];
    const unlock = () => {
      const ctx = this._getCtx();
      if (!ctx) return;

      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      // iOS Safari hardware audio pipeline unlock trick: play 1 frame of silence
      try {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
      } catch (_) {}

      if (ctx.state === "running") {
        this.unlocked = true;
        unlockEvents.forEach(evt => window.removeEventListener(evt, unlock, { capture: true }));
      }
    };

    unlockEvents.forEach(evt => window.addEventListener(evt, unlock, { passive: true, capture: true }));
  }

  /**
   * Lazily instantiates and returns the shared AudioContext.
   */
  _getCtx() {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return null;

      try {
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      } catch (err) {
        console.warn("[AudioEngine] Failed to create AudioContext:", err);
        return null;
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Resumes AudioContext on user interaction or app resume.
   */
  async resume() {
    const ctx = this._getCtx();
    if (ctx && ctx.state === "suspended") {
      try {
        await ctx.resume();
        this.unlocked = true;
      } catch (_) {}
    } else if (ctx && ctx.state === "running") {
      this.unlocked = true;
    }
  }

  /**
   * Suspends AudioContext on app pause or window blur to conserve battery.
   */
  async suspend() {
    if (this.ctx && this.ctx.state === "running") {
      try {
        await this.ctx.suspend();
      } catch (_) {}
    }
  }

  /**
   * Controls master volume level (0.0 to 1.0).
   */
  setMasterVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  /**
   * Checks whether sound is enabled in user settings.
   */
  isEnabled() {
    if (!GameState || !GameState.settings) return true;
    return GameState.settings.soundEnabled !== false;
  }

  /**
   * Rate limits rapid-fire events to prevent acoustic harshness.
   */
  _checkThrottle(id, minMs) {
    const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
    const last = this.throttles.get(id) || 0;
    if (now - last < minMs) return false;
    this.throttles.set(id, now);
    return true;
  }

  /**
   * Utility helper to safely disconnect audio nodes upon playback completion.
   */
  _bindCleanup(sourceNode, ...connectedNodes) {
    this.activeNodes++;
    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      this.activeNodes = Math.max(0, this.activeNodes - 1);
      try {
        sourceNode.disconnect();
      } catch (_) {}
      for (const node of connectedNodes) {
        try {
          node.disconnect();
        } catch (_) {}
      }
    };
    sourceNode.onended = cleanup;
    setTimeout(cleanup, 2000);
  }

  // ==========================================
  // SFX-01: Leap (Tactile Crystal / Marble Grid Hop)
  // ==========================================
  playLeap() {
    if (!this.isEnabled() || !this._checkThrottle("leap", 75)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;

    // Organic micro-pitch variance (C5 ± 15 Hz)
    const baseFreq = 520 + (Math.random() * 24 - 12);

    // Primary Body: Pure tactile drop with fast initial strike snap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Pitch snap from transient (740 Hz -> baseFreq) gives the tactile "pop"
    osc.frequency.setValueAtTime(baseFreq * 1.45, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.014);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.09);
    this._bindCleanup(osc, gain);

    // Subtle glass chime overtone (2nd harmonic) for crystalline resonance
    const overtone = ctx.createOscillator();
    const overGain = ctx.createGain();

    overtone.type = "triangle";
    overtone.frequency.setValueAtTime(baseFreq * 2.0, t);

    overGain.gain.setValueAtTime(0.001, t);
    overGain.gain.linearRampToValueAtTime(0.06, t + 0.002);
    overGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    overtone.connect(overGain);
    overGain.connect(this.masterGain);

    overtone.start(t);
    overtone.stop(t + 0.05);
    this._bindCleanup(overtone, overGain);
  }

  // ==========================================
  // SFX-02: Blocked (Damped Wooden Rim Tap)
  // ==========================================
  playBlocked() {
    if (!this.isEnabled() || !this._checkThrottle("blocked", 140)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;

    // Primary low damped thud (organic wooden rim tap, no harsh buzz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(240, t);

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(145, t);
    osc1.frequency.exponentialRampToValueAtTime(80, t + 0.035);

    gain1.gain.setValueAtTime(0.001, t);
    gain1.gain.linearRampToValueAtTime(0.19, t + 0.002);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

    osc1.connect(filter);
    filter.connect(gain1);
    gain1.connect(this.masterGain);

    osc1.start(t);
    osc1.stop(t + 0.06);
    this._bindCleanup(osc1, filter, gain1);

    // Secondary subtle micro-bounce (creates a double-tap tactile boundary cue)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(110, t + 0.016);
    osc2.frequency.exponentialRampToValueAtTime(70, t + 0.048);

    gain2.gain.setValueAtTime(0.001, t + 0.016);
    gain2.gain.linearRampToValueAtTime(0.11, t + 0.018);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.058);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);

    osc2.start(t + 0.016);
    osc2.stop(t + 0.062);
    this._bindCleanup(osc2, gain2);
  }

  // ==========================================
  // SFX-03: Dead End (Clean Minor Drop + Dampened Thud)
  // ==========================================
  playDeadEnd() {
    if (!this.isEnabled() || !this._checkThrottle("deadEnd", 250)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;

    // Two clean, discrete minor bell tones (F4 -> D4) - pure notes, no pitch sliding
    const notes = [
      { freq: 350, delay: 0.00, dur: 0.18, vol: 0.18 }, // High warning chime
      { freq: 262, delay: 0.05, dur: 0.22, vol: 0.19 }  // Lower minor resolution
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(180, t);

      osc.type = "sine";
      osc.frequency.setValueAtTime(n.freq, t + n.delay);

      const start = t + n.delay;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(n.vol, start + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + n.dur + 0.02);
      this._bindCleanup(osc, filter, gain);
    });

    // Soft damped wood/heart thud underneath
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    const thudFilter = ctx.createBiquadFilter();

    thudFilter.type = "lowpass";
    thudFilter.frequency.setValueAtTime(200, t);

    thud.type = "triangle";
    thud.frequency.setValueAtTime(110, t + 0.02);
    thud.frequency.exponentialRampToValueAtTime(65, t + 0.08);

    thudGain.gain.setValueAtTime(0.001, t + 0.02);
    thudGain.gain.linearRampToValueAtTime(0.14, t + 0.026);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    thud.connect(thudFilter);
    thudFilter.connect(thudGain);
    thudGain.connect(this.masterGain);

    thud.start(t + 0.02);
    thud.stop(t + 0.18);
    this._bindCleanup(thud, thudFilter, thudGain);
  }

  // ==========================================
  // SFX-04: Win (Level Solved - Pure Crystal Chord)
  // ==========================================
  playWin() {
    if (!this.isEnabled() || !this._checkThrottle("win", 500)) return;
    const ctx = this._getCtx();
    if (!ctx) return;

    // Suppress generic modal open sound from conflicting with win fanfare
    const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
    this.throttles.set("modalOpen", now + 750);
    this.throttles.set("smoothSettleGlobal", now + 750);

    const t = ctx.currentTime;
    const totalDuration = 0.85;

    // Sub-master bus with smooth overarching exponential decay
    const busGain = ctx.createGain();
    busGain.gain.setValueAtTime(0.70, t);
    busGain.gain.setValueAtTime(0.70, t + 0.35);
    busGain.gain.exponentialRampToValueAtTime(0.00001, t + totalDuration);
    busGain.connect(this.masterGain);

    // Pure, mathematically tuned E-Major triad (329.63 Hz, 415.30 Hz, 493.88 Hz, 659.25 Hz)
    // Zero detuned beating, zero static, zero noise — pristine crystalline bloom
    const notes = [
      { freq: 329.63, delay: 0.00, vol: 0.16 }, // E4 (Root)
      { freq: 415.30, delay: 0.08, vol: 0.15 }, // G#4 (Major 3rd)
      { freq: 493.88, delay: 0.16, vol: 0.17 }, // B4 (5th)
      { freq: 659.25, delay: 0.24, vol: 0.09 }  // E5 (Octave bell touch)
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(200, t);

      osc.type = "sine";
      const start = t + n.delay;
      osc.frequency.setValueAtTime(n.freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(n.vol, start + 0.016);
      gain.gain.exponentialRampToValueAtTime(0.00001, t + totalDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(busGain);

      osc.start(start);
      osc.stop(t + totalDuration + 0.02);
      this._bindCleanup(osc, filter, gain);
    });

    // Cleanup the bus node
    setTimeout(() => {
      try { busGain.disconnect(); } catch (_) {}
    }, (totalDuration + 0.05) * 1000);
  }

  // ==========================================
  // SFX-05: Out of Lives (Melancholy Minor Mirror of Win)
  // ==========================================
  playOutOfLives() {
    if (!this.isEnabled() || !this._checkThrottle("outOfLives", 600)) return;
    const ctx = this._getCtx();
    if (!ctx) return;

    // Suppress generic modal open sound from conflicting with out of lives dirge
    const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
    this.throttles.set("modalOpen", now + 800);
    this.throttles.set("smoothSettleGlobal", now + 800);

    const t = ctx.currentTime;
    const totalDuration = 0.90;

    // Sub-master bus for silky smooth tail fade
    const busGain = ctx.createGain();
    busGain.gain.setValueAtTime(0.70, t);
    busGain.gain.setValueAtTime(0.70, t + 0.38);
    busGain.gain.exponentialRampToValueAtTime(0.00001, t + totalDuration);
    busGain.connect(this.masterGain);

    // Poignant minor resolution phrase: E4 -> G4 -> C5 -> B4
    // Shares Win's root (E4) and climax (B4), but in solemn E minor with a weeping sigh
    const notes = [
      { freq: 329.63, delay: 0.00, vol: 0.16 }, // E4 (unifying root with Win)
      { freq: 392.00, delay: 0.08, vol: 0.15 }, // G4 (minor 3rd establishing defeat)
      { freq: 523.25, delay: 0.16, vol: 0.16 }, // C5 (mournful minor 6th sigh)
      { freq: 493.88, delay: 0.26, vol: 0.17 }  // B4 (tender resolution to 5th, forming E minor)
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(200, t);

      osc.type = "sine";
      const start = t + n.delay;
      osc.frequency.setValueAtTime(n.freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(n.vol, start + 0.016);
      gain.gain.exponentialRampToValueAtTime(0.00001, t + totalDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(busGain);

      osc.start(start);
      osc.stop(t + totalDuration + 0.02);
      this._bindCleanup(osc, filter, gain);
    });

    setTimeout(() => {
      try { busGain.disconnect(); } catch (_) {}
    }, (totalDuration + 0.05) * 1000);
  }

  // ==========================================
  // SFX-06: Undo (Rewind last step)
  // ==========================================
  playUndo() {
    if (!this.isEnabled() || !this._checkThrottle("undo", 80)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;
    const drops = [
      { freq: 587.33, delay: 0.000, dur: 0.075, vol: 0.18 },
      { freq: 392.00, delay: 0.035, dur: 0.095, vol: 0.19 }
    ];

    drops.forEach(d => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(180, t);

      osc.type = "sine";
      const start = t + d.delay;
      osc.frequency.setValueAtTime(d.freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(d.vol, start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.00001, start + d.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + d.dur + 0.01);
      this._bindCleanup(osc, filter, gain);
    });
  }

  // ==========================================
  // SFX-07: Restart (Fresh Board Wipe / Clean Tile Sweep)
  // ==========================================
  playRestart() {
    if (!this.isEnabled() || !this._checkThrottle("restart", 180)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    // Suppress generic modal close sound if restart was triggered from inside a modal
    const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
    this.throttles.set("modalClose", now + 300);
    this.throttles.set("smoothSettleGlobal", now + 300);

    const t = ctx.currentTime;

    // Fast, crisp 3-tone fresh board cascade (G4 -> C5 -> E5) - zero noise
    const pings = [
      { freq: 392, delay: 0.000, dur: 0.07, vol: 0.15 }, // G4
      { freq: 523, delay: 0.028, dur: 0.08, vol: 0.16 }, // C5
      { freq: 659, delay: 0.056, dur: 0.11, vol: 0.18 }  // E5
    ];

    pings.forEach(p => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const start = t + p.delay;
      osc.frequency.setValueAtTime(p.freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(p.vol, start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, start + p.dur);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + p.dur + 0.01);
      this._bindCleanup(osc, gain);
    });

    // Gentle grounding root sine undertone (C4 261.63 Hz) for tactile reset feel without noise
    const base = ctx.createOscillator();
    const baseGain = ctx.createGain();
    base.type = "sine";
    base.frequency.setValueAtTime(261.63, t + 0.028);

    baseGain.gain.setValueAtTime(0.001, t + 0.028);
    baseGain.gain.linearRampToValueAtTime(0.11, t + 0.035);
    baseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    base.connect(baseGain);
    baseGain.connect(this.masterGain);
    base.start(t + 0.028);
    base.stop(t + 0.13);
    this._bindCleanup(base, baseGain);
  }

  // ==========================================
  // SFX-08: Level Start (Harmonic chime)
  // ==========================================
  playLevelStart() {
    this._playStartChime("levelStart", 250);
  }

  // ==========================================
  // SFX-28: Radial Tile Grow (Concentric Grid Expansion)
  // ==========================================
  playRadialTileGrow(ringCount = 4, ringStepMs = 90) {
    if (!this.isEnabled() || !this._checkThrottle("tileGrow", 250)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;
    const totalRings = Math.max(1, Math.min(6, ringCount));
    const stepSec = (ringStepMs || 90) / 1000;
    const totalDuration = (totalRings * stepSec) + 0.16;

    // Sub-master bus for overarching smooth fade
    const busGain = ctx.createGain();
    busGain.gain.setValueAtTime(0.80, t);
    busGain.gain.setValueAtTime(0.80, t + (totalRings * stepSec));
    busGain.gain.exponentialRampToValueAtTime(0.0001, t + totalDuration);
    busGain.connect(this.masterGain);

    // Harmonically coherent ascending cascade (C4 -> E4 -> G4 -> C5 -> E5 -> G5)
    // Pure, soothing crystalline marimba drops matching radial ring expansion
    const scale = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];

    for (let r = 0; r < totalRings; r++) {
      const delay = r * stepSec;
      const start = t + delay;
      const freq = scale[r % scale.length];

      // Primary delicate glass bead / droplet tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(180, t);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.075);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(busGain);

      osc.start(start);
      osc.stop(start + 0.08);
      this._bindCleanup(osc, filter, gain);

      // Subtle overtone for tactile presence
      const over = ctx.createOscillator();
      const overGain = ctx.createGain();
      over.type = "triangle";
      over.frequency.setValueAtTime(freq * 2, start);

      overGain.gain.setValueAtTime(0.0001, start);
      overGain.gain.linearRampToValueAtTime(0.03, start + 0.002);
      overGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.040);

      over.connect(overGain);
      overGain.connect(busGain);

      over.start(start);
      over.stop(start + 0.045);
      this._bindCleanup(over, overGain);
    }

    setTimeout(() => {
      try { busGain.disconnect(); } catch (_) {}
    }, (totalDuration + 0.05) * 1000);
  }

  // ==========================================
  // SFX-09: Next Level (Forward Harmonic Progression)
  // ==========================================
  playNextLevel() {
    if (!this.isEnabled() || !this._checkThrottle("nextLevel", 350)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    // Suppress redundant immediate levelStart chime from startLevel() and modalClose
    const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
    this.throttles.set("levelStart", now + 550);
    this.throttles.set("modalClose", now + 350);
    this.throttles.set("smoothSettleGlobal", now + 350);

    const t = ctx.currentTime;
    const totalDuration = 0.38;

    // Sub-master bus with smooth exponential fadeout
    const busGain = ctx.createGain();
    busGain.gain.setValueAtTime(0.70, t);
    busGain.gain.setValueAtTime(0.70, t + 0.16);
    busGain.gain.exponentialRampToValueAtTime(0.00001, t + totalDuration);
    busGain.connect(this.masterGain);

    // Warm, uplifting, forward-propelling ascent in C Major (C4 -> G4 -> C5)
    // Pure sine tones in comfortable mid-range, harmonically preceding radial tile grow
    const notes = [
      { freq: 261.63, delay: 0.000, dur: 0.22, vol: 0.14 }, // C4
      { freq: 392.00, delay: 0.045, dur: 0.24, vol: 0.15 }, // G4 (perfect 5th)
      { freq: 523.25, delay: 0.090, dur: 0.26, vol: 0.16 }  // C5 (pure octave lift)
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(180, t);

      osc.type = "sine";
      const start = t + n.delay;
      osc.frequency.setValueAtTime(n.freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(n.vol, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.00001, start + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(busGain);

      osc.start(start);
      osc.stop(start + n.dur + 0.02);
      this._bindCleanup(osc, filter, gain);
    });

    setTimeout(() => {
      try { busGain.disconnect(); } catch (_) {}
    }, (totalDuration + 0.05) * 1000);
  }

  // ==========================================
  // SFX-10: Daily Start (Harmonic chime)
  // ==========================================
  playDailyStart() {
    this._playStartChime("dailyStart", 300);
  }

  /**
   * Shared harmonic chime (E4 330 Hz + A4 440 Hz harmony)
   */
  _playStartChime(throttleKey, minMs) {
    if (!this.isEnabled() || !this._checkThrottle(throttleKey, minMs)) return;
    const ctx = this._getCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [
      { freq: 330, delay: 0.00, dur: 0.22, vol: 0.17 },
      { freq: 440, delay: 0.06, dur: 0.18, vol: 0.15 }
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(200, t);

      osc.type = "sine";
      osc.frequency.setValueAtTime(n.freq, t + n.delay);

      const start = t + n.delay;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(n.vol, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + n.dur + 0.01);
      this._bindCleanup(osc, filter, gain);
    });
  }

  // ==========================================
  // SFX-11: Tutorial Success (Lesson solved)
  // ==========================================
  playTutorialSuccess() {
    if (!this.isEnabled() || !this._checkThrottle("tutSuccess", 200)) return;
    const ctx = this._getCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [
      { freq: 330, delay: 0.00, dur: 0.22, vol: 0.17 },
      { freq: 440, delay: 0.07, dur: 0.20, vol: 0.15 }
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(200, t);

      osc.type = "sine";
      osc.frequency.setValueAtTime(n.freq, t + n.delay);

      const start = t + n.delay;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(n.vol, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + n.dur + 0.01);
      this._bindCleanup(osc, filter, gain);
    });
  }

  // ==========================================
  // SFX-12: Tutorial Wrong (Lesson incorrect move - Damped soft tap)
  // ==========================================
  playTutorialWrong() {
    if (!this.isEnabled() || !this._checkThrottle("tutWrong", 180)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(220, t);

    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.05);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.07);
    this._bindCleanup(osc, filter, gain);
  }

  // ==========================================
  // SFX-13: Tutorial Complete (All lessons completed)
  // ==========================================
  playTutorialComplete() {
    if (!this.isEnabled() || !this._checkThrottle("tutComplete", 600)) return;
    const ctx = this._getCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const totalDuration = 0.60;

    const busGain = ctx.createGain();
    busGain.gain.setValueAtTime(0.70, t);
    busGain.gain.setValueAtTime(0.70, t + 0.30);
    busGain.gain.exponentialRampToValueAtTime(0.0001, t + totalDuration);
    busGain.connect(this.masterGain);

    const notes = [
      { freq: 330, delay: 0.00, dur: 0.50, vol: 0.18 },
      { freq: 415, delay: 0.07, dur: 0.44, vol: 0.16 },
      { freq: 550, delay: 0.14, dur: 0.46, vol: 0.19 }
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(220, t);

      osc.type = "sine";
      osc.frequency.setValueAtTime(n.freq, t + n.delay);

      const start = t + n.delay;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(n.vol, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + totalDuration - 0.02);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(busGain);

      osc.start(start);
      osc.stop(t + totalDuration);
      this._bindCleanup(osc, filter, gain);
    });

    setTimeout(() => {
      try { busGain.disconnect(); } catch (_) {}
    }, (totalDuration + 0.05) * 1000);
  }

  // ==========================================
  // SFX-14: Hint On (Compass activated)
  // ==========================================
  playHintOn() {
    if (!this.isEnabled() || !this._checkThrottle("hintOn", 200)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(350, t);
    filter.Q.setValueAtTime(1.2, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.17, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    // Primary triangle tone
    const oscA = ctx.createOscillator();
    oscA.type = "triangle";
    oscA.frequency.setValueAtTime(280, t);

    // Harmonic sine
    const oscB = ctx.createOscillator();
    const gainB = ctx.createGain();
    gainB.gain.setValueAtTime(0.40, t); // balance ratio
    oscB.type = "sine";
    oscB.frequency.setValueAtTime(420, t);

    oscA.connect(filter);
    oscB.connect(gainB);
    gainB.connect(filter);

    filter.connect(gain);
    gain.connect(this.masterGain);

    oscA.start(t);
    oscA.stop(t + 0.185);
    oscB.start(t);
    oscB.stop(t + 0.16);

    this._bindCleanup(oscA, oscB, gainB, filter, gain);
  }

  // ==========================================
  // SFX-15: Trapped (Hint attempted while trapped)
  // ==========================================
  playTrapped() {
    if (!this.isEnabled() || !this._checkThrottle("trapped", 250)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;

    const oscA = ctx.createOscillator();
    const gainA = ctx.createGain();
    oscA.type = "sine";
    oscA.frequency.setValueAtTime(280, t);
    oscA.frequency.linearRampToValueAtTime(235, t + 0.16);

    gainA.gain.setValueAtTime(0.001, t);
    gainA.gain.linearRampToValueAtTime(0.17, t + 0.008);
    gainA.gain.setValueAtTime(0.17, t + 0.08);
    gainA.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

    oscA.connect(gainA);
    gainA.connect(this.masterGain);
    oscA.start(t);
    oscA.stop(t + 0.245);
    this._bindCleanup(oscA, gainA);

    // Detuned beat frequency (creates unresolved dissonance)
    const oscB = ctx.createOscillator();
    const gainB = ctx.createGain();
    oscB.type = "sine";
    oscB.frequency.setValueAtTime(285, t);

    gainB.gain.setValueAtTime(0.001, t);
    gainB.gain.linearRampToValueAtTime(0.05, t + 0.008);
    gainB.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    oscB.connect(gainB);
    gainB.connect(this.masterGain);
    oscB.start(t);
    oscB.stop(t + 0.165);
    this._bindCleanup(oscB, gainB);
  }

  // ==========================================
  // SFX-16: Modal Open (Smooth Settle Chime)
  // ==========================================
  playModalOpen() {
    this._playSmoothSettle("modalOpen", 120);
  }

  // ==========================================
  // SFX-17: Modal Close (Smooth Settle Chime)
  // ==========================================
  playModalClose() {
    this._playSmoothSettle("modalClose", 120);
  }

  // ==========================================
  // SFX-20: Theme Switch (Smooth Settle Chime)
  // ==========================================
  playThemeSwitch() {
    this._playSmoothSettle("themeSwitch", 180);
  }

  // ==========================================
  // SFX-28B: UI Button / Tile Tap Feedback
  // ==========================================
  playTap() {
    this._playSmoothSettle("uiTap", 60);
  }

  // ==========================================
  // SFX-29: Navigation Back (Smooth Settle Chime)
  // ==========================================
  playNavBack() {
    this._playSmoothSettle("navBack", 120);
  }

  /**
   * Shared smooth settle chime (G4 392 Hz -> C4 261.63 Hz descending fifth)
   * Used for modalOpen, modalClose, themeSwitch, and navBack.
   */
  _playSmoothSettle(throttleKey, minMs = 120) {
    if (!this.isEnabled() || !this._checkThrottle("smoothSettleGlobal", 80) || !this._checkThrottle(throttleKey, minMs)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;
    const totalDuration = 0.22;

    const busGain = ctx.createGain();
    busGain.gain.setValueAtTime(1.0, t);
    busGain.gain.setValueAtTime(1.0, t + 0.10);
    busGain.gain.exponentialRampToValueAtTime(0.0001, t + totalDuration);
    busGain.connect(this.masterGain);

    // Pure descending smooth settle (G4 -> C4)
    const notes = [
      { freq: 392.00, delay: 0.000, dur: 0.17, vol: 0.13 }, // G4
      { freq: 261.63, delay: 0.032, dur: 0.18, vol: 0.14 }  // C4
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const start = t + n.delay;
      osc.frequency.setValueAtTime(n.freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(n.vol, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + n.dur);

      osc.connect(gain);
      gain.connect(busGain);

      osc.start(start);
      osc.stop(start + n.dur + 0.01);
      this._bindCleanup(osc, gain);
    });

    setTimeout(() => {
      try { busGain.disconnect(); } catch (_) {}
    }, (totalDuration + 0.05) * 1000);
  }

  // ==========================================
  // SFX-21: Trail Toggle (Soft UI tick)
  // ==========================================
  playTrailToggle() {
    if (!this.isEnabled() || !this._checkThrottle("trailToggle", 120)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "highpass";
    filter.frequency.setValueAtTime(300, t);

    osc.type = "sine";
    osc.frequency.setValueAtTime(580, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.028);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.032);
    this._bindCleanup(osc, filter, gain);
  }

  // ==========================================
  // SFX-23: Life Granted (Reward blip)
  // ==========================================
  playLifeGranted() {
    if (!this.isEnabled() || !this._checkThrottle("lifeGranted", 300)) return;
    const ctx = this._getCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [
      { freq: 330, delay: 0.00, dur: 0.20, vol: 0.18 },
      { freq: 495, delay: 0.08, dur: 0.17, vol: 0.16 }
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(200, t);

      osc.type = "sine";
      osc.frequency.setValueAtTime(n.freq, t + n.delay);

      const start = t + n.delay;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(n.vol, start + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + n.dur + 0.01);
      this._bindCleanup(osc, filter, gain);
    });
  }

  // ==========================================
  // SFX-24: Editor Tick (Cell painted)
  // ==========================================
  playEditorTick() {
    if (!this.isEnabled() || !this._checkThrottle("editorTick", 40)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.026);
    this._bindCleanup(osc, gain);
  }

  // ==========================================
  // SFX-25: Editor Solvable
  // ==========================================
  playEditorSolvable() {
    if (!this.isEnabled() || !this._checkThrottle("editorSolvable", 200)) return;
    const ctx = this._getCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const notes = [
      { freq: 330, delay: 0.00, dur: 0.18, vol: 0.18 },
      { freq: 440, delay: 0.06, dur: 0.15, vol: 0.16 }
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "highpass";
      filter.frequency.setValueAtTime(200, t);

      osc.type = "sine";
      osc.frequency.setValueAtTime(n.freq, t + n.delay);

      const start = t + n.delay;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(n.vol, start + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + n.dur + 0.01);
      this._bindCleanup(osc, filter, gain);
    });
  }

  // ==========================================
  // SFX-26: Editor Unsolvable
  // ==========================================
  playEditorUnsolvable() {
    if (!this.isEnabled() || !this._checkThrottle("editorUnsolvable", 200)) return;
    const ctx = this._getCtx();
    if (!ctx || this.activeNodes >= this.MAX_ACTIVE_NODES) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(175, t + 0.12);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.145);
    this._bindCleanup(osc, gain);
  }

  // ==========================================
  // SFX-27: Editor Export (Clipboard copied)
  // ==========================================
  playEditorExport() {
    if (!this.isEnabled() || !this._checkThrottle("editorExport", 150)) return;
    const ctx = this._getCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    const ticks = [
      { freq: 900, delay: 0.00, dur: 0.025, vol: 0.15 },
      { freq: 1100, delay: 0.03, dur: 0.025, vol: 0.13 }
    ];

    ticks.forEach(tick => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(tick.freq, t + tick.delay);

      const start = t + tick.delay;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(tick.vol, start + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.001, start + tick.dur);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + tick.dur + 0.005);
      this._bindCleanup(osc, gain);
    });
  }

  // ==========================================
  // SFX-28: Achievement Unlocked Fanfare
  // ==========================================
  playAchievementUnlocked() {
    if (!this.isEnabled() || !this._checkThrottle("achievementUnlocked", 400)) return;
    const ctx = this._getCtx();
    if (!ctx) return;

    const t = ctx.currentTime;
    // Ascending celebratory major arpeggio with shimmering chime decay (C5, E5, G5, C6)
    const notes = [
      { freq: 523.25, delay: 0.00, dur: 0.18, vol: 0.22 }, // C5
      { freq: 659.25, delay: 0.08, dur: 0.20, vol: 0.25 }, // E5
      { freq: 783.99, delay: 0.16, dur: 0.24, vol: 0.28 }, // G5
      { freq: 1046.50, delay: 0.24, dur: 0.55, vol: 0.32 } // C6 (long ring)
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(note.freq, t + note.delay);

      const start = t + note.delay;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(note.vol, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.dur);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + note.dur + 0.05);
      this._bindCleanup(osc, gain);
    });
  }
}

export const AudioEngine = new ProceduralAudioEngine();
