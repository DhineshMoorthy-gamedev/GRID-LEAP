import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const outDir = path.resolve("docs/crazygames");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function createHtml(width, height, mode) {
  const isPortrait = mode === 'portrait';
  const isSquare = mode === 'square';
  const isLandscape = mode === 'landscape';

  const gridPx = isLandscape ? 520 : (isSquare ? 420 : 480);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @font-face {
    font-family: 'Space Grotesk';
    src: url('../../public/fonts/space-grotesk-normal-600-14.woff2') format('woff2');
  }
  @font-face {
    font-family: 'JetBrains Mono';
    src: url('../../public/fonts/jetbrains-mono-normal-500-28.woff2') format('woff2');
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${width}px;
    height: ${height}px;
    background: #0B131A;
    font-family: 'Space Grotesk', -apple-system, sans-serif;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .bg-glow {
    position: absolute;
    width: ${isLandscape ? '1000px' : '750px'};
    height: ${isLandscape ? '1000px' : '750px'};
    background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(6, 182, 212, 0.12) 40%, transparent 70%);
    border-radius: 50%;
    top: ${isSquare ? '40%' : '50%'};
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .container {
    display: flex;
    flex-direction: ${isLandscape ? 'row' : (isSquare ? 'column-reverse' : 'column')};
    align-items: center;
    justify-content: center;
    gap: ${isLandscape ? '80px' : (isSquare ? '24px' : '44px')};
    z-index: 2;
    padding: ${isSquare ? '36px 32px 28px' : '40px'};
    width: 100%;
    max-width: ${width}px;
    height: 100%;
  }
  .branding {
    text-align: ${isLandscape ? 'left' : 'center'};
    max-width: ${isLandscape ? '650px' : (isSquare ? '680px' : '700px')};
  }
  .badge {
    display: inline-block;
    background: rgba(16, 185, 129, 0.18);
    border: 1px solid rgba(16, 185, 129, 0.4);
    color: #10B981;
    font-size: ${isSquare ? '15px' : (isLandscape ? '22px' : '20px')};
    font-weight: 700;
    padding: ${isSquare ? '5px 14px' : '8px 20px'};
    border-radius: 999px;
    margin-bottom: ${isSquare ? '6px' : '16px'};
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  h1 {
    font-size: ${isLandscape ? '88px' : (isSquare ? '58px' : '72px')};
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.05;
    margin-bottom: ${isSquare ? '6px' : '14px'};
    background: linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  p {
    font-size: ${isLandscape ? '26px' : (isSquare ? '18px' : '22px')};
    color: #94A3B8;
    line-height: 1.35;
  }
  .grid-card {
    background: #141E28;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 32px;
    padding: ${isSquare ? '18px' : '24px'};
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(6, 182, 212, 0.15);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: ${isSquare ? '10px' : '14px'};
    width: ${gridPx}px;
    height: ${gridPx}px;
    flex-shrink: 0;
  }
  .cell {
    background: #1E2D3D;
    border-radius: ${isSquare ? '12px' : '16px'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: ${isSquare ? '26px' : '32px'};
    font-weight: 700;
    color: #E2E8F0;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.05);
    aspect-ratio: 1 / 1;
    width: 100%;
    height: 100%;
  }
  .cell.player {
    background: #0284C7;
    border: 2px solid #38BDF8;
    box-shadow: 0 0 24px rgba(56, 189, 248, 0.6);
  }
  .token {
    width: ${isSquare ? '22px' : '28px'};
    height: ${isSquare ? '22px' : '28px'};
    background: #F59E0B;
    border: 3px solid #FFFFFF;
    border-radius: 50%;
    box-shadow: 0 0 16px rgba(245, 158, 11, 0.8);
  }
  .cell.goal {
    background: #059669;
    border: 2px solid #10B981;
    color: #FFFFFF;
    font-size: ${isSquare ? '15px' : '18px'};
    font-weight: 800;
    letter-spacing: 0.06em;
    box-shadow: 0 0 24px rgba(16, 185, 129, 0.5);
  }
  .cell.path {
    background: rgba(6, 182, 212, 0.25);
    border: 1px solid rgba(6, 182, 212, 0.5);
    color: #38BDF8;
  }
</style>
</head>
<body>
  <div class="bg-glow"></div>
  <div class="container">
    <div class="branding">
      <div class="badge">🧠 Exact-Distance Logic Puzzle</div>
      <h1>GRID LEAP</h1>
      <p>Master the number maze. Reach the goal.</p>
    </div>
    <div class="grid-card">
      <div class="cell player"><div class="token"></div></div>
      <div class="cell">2</div>
      <div class="cell path">3</div>
      <div class="cell">1</div>
      <div class="cell">1</div>
      <div class="cell path">2</div>
      <div class="cell">1</div>
      <div class="cell path">2</div>
      <div class="cell path">3</div>
      <div class="cell">1</div>
      <div class="cell">2</div>
      <div class="cell">1</div>
      <div class="cell">2</div>
      <div class="cell path">1</div>
      <div class="cell">3</div>
      <div class="cell goal">GOAL</div>
    </div>
  </div>
</body>
</html>`;
}

const configs = [
  { name: "landscape_1920x1080.png", w: 1920, h: 1080, mode: "landscape" },
  { name: "portrait_800x1200.png", w: 800, h: 1200, mode: "portrait" },
  { name: "square_800x800.png", w: 800, h: 800, mode: "square" }
];

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

for (const cfg of configs) {
  const htmlPath = path.join(outDir, `temp_${cfg.w}x${cfg.h}.html`);
  const pngPath = path.join(outDir, cfg.name);
  fs.writeFileSync(htmlPath, createHtml(cfg.w, cfg.h, cfg.mode));
  
  const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=${cfg.w},${cfg.h} --screenshot="${pngPath}" "file:///${htmlPath.replace(/\\\\/g, '/')}"`;
  execSync(cmd);
  fs.unlinkSync(htmlPath);
  console.log(`✓ Generated ${cfg.name} (${cfg.w}x${cfg.h})`);
}

console.log("All CrazyGames banner assets regenerated with safe top-left corner!");
