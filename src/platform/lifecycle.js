import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

const isCapacitor = Capacitor.isNativePlatform();
const isAndroid = Capacitor.getPlatform() === "android";

let onPauseCallback = null;
let onResumeCallback = null;
let onBackActionCallback = null;

export const PlatformBridge = {
  async init({ onPause, onResume, onBackAction }) {
    onPauseCallback = onPause;
    onResumeCallback = onResume;
    onBackActionCallback = onBackAction;

    // Web Page Visibility API
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (typeof onPauseCallback === "function") onPauseCallback("visibility_hidden");
      } else {
        if (typeof onResumeCallback === "function") onResumeCallback("visibility_visible");
      }
    });

    window.addEventListener("blur", () => {
      if (typeof onPauseCallback === "function") onPauseCallback("window_blur");
    });
    window.addEventListener("focus", () => {
      if (typeof onResumeCallback === "function") onResumeCallback("window_focus");
    });

    // Native Capacitor Bridge
    if (isCapacitor) {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#0b131a" });
      } catch (err) {
        console.warn("[Platform] StatusBar setup skipped:", err);
      }

      try {
        App.addListener("appStateChange", ({ isActive }) => {
          if (!isActive) {
            if (typeof onPauseCallback === "function") onPauseCallback("capacitor_app_inactive");
          } else {
            if (typeof onResumeCallback === "function") onResumeCallback("capacitor_app_active");
          }
        });

        App.addListener("backButton", () => {
          this.handleBackButton();
        });
      } catch (err) {
        console.warn("[Platform] App listeners setup skipped:", err);
      }
    }

    // Web popstate fallback for hardware back gesture
    window.addEventListener("popstate", () => {
      this.handleBackButton();
    });

    try {
      history.pushState({ app: "gridleap" }, "");
    } catch (_) {}
  },

  handleBackButton() {
    if (typeof onBackActionCallback === "function") {
      const handled = onBackActionCallback();
      if (!handled && isCapacitor) {
        App.minimizeApp();
      } else if (!handled) {
        try {
          history.pushState({ app: "gridleap" }, "");
        } catch (_) {}
      }
    }
  },

  async vibrateLight() {
    if (isCapacitor) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (_) {}
    } else if (navigator.vibrate) {
      try { navigator.vibrate(10); } catch (_) {}
    }
  },

  async vibrateSuccess() {
    if (isCapacitor) {
      try {
        await Haptics.notification({ type: NotificationType.Success });
      } catch (_) {}
    } else if (navigator.vibrate) {
      try { navigator.vibrate([15, 50, 25]); } catch (_) {}
    }
  },

  async vibrateWarning() {
    if (isCapacitor) {
      try {
        await Haptics.notification({ type: NotificationType.Warning });
      } catch (_) {}
    } else if (navigator.vibrate) {
      try { navigator.vibrate([30, 40, 30]); } catch (_) {}
    }
  },

  isCapacitor: () => isCapacitor,
  isAndroid: () => isAndroid
};
