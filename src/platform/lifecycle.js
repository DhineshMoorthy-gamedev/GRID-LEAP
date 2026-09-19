import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";
import { TargetConfig } from "./target-config.js";

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
    // 1. If running in Tauri Desktop, use native OS opener command
    if (typeof window !== "undefined") {
      const tauriInvoke = window.__TAURI_INTERNALS__?.invoke || window.__TAURI__?.core?.invoke;
      if (typeof tauriInvoke === "function") {
        try {
          tauriInvoke("open_url", { url });
          return;
        } catch (err) {
          console.warn("[PlatformBridge] Tauri open_url error:", err);
        }
      }
    }

    // 2. Standard Web fallback: create an invisible anchor with _blank
    try {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      try {
        window.open(url, "_blank", "noopener,noreferrer");
      } catch (_) {
        window.location.href = url;
      }
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
  },

  // In-App Update Simulation State (Browser/Editor testing)
  _simulatedUpdateState: null,
  _simulatedListeners: [],

  setSimulatedUpdateState(state) {
    this._simulatedUpdateState = state;
  },

  // Dynamic App Version Retrieval (Native PackageInfo or TargetConfig fallback)
  async getAppVersion() {
    if (isCapacitor && window.Capacitor?.Plugins?.AppUpdatePlugin) {
      try {
        const res = await window.Capacitor.Plugins.AppUpdatePlugin.getAppVersion();
        if (res?.versionName) {
          return {
            versionName: res.versionName,
            versionCode: res.versionCode || 15
          };
        }
      } catch (e) {
        console.warn("[Platform] getAppVersion native error:", e);
      }
    }
    return {
      versionName: TargetConfig.version || "0.0.15",
      versionCode: TargetConfig.versionCode || 15
    };
  },

  // Google Play In-App Updates (Play Core API)
  async checkForPlayStoreUpdate() {
    if (!isCapacitor) {
      if (this._simulatedUpdateState) {
        return this._simulatedUpdateState;
      }
      return { updateAvailable: false, isDownloaded: false, installStatus: "INSTALLED" };
    }
    try {
      if (window.Capacitor?.Plugins?.AppUpdatePlugin) {
        const res = await window.Capacitor.Plugins.AppUpdatePlugin.checkForUpdate();
        return res || { updateAvailable: false, isDownloaded: false };
      }
    } catch (e) {
      console.warn("[Platform] checkForPlayStoreUpdate error:", e);
    }
    return { updateAvailable: false, isDownloaded: false };
  },

  async startPlayStoreUpdate(type = "flexible") {
    if (!isCapacitor) {
      // Browser simulation
      setTimeout(() => {
        this._simulatedUpdateState = { isDownloaded: true, installStatus: "DOWNLOADED" };
        this._simulatedListeners.forEach(cb => cb({ installStatus: "DOWNLOADED" }));
      }, 2000);
      return { status: "flow_started", simulated: true };
    }
    try {
      if (window.Capacitor?.Plugins?.AppUpdatePlugin) {
        if (type === "immediate") {
          return await window.Capacitor.Plugins.AppUpdatePlugin.startImmediateUpdate();
        }
        return await window.Capacitor.Plugins.AppUpdatePlugin.startFlexibleUpdate();
      }
    } catch (e) {
      console.warn("[Platform] startPlayStoreUpdate error:", e);
      return { success: false, error: e };
    }
    return { success: false, message: "AppUpdatePlugin unavailable." };
  },

  async completePlayStoreUpdate() {
    if (!isCapacitor) {
      // Browser simulation: reload page to simulate fresh boot
      window.location.reload();
      return;
    }
    try {
      if (window.Capacitor?.Plugins?.AppUpdatePlugin) {
        await window.Capacitor.Plugins.AppUpdatePlugin.completeUpdate();
      }
    } catch (e) {
      console.warn("[Platform] completePlayStoreUpdate error:", e);
    }
  },

  onPlayStoreUpdateDownloaded(callback) {
    if (typeof callback !== "function") return;
    if (!isCapacitor) {
      this._simulatedListeners.push(callback);
      return;
    }
    try {
      if (window.Capacitor?.Plugins?.AppUpdatePlugin) {
        window.Capacitor.Plugins.AppUpdatePlugin.addListener("onUpdateDownloaded", callback);
      }
    } catch (e) {
      console.warn("[Platform] onPlayStoreUpdateDownloaded listener error:", e);
    }
  },

  onPlayStoreUpdateDownloading(callback) {
    if (typeof callback !== "function") return;
    if (isCapacitor) {
      try {
        if (window.Capacitor?.Plugins?.AppUpdatePlugin) {
          window.Capacitor.Plugins.AppUpdatePlugin.addListener("onUpdateDownloading", callback);
        }
      } catch (e) {
        console.warn("[Platform] onPlayStoreUpdateDownloading listener error:", e);
      }
    }
  },

  onPlayStoreUpdateCanceled(callback) {
    if (typeof callback !== "function") return;
    if (isCapacitor) {
      try {
        if (window.Capacitor?.Plugins?.AppUpdatePlugin) {
          window.Capacitor.Plugins.AppUpdatePlugin.addListener("onUpdateCanceled", callback);
        }
      } catch (e) {
        console.warn("[Platform] onPlayStoreUpdateCanceled listener error:", e);
      }
    }
  },

  onPlayStoreUpdateFailed(callback) {
    if (typeof callback !== "function") return;
    if (isCapacitor) {
      try {
        if (window.Capacitor?.Plugins?.AppUpdatePlugin) {
          window.Capacitor.Plugins.AppUpdatePlugin.addListener("onUpdateFailed", callback);
        }
      } catch (e) {
        console.warn("[Platform] onPlayStoreUpdateFailed listener error:", e);
      }
    }
  },

  // ── AdMob Native Bridge (Play Store) ──────────────────────────────────────
  async initAds() {
    if (!isCapacitor) return { success: false };
    try {
      if (window.Capacitor?.Plugins?.AdMobPlugin) {
        return await window.Capacitor.Plugins.AdMobPlugin.initialize();
      }
    } catch (e) {
      console.warn("[Platform] initAds error:", e);
    }
    return { success: false };
  },

  async showBanner(adUnitId) {
    if (!isCapacitor) return { success: false };
    try {
      if (window.Capacitor?.Plugins?.AdMobPlugin) {
        return await window.Capacitor.Plugins.AdMobPlugin.showBanner({ adUnitId });
      }
    } catch (e) {
      console.warn("[Platform] showBanner error:", e);
    }
    return { success: false };
  },

  async hideBanner() {
    if (!isCapacitor) return { success: false };
    try {
      if (window.Capacitor?.Plugins?.AdMobPlugin) {
        return await window.Capacitor.Plugins.AdMobPlugin.hideBanner();
      }
    } catch (e) {
      console.warn("[Platform] hideBanner error:", e);
    }
    return { success: false };
  },

  async loadRewardedAd(adUnitId) {
    if (!isCapacitor) return { success: false };
    try {
      if (window.Capacitor?.Plugins?.AdMobPlugin) {
        return await window.Capacitor.Plugins.AdMobPlugin.loadRewardedAd({ adUnitId });
      }
    } catch (e) {
      console.warn("[Platform] loadRewardedAd error:", e);
    }
    return { success: false };
  },

  showRewardedAd() {
    return new Promise(async (resolve) => {
      if (!isCapacitor || !window.Capacitor?.Plugins?.AdMobPlugin) {
        resolve(false);
        return;
      }
      try {
        const plugin = window.Capacitor.Plugins.AdMobPlugin;
        let resolved = false;
        let rewardListener = null;
        let dismissListener = null;

        const cleanup = () => {
          if (rewardListener && typeof rewardListener.remove === "function") rewardListener.remove();
          if (dismissListener && typeof dismissListener.remove === "function") dismissListener.remove();
        };

        try {
          rewardListener = await plugin.addListener("onRewardEarned", () => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve(true);
            }
          });
        } catch (_) {}

        try {
          dismissListener = await plugin.addListener("onRewardDismissed", (res) => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve(res?.rewardEarned === true);
            }
          });
        } catch (_) {}

        plugin.showRewardedAd().catch((e) => {
          console.warn("[Platform] showRewardedAd call failed:", e);
          if (!resolved) {
            resolved = true;
            cleanup();
            resolve(false);
          }
        });
      } catch (e) {
        console.warn("[Platform] showRewardedAd exception:", e);
        resolve(false);
      }
    });
  },

  async loadInterstitial(adUnitId) {
    if (!isCapacitor) return { success: false };
    try {
      if (window.Capacitor?.Plugins?.AdMobPlugin) {
        return await window.Capacitor.Plugins.AdMobPlugin.loadInterstitial({ adUnitId });
      }
    } catch (e) {
      console.warn("[Platform] loadInterstitial error:", e);
    }
    return { success: false };
  },

  showInterstitial() {
    return new Promise(async (resolve) => {
      if (!isCapacitor || !window.Capacitor?.Plugins?.AdMobPlugin) {
        resolve(false);
        return;
      }
      try {
        const plugin = window.Capacitor.Plugins.AdMobPlugin;
        let resolved = false;
        let dismissListener = null;
        let failListener = null;

        const cleanup = () => {
          if (dismissListener && typeof dismissListener.remove === "function") dismissListener.remove();
          if (failListener && typeof failListener.remove === "function") failListener.remove();
        };

        try {
          dismissListener = await plugin.addListener("onInterstitialDismissed", () => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve(true);
            }
          });
        } catch (_) {}

        try {
          failListener = await plugin.addListener("onInterstitialFailed", () => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve(false);
            }
          });
        } catch (_) {}

        plugin.showInterstitial().catch((e) => {
          console.warn("[Platform] showInterstitial call failed:", e);
          if (!resolved) {
            resolved = true;
            cleanup();
            resolve(false);
          }
        });
      } catch (e) {
        console.warn("[Platform] showInterstitial exception:", e);
        resolve(false);
      }
    });
  }
};
