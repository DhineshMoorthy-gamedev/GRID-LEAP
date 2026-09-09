/**
 * Visual Level Designer & Diagnostics Lab
 */

import { solve } from "../core/solver.js";
import { LEVELS } from "../data/levels.js";
import { SceneRouter } from "../scenes/scene-router.js";

export const EditorController = {
  level: {
    w: 4,
    h: 4,
    start: [0, 0],
    goal: [3, 3],
    grid: [
      [2, 1, 2, 1],
      [1, 3, 1, 2],
      [2, 1, 1, 1],
      [1, 2, 1, 0]
    ],
    name: "Custom Level",
    phase: "Planning",
    optimal: 4
  },

  selectedBrush: "1", // "1".."7" | "start" | "goal"
  onPlaytestCallback: null,

  init({ onPlaytest }) {
    this.onPlaytestCallback = onPlaytest;
    this.bindDom();
    this.populatePresets();
    this.refresh();
  },

  bindDom() {
    // Back to Hub
    const backBtn = document.getElementById("editorBackBtn");
    if (backBtn) backBtn.addEventListener("click", () => SceneRouter.navigateTo("screenHome"));

    // Name & Phase
    const nameInput = document.getElementById("editorLevelName");
    const phaseInput = document.getElementById("editorLevelPhase");
    if (nameInput) {
      nameInput.value = this.level.name;
      nameInput.addEventListener("input", (e) => {
        this.level.name = e.target.value.trim() || "Custom Level";
      });
    }
    if (phaseInput) {
      phaseInput.value = this.level.phase;
      phaseInput.addEventListener("input", (e) => {
        this.level.phase = e.target.value.trim() || "Custom";
      });
    }

    // Grid Dimension Steppers
    const decBtn = document.getElementById("editorSizeDecBtn");
    const incBtn = document.getElementById("editorSizeIncBtn");
    if (decBtn) decBtn.addEventListener("click", () => this.changeSize(-1));
    if (incBtn) incBtn.addEventListener("click", () => this.changeSize(1));

    // Brush Palette
    const palette = document.getElementById("brushPalette");
    if (palette) {
      palette.addEventListener("click", (e) => {
        const btn = e.target.closest(".brush-btn");
        if (!btn) return;
        palette.querySelectorAll(".brush-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedBrush = btn.dataset.brush;
      });
    }

    // Preset Level Loader
    const presetSelect = document.getElementById("editorPresetSelect");
    if (presetSelect) {
      presetSelect.addEventListener("change", (e) => {
        const idx = parseInt(e.target.value, 10);
        if (!isNaN(idx) && LEVELS[idx]) {
          this.loadFromPreset(LEVELS[idx]);
          e.target.value = "";
        }
      });
    }

    // Export & Import
    const exportBtn = document.getElementById("editorExportBtn");
    const importBtn = document.getElementById("editorImportBtn");
    const copyBtn = document.getElementById("editorJsonCopyBtn");
    const applyBtn = document.getElementById("editorJsonApplyBtn");
    const closeJsonBtn = document.getElementById("closeEditorJsonBtn");

    if (exportBtn) exportBtn.addEventListener("click", () => this.openExportModal());
    if (importBtn) importBtn.addEventListener("click", () => this.openImportModal());
    if (copyBtn) copyBtn.addEventListener("click", () => this.copyJsonToClipboard());
    if (applyBtn) applyBtn.addEventListener("click", () => this.applyJsonImport());
    if (closeJsonBtn) closeJsonBtn.addEventListener("click", () => SceneRouter.popModal());

    // Test Play
    const playtestBtn = document.getElementById("editorPlaytestBtn");
    if (playtestBtn) {
      playtestBtn.addEventListener("click", () => {
        if (typeof this.onPlaytestCallback === "function") {
          this.onPlaytestCallback(this.level);
        }
      });
    }
  },

  populatePresets() {
    const select = document.getElementById("editorPresetSelect");
    if (!select) return;
    select.innerHTML = '<option value="">Remix Shipped Level...</option>';
    LEVELS.forEach((lv, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `Level ${i + 1}: ${lv.name} (${lv.w}x${lv.h})`;
      select.appendChild(opt);
    });
  },

  loadFromPreset(lv) {
    this.level = JSON.parse(JSON.stringify(lv));
    const nameInput = document.getElementById("editorLevelName");
    const phaseInput = document.getElementById("editorLevelPhase");
    if (nameInput) nameInput.value = this.level.name;
    if (phaseInput) phaseInput.value = this.level.phase;
    this.refresh();
  },

  changeSize(delta) {
    const newSize = Math.max(3, Math.min(8, this.level.w + delta));
    if (newSize === this.level.w) return;

    const oldGrid = this.level.grid;
    const newGrid = [];
    for (let r = 0; r < newSize; r++) {
      newGrid.push([]);
      for (let c = 0; c < newSize; c++) {
        if (oldGrid[r] && oldGrid[r][c] !== undefined) {
          newGrid[r].push(oldGrid[r][c]);
        } else {
          newGrid[r].push(1);
        }
      }
    }

    this.level.w = newSize;
    this.level.h = newSize;
    this.level.grid = newGrid;

    // Adjust start & goal if outside bounds
    if (this.level.start[0] >= newSize || this.level.start[1] >= newSize) {
      this.level.start = [0, 0];
    }
    if (this.level.goal[0] >= newSize || this.level.goal[1] >= newSize) {
      this.level.goal = [newSize - 1, newSize - 1];
    }

    this.refresh();
  },

  refresh() {
    const sizeVal = document.getElementById("editorSizeVal");
    if (sizeVal) sizeVal.textContent = `${this.level.w} × ${this.level.h}`;

    this.renderGrid();
    this.runSolverDiagnostics();
  },

  renderGrid() {
    const gridEl = document.getElementById("editorGrid");
    if (!gridEl) return;

    gridEl.style.gridTemplateColumns = `repeat(${this.level.w}, 1fr)`;
    gridEl.innerHTML = "";

    for (let r = 0; r < this.level.h; r++) {
      for (let c = 0; c < this.level.w; c++) {
        const cell = document.createElement("div");
        cell.className = "editor-cell";
        cell.dataset.r = r;
        cell.dataset.c = c;

        const isStart = (r === this.level.start[0] && c === this.level.start[1]);
        const isGoal = (r === this.level.goal[0] && c === this.level.goal[1]);

        if (isStart) cell.classList.add("start-cell");
        if (isGoal) cell.classList.add("goal-cell");

        cell.textContent = this.level.grid[r][c];

        cell.addEventListener("click", () => this.onCellClick(r, c));
        gridEl.appendChild(cell);
      }
    }
  },

  onCellClick(r, c) {
    if (this.selectedBrush === "start") {
      this.level.start = [r, c];
    } else if (this.selectedBrush === "goal") {
      this.level.goal = [r, c];
    } else {
      const val = parseInt(this.selectedBrush, 10);
      if (!isNaN(val)) {
        this.level.grid[r][c] = val;
      }
    }
    this.refresh();
  },

  runSolverDiagnostics() {
    const result = solve(this.level);
    const badge = document.getElementById("editorDiagBadge");
    const statusHeader = document.getElementById("editorSolverStatus");
    const optMovesEl = document.getElementById("editorOptMoves");
    const diffPill = document.getElementById("editorDiffPill");
    const decoyCountEl = document.getElementById("editorDecoyCount");
    const trapDepthEl = document.getElementById("editorTrapDepth");
    const branchLoadEl = document.getElementById("editorBranchLoad");
    const pathTrailEl = document.getElementById("editorPathTrail");

    if (result.solvable) {
      this.level.optimal = result.moves;
      const diff = result.difficulty;

      if (badge) {
        badge.className = "diag-badge valid";
        badge.textContent = "SOLVABLE";
      }
      if (statusHeader) {
        statusHeader.textContent = `SOLVABLE: ${result.moves} MOVES`;
        statusHeader.style.color = "var(--teal)";
      }
      if (diffPill) {
        diffPill.className = `diag-diff-pill ${diff.tier.toLowerCase()}`;
        diffPill.innerHTML = `<span class="star">★</span> <span class="score-num">${diff.score.toFixed(1)}</span> <span class="tier-label">${diff.tier}</span>`;
      }
      if (optMovesEl) optMovesEl.textContent = `${result.moves} moves`;
      if (decoyCountEl) decoyCountEl.textContent = `${result.decoyCount} decoy paths`;
      if (trapDepthEl) trapDepthEl.textContent = `Max ${result.maxTrapDepth} deep`;
      if (branchLoadEl) branchLoadEl.textContent = `${result.avgBranching} exits/step`;

      const trail = result.path.map(([r, c]) => `[${r},${c}]`).join(" → ");
      if (pathTrailEl) pathTrailEl.textContent = `Solution: ${trail}`;
    } else {
      this.level.optimal = 0;
      if (badge) {
        badge.className = "diag-badge invalid";
        badge.textContent = "UNSOLVABLE";
      }
      if (statusHeader) {
        statusHeader.textContent = "UNSOLVABLE (DEAD END)";
        statusHeader.style.color = "var(--danger)";
      }
      if (diffPill) {
        diffPill.className = "diag-diff-pill unsolvable";
        diffPill.innerHTML = `<span class="score-num">--</span> <span class="tier-label">NO PATH</span>`;
      }
      if (optMovesEl) optMovesEl.textContent = "No Path";
      if (decoyCountEl) decoyCountEl.textContent = "0";
      if (trapDepthEl) trapDepthEl.textContent = "--";
      if (branchLoadEl) branchLoadEl.textContent = "--";
      if (pathTrailEl) pathTrailEl.textContent = "No valid path connects START to GOAL.";
    }
  },

  openExportModal() {
    const titleEl = document.getElementById("editorJsonTitle");
    const textEl = document.getElementById("editorJsonText");
    const copyBtn = document.getElementById("editorJsonCopyBtn");
    const applyBtn = document.getElementById("editorJsonApplyBtn");

    if (titleEl) titleEl.textContent = "Export Level Code";
    if (copyBtn) copyBtn.style.display = "block";
    if (applyBtn) applyBtn.style.display = "none";

    const exportData = {
      name: this.level.name,
      phase: this.level.phase,
      w: this.level.w,
      h: this.level.h,
      start: this.level.start,
      goal: this.level.goal,
      optimal: this.level.optimal,
      grid: this.level.grid
    };

    if (textEl) {
      textEl.value = JSON.stringify(exportData, null, 2);
      textEl.readOnly = false;
    }
    SceneRouter.pushModal("EDITOR_JSON");
  },

  openImportModal() {
    const titleEl = document.getElementById("editorJsonTitle");
    const textEl = document.getElementById("editorJsonText");
    const copyBtn = document.getElementById("editorJsonCopyBtn");
    const applyBtn = document.getElementById("editorJsonApplyBtn");

    if (titleEl) titleEl.textContent = "Import Level JSON";
    if (copyBtn) copyBtn.style.display = "none";
    if (applyBtn) applyBtn.style.display = "block";

    if (textEl) {
      textEl.value = "";
      textEl.placeholder = "Paste valid level JSON definition here...";
      textEl.readOnly = false;
    }
    SceneRouter.pushModal("EDITOR_JSON");
  },

  async copyJsonToClipboard() {
    const textEl = document.getElementById("editorJsonText");
    if (!textEl) return;
    try {
      await navigator.clipboard.writeText(textEl.value);
      const copyBtn = document.getElementById("editorJsonCopyBtn");
      if (copyBtn) {
        copyBtn.textContent = "Copied to Clipboard!";
        setTimeout(() => { copyBtn.textContent = "Copy Code"; }, 1500);
      }
    } catch (_) {
      textEl.select();
      document.execCommand("copy");
    }
  },

  applyJsonImport() {
    const textEl = document.getElementById("editorJsonText");
    if (!textEl) return;
    try {
      const parsed = JSON.parse(textEl.value);
      if (!parsed.grid || !parsed.start || !parsed.goal) {
        alert("Invalid level JSON structure. Missing grid, start, or goal.");
        return;
      }
      this.loadFromPreset(parsed);
      SceneRouter.popModal();
    } catch (err) {
      alert("JSON Syntax Error: " + err.message);
    }
  }
};