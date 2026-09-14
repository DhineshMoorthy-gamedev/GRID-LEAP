/**
 * Dedicated Interactive Tutorial Sandbox Controller
 * Provides hands-on interactive micro-levels directly in the How-to-Play modal.
 */

import { calculateLegalDestinations } from "../core/rules.js";
import { PlatformBridge } from "../platform/lifecycle.js";
import { SceneRouter } from "./scene-router.js";

const TUTORIAL_STAGES = [
  // --- LESSON 1: Leap Distance 1 ---
  {
    lesson: "LESSON 1",
    lessonNum: 1,
    title: "Number = Leap Distance",
    prompt: "Swipe RIGHT to leap 1 tile into Goal.",
    successMsg: "Standing on 1 = 1 tile leap! 🎯",
    w: 2,
    h: 1,
    start: [0, 0],
    goal: [0, 1],
    grid: [
      [1, 0]
    ],
    hintSwipe: { from: [0, 0], to: [0, 1], dir: "right" }
  },
  // --- LESSON 2: Leap Distance 2 (DOWN) ---
  {
    lesson: "LESSON 2",
    lessonNum: 2,
    title: "Leap Over Empty Tiles",
    prompt: "Standing on 2 leaps you 2 tiles DOWN.",
    successMsg: "Leapt 2 tiles down to Goal! 🚀",
    w: 1,
    h: 3,
    start: [0, 0],
    goal: [2, 0],
    grid: [
      [2],
      [1],
      [0]
    ],
    hintSwipe: { from: [0, 0], to: [2, 0], dir: "down" }
  },
  // --- LESSON 3: Leap Distance 3 (LEFT) ---
  {
    lesson: "LESSON 3",
    lessonNum: 3,
    title: "Longer Leap Distance",
    prompt: "Standing on 3 leaps you 3 tiles LEFT.",
    successMsg: "Tile number = leap distance! 💥",
    w: 4,
    h: 1,
    start: [0, 3],
    goal: [0, 0],
    grid: [
      [0, 1, 1, 3]
    ],
    hintSwipe: { from: [0, 3], to: [0, 0], dir: "left" }
  },
  // --- LESSON 4: Chaining Leaps (UP) ---
  {
    lesson: "LESSON 4",
    lessonNum: 4,
    title: "Chain Your Leaps",
    prompt: "Swipe UP to 1, then leap UP to Goal.",
    successMsg: "Smooth rhythm! 2 leaps chained. ⚡",
    w: 1,
    h: 3,
    start: [2, 0],
    goal: [0, 0],
    grid: [
      [0],
      [1],
      [1]
    ],
    hintSwipe: { from: [2, 0], to: [1, 0], dir: "up" },
    step2Hint: { from: [1, 0], to: [0, 0], dir: "up", prompt: "Now swipe UP into the Goal! 🎯" }
  },
  // --- LESSON 5: Power Increase (RIGHT) ---
  {
    lesson: "LESSON 5",
    lessonNum: 5,
    title: "Tile Changes Power",
    prompt: "Land on 2 to boost leap distance.",
    successMsg: "Landed on 2 = boosted leap! ⚡",
    w: 4,
    h: 1,
    start: [0, 0],
    goal: [0, 3],
    grid: [
      [1, 2, 1, 0]
    ],
    hintSwipe: { from: [0, 0], to: [0, 1], dir: "right" },
    step2Hint: { from: [0, 1], to: [0, 3], dir: "right", prompt: "Now on 2! Swipe 2 tiles to Goal! 🎯" }
  },
  // --- LESSON 6: Power Decrease (LEFT) ---
  {
    lesson: "LESSON 6",
    lessonNum: 6,
    title: "Step Down Power",
    prompt: "Leap 2 tiles LEFT to 1, then to Goal.",
    successMsg: "Power stepped down to 1! 🎯",
    w: 4,
    h: 1,
    start: [0, 3],
    goal: [0, 0],
    grid: [
      [0, 1, 1, 2]
    ],
    hintSwipe: { from: [0, 3], to: [0, 1], dir: "left" },
    step2Hint: { from: [0, 1], to: [0, 0], dir: "left", prompt: "Now on 1! Swipe into the Goal! 🎯" }
  },
  // --- LESSON 7: Cardinal Turns ---
  {
    lesson: "LESSON 7",
    lessonNum: 7,
    isCardinal: true,
    title: "Turn in 4 Directions",
    prompt: "Swipe UP onto 1.",
    successMsg: "Great turn! Up and Right leaps. 🧭",
    w: 3,
    h: 3,
    start: [1, 1],
    goal: [0, 2],
    grid: [
      [2, 1, 0],
      [1, 1, 2],
      [2, 1, 2]
    ],
    hintSwipe: { from: [1, 1], to: [0, 1], dir: "up" },
    step2Hint: { from: [0, 1], to: [0, 2], dir: "right", prompt: "Now turn and swipe RIGHT to Goal! 🎯" },
    wrongMoves: {
      "2,1": "❌ Goal is upper-right! Resetting...",
      "1,0": "❌ Goal is upper-right! Resetting..."
    }
  },
  // --- LESSON 8: Cardinal Freedom ---
  {
    lesson: "LESSON 8",
    lessonNum: 8,
    isCardinal: true,
    title: "Follow the Chevrons",
    prompt: "Look at arrows (↑, ↓, ←, →). Swipe DOWN!",
    successMsg: "Ready to play! Tutorial clear! 🏆",
    w: 3,
    h: 3,
    start: [1, 1],
    goal: [2, 1],
    grid: [
      [2, 1, 2],
      [1, 1, 1],
      [2, 0, 2]
    ],
    hintSwipe: { from: [1, 1], to: [2, 1], dir: "down" },
    wrongMoves: {
      "0,1": "❌ Goal is DOWN! Resetting...",
      "1,0": "❌ Goal is DOWN! Resetting...",
      "1,2": "❌ Goal is DOWN! Resetting..."
    }
  }
];

export const TutorialController = {
  currentStageIdx: 0,
  playerPos: [0, 0],
  isAnimating: false,
  isStageSolved: false,
  isWrongState: false,
  _promptResetTimer: null,
  _autoAdvanceTimer: null,
  _autoResetTimer: null,

  dom: {
    modal: null,
    board: null,
    boardContainer: null,
    arcSvg: null,
    arcActive: null,
    arcStep2: null,
    arrowActive: null,
    arrowStep2: null,
    dots: null,
    eyebrow: null,
    title: null,
    prompt: null,
    promptBox: null,
    closeX: null,
    resetBtn: null,
    actionBtn: null,
    closeBtn: null,
    welcomeView: null,
    gameView: null,
    completeView: null,
    welcomeStartBtn: null,
    welcomeCloseX: null,
    completeCampaignBtn: null,
    completeHomeBtn: null,
    completeReplayBtn: null,
    completeCloseX: null
  },

  setView(viewName) {
    const modal = this.dom.modal || document.getElementById("rulesModal");
    if (modal) {
      modal.dataset.view = viewName;
    }
  },

  init() {
    this.dom.modal = document.getElementById("tutorialModal") || document.getElementById("rulesModal");
    this.dom.board = document.getElementById("tutorialBoard");
    this.dom.boardContainer = document.getElementById("tutorialBoardContainer");
    this.dom.arcSvg = document.getElementById("tutorialArcSvg");
    this.dom.arcActive = document.getElementById("tutArcPathActive");
    this.dom.arcStep2 = document.getElementById("tutArcPathStep2");
    this.dom.arrowActive = document.getElementById("tutArcArrowActive");
    this.dom.arrowStep2 = document.getElementById("tutArcArrowStep2");
    this.dom.dots = document.getElementById("tutorialDots");
    this.dom.eyebrow = document.getElementById("tutorialEyebrow");
    this.dom.title = document.getElementById("tutorialTitle");
    this.dom.prompt = document.getElementById("tutorialPrompt");
    this.dom.promptBox = document.querySelector(".tutorial-prompt-box");
    this.dom.closeX = document.getElementById("tutorialCloseX");
    this.dom.resetBtn = document.getElementById("tutorialResetBtn");
    this.dom.actionBtn = document.getElementById("tutorialActionBtn");
    this.dom.closeBtn = document.getElementById("closeTutorialBtn");

    // Subviews & Simple Modal Buttons
    this.dom.welcomeView = document.getElementById("tutorialWelcomeView");
    this.dom.gameView = document.getElementById("tutorialGameView");
    this.dom.completeView = document.getElementById("tutorialCompleteView");
    this.dom.welcomeStartBtn = document.getElementById("welcomeStartBtn");
    this.dom.welcomeCloseX = document.getElementById("welcomeCloseX");
    this.dom.completeCampaignBtn = document.getElementById("completeCampaignBtn");
    this.dom.completeHomeBtn = document.getElementById("completeHomeBtn");
    this.dom.completeReplayBtn = document.getElementById("completeReplayBtn");
    this.dom.completeCloseX = document.getElementById("completeCloseX");

    if (this.dom.welcomeStartBtn) {
      this.dom.welcomeStartBtn.addEventListener("click", () => {
        this.startTutorialFromWelcome();
      });
    }

    if (this.dom.welcomeCloseX) {
      this.dom.welcomeCloseX.addEventListener("click", () => this.close());
    }

    if (this.dom.completeCampaignBtn) {
      this.dom.completeCampaignBtn.addEventListener("click", () => {
        this.close();
        if (window.SceneRouter) {
          window.SceneRouter.showScreen("GAME");
        }
      });
    }

    if (this.dom.completeHomeBtn) {
      this.dom.completeHomeBtn.addEventListener("click", () => {
        this.close();
        if (window.SceneRouter) {
          window.SceneRouter.showScreen("HOME");
        }
      });
    }

    if (this.dom.completeReplayBtn) {
      this.dom.completeReplayBtn.addEventListener("click", () => {
        this.loadStage(0);
      });
    }

    if (this.dom.completeCloseX) {
      this.dom.completeCloseX.addEventListener("click", () => this.close());
    }

    if (this.dom.closeX) {
      this.dom.closeX.addEventListener("click", () => this.close());
    }

    if (this.dom.resetBtn) {
      this.dom.resetBtn.addEventListener("click", () => this.resetCurrentStage());
    }

    if (this.dom.actionBtn) {
      this.dom.actionBtn.addEventListener("click", () => this.handleActionClick());
    }

    if (this.dom.closeBtn) {
      this.dom.closeBtn.addEventListener("click", () => this.close());
    }

    window.addEventListener("resize", () => {
      if (this.isOpen()) {
        const stage = TUTORIAL_STAGES[this.currentStageIdx];
        if (stage && this.dom.board) {
          const isTablet = window.innerWidth >= 560 && window.innerHeight >= 760;
          const cellSize = isTablet ? 64 : 54;
          this.dom.board.style.setProperty("--tut-cell-size", `${cellSize}px`);
          this.dom.board.style.gridTemplateColumns = `repeat(${stage.w}, ${cellSize}px)`;
          this.dom.board.style.gridTemplateRows = `repeat(${stage.h}, ${cellSize}px)`;
          this.placeToken(this.playerPos, false);
        }
      }
      if (this.dom.arcSvg && this.dom.arcSvg.style.display !== "none") {
        this.showArcGuide();
      }
    });

    this.setupSwipeHandling();
  },

  open(stageIndex = null) {
    SceneRouter.pushModal("RULES");
    if (stageIndex === null || typeof stageIndex === "undefined") {
      this.setView("welcome");
    } else {
      this.currentStageIdx = Math.max(0, Math.min(stageIndex, TUTORIAL_STAGES.length - 1));
      this.loadStage(this.currentStageIdx);
    }
  },

  startTutorialFromWelcome() {
    this.currentStageIdx = 0;
    this.loadStage(0);
  },

  close() {
    clearTimeout(this._autoAdvanceTimer);
    clearTimeout(this._autoResetTimer);
    clearTimeout(this._promptResetTimer);
    SceneRouter.popModal();
  },

  loadStage(idx) {
    this.setView("game");
    this.hideArcGuide();
    this.currentStageIdx = idx;
    const stage = TUTORIAL_STAGES[idx];
    this.playerPos = [stage.start[0], stage.start[1]];
    this.isAnimating = false;
    this.isStageSolved = false;
    this.isWrongState = false;
    clearTimeout(this._promptResetTimer);
    clearTimeout(this._autoAdvanceTimer);
    clearTimeout(this._autoResetTimer);

    // Reset Prompt Box styles
    if (this.dom.promptBox) {
      this.dom.promptBox.classList.remove("error-state");
    }
    if (this.dom.prompt) {
      this.dom.prompt.textContent = stage.prompt;
      this.dom.prompt.classList.remove("solved", "error-hint");
    }
    if (this.dom.resetBtn) {
      this.dom.resetBtn.classList.remove("attention", "shake-error");
    }

    // Update Lesson Badge & Step Dots
    if (this.dom.eyebrow) {
      this.dom.eyebrow.textContent = `LESSON ${stage.lessonNum}`;
    }
    if (this.dom.dots) {
      this.dom.dots.innerHTML = TUTORIAL_STAGES.map((s, i) =>
        `<span class="tut-dot ${i === idx ? "active" : ""}${i < idx ? " done" : ""}" title="${s.title}"></span>`
      ).join("");
      this.dom.dots.querySelectorAll(".tut-dot").forEach((dot, i) => {
        dot.style.cursor = "pointer";
        dot.addEventListener("click", () => this.loadStage(i));
      });
    }

    // Update Title & Action Button
    if (this.dom.title) this.dom.title.textContent = stage.title;

    if (this.dom.actionBtn) {
      this.dom.actionBtn.disabled = true;
      this.dom.actionBtn.classList.remove("primary");
      this.dom.actionBtn.textContent = idx === TUTORIAL_STAGES.length - 1 ? "Start Playing! 🚀" : "Next ▶";
    }

    this.renderMicroBoard(stage);
    this.updateLegalHighlights();
    this.showArcGuide();
  },

  resetCurrentStage() {
    this.loadStage(this.currentStageIdx);
    PlatformBridge.vibrateLight?.();
  },

  handleActionClick() {
    if (!this.isStageSolved) return;
    if (this.currentStageIdx < TUTORIAL_STAGES.length - 1) {
      this.loadStage(this.currentStageIdx + 1);
    } else {
      this.close();
    }
  },

  renderMicroBoard(stage) {
    if (!this.dom.board) return;
    this.dom.board.innerHTML = "";
    const isTablet = window.innerWidth >= 560 && window.innerHeight >= 760;
    const cellSize = isTablet ? 64 : 54;
    this.dom.board.style.setProperty("--tut-cell-size", `${cellSize}px`);
    this.dom.board.style.gridTemplateColumns = `repeat(${stage.w}, ${cellSize}px)`;
    this.dom.board.style.gridTemplateRows = `repeat(${stage.h}, ${cellSize}px)`;

    for (let r = 0; r < stage.h; r++) {
      for (let c = 0; c < stage.w; c++) {
        const cell = document.createElement("div");
        cell.className = "cell tut-cell";
        cell.dataset.r = r;
        cell.dataset.c = c;

        const isGoal = (r === stage.goal[0] && c === stage.goal[1]);
        const isStart = (r === stage.start[0] && c === stage.start[1]);
        if (isStart) cell.classList.add("start-cell");

        if (isGoal) {
          cell.classList.add("goal-cell");
          cell.innerHTML = '<span class="cell-glyph goal-label">GOAL</span>';
        } else {
          cell.innerHTML = `<span class="cell-glyph">${stage.grid[r][c]}</span>`;
        }

        cell.addEventListener("click", () => this.attemptMoveTo(r, c));
        this.dom.board.appendChild(cell);
      }
    }

    // Create Token Frame Element with Directional Chevrons
    const token = document.createElement("div");
    token.className = "token tut-token";
    token.id = "tutToken";
    token.innerHTML = `
      <div class="token-inner">
        <div class="token-frame"></div>
        <div class="token-dir-arrow up" id="tutTokenDirUp">
          <svg viewBox="0 0 12 12" width="12" height="12"><path d="M2.5 7.5 L6 3.5 L9.5 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="token-dir-arrow down" id="tutTokenDirDown">
          <svg viewBox="0 0 12 12" width="12" height="12"><path d="M2.5 4.5 L6 8.5 L9.5 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="token-dir-arrow left" id="tutTokenDirLeft">
          <svg viewBox="0 0 12 12" width="12" height="12"><path d="M7.5 2.5 L3.5 6 L7.5 9.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="token-dir-arrow right" id="tutTokenDirRight">
          <svg viewBox="0 0 12 12" width="12" height="12"><path d="M4.5 2.5 L8.5 6 L4.5 9.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    `;
    this.dom.board.appendChild(token);

    this.placeToken(this.playerPos, false);
  },

  placeToken(pos, animate = true) {
    const token = document.getElementById("tutToken");
    if (!token || !this.dom.board) return;

    const cell = this.dom.board.querySelector(`.tut-cell[data-r="${pos[0]}"][data-c="${pos[1]}"]`);
    if (!cell) return;

    if (!animate) token.style.transition = "none";
    else token.style.transition = "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)";

    token.style.width = cell.offsetWidth + "px";
    token.style.height = cell.offsetHeight + "px";
    token.style.transform = `translate(${cell.offsetLeft}px, ${cell.offsetTop}px)`;

    if (!animate) {
      void token.offsetWidth;
      token.style.transition = "";
    }

    // Toggle current-cell on the active cell
    this.dom.board.querySelectorAll(".tut-cell").forEach(c => {
      const r = parseInt(c.dataset.r, 10);
      const col = parseInt(c.dataset.c, 10);
      const isCurrent = (r === pos[0] && col === pos[1]);
      c.classList.toggle("current-cell", isCurrent);
      if (!isCurrent) {
        c.classList.remove("wrong-cell");
      }
    });
  },

  updateLegalHighlights() {
    if (this.isWrongState) {
      this.dom.board?.querySelectorAll(".tut-cell").forEach(cell => {
        cell.classList.remove("legal-dest", "pulse");
      });
      ["Up", "Down", "Left", "Right"].forEach(d => {
        const arrow = document.getElementById(`tutTokenDir${d}`);
        if (arrow) arrow.classList.add("disabled");
      });
      return;
    }

    const stage = TUTORIAL_STAGES[this.currentStageIdx];
    const legal = calculateLegalDestinations(stage, this.playerPos);

    this.dom.board?.querySelectorAll(".tut-cell").forEach(cell => {
      const r = parseInt(cell.dataset.r, 10);
      const c = parseInt(cell.dataset.c, 10);
      const isLegal = legal.some(l => l.r === r && l.c === c);
      cell.classList.toggle("legal-dest", isLegal);
      cell.classList.toggle("pulse", isLegal);
    });

    // Update directional arrows on the token
    const hasUp = legal.some(d => d.dir === "up");
    const hasDown = legal.some(d => d.dir === "down");
    const hasLeft = legal.some(d => d.dir === "left");
    const hasRight = legal.some(d => d.dir === "right");

    const arrowUp = document.getElementById("tutTokenDirUp");
    const arrowDown = document.getElementById("tutTokenDirDown");
    const arrowLeft = document.getElementById("tutTokenDirLeft");
    const arrowRight = document.getElementById("tutTokenDirRight");

    if (arrowUp) arrowUp.classList.toggle("disabled", !hasUp);
    if (arrowDown) arrowDown.classList.toggle("disabled", !hasDown);
    if (arrowLeft) arrowLeft.classList.toggle("disabled", !hasLeft);
    if (arrowRight) arrowRight.classList.toggle("disabled", !hasRight);
  },

  handleLandedOnWrongCell(r, c, customMsg = null) {
    this.isWrongState = true;
    const stage = TUTORIAL_STAGES[this.currentStageIdx];
    clearTimeout(this._promptResetTimer);
    clearTimeout(this._autoResetTimer);

    PlatformBridge.vibrateWarning?.();

    // Mark landed cell with red error styling and shake
    const cell = this.dom.board?.querySelector(`.tut-cell[data-r="${r}"][data-c="${c}"]`);
    if (cell) {
      cell.classList.add("wrong-cell");
      cell.classList.remove("shake-error");
      void cell.offsetWidth;
      cell.classList.add("shake-error");
    }

    // Mark token as error and shake inner frame
    const token = document.getElementById("tutToken");
    if (token) {
      token.classList.add("token-error");
      const inner = token.querySelector(".token-inner");
      if (inner) {
        inner.classList.remove("shake-error-inner");
        void inner.offsetWidth;
        inner.classList.add("shake-error-inner");
      }
    }

    // Clear legal highlights and arrows
    this.updateLegalHighlights();

    // Set error prompt
    const msg = customMsg || stage.wrongMoves?.[`${r},${c}`] || "❌ Dead End! Resetting...";
    if (this.dom.prompt) {
      this.dom.prompt.textContent = msg;
      this.dom.prompt.classList.add("error-hint");
    }
    if (this.dom.promptBox) {
      this.dom.promptBox.classList.add("error-state");
    }

    // Call attention to the Reset button if present
    if (this.dom.resetBtn) {
      this.dom.resetBtn.classList.add("attention");
    }

    this.hideArcGuide();

    // Automated reset back to start of current stage
    this._autoResetTimer = setTimeout(() => {
      if (this.isWrongState) {
        this.resetCurrentStage();
      }
    }, 850);
  },

  handleWrongMoveFeedback(attemptedDir = null, tappedR = null, tappedC = null) {
    PlatformBridge.vibrateWarning?.() || PlatformBridge.vibrateLight?.();

    // If already in wrong state, shake current cell and draw attention to Reset button
    if (this.isWrongState) {
      if (this.dom.resetBtn) {
        this.dom.resetBtn.classList.remove("shake-error");
        void this.dom.resetBtn.offsetWidth;
        this.dom.resetBtn.classList.add("shake-error");
      }
      const [pr, pc] = this.playerPos;
      const currentCell = this.dom.board?.querySelector(`.tut-cell[data-r="${pr}"][data-c="${pc}"]`);
      if (currentCell) {
        currentCell.classList.remove("shake-error");
        void currentCell.offsetWidth;
        currentCell.classList.add("shake-error");
      }
      return;
    }

    // Flash tapped invalid cell red if provided
    if (tappedR !== null && tappedC !== null) {
      const targetCell = this.dom.board?.querySelector(`.tut-cell[data-r="${tappedR}"][data-c="${tappedC}"]`);
      if (targetCell) {
        targetCell.classList.remove("illegal-tap", "shake-error");
        void targetCell.offsetWidth;
        targetCell.classList.add("illegal-tap", "shake-error");
        setTimeout(() => targetCell.classList.remove("illegal-tap", "shake-error"), 400);
      }
    }

    // Shake the token / active cell
    const [pr, pc] = this.playerPos;
    const currentCell = this.dom.board?.querySelector(`.tut-cell[data-r="${pr}"][data-c="${pc}"]`);
    if (currentCell) {
      currentCell.classList.remove("shake-error");
      void currentCell.offsetWidth;
      currentCell.classList.add("shake-error");
    }

    const token = document.getElementById("tutToken");
    if (token) {
      const inner = token.querySelector(".token-inner");
      if (inner) {
        inner.classList.remove("shake-error-inner");
        void inner.offsetWidth;
        inner.classList.add("shake-error-inner");
      }
    }

    // Show temporary feedback toast / prompt
    const stage = TUTORIAL_STAGES[this.currentStageIdx];
    const currentVal = stage.grid[pr][pc];
    if (this.dom.prompt) {
      this.dom.prompt.textContent = `❌ Cannot leap that way! Stand on ${currentVal} = ${currentVal} tiles.`;
      this.dom.prompt.classList.add("error-hint");
      if (this.dom.promptBox) this.dom.promptBox.classList.add("error-state");

      clearTimeout(this._promptResetTimer);
      this._promptResetTimer = setTimeout(() => {
        if (!this.isStageSolved && !this.isWrongState && this.dom.prompt) {
          this.dom.prompt.textContent = stage.prompt;
          this.dom.prompt.classList.remove("error-hint");
          if (this.dom.promptBox) this.dom.promptBox.classList.remove("error-state");
        }
      }, 2000);
    }
  },

  attemptMoveTo(targetR, targetC) {
    if (this.isAnimating || this.isStageSolved) return;

    if (this.isWrongState) {
      this.handleWrongMoveFeedback();
      return;
    }

    const stage = TUTORIAL_STAGES[this.currentStageIdx];
    const legal = calculateLegalDestinations(stage, this.playerPos);
    const match = legal.find(l => l.r === targetR && l.c === targetC);

    if (!match) {
      this.handleWrongMoveFeedback(null, targetR, targetC);
      return;
    }

    this.hideArcGuide();
    this.isAnimating = true;
    this.playerPos = [targetR, targetC];
    this.placeToken(this.playerPos, true);
    PlatformBridge.vibrateLight?.();

    setTimeout(() => {
      this.isAnimating = false;

      // 1. Check if reached Goal
      if (this.playerPos[0] === stage.goal[0] && this.playerPos[1] === stage.goal[1]) {
        this.updateLegalHighlights();
        this.handleStageSolved();
        return;
      }

      // 2. Check if reached intermediate step in multi-step stage
      if (stage.step2Hint && targetR === stage.step2Hint.from[0] && targetC === stage.step2Hint.from[1]) {
        this.updateLegalHighlights();
        if (this.dom.prompt && stage.step2Hint.prompt) {
          this.dom.prompt.textContent = stage.step2Hint.prompt;
        }
        this.showArcGuide();
        return;
      }

      // 3. Any other destination in the tutorial is a wrong move or dead end
      const key = `${targetR},${targetC}`;
      const updatedLegal = calculateLegalDestinations(stage, this.playerPos);

      if (stage.wrongMoves && stage.wrongMoves[key]) {
        this.handleLandedOnWrongCell(targetR, targetC, stage.wrongMoves[key]);
        return;
      }

      if (updatedLegal.length === 0) {
        this.handleLandedOnWrongCell(targetR, targetC, "❌ Dead End! Resetting...");
        return;
      }

      this.handleLandedOnWrongCell(targetR, targetC);
    }, 240);
  },

  handleStageSolved() {
    this.isStageSolved = true;
    this.isWrongState = false;
    clearTimeout(this._promptResetTimer);
    clearTimeout(this._autoAdvanceTimer);
    clearTimeout(this._autoResetTimer);

    const stage = TUTORIAL_STAGES[this.currentStageIdx];
    PlatformBridge.vibrateSuccess?.();

    if (this.dom.promptBox) {
      this.dom.promptBox.classList.remove("error-state");
    }

    if (this.dom.prompt) {
      this.dom.prompt.textContent = stage.successMsg;
      this.dom.prompt.classList.remove("error-hint");
      this.dom.prompt.classList.add("solved");
    }

    if (this.dom.resetBtn) {
      this.dom.resetBtn.classList.remove("attention");
    }

    if (this.dom.actionBtn) {
      this.dom.actionBtn.disabled = false;
      this.dom.actionBtn.classList.add("primary");
    }

    // Flash goal
    const goalCell = this.dom.board?.querySelector(".tut-cell.goal-cell");
    if (goalCell) goalCell.classList.add("pulse-success");

    // Automated advance to next stage (~750ms) or transition to Complete screen after final stage (~850ms)
    const isLastStage = (this.currentStageIdx >= TUTORIAL_STAGES.length - 1);
    const delay = isLastStage ? 850 : 750;

    this._autoAdvanceTimer = setTimeout(() => {
      if (!isLastStage) {
        this.loadStage(this.currentStageIdx + 1);
      } else {
        this.showCompleteScreen();
      }
    }, delay);
  },

  showCompleteScreen() {
    this.setView("complete");
    PlatformBridge.vibrateSuccess?.();
  },

  isOpen() {
    const modal = this.dom.modal || document.getElementById("rulesModal");
    return Boolean(modal && modal.classList.contains("show"));
  },

  setupSwipeHandling() {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isTrackingTouch = false;
    let isTrackingMouse = false;

    const onSwipeDetected = (dx, dy, dt) => {
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Require at least 20px of travel and duration under 900ms
      if (Math.max(absDx, absDy) < 20 || dt > 900) return;

      let dir = null;
      if (absDx > absDy) {
        dir = dx > 0 ? "right" : "left";
      } else {
        dir = dy > 0 ? "down" : "up";
      }

      this.handleSwipeDirection(dir);
    };

    const isInteractiveTarget = (target) => {
      if (!target || typeof target.closest !== "function") return false;
      return Boolean(target.closest("#tutorialCloseX, .tut-dot, button, a, input, select, textarea"));
    };

    // --- 1. Touch Events: Swipe anywhere on screen while tutorial is active ---
    window.addEventListener("touchstart", (e) => {
      if (!this.isOpen()) return;
      if (e.touches.length !== 1) {
        isTrackingTouch = false;
        return;
      }
      if (isInteractiveTarget(e.target)) {
        isTrackingTouch = false;
        return;
      }
      isTrackingTouch = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (!this.isOpen() || !isTrackingTouch) return;
      if (e.touches.length > 1) {
        isTrackingTouch = false;
      }
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      if (!this.isOpen() || !isTrackingTouch) {
        isTrackingTouch = false;
        return;
      }
      isTrackingTouch = false;
      if (!e.changedTouches || e.changedTouches.length === 0) return;

      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const dt = Date.now() - startTime;
      onSwipeDetected(dx, dy, dt);
    }, { passive: true });

    window.addEventListener("touchcancel", () => {
      isTrackingTouch = false;
    }, { passive: true });

    // --- 2. Pointer / Mouse Drag: Click-and-drag anywhere on desktop ---
    window.addEventListener("mousedown", (e) => {
      if (!this.isOpen() || e.button !== 0) return;
      if (isInteractiveTarget(e.target)) {
        isTrackingMouse = false;
        return;
      }
      isTrackingMouse = true;
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
    });

    window.addEventListener("mouseup", (e) => {
      if (!this.isOpen() || !isTrackingMouse) {
        isTrackingMouse = false;
        return;
      }
      isTrackingMouse = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const dt = Date.now() - startTime;
      onSwipeDetected(dx, dy, dt);
    });

    // --- 3. Keyboard Navigation (Arrow keys & WASD while tutorial is open) ---
    window.addEventListener("keydown", (e) => {
      if (!this.isOpen()) return;

      const keyMap = {
        ArrowUp: "up",
        KeyW: "up",
        w: "up",
        W: "up",
        ArrowDown: "down",
        KeyS: "down",
        s: "down",
        S: "down",
        ArrowLeft: "left",
        KeyA: "left",
        a: "left",
        A: "left",
        ArrowRight: "right",
        KeyD: "right",
        d: "right",
        D: "right"
      };

      const dir = keyMap[e.key] || keyMap[e.code];
      if (dir) {
        e.preventDefault();
        this.handleSwipeDirection(dir);
      }
    });
  },

  handleSwipeDirection(dir) {
    if (this.isAnimating || this.isStageSolved) return;

    if (this.isWrongState) {
      this.handleWrongMoveFeedback();
      return;
    }

    const stage = TUTORIAL_STAGES[this.currentStageIdx];
    const legal = calculateLegalDestinations(stage, this.playerPos);
    const match = legal.find(l => l.dir === dir);

    if (match) {
      this.attemptMoveTo(match.r, match.c);
    } else {
      this.handleWrongMoveFeedback(dir);
    }
  },

  calculateArcD(fromCell, toCell) {
    const container = this.dom.boardContainer || this.dom.board?.parentElement;
    if (!container || !fromCell || !toCell) return { d: "", arrowPoints: "" };

    const cRect = container.getBoundingClientRect();
    const fRect = fromCell.getBoundingClientRect();
    const tRect = toCell.getBoundingClientRect();

    const fCenterX = (fRect.left + fRect.width / 2) - cRect.left;
    const fCenterY = (fRect.top + fRect.height / 2) - cRect.top;
    const tCenterX = (tRect.left + tRect.width / 2) - cRect.left;
    const tCenterY = (tRect.top + tRect.height / 2) - cRect.top;

    const isVertical = Math.abs(tCenterY - fCenterY) > Math.abs(tCenterX - fCenterX);

    if (isVertical) {
      // Vertical leap (DOWN or UP): Arc curves outward to the right side of the column
      const fRight = fRect.right - cRect.left;
      const tRight = tRect.right - cRect.left;

      const tipX = tRight + 2;
      const arrowW = 7;
      const halfH = 4.5;
      const baseX = tipX + arrowW;
      const arrowPoints = `${tipX.toFixed(1)},${tCenterY.toFixed(1)} ${baseX.toFixed(1)},${(tCenterY - halfH).toFixed(1)} ${baseX.toFixed(1)},${(tCenterY + halfH).toFixed(1)}`;

      const startX = fRight + 2;
      const startY = fCenterY;
      const dist = Math.abs(tCenterY - fCenterY);
      const arcW = Math.min(38, Math.max(22, dist * 0.24));
      const peakX = Math.max(startX, baseX) + arcW;

      const d = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${peakX.toFixed(1)} ${startY.toFixed(1)}, ${peakX.toFixed(1)} ${tCenterY.toFixed(1)}, ${baseX.toFixed(1)} ${tCenterY.toFixed(1)}`;

      return { d, arrowPoints };
    } else {
      // Horizontal leap (RIGHT or LEFT): Arc arches over the top of the cells
      const fTop = fRect.top - cRect.top;
      const tTop = tRect.top - cRect.top;

      const tipY = tTop - 2;
      const arrowH = 7;
      const halfW = 4.5;
      const baseY = tipY - arrowH;
      const arrowPoints = `${tCenterX.toFixed(1)},${tipY.toFixed(1)} ${(tCenterX - halfW).toFixed(1)},${baseY.toFixed(1)} ${(tCenterX + halfW).toFixed(1)},${baseY.toFixed(1)}`;

      const startY = fTop - 2;
      const dist = Math.abs(tCenterX - fCenterX);
      const arcH = Math.min(38, Math.max(20, dist * 0.24));
      const peakY = Math.min(startY, baseY) - arcH;

      const d = `M ${fCenterX.toFixed(1)} ${startY.toFixed(1)} C ${fCenterX.toFixed(1)} ${peakY.toFixed(1)}, ${tCenterX.toFixed(1)} ${peakY.toFixed(1)}, ${tCenterX.toFixed(1)} ${baseY.toFixed(1)}`;

      return { d, arrowPoints };
    }
  },

  showArcGuide() {
    if (!this.dom.arcSvg || !this.dom.board) return;
    const stage = TUTORIAL_STAGES[this.currentStageIdx];
    // Cardinal levels (stages 7 and 8 / 3x3 board): do not show any trajectory arcs (player relies on cardinal chevrons)
    if (!stage || stage.isCardinal || this.currentStageIdx >= 6) {
      this.hideArcGuide();
      return;
    }

    requestAnimationFrame(() => {
      const container = this.dom.boardContainer || this.dom.board?.parentElement;
      if (container && container.offsetWidth === 0) {
        setTimeout(() => this.showArcGuide(), 50);
        return;
      }

      const [pr, pc] = this.playerPos;
      const currentCell = this.dom.board?.querySelector(`.tut-cell[data-r="${pr}"][data-c="${pc}"]`);
      if (!currentCell) return;

      let nextTarget = null;
      let secondTarget = null;

      if (stage.step2Hint) {
        if (pr === stage.start[0] && pc === stage.start[1]) {
          // At start of multi-step level:
          nextTarget = stage.step2Hint.from;
          secondTarget = stage.step2Hint.to;
        } else if (pr === stage.step2Hint.from[0] && pc === stage.step2Hint.from[1]) {
          // At intermediate step:
          nextTarget = stage.step2Hint.to;
          secondTarget = null;
        }
      } else {
        // Single leap level: direct arc to Goal
        nextTarget = stage.goal;
      }

      if (!nextTarget) return;

      const targetCell = this.dom.board?.querySelector(`.tut-cell[data-r="${nextTarget[0]}"][data-c="${nextTarget[1]}"]`);
      if (!targetCell) return;

      // Draw primary active arc & arrow
      const activeArc = this.calculateArcD(currentCell, targetCell);
      if (this.dom.arcActive) {
        this.dom.arcActive.setAttribute("d", activeArc.d);
        this.dom.arcActive.style.opacity = "1";
      }
      if (this.dom.arrowActive) {
        this.dom.arrowActive.setAttribute("points", activeArc.arrowPoints);
        this.dom.arrowActive.style.opacity = "1";
      }

      // Draw optional second step preview arc & arrow
      if (secondTarget) {
        const goalCell = this.dom.board?.querySelector(`.tut-cell[data-r="${secondTarget[0]}"][data-c="${secondTarget[1]}"]`);
        if (goalCell && this.dom.arcStep2 && this.dom.arrowStep2) {
          const step2Arc = this.calculateArcD(targetCell, goalCell);
          this.dom.arcStep2.setAttribute("d", step2Arc.d);
          this.dom.arcStep2.style.opacity = "0.35";
          this.dom.arrowStep2.setAttribute("points", step2Arc.arrowPoints);
          this.dom.arrowStep2.style.opacity = "0.35";
        }
      } else {
        if (this.dom.arcStep2) {
          this.dom.arcStep2.setAttribute("d", "");
          this.dom.arcStep2.style.opacity = "0";
        }
        if (this.dom.arrowStep2) {
          this.dom.arrowStep2.setAttribute("points", "");
          this.dom.arrowStep2.style.opacity = "0";
        }
      }

      this.dom.arcSvg.style.display = "block";
      this.dom.arcSvg.style.opacity = "1";
    });
  },

  hideArcGuide() {
    if (this.dom.arcSvg) {
      this.dom.arcSvg.style.opacity = "0";
    }
    if (this.dom.arcActive) this.dom.arcActive.setAttribute("d", "");
    if (this.dom.arrowActive) this.dom.arrowActive.setAttribute("points", "");
    if (this.dom.arcStep2) this.dom.arcStep2.setAttribute("d", "");
    if (this.dom.arrowStep2) this.dom.arrowStep2.setAttribute("points", "");
  }
};
