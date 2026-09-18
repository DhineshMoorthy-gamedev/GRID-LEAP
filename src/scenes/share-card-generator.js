/**
 * Grid Leap — Victory Modal Card Generator
 * Generates an instantaneous (<2ms), zero-lag, pixel-perfect 2D Canvas snapshot of the Win Modal Card.
 */

import { formatDisplayDate } from "../core/daily-seed.js";

/**
 * Draws and exports a pixel-perfect image of the Win Modal Card.
 * Returns { dataUrl, rawBase64, blob, canvas } for all platform targets.
 */
export async function generateVictoryCard({
  level,
  path = [],
  moveCount = 1,
  optimal = 1,
  eff = 100,
  isDaily = false,
  dateKey = "",
  streak = 0,
  isCustom = false,
  levelIndex = 0,
  theme = "obsidian"
}) {
  const isVellum = theme === "vellum";

  // Card dimensions (Crisp 2x resolution: 720 x 820)
  const width = 720;
  const height = 820;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const cx = width / 2;

  // --- 1. Background Rounded Card ---
  const pad = 16;
  const cardW = width - pad * 2;
  const cardH = height - pad * 2;
  const cardRadius = 32;

  // Card Body Background
  ctx.save();
  if (isVellum) {
    ctx.fillStyle = "#F8F6F0";
    ctx.strokeStyle = "rgba(30, 28, 26, 0.14)";
  } else {
    ctx.fillStyle = "#151619";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  }
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, pad, pad, cardW, cardH, cardRadius);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // --- 2. Centerpiece: The Constellation Sigil Medallion ---
  const medallionY = 240;
  const medallionR = 175;

  ctx.save();
  // Medallion outer background disc
  if (isVellum) {
    ctx.fillStyle = "rgba(43, 93, 125, 0.06)";
    ctx.strokeStyle = "rgba(43, 93, 125, 0.25)";
  } else {
    ctx.fillStyle = "rgba(16, 185, 129, 0.07)";
    ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
  }
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, medallionY, medallionR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner dashed concentric ring
  ctx.setLineDash([6, 8]);
  ctx.strokeStyle = isVellum ? "rgba(43, 93, 125, 0.15)" : "rgba(16, 185, 129, 0.2)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, medallionY, medallionR * 0.72, 0, Math.PI * 2);
  ctx.stroke();

  // Core inner ring
  ctx.setLineDash([]);
  ctx.strokeStyle = isVellum ? "rgba(43, 93, 125, 0.1)" : "rgba(16, 185, 129, 0.12)";
  ctx.beginPath();
  ctx.arc(cx, medallionY, medallionR * 0.42, 0, Math.PI * 2);
  ctx.stroke();

  // Cardinal Crosshair Ticks
  ctx.strokeStyle = isVellum ? "rgba(43, 93, 125, 0.35)" : "rgba(16, 185, 129, 0.45)";
  ctx.lineWidth = 2.5;
  const tickLen = 14;
  // Top
  ctx.beginPath(); ctx.moveTo(cx, medallionY - medallionR); ctx.lineTo(cx, medallionY - medallionR + tickLen); ctx.stroke();
  // Bottom
  ctx.beginPath(); ctx.moveTo(cx, medallionY + medallionR); ctx.lineTo(cx, medallionY + medallionR - tickLen); ctx.stroke();
  // Left
  ctx.beginPath(); ctx.moveTo(cx - medallionR, medallionY); ctx.lineTo(cx - medallionR + tickLen, medallionY); ctx.stroke();
  // Right
  ctx.beginPath(); ctx.moveTo(cx + medallionR, medallionY); ctx.lineTo(cx + medallionR - tickLen, medallionY); ctx.stroke();
  ctx.restore();

  // --- Calculate Constellation Path Points ---
  const coords = (Array.isArray(path) && path.length > 0)
    ? path
    : (level?.start && level?.goal ? [level.start, level.goal] : [[0, 0], [0, 1]]);
  const cols = (level && (level.w || (level.grid && level.grid[0]?.length))) || 4;
  const rows = (level && (level.h || (level.grid && level.grid?.length))) || 4;

  const span = medallionR * 1.35;
  const stepX = cols > 1 ? span / (cols - 1) : 0;
  const stepY = rows > 1 ? span / (rows - 1) : 0;
  const startX = cx - ((cols - 1) * stepX) / 2;
  const startY = medallionY - ((rows - 1) * stepY) / 2;

  const pts = coords.map(([r, c]) => ({
    x: Math.round(startX + c * stepX),
    y: Math.round(startY + r * stepY)
  }));

  // --- Draw Constellation Beam ---
  if (pts.length > 1) {
    const beamColor = isVellum ? "#1D4E6D" : "#10B981";
    const glowColor = isVellum ? "rgba(29, 78, 109, 0.3)" : "rgba(16, 185, 129, 0.35)";

    // Glow trace
    ctx.save();
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
    ctx.restore();

    // Sharp Core Beam
    ctx.save();
    ctx.strokeStyle = beamColor;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // --- Draw Constellation Nodes ---
  pts.forEach((pt, idx) => {
    const isStart = idx === 0;
    const isGoal = idx === pts.length - 1;

    if (isGoal) {
      // Goal Radiant Halo
      ctx.save();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.fillStyle = isVellum ? "#1D4E6D" : "#10B981";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (isStart) {
      // Start node
      ctx.save();
      ctx.fillStyle = isVellum ? "#1D4E6D" : "#38BDF8";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Intermediate star node
      ctx.save();
      ctx.fillStyle = isVellum ? "#2B5D7D" : "#F8FAFC";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });

  // --- 3. Level Title ---
  let titleText = `Level ${String(levelIndex + 1).padStart(levelIndex + 1 >= 100 ? 3 : 2, "0")}`;
  if (isDaily) {
    titleText = "Daily Challenge";
  } else if (isCustom) {
    titleText = "Custom Maze";
  }

  ctx.save();
  ctx.fillStyle = isVellum ? "#1E1C1A" : "#FFFFFF";
  ctx.font = "700 42px 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(titleText, cx, 490);
  ctx.restore();

  // --- 4. Subtitle ---
  let subText = "Cleared";
  let subColor = isVellum ? "#6E6962" : "rgba(255, 255, 255, 0.55)";
  if (isDaily) {
    if (streak > 0) {
      subText = `🔥 ${streak} Day Streak!`;
      subColor = "#F59E0B";
    } else {
      subText = `Daily Solved • ${formatDisplayDate(dateKey)}`;
    }
  } else if (isCustom) {
    subText = "Playtest Complete";
  }

  ctx.save();
  ctx.fillStyle = subColor;
  ctx.font = "600 20px 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(subText, cx, 528);
  ctx.restore();

  // --- 5. Dual-Stat Strip (Efficiency Pill + Moves Pill) ---
  const pillY = 575;
  const pillH = 68;
  const pillW = 280;
  const pillGap = 16;
  const leftPillX = cx - pillW - pillGap / 2;
  const rightPillX = cx + pillGap / 2;
  const pillRadius = 18;

  let tierLabel = "SOLVED";
  let tierColor = isVellum ? "#1D4E6D" : "#10B981";
  let tierBg = isVellum ? "rgba(43, 93, 125, 0.1)" : "rgba(16, 185, 129, 0.12)";
  let tierBorder = isVellum ? "rgba(43, 93, 125, 0.3)" : "rgba(16, 185, 129, 0.35)";

  if (eff >= 100) {
    tierLabel = "FLAWLESS";
    tierColor = isVellum ? "#15803D" : "#10B981";
    tierBg = isVellum ? "rgba(21, 128, 61, 0.1)" : "rgba(16, 185, 129, 0.14)";
    tierBorder = isVellum ? "rgba(21, 128, 61, 0.3)" : "rgba(16, 185, 129, 0.4)";
  } else if (eff >= 85) {
    tierLabel = "EXCELLENT";
    tierColor = isVellum ? "#0284C7" : "#38BDF8";
    tierBg = isVellum ? "rgba(2, 132, 199, 0.1)" : "rgba(56, 189, 248, 0.14)";
    tierBorder = isVellum ? "rgba(2, 132, 199, 0.3)" : "rgba(56, 189, 248, 0.4)";
  } else if (eff >= 70) {
    tierLabel = "GREAT";
    tierColor = "#F59E0B";
    tierBg = "rgba(245, 158, 11, 0.12)";
    tierBorder = "rgba(245, 158, 11, 0.35)";
  }

  // Left Pill: Efficiency
  ctx.save();
  ctx.fillStyle = tierBg;
  ctx.strokeStyle = tierBorder;
  ctx.lineWidth = 1.2;
  drawRoundedRect(ctx, leftPillX, pillY, pillW, pillH, pillRadius);
  ctx.fill();
  ctx.stroke();

  // Efficiency Star & Text
  ctx.fillStyle = tierColor;
  ctx.font = "700 24px 'Space Grotesk', -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`★  ${eff}%`, leftPillX + pillW / 2, pillY + 32);

  ctx.font = "800 13px 'Space Grotesk', -apple-system, sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillText(tierLabel, leftPillX + pillW / 2, pillY + 54);
  ctx.restore();

  // Right Pill: Moves
  ctx.save();
  const movesBg = isVellum ? "rgba(30, 28, 26, 0.06)" : "rgba(255, 255, 255, 0.06)";
  const movesBorder = isVellum ? "rgba(30, 28, 26, 0.14)" : "rgba(255, 255, 255, 0.12)";
  ctx.fillStyle = movesBg;
  ctx.strokeStyle = movesBorder;
  ctx.lineWidth = 1.2;
  drawRoundedRect(ctx, rightPillX, pillY, pillW, pillH, pillRadius);
  ctx.fill();
  ctx.stroke();

  // Moves value
  ctx.fillStyle = isVellum ? "#1E1C1A" : "#FFFFFF";
  ctx.font = "700 24px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${moveCount} / ${optimal}`, rightPillX + pillW / 2, pillY + 32);

  ctx.fillStyle = isVellum ? "#6E6962" : "rgba(255, 255, 255, 0.45)";
  ctx.font = "700 13px 'Space Grotesk', -apple-system, sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillText("MOVES", rightPillX + pillW / 2, pillY + 54);
  ctx.restore();

  // --- 6. Footer Brand Watermark ---
  ctx.save();
  ctx.fillStyle = isVellum ? "rgba(30, 28, 26, 0.35)" : "rgba(255, 255, 255, 0.3)";
  ctx.font = "700 15px 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "4px";
  ctx.fillText("G R I D   L E A P", cx, 730);

  ctx.fillStyle = isVellum ? "rgba(30, 28, 26, 0.22)" : "rgba(255, 255, 255, 0.18)";
  ctx.font = "500 12px 'Space Grotesk', -apple-system, sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("OLAI DIGITAL STUDIOS", cx, 755);
  ctx.restore();

  const dataUrl = canvas.toDataURL("image/png");
  const rawBase64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));

  return {
    canvas,
    dataUrl,
    rawBase64,
    blob
  };
}

/**
 * Helper to draw rounded rectangles on canvas.
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
