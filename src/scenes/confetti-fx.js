/**
 * High-Performance Procedural Confetti Particle System
 * Zero-dependency HTML5 2D Canvas particles for Victory celebrations.
 * Automatically sleeps and clears when animation completes or modal is closed.
 */

class ConfettiFXClass {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.isActive = false;
    this.colors = [
      "#10B981", // Emerald
      "#14B8A6", // Teal
      "#38BDF8", // Sky Blue
      "#F59E0B", // Amber Gold
      "#8B5CF6", // Violet Purple
      "#EC4899", // Coral Rose
      "#F8FAFC"  // Starlight White
    ];
  }

  _initCanvas() {
    if (!this.canvas) {
      this.canvas = document.getElementById("winConfettiCanvas");
      if (this.canvas) {
        this.ctx = this.canvas.getContext("2d", { alpha: true });
      }
    }
  }

  _resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    if (this.ctx) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  /**
   * Spawns a celebration confetti burst
   * @param {Object} [options]
   * @param {number} [options.count=55] - Number of particles
   * @param {boolean} [options.isFlawless=false] - Enhanced burst for 100% efficiency
   */
  burst(options = {}) {
    this._initCanvas();
    if (!this.canvas || !this.ctx) return;

    this.stop();
    this._resize();

    const count = options.count || (options.isFlawless ? 75 : 50);
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.45; // Burst around the win card center

    this.particles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * (i / count)) + (Math.random() * 0.4 - 0.2);
      const speed = 4 + Math.random() * 9;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const shapeType = Math.random() > 0.4 ? "rect" : (Math.random() > 0.5 ? "circle" : "diamond");

      this.particles.push({
        x: originX + (Math.random() * 40 - 20),
        y: originY + (Math.random() * 30 - 15),
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.6),
        vy: (Math.sin(angle) * speed * (0.8 + Math.random() * 0.6)) - (Math.random() * 4 + 2), // Initial upward thrust
        gravity: 0.22 + Math.random() * 0.08,
        drag: 0.982,
        size: 5 + Math.random() * 6,
        color,
        shapeType,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() * 0.12 - 0.06),
        vRotY: (Math.random() * 0.14 - 0.07),
        vRotZ: (Math.random() * 0.10 - 0.05),
        alpha: 1.0,
        decay: 0.009 + Math.random() * 0.008
      });
    }

    this.isActive = true;
    this._loop();
  }

  _loop() {
    if (!this.isActive || !this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let livingCount = 0;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.vx *= p.drag;
      p.vy = (p.vy * p.drag) + p.gravity;
      p.x += p.vx;
      p.y += p.vy;

      p.rotX += p.vRotX;
      p.rotY += p.vRotY;
      p.rotZ += p.vRotZ;

      p.alpha -= p.decay;

      if (p.alpha > 0.01 && p.y < window.innerHeight + 50) {
        livingCount++;
        this._drawParticle(p);
      }
    }

    if (livingCount > 0 && this.isActive) {
      this.animationId = requestAnimationFrame(() => this._loop());
    } else {
      this.stop();
    }
  }

  _drawParticle(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotZ);
    // 3D perspective squish via scale transform
    ctx.scale(Math.cos(p.rotX), Math.sin(p.rotY));
    ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
    ctx.fillStyle = p.color;

    const s = p.size;
    if (p.shapeType === "rect") {
      ctx.fillRect(-s / 2, -s / 2, s, s * 1.3);
    } else if (p.shapeType === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shapeType === "diamond") {
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.7, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.7, 0);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Instantly stops animation and clears canvas to conserve battery/memory.
   */
  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.particles = [];
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
}

export const ConfettiFX = new ConfettiFXClass();
