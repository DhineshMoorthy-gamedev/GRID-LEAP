/**
 * Grid Leap — Campaign Level Selector Modal Controller
 * Manages the expedition matrix level select modal and launching levels.
 */

import { SceneRouter } from "./scene-router.js";
import { GameState } from "../state/game-state.js";
import { AudioEngine } from "../audio/audio-engine.js";
import { LEVELS } from "../data/levels.js";
import { renderLevelSelectModal } from "./game-renderer.js";

export const LevelSelectController = {
  dom: {},
  selectedLevelIndex: 0,
  onLevelChosenCallback: null,
  onLaunchLevelCallback: null,

  init({ onLevelChosen, onLaunchLevel } = {}) {
    this.onLevelChosenCallback = onLevelChosen || null;
    this.onLaunchLevelCallback = onLaunchLevel || null;
    this.dom = {
      modal: document.getElementById("levelSelectModal"),
      closeBtn: document.getElementById("levelSelectCloseBtn"),
      summaryText: document.getElementById("levelSelectSummaryText"),
      gridContainer: document.getElementById("levelSelectGrid"),
      playBtn: document.getElementById("levelSelectPlayBtn"),
      playText: document.getElementById("levelSelectPlayText")
    };

    if (this.dom.closeBtn) {
      this.dom.closeBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.close();
      });
    }

    if (this.dom.modal) {
      this.dom.modal.addEventListener("click", (e) => {
        if (e.target === this.dom.modal) {
          AudioEngine.playNavBack();
          this.close();
        }
      });
    }

    if (this.dom.playBtn) {
      this.dom.playBtn.addEventListener("click", () => {
        this.launchSelectedLevel();
      });
    }
  },

  open() {
    this.selectedLevelIndex = GameState.getSelectedCardLevelIndex();
    this.render();
    this.updatePlayButton();
    SceneRouter.pushModal("LEVEL_SELECT");

    requestAnimationFrame(() => {
      // Auto-scroll to selected level tile
      const selectedTile = this.dom.gridContainer?.querySelector(`.level-tile[data-index="${this.selectedLevelIndex}"]`) ||
        this.dom.gridContainer?.querySelector(".level-tile.selected");
      if (selectedTile) {
        selectedTile.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  },

  close() {
    SceneRouter.popModal();
  },

  selectLevel(idx) {
    if (this.selectedLevelIndex === idx) {
      // Double tapping the already selected level tile launches it directly
      AudioEngine.playTap();
      this.launchSelectedLevel();
      return;
    }

    this.selectedLevelIndex = idx;
    GameState.setSelectedCardLevelIndex(idx);
    AudioEngine.playTap();

    // Dynamically toggle selected class without full re-render
    if (this.dom.gridContainer) {
      const prev = this.dom.gridContainer.querySelector(".level-tile.selected");
      if (prev) prev.classList.remove("selected");
      const next = this.dom.gridContainer.querySelector(`.level-tile[data-index="${idx}"]`);
      if (next) next.classList.add("selected");
    }

    this.updatePlayButton();

    if (typeof this.onLevelChosenCallback === "function") {
      this.onLevelChosenCallback(idx);
    }
  },

  updatePlayButton() {
    if (!this.dom.playText) return;
    const idx = this.selectedLevelIndex;
    const numStr = String(idx + 1).padStart(2, "0");

    let label = `PLAY LEVEL ${numStr}`;
    if (GameState.hasActiveSessionFor(idx)) {
      label = `RESUME LEVEL ${numStr}`;
    } else if (GameState.completed[idx]) {
      label = `REPLAY LEVEL ${numStr}`;
    }

    this.dom.playText.textContent = label;
  },

  launchSelectedLevel() {
    const idx = this.selectedLevelIndex;
    AudioEngine.playTap();
    this.close();
    if (typeof this.onLaunchLevelCallback === "function") {
      this.onLaunchLevelCallback(idx);
    }
  },

  render() {
    renderLevelSelectModal({
      levels: LEVELS,
      selectedIndex: this.selectedLevelIndex,
      completedArr: GameState.completed,
      starsArr: GameState.stars,
      bestMovesArr: GameState.bestMoves,
      onSelectLevel: (idx) => this.selectLevel(idx)
    });
  }
};
