/**
 * Screen and Modal Navigation Router
 * Manages full-screen navigation (Home vs Play), modals, and back button stacks.
 */

const modalStack = [];
const listeners = [];

const MODAL_ELEMENTS = {
  RULES: "rulesModal",
  WIN: "winOverlay",
  FINAL: "finalOverlay",
  PAUSE: "pauseModal",
  SETTINGS: "settingsModal",
  DEV: "devModal",
  EDITOR_JSON: "editorJsonModal",
  OUT_OF_LIVES: "outOfLivesModal",
  DAILY_CALENDAR: "dailyCalendarModal",
  ACHIEVEMENTS: "achievementsModal",
  UPDATE: "updateModal",
  REWARD: "rewardModal",
  NOTIF_PROMPT: "notificationPromptModal",
  SHARE: "shareModal"
};

let currentScreen = "screenHome"; // "screenHome" | "screenGame"

function getElement(modalName) {
  const id = MODAL_ELEMENTS[modalName];
  return id ? document.getElementById(id) : null;
}

export const SceneRouter = {
  getCurrentScreen() {
    return currentScreen;
  },

  navigateTo(screenId) {
    if (currentScreen === screenId) return;

    document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
    const targetEl = document.getElementById(screenId);
    if (targetEl) targetEl.classList.add("active");

    currentScreen = screenId;
    this._notify("screen_changed", { screenId });
  },

  hasAnyModalOpen() {
    if (modalStack.length > 0) return true;
    for (const id of Object.values(MODAL_ELEMENTS)) {
      const el = document.getElementById(id);
      if (el && (el.classList.contains("show") || el.classList.contains("active"))) {
        return true;
      }
    }
    return false;
  },

  isInputBlocked() {
    return this.hasAnyModalOpen() || currentScreen !== "screenGame";
  },

  currentModal() {
    return modalStack.length > 0 ? modalStack[modalStack.length - 1] : null;
  },

  pushModal(modalName, payload = null) {
    const el = getElement(modalName);
    if (!el) {
      console.warn(`[SceneRouter] Unknown modal overlay '${modalName}'`);
      return false;
    }

    modalStack.push({ name: modalName, payload });
    el.classList.add("show");
    this._notify("modal_opened", { modalName, payload });
    return true;
  },

  popModal() {
    if (modalStack.length === 0) return null;
    const popped = modalStack.pop();
    const el = getElement(popped.name);
    if (el) {
      el.classList.remove("show");
    }
    this._notify("modal_closed", { modalName: popped.name });
    return popped;
  },

  popAllModals() {
    while (modalStack.length > 0) {
      this.popModal();
    }
  },

  isModalOpen(modalName) {
    if (modalStack.some(m => m.name === modalName)) return true;
    const el = getElement(modalName);
    return !!(el && (el.classList.contains("show") || el.classList.contains("active")));
  },

  subscribe(fn) {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  },

  _notify(event, data) {
    for (const fn of listeners) {
      try {
        fn(event, data);
      } catch (err) {
        console.error("[SceneRouter] Listener error:", err);
      }
    }
  }
};
