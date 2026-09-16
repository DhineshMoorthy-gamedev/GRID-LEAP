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
    if (typeof window !== "undefined" && window.GameState?.settings?.hapticsEnabled === false) return;
    if (isCapacitor) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (_) {}
    } else if (navigator.vibrate) {
      try { navigator.vibrate(10); } catch (_) {}
    }
  },

  async vibrateSuccess() {
    if (typeof window !== "undefined" && window.GameState?.settings?.hapticsEnabled === false) return;
    if (isCapacitor) {
      try {
        await Haptics.notification({ type: NotificationType.Success });
      } catch (_) {}
    } else if (navigator.vibrate) {
      try { navigator.vibrate([15, 50, 25]); } catch (_) {}
    }
  },

  async vibrateWarning() {
    if (typeof window !== "undefined" && window.GameState?.settings?.hapticsEnabled === false) return;
    if (isCapacitor) {
      try {
        await Haptics.notification({ type: NotificationType.Warning });
      } catch (_) {}
    } else if (navigator.vibrate) {
      try { navigator.vibrate([30, 40, 30]); } catch (_) {}
    }
  },

  isCapacitor: () => isCapacitor,
  isAndroid: () => isAndroid,
  isHapticsSupported: () => {
    if (isCapacitor) return true;
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return false;
    const ua = navigator.userAgent || "";
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    if (isIOS) return false;
    const isAndroidMobile = /Android/i.test(ua);
    return isAndroidMobile;
  },

  openExternalUrl(url) {
    if (!url) return;
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      window.location.href = url;
    }
  },

  // Google Play In-App Purchases (Remove Ads)
  async checkRemoveAdsPurchased() {
    if (!isCapacitor) return false;
    try {
      if (window.Capacitor?.Plugins?.BillingPlugin) {
        const res = await window.Capacitor.Plugins.BillingPlugin.isPurchased({ productId: "remove_ads" });
        return res?.isPurchased === true;
      }
    } catch (e) {
      console.warn("[Platform] checkRemoveAdsPurchased error:", e);
    }
    return false;
  },

  async purchaseRemoveAds() {
    if (!isCapacitor) {
      return { success: false, message: "In-App Purchases are available on the Android Play Store edition." };
    }
    try {
      if (window.Capacitor?.Plugins?.BillingPlugin) {
        const res = await window.Capacitor.Plugins.BillingPlugin.purchase({ productId: "remove_ads" });
        return { success: res?.isPurchased === true, data: res };
      }
    } catch (e) {
      console.warn("[Platform] purchaseRemoveAds error:", e);
      return { success: false, error: e };
    }
    return { success: false, message: "Billing service not initialized." };
  },

  async restorePurchases() {
    if (!isCapacitor) return false;
    try {
      if (window.Capacitor?.Plugins?.BillingPlugin) {
        const res = await window.Capacitor.Plugins.BillingPlugin.restorePurchases();
        return res?.isPurchased === true;
      }
    } catch (e) {
      console.warn("[Platform] restorePurchases error:", e);
    }
    return false;
  }
};
