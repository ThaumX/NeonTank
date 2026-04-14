/* ============================================================
   NEON TANK  –  Phaser 3 Side-Scrolling Combat Game
   All textures generated programmatically (no external assets)
   ============================================================ */

'use strict';

// ── Constants ─────────────────────────────────────────────────
const GW = 1280;
const GH = 720;

// ── Tank definitions ──────────────────────────────────────────
const TANK_DATA = [
  {
    id: 'scout', name: 'SCOUT', desc: 'Fast & Agile',
    health: 80, speed: 280, jumpVel: -580,
    weaponType: 'cannon', fireRate: 500, bulletSpeed: 750,
    bulletDamage: 25, bulletW: 16, bulletH: 8,
    color: 0x00ffff, cost: 0
  },
  {
    id: 'heavy', name: 'HEAVY', desc: 'Armored Beast',
    health: 200, speed: 150, jumpVel: -500,
    weaponType: 'cannon', fireRate: 1200, bulletSpeed: 900,
    bulletDamage: 70, bulletW: 18, bulletH: 10,
    color: 0xff00ff, cost: 50
  },
  {
    id: 'gunner', name: 'GUNNER', desc: 'Rapid Fire',
    health: 120, speed: 230, jumpVel: -560,
    weaponType: 'machinegun', fireRate: 90, bulletSpeed: 1100,
    bulletDamage: 7, bulletW: 8, bulletH: 4,
    color: 0xffff00, cost: 100
  },
  {
    id: 'rocketeer', name: 'ROCKETEER', desc: 'Explosive Power',
    health: 150, speed: 190, jumpVel: -540,
    weaponType: 'rocket', fireRate: 900, bulletSpeed: 550,
    bulletDamage: 90, bulletW: 20, bulletH: 7,
    color: 0xff6600, cost: 150
  },
  {
    id: 'mortar', name: 'MORTAR KING', desc: 'Arcing Death',
    health: 170, speed: 140, jumpVel: -480,
    weaponType: 'mortar', fireRate: 2000, bulletSpeed: 600,
    bulletDamage: 110, bulletW: 14, bulletH: 14,
    color: 0x00ff88, cost: 250
  }
];

// ── Enemy definitions ─────────────────────────────────────────
const ENEMY_DATA = {
  rifleman: {
    name: 'Rifleman', health: 20, speed: 70,
    detectRange: 550, attackRange: 380,
    fireRate: 1800, damage: 5, bulletSpeed: 480, bulletType: 'rifle',
    reward: 1, color: 0xff3344, isTank: false, w: 24, h: 40
  },
  heavy_soldier: {
    name: 'Heavy Soldier', health: 60, speed: 45,
    detectRange: 480, attackRange: 320,
    fireRate: 350, damage: 4, bulletSpeed: 600, bulletType: 'rifle',
    reward: 3, color: 0xff7700, isTank: false, w: 28, h: 44
  },
  bazooka: {
    name: 'Bazooka Man', health: 40, speed: 55,
    detectRange: 700, attackRange: 580,
    fireRate: 2800, damage: 45, bulletSpeed: 420, bulletType: 'enemy_rocket',
    reward: 5, color: 0xcc00ff, isTank: false, w: 24, h: 42
  },
  scout_tank: {
    name: 'Scout Tank', health: 150, speed: 110,
    detectRange: 800, attackRange: 550,
    fireRate: 2200, damage: 35, bulletSpeed: 700, bulletType: 'enemy_cannon',
    reward: 12, color: 0xff3344, isTank: true, w: 80, h: 44
  },
  heavy_tank: {
    name: 'Heavy Tank', health: 350, speed: 65,
    detectRange: 900, attackRange: 700,
    fireRate: 3500, damage: 90, bulletSpeed: 850, bulletType: 'enemy_cannon',
    reward: 30, color: 0x880000, isTank: true, w: 112, h: 58
  }
};

// ─────────────────────────────────────────────────────────────
// Utility: save/load
// ─────────────────────────────────────────────────────────────
function loadSave() {
  try {
    const d = JSON.parse(localStorage.getItem('neonTankSave') || '{}');
    return {
      highScore:     d.highScore     || 0,
      totalKills:    d.totalKills    || 0,
      kills:         d.kills         || 0,
      selectedTank:  d.selectedTank  || 'scout',
      unlockedTanks: d.unlockedTanks || ['scout']
    };
  } catch (_) {
    return { highScore: 0, totalKills: 0, kills: 0, selectedTank: 'scout', unlockedTanks: ['scout'] };
  }
}
function persistSave(data) {
  try { localStorage.setItem('neonTankSave', JSON.stringify(data)); } catch (_) {}
}

// ─────────────────────────────────────────────────────────────
// BOOT SCENE  –  build all textures procedurally
// ─────────────────────────────────────────────────────────────
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    this._makeTankTextures();
    this._makeEnemyTextures();
    this._makeBulletTextures();
    this._makeEnvTextures();
    this._makeUITextures();
    this.scene.start('MainMenu');
  }

  // ── helpers ──────────────────────────────────────────────
  g(w, h) {
    return this.make.graphics({ x: 0, y: 0, add: false });
  }
  tex(g, key, w, h) {
    g.generateTexture(key, w, h);
    g.destroy();
  }

  // ── tank textures ─────────────────────────────────────────
  _makeTankTextures() {
    TANK_DATA.forEach(tank => {
      const W = 80, H = 44;
      const g = this.g(W, H);
      const c = tank.color;

      // hull fill
      g.fillStyle(0x0a0a22);
      g.fillRect(0, 14, W, 26);
      // hull neon border
      g.lineStyle(2, c, 1);
      g.strokeRect(0, 14, W, 26);

      // track bottom
      g.fillStyle(0x151530);
      g.fillRect(2, 34, W - 4, 10);
      g.lineStyle(1, c, 0.5);
      for (let tx = 4; tx < W - 4; tx += 8) {
        g.strokeRect(tx, 35, 6, 8);
      }

      // turret
      const tw = 36, th = 16, ttx = W / 2 - tw / 2 + 6, tty = 2;
      g.fillStyle(0x0a0a22);
      g.fillRect(ttx, tty, tw, th);
      g.lineStyle(2, c, 1);
      g.strokeRect(ttx, tty, tw, th);

      // barrel
      this._drawBarrel(g, tank.weaponType, ttx + tw, tty + th / 2, c);

      // panel details
      g.lineStyle(1, c, 0.3);
      g.lineBetween(18, 16, 18, 38);
      g.lineBetween(62, 16, 62, 38);

      this.tex(g, `tank_${tank.id}`, W, H);
    });
  }

  _drawBarrel(g, type, bx, by, c) {
    if (type === 'cannon') {
      g.lineStyle(4, c, 0.9);
      g.lineBetween(bx, by, bx + 28, by);
    } else if (type === 'machinegun') {
      g.lineStyle(2, c, 1);
      g.lineBetween(bx, by - 2, bx + 20, by - 2);
      g.lineBetween(bx, by + 2, bx + 22, by + 2);
    } else if (type === 'rocket') {
      g.lineStyle(5, c, 0.85);
      g.lineBetween(bx, by, bx + 24, by);
      g.lineStyle(1, 0xffffff, 0.6);
      g.lineBetween(bx + 20, by - 4, bx + 25, by);
      g.lineBetween(bx + 20, by + 4, bx + 25, by);
    } else if (type === 'mortar') {
      g.lineStyle(6, c, 0.9);
      g.lineBetween(bx - 2, by + 4, bx + 10, by - 12);
    }
  }

  // ── enemy textures ────────────────────────────────────────
  _makeEnemyTextures() {
    // Stick-figure soldiers
    const soldiers = ['rifleman', 'heavy_soldier', 'bazooka'];
    soldiers.forEach(key => {
      const d = ENEMY_DATA[key];
      const W = d.w, H = d.h;
      const g = this.g(W, H);
      const c = d.color;
      const cx = W / 2;

      // head
      g.lineStyle(2, c, 1);
      g.strokeCircle(cx, 5, 4);
      g.fillStyle(c, 0.15);
      g.fillCircle(cx, 5, 4);

      // helmet brim line
      g.lineStyle(2, c, 0.7);
      g.lineBetween(cx - 5, 3, cx + 5, 3);

      // body
      g.lineStyle(2, c, 1);
      g.lineBetween(cx, 9, cx, H * 0.62);

      // shoulder line
      const sy = 14;
      g.lineBetween(cx - 8, sy, cx + 8, sy);

      // arms & weapon
      if (key === 'rifleman') {
        g.lineBetween(cx + 8, sy, cx + 12, sy + 6);
        g.lineStyle(2, 0xaabbaa, 0.9);
        g.lineBetween(cx + 10, sy + 4, cx + W * 0.8, sy + 2);
      } else if (key === 'heavy_soldier') {
        g.lineStyle(3, c, 1);
        g.lineBetween(cx + 8, sy, cx + 12, sy + 2);
        g.lineStyle(3, 0xffaa00, 0.9);
        g.lineBetween(cx + 10, sy + 1, cx + W * 0.85, sy - 2);
        g.lineBetween(cx + 10, sy + 1, cx + W * 0.85, sy + 3);
      } else { // bazooka
        g.lineStyle(2, c, 1);
        g.lineBetween(cx + 8, sy, cx + 12, sy - 2);
        g.lineStyle(4, 0xcc00ff, 0.9);
        g.lineBetween(cx - 4, sy - 7, cx + W * 0.9, sy - 7);
      }

      // left arm
      g.lineStyle(2, c, 1);
      g.lineBetween(cx - 8, sy, cx - 10, sy + 8);

      // legs
      const hy = Math.round(H * 0.62);
      g.lineBetween(cx, hy, cx - 5, H - 2);
      g.lineBetween(cx, hy, cx + 5, H - 2);

      this.tex(g, `enemy_${key}`, W, H);
    });

    // Enemy tanks
    ['scout_tank', 'heavy_tank'].forEach(key => {
      const d = ENEMY_DATA[key];
      const W = d.w, H = d.h;
      const scale = W / 80;
      const g = this.g(W, H);
      const c = d.color;

      const hullTop = Math.round(14 * scale);
      const hullH   = Math.round(26 * scale);
      g.fillStyle(0x1a0808);
      g.fillRect(0, hullTop, W, hullH);
      g.lineStyle(2, c, 1);
      g.strokeRect(0, hullTop, W, hullH);

      // tracks
      const trkY = hullTop + hullH - Math.round(8 * scale);
      g.fillStyle(0x220808);
      g.fillRect(2, trkY, W - 4, Math.round(10 * scale));
      g.lineStyle(1, c, 0.5);
      const step = Math.round(8 * scale);
      for (let tx = 4; tx < W - 4; tx += step) {
        g.strokeRect(tx, trkY + 1, step - 2, Math.round(8 * scale));
      }

      // turret
      const ttW = Math.round(36 * scale), ttH = Math.round(16 * scale);
      const ttX = Math.round(W / 2 - ttW / 2 + 4 * scale);
      const ttY = Math.round(2 * scale);
      g.fillStyle(0x1a0808);
      g.fillRect(ttX, ttY, ttW, ttH);
      g.lineStyle(2, c, 1);
      g.strokeRect(ttX, ttY, ttW, ttH);

      // barrel
      g.lineStyle(Math.max(2, Math.round(3 * scale)), c, 1);
      g.lineBetween(ttX + ttW, ttY + ttH / 2, ttX + ttW + Math.round(26 * scale), ttY + ttH / 2);

      this.tex(g, `enemy_${key}`, W, H);
    });
  }

  // ── bullet textures ───────────────────────────────────────
  _makeBulletTextures() {
    const specs = [
      { key: 'cannon',       W: 16, H:  8, color: 0xffdd00, shape: 'rect' },
      { key: 'machinegun',   W:  8, H:  4, color: 0x00ffff, shape: 'rect' },
      { key: 'rocket',       W: 20, H:  7, color: 0xff6600, shape: 'rocket' },
      { key: 'mortar',       W: 14, H: 14, color: 0x00ff88, shape: 'circle' },
      { key: 'rifle',        W:  6, H:  3, color: 0xff3344, shape: 'rect' },
      { key: 'enemy_cannon', W: 14, H:  7, color: 0xff5555, shape: 'rect' },
      { key: 'enemy_rocket', W: 18, H:  6, color: 0xcc00ff, shape: 'rocket' }
    ];

    specs.forEach(s => {
      const g = this.g(s.W, s.H);
      if (s.shape === 'circle') {
        g.fillStyle(s.color, 0.9);
        g.fillCircle(s.W / 2, s.H / 2, s.W / 2 - 1);
        g.lineStyle(2, 0xffffff, 0.6);
        g.strokeCircle(s.W / 2, s.H / 2, s.W / 2 - 1);
      } else if (s.shape === 'rocket') {
        g.fillStyle(s.color, 0.9);
        g.fillRect(0, 1, s.W - 4, s.H - 2);
        g.fillStyle(0xff2200, 0.85);
        g.fillRect(s.W - 4, 0, 5, s.H);
        g.lineStyle(1, 0xffffff, 0.6);
        g.strokeRect(0, 1, s.W - 4, s.H - 2);
      } else {
        g.fillStyle(s.color, 0.95);
        g.fillRect(0, 0, s.W, s.H);
        g.lineStyle(1, 0xffffff, 0.4);
        g.strokeRect(0, 0, s.W, s.H);
      }
      this.tex(g, `bullet_${s.key}`, s.W, s.H);
    });
  }

  // ── environment textures ──────────────────────────────────
  _makeEnvTextures() {
    // Scrolling background (grid + faint stars)
    {
      const g = this.g(256, 256);
      g.fillStyle(0x000008, 1);
      g.fillRect(0, 0, 256, 256);
      g.lineStyle(1, 0x0a0a3a, 1);
      for (let x = 0; x < 256; x += 32) g.lineBetween(x, 0, x, 256);
      for (let y = 0; y < 256; y += 32) g.lineBetween(0, y, 256, y);
      g.fillStyle(0xffffff, 0.7);
      for (let i = 0; i < 40; i++) {
        g.fillRect(Phaser.Math.Between(0, 255), Phaser.Math.Between(0, 255), 1, 1);
      }
      this.tex(g, 'bg', 256, 256);
    }

    // Ground tile (32×32, drawn on terrain chunks in code)
    {
      const g = this.g(32, 32);
      g.fillStyle(0x020214, 1);
      g.fillRect(0, 0, 32, 32);
      g.lineStyle(1, 0x00ffff, 0.08);
      g.lineBetween(0, 0, 32, 0);
      g.lineBetween(0, 0, 0, 32);
      this.tex(g, 'ground_tile', 32, 32);
    }

    // Floating platform tile (32×14)
    {
      const g = this.g(32, 14);
      g.fillStyle(0x080820, 1);
      g.fillRect(0, 0, 32, 14);
      g.lineStyle(2, 0xff00ff, 1);
      g.lineBetween(0, 0, 32, 0);
      g.lineStyle(1, 0xff00ff, 0.35);
      g.lineBetween(0, 7, 32, 7);
      g.lineBetween(0, 13, 32, 13);
      this.tex(g, 'platform_tile', 32, 14);
    }

    // Destructible obstacle (40×40)
    {
      const g = this.g(40, 40);
      g.fillStyle(0x0a0a24, 1);
      g.fillRect(0, 0, 40, 40);
      g.lineStyle(2, 0x00ff88, 1);
      g.strokeRect(1, 1, 38, 38);
      g.lineStyle(1, 0x00ff88, 0.45);
      g.lineBetween(0, 0, 40, 40);
      g.lineBetween(40, 0, 0, 40);
      this.tex(g, 'obstacle', 40, 40);
    }
  }

  // ── UI textures ───────────────────────────────────────────
  _makeUITextures() {
    // Generic 4×4 white pixel (particle)
    {
      const g = this.g(4, 4);
      g.fillStyle(0xffffff, 1);
      g.fillRect(0, 0, 4, 4);
      this.tex(g, 'pixel', 4, 4);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN MENU SCENE
// ─────────────────────────────────────────────────────────────
class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenu'); }

  create() {
    const W = this.scale.width, H = this.scale.height;

    this.add.tileSprite(0, 0, W, H, 'bg').setOrigin(0, 0);
    this._scanlines();

    // Title
    const title = this.add.text(W / 2, 170, 'NEON TANK', {
      fontSize: '78px', fontFamily: 'monospace',
      color: '#00ffff', stroke: '#ff00ff', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(W / 2, 262, '// KILL · ADVANCE · SURVIVE //', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ff00ff', alpha: 0.8
    }).setOrigin(0.5);

    const s = loadSave();
    this.add.text(W / 2, 308, `BEST: ${s.highScore}m   |   CURRENCY: ${s.kills} kills`, {
      fontSize: '17px', fontFamily: 'monospace', color: '#ffff00'
    }).setOrigin(0.5);

    this._btn(W / 2, 400, 'PLAY', 0x00ffff, () => {
      this.scene.start('Game', { tankId: s.selectedTank || 'scout' });
    });
    this._btn(W / 2, 472, 'SELECT TANK', 0xff00ff, () => {
      this.scene.start('TankSelect');
    });
    this._btn(W / 2, 544, 'CONTROLS', 0xffff00, () => {
      this._showControls();
    });

    // Decorative tanks
    this._decoTank(180, 580, 0x00ffff);
    this._decoTank(W - 180, 580, 0xff00ff);

    // Title flicker
    this.time.addEvent({
      delay: 4000, loop: true, callback: () => {
        this.tweens.add({
          targets: title, alpha: 0.05, duration: 60,
          yoyo: true, repeat: 3, onComplete: () => title.setAlpha(1)
        });
      }
    });

    this.controlsOverlay = null;
  }

  _showControls() {
    if (this.controlsOverlay) { this.controlsOverlay.destroy(); this.controlsOverlay = null; return; }
    const W = this.scale.width, H = this.scale.height;
    const panel = this.add.container(W / 2, H / 2);
    const bg = this.add.graphics();
    bg.fillStyle(0x000022, 0.92);
    bg.fillRect(-300, -200, 600, 400);
    bg.lineStyle(2, 0x00ffff, 1);
    bg.strokeRect(-300, -200, 600, 400);

    const lines = [
      'CONTROLS',
      '',
      'A / ← : Move Left',
      'D / → : Move Right',
      'W / ↑ : Jump',
      'MOUSE : Aim',
      'CLICK (hold) : Fire',
      '',
      'Touch: ◄ ► ▲ buttons (bottom-left)',
      '',
      'Click anywhere to close'
    ];

    const texts = lines.map((l, i) =>
      this.add.text(0, -170 + i * 30, l, {
        fontSize: i === 0 ? '26px' : '18px',
        fontFamily: 'monospace',
        color: i === 0 ? '#00ffff' : '#ccccdd'
      }).setOrigin(0.5)
    );

    panel.add([bg, ...texts]);
    this.controlsOverlay = panel;

    this.input.once('pointerdown', () => {
      if (this.controlsOverlay) { this.controlsOverlay.destroy(); this.controlsOverlay = null; }
    });
  }

  _scanlines() {
    const g = this.add.graphics().setDepth(200);
    g.fillStyle(0x000000, 0.04);
    for (let y = 0; y < this.scale.height; y += 4) g.fillRect(0, y, this.scale.width, 2);
  }

  _btn(x, y, label, color, cb) {
    const hex = '#' + color.toString(16).padStart(6, '0');
    const bg = this.add.graphics();
    const draw = (fill) => {
      bg.clear();
      bg.fillStyle(fill ? color : 0x000022, fill ? 0.18 : 0.85);
      bg.fillRect(x - 130, y - 26, 260, 52);
      bg.lineStyle(2, color, 1);
      bg.strokeRect(x - 130, y - 26, 260, 52);
    };
    draw(false);
    const txt = this.add.text(x, y, label, { fontSize: '22px', fontFamily: 'monospace', color: hex }).setOrigin(0.5);
    const z = this.add.zone(x, y, 260, 52).setInteractive({ useHandCursor: true });
    z.on('pointerover', () => { draw(true); txt.setColor('#ffffff'); });
    z.on('pointerout',  () => { draw(false); txt.setColor(hex); });
    z.on('pointerdown', cb);
  }

  _decoTank(x, y, c) {
    const g = this.add.graphics();
    g.fillStyle(0x0a0a22); g.fillRect(x - 40, y - 12, 80, 24);
    g.lineStyle(2, c, 1);  g.strokeRect(x - 40, y - 12, 80, 24);
    g.fillStyle(0x0a0a22); g.fillRect(x - 15, y - 26, 34, 16);
    g.lineStyle(2, c, 1);  g.strokeRect(x - 15, y - 26, 34, 16);
    g.lineBetween(x + 19, y - 18, x + 50, y - 18);
    g.fillStyle(0x151530); g.fillRect(x - 38, y + 10, 76, 8);
  }
}

// ─────────────────────────────────────────────────────────────
// TANK SELECT SCENE
// ─────────────────────────────────────────────────────────────
class TankSelectScene extends Phaser.Scene {
  constructor() { super('TankSelect'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.add.tileSprite(0, 0, W, H, 'bg').setOrigin(0, 0);

    this.add.text(W / 2, 46, 'SELECT YOUR TANK', {
      fontSize: '40px', fontFamily: 'monospace', color: '#00ffff',
      stroke: '#ff00ff', strokeThickness: 3
    }).setOrigin(0.5);

    const sv = loadSave();

    this.killsLabel = this.add.text(W / 2, 92, `KILL CURRENCY: ${sv.kills}`, {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffff00'
    }).setOrigin(0.5);

    const cols = 3;
    const cardW = 240, cardH = 170, gapX = 24, gapY = 20;
    const totalW = cols * cardW + (cols - 1) * gapX;
    const startX = (W - totalW) / 2;
    const startY = 130;

    TANK_DATA.forEach((tank, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const cx = startX + col * (cardW + gapX) + cardW / 2;
      const cy = startY + row * (cardH + gapY) + cardH / 2;
      this._drawCard(cx, cy, cardW, cardH, tank, sv);
    });

    this._btn(W / 2, H - 50, '← BACK', 0xff0088, () => this.scene.start('MainMenu'));

    // Scanlines
    const sl = this.add.graphics().setDepth(200);
    sl.fillStyle(0x000000, 0.04);
    for (let y = 0; y < H; y += 4) sl.fillRect(0, y, W, 2);
  }

  _drawCard(cx, cy, W, H, tank, sv) {
    const unlocked = sv.unlockedTanks.includes(tank.id);
    const selected = sv.selectedTank === tank.id;
    const borderC = selected ? 0xffffff : (unlocked ? tank.color : 0x334);
    const hex = '#' + tank.color.toString(16).padStart(6, '0');

    const g = this.add.graphics();
    g.fillStyle(unlocked ? tank.color : 0x223, selected ? 0.2 : 0.08);
    g.fillRect(cx - W / 2, cy - H / 2, W, H);
    g.lineStyle(selected ? 3 : 2, borderC, 1);
    g.strokeRect(cx - W / 2, cy - H / 2, W, H);

    // "SELECTED" badge
    if (selected) {
      this.add.text(cx, cy - H / 2 + 10, '▶ ACTIVE ◀', {
        fontSize: '12px', fontFamily: 'monospace', color: '#ffffff'
      }).setOrigin(0.5);
    }

    // Tank sprite preview
    this.add.image(cx - 6, cy - 22, `tank_${tank.id}`)
      .setAlpha(unlocked ? 1 : 0.2);

    // Name
    this.add.text(cx, cy + 16, tank.name, {
      fontSize: '17px', fontFamily: 'monospace', color: unlocked ? hex : '#334466'
    }).setOrigin(0.5);

    // Desc / lock
    if (unlocked) {
      this.add.text(cx, cy + 38, tank.desc, {
        fontSize: '12px', fontFamily: 'monospace', color: '#8888aa'
      }).setOrigin(0.5);
      this.add.text(cx, cy + 58, `HP:${tank.health}  SPD:${tank.speed}  ${tank.weaponType.toUpperCase()}`, {
        fontSize: '11px', fontFamily: 'monospace', color: '#666688'
      }).setOrigin(0.5);
    } else {
      this.add.text(cx, cy + 30, `🔒 ${tank.cost} kills to unlock`, {
        fontSize: '13px', fontFamily: 'monospace', color: '#556677'
      }).setOrigin(0.5);
    }

    // Interactive zone
    const z = this.add.zone(cx, cy, W, H).setInteractive({ useHandCursor: true });
    z.on('pointerdown', () => {
      const s = loadSave();
      if (unlocked) {
        s.selectedTank = tank.id;
        persistSave(s);
        this.scene.restart();
      } else if (s.kills >= tank.cost) {
        s.kills -= tank.cost;
        if (!s.unlockedTanks.includes(tank.id)) s.unlockedTanks.push(tank.id);
        s.selectedTank = tank.id;
        persistSave(s);
        this.scene.restart();
      } else {
        // Flash "not enough" message
        const msg = this.add.text(cx, cy - H / 2 - 18, 'Not enough kills!', {
          fontSize: '14px', fontFamily: 'monospace', color: '#ff2244'
        }).setOrigin(0.5);
        this.tweens.add({ targets: msg, alpha: 0, y: msg.y - 30, duration: 1200, onComplete: () => msg.destroy() });
      }
    });
  }

  _btn(x, y, label, color, cb) {
    const hex = '#' + color.toString(16).padStart(6, '0');
    const bg = this.add.graphics();
    bg.fillStyle(0x000022, 0.85); bg.fillRect(x - 110, y - 22, 220, 44);
    bg.lineStyle(2, color, 1);    bg.strokeRect(x - 110, y - 22, 220, 44);
    this.add.text(x, y, label, { fontSize: '20px', fontFamily: 'monospace', color: hex }).setOrigin(0.5);
    this.add.zone(x, y, 220, 44).setInteractive({ useHandCursor: true }).on('pointerdown', cb);
  }
}

// ─────────────────────────────────────────────────────────────
// GAME SCENE
// ─────────────────────────────────────────────────────────────
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  init(data) {
    this.tankId  = data.tankId || 'scout';
    this.tankCfg = TANK_DATA.find(t => t.id === this.tankId) || TANK_DATA[0];
  }

  create() {
    const W = this.scale.width, H = this.scale.height;

    this.physics.world.setBounds(0, 0, 9_000_000, H);

    // State
    this.score        = 0;
    this.sessionKills = 0;
    this.isOver       = false;
    this.mouseDown    = false;
    this.mouseWorldX  = W / 2;
    this.mouseWorldY  = H / 2;

    // Terrain
    this.CHUNK_W    = 1600;
    this.SEG_COUNT  = 24;
    this.BASE_Y     = H - 110;
    this.chunks     = [];
    this.lastChunkX = 0;

    // Physics groups
    this.grpGround    = this.physics.add.staticGroup();
    this.grpPlatform  = this.physics.add.staticGroup();
    this.grpObstacle  = this.physics.add.staticGroup();
    this.grpEnemy     = this.physics.add.group();
    this.grpPBullet   = this.physics.add.group();
    this.grpEBullet   = this.physics.add.group();

    // Background
    this.bgSprite = this.add.tileSprite(0, 0, W, H, 'bg').setOrigin(0, 0).setScrollFactor(0);

    // Generate initial terrain
    for (let i = 0; i < 5; i++) this._genChunk(i * this.CHUNK_W);

    // Player
    this._createPlayer();

    // Camera
    this.cameras.main.startFollow(this.player.sprite, false, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, 9_000_000, H);

    // HUD
    this._createHUD();

    // Touch controls
    this._createTouch();

    // Input
    this._setupInput();

    // Collisions
    this._setupCollisions();

    // Aim graphics (drawn in world space)
    this.aimGfx = this.add.graphics().setDepth(12);

    // Scanlines overlay
    const sl = this.add.graphics().setScrollFactor(0).setDepth(200);
    sl.fillStyle(0x000000, 0.04);
    for (let y = 0; y < H; y += 4) sl.fillRect(0, y, W, 2);

    // Spawn timer (interval shrinks with distance)
    this.spawnTimer = this.time.addEvent({ delay: 2200, callback: this._spawnEnemy, callbackScope: this, loop: true });
  }

  // ═══════════════════════════════════════════════════════════
  // TERRAIN
  // ═══════════════════════════════════════════════════════════
  _genChunk(startX) {
    const H = this.scale.height;
    const SEG = this.SEG_COUNT;
    const SW  = this.CHUNK_W / SEG;   // segment width

    // Build height array (smooth random walk)
    const heights = [this.BASE_Y];
    for (let i = 1; i <= SEG; i++) {
      const prev = heights[i - 1];
      const delta = Phaser.Math.Between(-36, 36);
      heights.push(Phaser.Math.Clamp(prev + delta, H - 240, H - 70));
    }

    // Smooth heights
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 1; i < SEG; i++) {
        heights[i] = (heights[i - 1] + heights[i] * 2 + heights[i + 1]) / 4;
      }
    }

    // Graphics
    const gfx = this.add.graphics().setDepth(1);

    // Fill polygon (terrain body)
    const pts = [{ x: startX, y: H }];
    for (let i = 0; i <= SEG; i++) pts.push({ x: startX + i * SW, y: heights[i] });
    pts.push({ x: startX + this.CHUNK_W, y: H });
    gfx.fillStyle(0x020214, 1);
    gfx.fillPoints(pts, true);

    // Neon top edge
    gfx.lineStyle(3, 0x00ffff, 1);
    gfx.beginPath();
    gfx.moveTo(startX, heights[0]);
    for (let i = 1; i <= SEG; i++) gfx.lineTo(startX + i * SW, heights[i]);
    gfx.strokePath();

    // Subtle vertical grid lines on terrain
    gfx.lineStyle(1, 0x00ffff, 0.07);
    for (let x = startX; x < startX + this.CHUNK_W; x += 64) {
      const rel = x - startX;
      const si  = Math.min(Math.floor(rel / SW), SEG - 1);
      const t   = (rel - si * SW) / SW;
      const gy  = Phaser.Math.Linear(heights[si], heights[si + 1], t);
      gfx.lineBetween(x, gy, x, H);
    }

    // Physics bodies: one invisible rect per sub-segment
    const bodies = [];
    const STEPS = 4;
    for (let i = 0; i < SEG; i++) {
      for (let s = 0; s < STEPS; s++) {
        const t0 = s / STEPS, t1 = (s + 1) / STEPS;
        const x0 = startX + i * SW + t0 * SW;
        const y0 = Phaser.Math.Linear(heights[i], heights[i + 1], t0);
        const bw  = SW / STEPS;
        const bh  = H - y0;
        const b   = this.grpGround.create(x0 + bw / 2, y0 + bh / 2, null);
        b.setSize(bw + 1, bh);
        b.refreshBody();
        b.setVisible(false);
        bodies.push(b);
      }
    }

    // Obstacles
    const obsCount = Phaser.Math.Between(1, 4);
    for (let o = 0; o < obsCount; o++) {
      const ox  = startX + Phaser.Math.Between(150, this.CHUNK_W - 150);
      const si  = Math.min(Math.floor((ox - startX) / SW), SEG - 1);
      const oy  = heights[si] - 40;
      const obs = this.grpObstacle.create(ox, oy, 'obstacle');
      obs.setData('hp', 60);
      obs.refreshBody();
    }

    // Floating platforms (occasional)
    if (startX > 0 && Phaser.Math.Between(0, 2) === 0) {
      const px  = startX + Phaser.Math.Between(300, this.CHUNK_W - 300);
      const si  = Math.min(Math.floor((px - startX) / SW), SEG - 1);
      const gy  = heights[si];
      const py  = gy - Phaser.Math.Between(120, 200);
      const len = Phaser.Math.Between(3, 7);
      for (let t = 0; t < len; t++) {
        const pl = this.grpPlatform.create(px + t * 32, py, 'platform_tile');
        pl.refreshBody();
      }
    }

    this.chunks.push({ startX, gfx, bodies, heights });
    this.lastChunkX = startX + this.CHUNK_W;
  }

  _groundHeightAt(worldX) {
    const SEG = this.SEG_COUNT;
    const SW  = this.CHUNK_W / SEG;
    for (const ch of this.chunks) {
      if (worldX >= ch.startX && worldX < ch.startX + this.CHUNK_W) {
        const rel = worldX - ch.startX;
        const si  = Math.min(Math.floor(rel / SW), SEG - 1);
        const t   = (rel - si * SW) / SW;
        return Phaser.Math.Linear(ch.heights[si], ch.heights[si + 1], t);
      }
    }
    return this.BASE_Y;
  }

  // ═══════════════════════════════════════════════════════════
  // PLAYER
  // ═══════════════════════════════════════════════════════════
  _createPlayer() {
    const cfg = this.tankCfg;
    const sp  = this.physics.add.sprite(220, this.BASE_Y - 44, `tank_${cfg.id}`);
    sp.setCollideWorldBounds(true).setDepth(10);

    this.player = {
      sprite:        sp,
      health:        cfg.health,
      maxHealth:     cfg.health,
      speed:         cfg.speed,
      jumpVel:       cfg.jumpVel,
      weaponType:    cfg.weaponType,
      fireRate:      cfg.fireRate,
      bulletSpeed:   cfg.bulletSpeed,
      bulletDamage:  cfg.bulletDamage,
      bulletW:       cfg.bulletW,
      bulletH:       cfg.bulletH,
      color:         cfg.color,
      lastFired:     0,
      grounded:      false,
      jumpQueued:    false
    };
  }

  // ═══════════════════════════════════════════════════════════
  // HUD
  // ═══════════════════════════════════════════════════════════
  _createHUD() {
    const W = this.scale.width;
    const sf = { scrollFactorX: 0, scrollFactorY: 0 };

    // Top bar background
    const bar = this.add.graphics().setScrollFactor(0).setDepth(90);
    bar.fillStyle(0x00000a, 0.72);
    bar.fillRect(0, 0, W, 52);
    bar.lineStyle(1, 0x00ffff, 0.25);
    bar.lineBetween(0, 52, W, 52);

    const ts = { fontFamily: 'monospace', scrollFactorX: 0, scrollFactorY: 0 };

    this.add.text(10, 14, 'HP', { ...ts, fontSize: '17px', color: '#00ffff' }).setDepth(91);

    this.hudHpBg = this.add.graphics().setScrollFactor(0).setDepth(91);
    this.hudHpBg.fillStyle(0x111133, 1);
    this.hudHpBg.fillRect(36, 16, 160, 18);
    this.hudHpBg.lineStyle(1, 0x0055bb, 1);
    this.hudHpBg.strokeRect(36, 16, 160, 18);

    this.hudHpFill = this.add.graphics().setScrollFactor(0).setDepth(92);
    this.hudHpTxt  = this.add.text(202, 16, '', { ...ts, fontSize: '14px', color: '#00ff88' }).setDepth(92);

    this.hudDist  = this.add.text(W / 2, 14, 'DIST: 0m', { ...ts, fontSize: '17px', color: '#ffff00' }).setOrigin(0.5, 0).setDepth(91);
    this.hudKills = this.add.text(W - 10, 14, 'KILLS: 0', { ...ts, fontSize: '17px', color: '#ff00ff' }).setOrigin(1, 0).setDepth(91);

    const wHex = '#' + this.tankCfg.color.toString(16).padStart(6, '0');
    this.hudWeapon = this.add.text(10, this.scale.height - 130, `[${this.tankCfg.weaponType.toUpperCase()}]`, {
      ...ts, fontSize: '14px', color: wHex
    }).setDepth(91);
  }

  _updateHUD() {
    const p = this.player;
    const pct = p.health / p.maxHealth;
    const bw  = Math.max(0, Math.floor(160 * pct));
    const col = pct > 0.55 ? 0x00ff88 : pct > 0.28 ? 0xffff00 : 0xff2244;

    this.hudHpFill.clear();
    this.hudHpFill.fillStyle(col, 1);
    this.hudHpFill.fillRect(36, 16, bw, 18);
    this.hudHpTxt.setText(`${Math.ceil(p.health)}/${p.maxHealth}`);

    const dist = Math.max(0, Math.floor((p.sprite.x - 220) / 5));
    this.hudDist.setText(`DIST: ${dist}m`);
    this.hudKills.setText(`KILLS: ${this.sessionKills}`);
    this.score = dist;
  }

  // ═══════════════════════════════════════════════════════════
  // TOUCH CONTROLS
  // ═══════════════════════════════════════════════════════════
  _createTouch() {
    const H = this.scale.height;
    this.touch = { left: false, right: false, jump: false };

    const btns = [
      { x: 50,  y: H - 65, label: '◄', color: 0x0066ff, key: 'left'  },
      { x: 135, y: H - 65, label: '►', color: 0x0066ff, key: 'right' },
      { x: 222, y: H - 65, label: '▲', color: 0xff8800, key: 'jump'  }
    ];

    btns.forEach(b => {
      const g = this.add.graphics().setScrollFactor(0).setDepth(95);
      g.fillStyle(0x000022, 0.75);
      g.fillRoundedRect(b.x - 35, b.y - 35, 70, 70, 10);
      g.lineStyle(2, b.color, 1);
      g.strokeRoundedRect(b.x - 35, b.y - 35, 70, 70, 10);

      const hex = '#' + b.color.toString(16).padStart(6, '0');
      this.add.text(b.x, b.y, b.label, { fontSize: '28px', fontFamily: 'monospace', color: hex })
        .setOrigin(0.5).setScrollFactor(0).setDepth(96);

      const zone = this.add.zone(b.x, b.y, 70, 70).setScrollFactor(0).setDepth(97).setInteractive();
      zone.on('pointerdown', () => { this.touch[b.key] = true; });
      zone.on('pointerup',   () => { this.touch[b.key] = false; });
      zone.on('pointerout',  () => { this.touch[b.key] = false; });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // INPUT
  // ═══════════════════════════════════════════════════════════
  _setupInput() {
    this.keys = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.input.on('pointermove', (ptr) => {
      const wp = this.cameras.main.getWorldPoint(ptr.x, ptr.y);
      this.mouseWorldX = wp.x;
      this.mouseWorldY = wp.y;
    });

    this.input.on('pointerdown', (ptr) => {
      // Ignore touch control area
      if (ptr.y > this.scale.height - 120 && ptr.x < 280) return;
      const wp = this.cameras.main.getWorldPoint(ptr.x, ptr.y);
      this.mouseWorldX = wp.x;
      this.mouseWorldY = wp.y;
      this.mouseDown = true;
    });

    this.input.on('pointerup', () => { this.mouseDown = false; });
  }

  // ═══════════════════════════════════════════════════════════
  // COLLISIONS
  // ═══════════════════════════════════════════════════════════
  _setupCollisions() {
    const p = this.player.sprite;

    this.physics.add.collider(p, this.grpGround);
    this.physics.add.collider(p, this.grpPlatform);
    this.physics.add.collider(p, this.grpObstacle);

    this.physics.add.collider(this.grpEnemy, this.grpGround);
    this.physics.add.collider(this.grpEnemy, this.grpPlatform);
    this.physics.add.collider(this.grpEnemy, this.grpObstacle);

    this.physics.add.overlap(this.grpPBullet, this.grpEnemy,    this._pBulletHitEnemy,    null, this);
    this.physics.add.overlap(this.grpPBullet, this.grpObstacle, this._bulletHitObstacle,  null, this);
    this.physics.add.overlap(this.grpPBullet, this.grpGround,   this._bulletHitGround,    null, this);

    this.physics.add.overlap(this.grpEBullet, p,                this._eBulletHitPlayer,   null, this);
    this.physics.add.overlap(this.grpEBullet, this.grpObstacle, this._bulletHitObstacle,  null, this);
    this.physics.add.overlap(this.grpEBullet, this.grpGround,   this._bulletHitGround,    null, this);

    this.physics.add.overlap(this.grpEnemy, p, this._enemyContact, null, this);
  }

  // ═══════════════════════════════════════════════════════════
  // UPDATE
  // ═══════════════════════════════════════════════════════════
  update(time, delta) {
    if (this.isOver) return;
    if (!this.player.sprite.active) return;

    this._movePlayer(time);
    this._aimAndShoot(time);
    this._drawAim();
    this._updateEnemies(time);
    this._cleanBullets();
    this._updateHUD();
    this._streamTerrain();
    this._cullChunks();

    // Background parallax
    this.bgSprite.setTilePosition(this.cameras.main.scrollX * 0.25, 0);
  }

  // ── Player movement ───────────────────────────────────────
  _movePlayer(time) {
    const p = this.player, sp = p.sprite;
    const goLeft  = this.keys.left.isDown  || this.wasd.left.isDown  || this.touch.left;
    const goRight = this.keys.right.isDown || this.wasd.right.isDown || this.touch.right;
    const jump    = this.keys.up.isDown    || this.wasd.up.isDown    || this.touch.jump;

    p.grounded = sp.body.blocked.down;

    if (goLeft)       sp.setVelocityX(-p.speed);
    else if (goRight) sp.setVelocityX(p.speed);
    else {
      sp.setVelocityX(sp.body.velocity.x * 0.75);
      if (Math.abs(sp.body.velocity.x) < 8) sp.setVelocityX(0);
    }

    if (jump && p.grounded) sp.setVelocityY(p.jumpVel);
    if (sp.x < 60) sp.setX(60);
  }

  // ── Aiming and shooting ───────────────────────────────────
  _aimAndShoot(time) {
    if (!this.mouseDown) return;
    const p = this.player;
    if (time - p.lastFired < p.fireRate) return;
    p.lastFired = time;
    this._firePBullet();
  }

  _firePBullet() {
    const p  = this.player, sp = p.sprite;
    const dx = this.mouseWorldX - sp.x;
    const dy = this.mouseWorldY - (sp.y - 12);
    const ang = Math.atan2(dy, dx);

    // Spawn just beyond the barrel tip
    const bx = sp.x + 50 * Math.cos(ang);
    const by = (sp.y - 12) + 50 * Math.sin(ang);

    const b = this.grpPBullet.create(bx, by, `bullet_${p.weaponType}`);
    if (!b) return;
    b.setRotation(ang).setDepth(8);
    b.setData('dmg', p.bulletDamage);
    b.body.setAllowGravity(false);

    const spd = p.bulletSpeed;
    if (p.weaponType === 'mortar') {
      b.body.setAllowGravity(true);
      b.body.setGravityY(-400); // partial gravity = arc
      b.setVelocity(Math.cos(ang) * spd * 0.9, Math.sin(ang) * spd * 0.7);
    } else {
      b.setVelocity(Math.cos(ang) * spd, Math.sin(ang) * spd);
    }

    this._muzzleFlash(bx, by, p.color);
  }

  // ── Aim reticle ───────────────────────────────────────────
  _drawAim() {
    this.aimGfx.clear();
    const sp  = this.player.sprite;
    const dx  = this.mouseWorldX - sp.x;
    const dy  = this.mouseWorldY - (sp.y - 12);
    const ang = Math.atan2(dy, dx);
    const ex  = sp.x + 58 * Math.cos(ang);
    const ey  = (sp.y - 12) + 58 * Math.sin(ang);

    this.aimGfx.lineStyle(2, this.player.color, 0.55);
    this.aimGfx.lineBetween(sp.x + 32 * Math.cos(ang), (sp.y - 12) + 32 * Math.sin(ang), ex, ey);
    this.aimGfx.fillStyle(this.player.color, 0.85);
    this.aimGfx.fillCircle(ex, ey, 5);
  }

  // ── Enemy spawning ────────────────────────────────────────
  _spawnEnemy() {
    if (this.isOver) return;
    const dist = this.score;
    const W    = this.scale.width;

    let pool = ['rifleman'];
    if (dist >  80)   pool.push('heavy_soldier');
    if (dist >  250)  pool.push('bazooka');
    if (dist >  500)  pool.push('scout_tank');
    if (dist >  1000) pool.push('heavy_tank');

    const cap = Math.min(8 + Math.floor(dist / 180), 22);
    if (this.grpEnemy.countActive() >= cap) return;

    const typeKey = Phaser.Utils.Array.GetRandom(pool);
    const d       = ENEMY_DATA[typeKey];
    const spawnX  = this.player.sprite.x + W * 0.55 + Phaser.Math.Between(60, 420);
    const gy      = this._groundHeightAt(spawnX);
    const spawnY  = gy - (d.isTank ? d.h / 2 + 2 : d.h / 2 + 4);

    this._createEnemy(typeKey, spawnX, spawnY);
  }

  _createEnemy(typeKey, x, y) {
    const d  = ENEMY_DATA[typeKey];
    const sp = this.grpEnemy.create(x, y, `enemy_${typeKey}`);
    if (!sp) return;

    const hpScale = 1 + this.score / 800;
    sp.setDepth(9);
    sp.setData({
      typeKey, isTank: d.isTank,
      hp: d.health * hpScale, maxHp: d.health * hpScale,
      spd: d.speed, detectRange: d.detectRange, attackRange: d.attackRange,
      fireRate: d.fireRate, dmg: d.damage, bulletSpd: d.bulletSpeed,
      bulletType: d.bulletType, reward: d.reward, color: d.color,
      lastFired: 0, state: 'idle', contactCd: 0
    });

    // Health bar (canvas graphics, lives in world space)
    const hbg = this.add.graphics().setDepth(21);
    sp.setData('hbg', hbg);
  }

  // ── Enemy AI update ───────────────────────────────────────
  _updateEnemies(time) {
    const psp = this.player.sprite;

    this.grpEnemy.getChildren().forEach(en => {
      if (!en.active) return;
      const dx   = psp.x - en.x;
      const dist = Math.abs(dx);
      const dRange = en.getData('detectRange');
      const aRange = en.getData('attackRange');

      // State transitions
      let state = dist < dRange ? (dist < aRange ? 'attack' : 'chase') : 'idle';
      en.setData('state', state);

      const spd = en.getData('spd');

      if (state === 'chase') {
        en.setVelocityX(dx > 0 ? spd : -spd);
      } else if (state === 'attack') {
        en.setVelocityX(0);
        this._enemyFire(en, psp, time);
      } else {
        // Patrol slowly
        const dir = Math.sin(time * 0.0008 + en.x * 0.005) > 0 ? 1 : -1;
        en.setVelocityX(dir * spd * 0.28);
      }

      // Health bar
      const hbg = en.getData('hbg');
      if (hbg) {
        const hp  = en.getData('hp');
        const mhp = en.getData('maxHp');
        const pct = hp / mhp;
        const barW = 40;
        const bx   = en.x - barW / 2;
        const by   = en.y - en.height / 2 - 9;
        hbg.clear();
        hbg.fillStyle(0x110011, 0.85);
        hbg.fillRect(bx, by, barW, 5);
        hbg.fillStyle(pct > 0.5 ? 0x00ff44 : pct > 0.25 ? 0xffff00 : 0xff2244, 1);
        hbg.fillRect(bx, by, Math.max(0, barW * pct), 5);
      }
    });
  }

  _enemyFire(en, psp, time) {
    const lastF = en.getData('lastFired');
    const fr    = en.getData('fireRate');
    if (time - lastF < fr) return;
    en.setData('lastFired', time);

    const bType = en.getData('bulletType');
    const bSpd  = en.getData('bulletSpd');
    const dmg   = en.getData('dmg');
    const color = en.getData('color');

    // Slight inaccuracy
    const inaccuracy = Math.max(0.03, 0.22 - this.score * 0.00015);
    const jitter = Phaser.Math.FloatBetween(-inaccuracy * 300, inaccuracy * 300);
    const dx  = (psp.x - en.x) + jitter;
    const dy  = (psp.y - en.y);
    const ang = Math.atan2(dy, dx);

    const bx = en.x + Math.cos(ang) * 32;
    const by = en.y - en.height * 0.25;

    const b = this.grpEBullet.create(bx, by, `bullet_${bType}`);
    if (!b) return;
    b.setRotation(ang).setDepth(8);
    b.setData('dmg', dmg);
    b.body.setAllowGravity(false);

    if (bType === 'enemy_rocket') {
      b.setVelocity(Math.cos(ang) * bSpd, Math.sin(ang) * bSpd * 0.8);
      b.body.setAllowGravity(true);
      b.body.setGravityY(-500);
    } else {
      b.setVelocity(Math.cos(ang) * bSpd, Math.sin(ang) * bSpd);
    }

    this._muzzleFlash(bx, by, color);
  }

  // ── Collision callbacks ───────────────────────────────────
  _pBulletHitEnemy(bullet, enemy) {
    const dmg = bullet.getData('dmg');
    this._impact(bullet.x, bullet.y, 0x00ffff);
    bullet.destroy();
    const hp = enemy.getData('hp') - dmg;
    if (hp <= 0) this._killEnemy(enemy);
    else         enemy.setData('hp', hp);
  }

  _eBulletHitPlayer(bullet, _psp) {
    const dmg = bullet.getData('dmg');
    this._impact(bullet.x, bullet.y, 0xff3344);
    bullet.destroy();
    this.player.health -= dmg;
    this.cameras.main.flash(120, 200, 0, 0, true);
    if (this.player.health <= 0) { this.player.health = 0; this._gameOver(); }
  }

  _bulletHitObstacle(bullet, obs) {
    const dmg = bullet.getData('dmg') || 10;
    this._impact(bullet.x, bullet.y, 0x00ff88);
    bullet.destroy();
    const hp = obs.getData('hp') - dmg;
    if (hp <= 0) {
      this._explode(obs.x, obs.y, 0x00ff88);
      obs.destroy();
    } else {
      obs.setData('hp', hp);
      obs.setTint(0xff6600);
      this.time.delayedCall(120, () => { if (obs.active) obs.clearTint(); });
    }
  }

  _bulletHitGround(bullet) {
    this._impact(bullet.x, bullet.y, 0x00ffff);
    bullet.destroy();
  }

  _enemyContact(enemy, _psp) {
    const now  = this.time.now;
    const last = enemy.getData('contactCd');
    if (now - last < 500) return;
    enemy.setData('contactCd', now);
    this.player.health -= 8;
    this.cameras.main.flash(80, 200, 0, 0, true);
    if (this.player.health <= 0) { this.player.health = 0; this._gameOver(); }
  }

  // ── Kill enemy ────────────────────────────────────────────
  _killEnemy(enemy) {
    const reward  = enemy.getData('reward');
    const color   = enemy.getData('color');
    this.sessionKills++;

    const sv = loadSave();
    sv.kills      += reward;
    sv.totalKills  = (sv.totalKills || 0) + 1;
    persistSave(sv);

    this._explode(enemy.x, enemy.y, color);

    const hbg = enemy.getData('hbg');
    if (hbg) hbg.destroy();
    enemy.destroy();

    this._killPopup(enemy.x, enemy.y - 28, `+${reward}`);
  }

  _killPopup(x, y, txt) {
    const t = this.add.text(x, y, txt, {
      fontSize: '18px', fontFamily: 'monospace', color: '#ffff00',
      stroke: '#000000', strokeThickness: 2
    }).setDepth(26).setOrigin(0.5);
    this.tweens.add({ targets: t, y: y - 52, alpha: 0, duration: 1000, ease: 'Power2', onComplete: () => t.destroy() });
  }

  // ── VFX ───────────────────────────────────────────────────
  _muzzleFlash(x, y, color) {
    const g = this.add.graphics().setPosition(x, y).setDepth(14);
    g.fillStyle(color,     0.9); g.fillCircle(0, 0, 10);
    g.fillStyle(0xffffff,  0.7); g.fillCircle(0, 0, 5);
    this.tweens.add({ targets: g, alpha: 0, scaleX: 2.2, scaleY: 2.2, duration: 90, onComplete: () => g.destroy() });
  }

  _impact(x, y, color) {
    const g = this.add.graphics().setPosition(x, y).setDepth(14);
    g.fillStyle(color, 0.85);
    for (let i = 0; i < 6; i++) {
      const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const r = Phaser.Math.FloatBetween(4, 18);
      g.fillRect(Math.cos(a) * r - 2, Math.sin(a) * r - 2, 5, 5);
    }
    this.tweens.add({ targets: g, alpha: 0, duration: 180, onComplete: () => g.destroy() });
  }

  _explode(x, y, color) {
    // Ring
    const ring = this.add.graphics().setPosition(x, y).setDepth(15);
    ring.lineStyle(3, color, 1);
    ring.strokeCircle(0, 0, 12);
    ring.lineStyle(2, 0xffffff, 0.6);
    ring.strokeCircle(0, 0, 6);
    this.tweens.add({ targets: ring, scaleX: 3.5, scaleY: 3.5, alpha: 0, duration: 380, ease: 'Power2', onComplete: () => ring.destroy() });

    // Sparks
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.3, 0.3);
      const spd = Phaser.Math.FloatBetween(70, 220);
      const sp  = this.add.graphics().setPosition(x, y).setDepth(14);
      sp.fillStyle(i % 2 === 0 ? color : 0xffffff, 1);
      sp.fillRect(-3, -3, 6, 6);
      this.tweens.add({
        targets: sp,
        x: x + Math.cos(ang) * spd,
        y: y + Math.sin(ang) * spd,
        alpha: 0,
        duration: Phaser.Math.Between(280, 600),
        ease: 'Power2',
        onComplete: () => sp.destroy()
      });
    }

    this.cameras.main.shake(140, 0.007);
  }

  // ── Cleanup ───────────────────────────────────────────────
  _cleanBullets() {
    const cl = this.cameras.main.scrollX - 120;
    const cr = this.cameras.main.scrollX + this.scale.width + 120;
    const ct = -80, cb = this.scale.height + 80;

    [this.grpPBullet, this.grpEBullet].forEach(g => {
      g.getChildren().forEach(b => {
        if (b.x < cl || b.x > cr || b.y < ct || b.y > cb) b.destroy();
      });
    });
  }

  _streamTerrain() {
    const need = this.cameras.main.scrollX + this.scale.width + this.CHUNK_W;
    if (need > this.lastChunkX) this._genChunk(this.lastChunkX);
  }

  _cullChunks() {
    const cutoff = this.cameras.main.scrollX - this.CHUNK_W * 1.5;
    this.chunks = this.chunks.filter(ch => {
      if (ch.startX + this.CHUNK_W < cutoff) {
        ch.gfx.destroy();
        ch.bodies.forEach(b => b.destroy());
        return false;
      }
      return true;
    });
  }

  // ── Game over ─────────────────────────────────────────────
  _gameOver() {
    if (this.isOver) return;
    this.isOver = true;

    const sv = loadSave();
    const newBest = this.score > sv.highScore;
    if (newBest) sv.highScore = this.score;
    persistSave(sv);

    this._explode(this.player.sprite.x, this.player.sprite.y, 0xff2244);
    this.player.sprite.destroy();

    this.time.delayedCall(1600, () => {
      this.scene.start('GameOver', { score: this.score, kills: this.sessionKills, newBest });
    });
  }
}

// ─────────────────────────────────────────────────────────────
// GAME OVER SCENE
// ─────────────────────────────────────────────────────────────
class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  init(d) {
    this.finalScore = d.score  || 0;
    this.finalKills = d.kills  || 0;
    this.newBest    = d.newBest || false;
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.add.tileSprite(0, 0, W, H, 'bg').setOrigin(0, 0);

    // Scanlines
    const sl = this.add.graphics().setDepth(200);
    sl.fillStyle(0x000000, 0.04);
    for (let y = 0; y < H; y += 4) sl.fillRect(0, y, W, 2);

    this.add.text(W / 2, 165, 'GAME OVER', {
      fontSize: '68px', fontFamily: 'monospace',
      color: '#ff2244', stroke: '#ff00ff', strokeThickness: 3
    }).setOrigin(0.5);

    if (this.newBest) {
      this.add.text(W / 2, 258, '★  NEW BEST DISTANCE  ★', {
        fontSize: '26px', fontFamily: 'monospace', color: '#ffff00'
      }).setOrigin(0.5);
    }

    const sv = loadSave();
    const rows = [
      { label: `DISTANCE`, val: `${this.finalScore}m`, c: '#ffff00' },
      { label: `BEST DIST`, val: `${sv.highScore}m`,   c: '#aaffaa' },
      { label: `KILLS THIS RUN`, val: `${this.finalKills}`, c: '#ff00ff' },
      { label: `KILL CURRENCY`,  val: `${sv.kills}`,    c: '#00ffff' }
    ];

    rows.forEach((r, i) => {
      const ry = 310 + i * 42;
      this.add.text(W / 2 - 10, ry, r.label, { fontSize: '20px', fontFamily: 'monospace', color: '#888899' }).setOrigin(1, 0.5);
      this.add.text(W / 2 + 10, ry, r.val,   { fontSize: '22px', fontFamily: 'monospace', color: r.c      }).setOrigin(0, 0.5);
    });

    this._btn(W / 2, 500, 'PLAY AGAIN', 0x00ffff, () => {
      this.scene.start('Game', { tankId: sv.selectedTank || 'scout' });
    });
    this._btn(W / 2, 565, 'SELECT TANK', 0xff00ff, () => this.scene.start('TankSelect'));
    this._btn(W / 2, 630, 'MAIN MENU',   0xffff00, () => this.scene.start('MainMenu'));
  }

  _btn(x, y, label, color, cb) {
    const hex = '#' + color.toString(16).padStart(6, '0');
    const bg  = this.add.graphics();
    const draw = (hl) => {
      bg.clear();
      bg.fillStyle(hl ? color : 0x000022, hl ? 0.18 : 0.85);
      bg.fillRect(x - 140, y - 25, 280, 50);
      bg.lineStyle(2, color, 1);
      bg.strokeRect(x - 140, y - 25, 280, 50);
    };
    draw(false);
    const t = this.add.text(x, y, label, { fontSize: '22px', fontFamily: 'monospace', color: hex }).setOrigin(0.5);
    const z = this.add.zone(x, y, 280, 50).setInteractive({ useHandCursor: true });
    z.on('pointerover', () => { draw(true);  t.setColor('#ffffff'); });
    z.on('pointerout',  () => { draw(false); t.setColor(hex); });
    z.on('pointerdown', cb);
  }
}

// ─────────────────────────────────────────────────────────────
// PHASER GAME CONFIG
// ─────────────────────────────────────────────────────────────
const config = {
  type: Phaser.AUTO,
  width:  GW,
  height: GH,
  backgroundColor: '#000008',
  scale: {
    mode:            Phaser.Scale.FIT,
    autoCenter:      Phaser.Scale.CENTER_BOTH,
    width:  GW,
    height: GH
  },
  physics: {
    default: 'arcade',
    arcade:  { gravity: { y: 820 }, debug: false }
  },
  scene: [BootScene, MainMenuScene, TankSelectScene, GameScene, GameOverScene]
};

// eslint-disable-next-line no-unused-vars
const game = window.game = new Phaser.Game(config);
