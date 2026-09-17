package com.olaidigitalstudios.gridleap;

import android.app.Activity;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardItem;
import android.util.DisplayMetrics;

@CapacitorPlugin(name = "AdMobPlugin")
public class AdMobPlugin extends Plugin {

    private static final String TAG = "GridLeapAdMob";

    private boolean isInitialized = false;
    private AdView bannerAdView = null;
    private RelativeLayout bannerLayout = null;

    private RewardedAd rewardedAd = null;
    private boolean isRewardedLoading = false;

    private InterstitialAd interstitialAd = null;
    private boolean isInterstitialLoading = false;

    @PluginMethod
    public void initialize(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity context unavailable.");
            return;
        }

        activity.runOnUiThread(() -> {
            try {
                MobileAds.initialize(activity, new OnInitializationCompleteListener() {
                    @Override
                    public void onInitializationComplete(@NonNull InitializationStatus initializationStatus) {
                        isInitialized = true;
                        Log.i(TAG, "AdMob SDK Initialized successfully.");
                        JSObject ret = new JSObject();
                        ret.put("success", true);
                        call.resolve(ret);
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "Error initializing MobileAds", e);
                call.reject("AdMob init failed: " + e.getMessage());
            }
        });
    }

    private boolean isBannerLoaded = false;
    private boolean isBannerShowing = false;
    private String currentBannerUnitId = null;
    private android.os.Handler bannerRetryHandler = new android.os.Handler(android.os.Looper.getMainLooper());
    private Runnable bannerRetryRunnable = null;

    @PluginMethod
    public void showBanner(PluginCall call) {
        String adUnitId = call.getString("adUnitId");
        if (adUnitId == null || adUnitId.trim().isEmpty()) {
            call.reject("adUnitId is required.");
            return;
        }

        currentBannerUnitId = adUnitId;
        isBannerShowing = true;

        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity unavailable.");
            return;
        }

        activity.runOnUiThread(() -> {
            try {
                if (bannerAdView != null && isBannerLoaded) {
                    bannerAdView.setVisibility(View.VISIBLE);
                    if (bannerLayout != null) {
                        bannerLayout.setVisibility(View.VISIBLE);
                        bannerLayout.bringToFront();
                    }
                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    ret.put("status", "already_visible");
                    call.resolve(ret);
                    return;
                }

                // If existing view failed to load previously, recreate or reload
                if (bannerAdView == null) {
                    DisplayMetrics displayMetrics = activity.getResources().getDisplayMetrics();
                    int adWidth = (int) (displayMetrics.widthPixels / displayMetrics.density);
                    AdSize adSize = AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(activity, adWidth);
                    if (adSize == null) {
                        adSize = AdSize.BANNER;
                    }

                    bannerAdView = new AdView(activity);
                    bannerAdView.setAdSize(adSize);
                    bannerAdView.setAdUnitId(adUnitId);

                    bannerLayout = new RelativeLayout(activity);
                    FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
                            FrameLayout.LayoutParams.MATCH_PARENT,
                            FrameLayout.LayoutParams.WRAP_CONTENT,
                            Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL
                    );

                    RelativeLayout.LayoutParams adParams = new RelativeLayout.LayoutParams(
                            RelativeLayout.LayoutParams.WRAP_CONTENT,
                            RelativeLayout.LayoutParams.WRAP_CONTENT
                    );
                    adParams.addRule(RelativeLayout.CENTER_HORIZONTAL);
                    bannerLayout.addView(bannerAdView, adParams);

                    ViewGroup rootView = activity.findViewById(android.R.id.content);
                    if (rootView != null) {
                        if (bannerLayout.getParent() != null) {
                            ((ViewGroup) bannerLayout.getParent()).removeView(bannerLayout);
                        }
                        rootView.addView(bannerLayout, layoutParams);
                    } else {
                        activity.addContentView(bannerLayout, layoutParams);
                    }

                    bannerLayout.bringToFront();
                    bannerLayout.setElevation(100f);

                    bannerAdView.setAdListener(new AdListener() {
                        @Override
                        public void onAdLoaded() {
                            isBannerLoaded = true;
                            Log.i(TAG, "Banner ad loaded successfully.");
                            if (bannerLayout != null && isBannerShowing) {
                                bannerLayout.setVisibility(View.VISIBLE);
                                bannerLayout.bringToFront();
                            }
                        }

                        @Override
                        public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                            isBannerLoaded = false;
                            Log.w(TAG, "Banner ad failed to load: " + loadAdError.getMessage() + " (Code: " + loadAdError.getCode() + ")");
                            // Schedule an automatic retry after 15 seconds if still requested
                            if (isBannerShowing) {
                                if (bannerRetryRunnable != null) {
                                    bannerRetryHandler.removeCallbacks(bannerRetryRunnable);
                                }
                                bannerRetryRunnable = () -> {
                                    if (isBannerShowing && bannerAdView != null && !isBannerLoaded) {
                                        Log.i(TAG, "Retrying banner ad request...");
                                        AdRequest retryReq = new AdRequest.Builder().build();
                                        bannerAdView.loadAd(retryReq);
                                    }
                                };
                                bannerRetryHandler.postDelayed(bannerRetryRunnable, 15000);
                            }
                        }

                        @Override
                        public void onAdOpened() {
                            Log.i(TAG, "Banner ad clicked/opened.");
                        }
                    });
                }

                AdRequest adRequest = new AdRequest.Builder().build();
                bannerAdView.loadAd(adRequest);

                Log.i(TAG, "Banner ad requested with unit ID: " + adUnitId);
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            } catch (Exception e) {
                Log.e(TAG, "Error displaying banner ad", e);
                call.reject("Failed to show banner: " + e.getMessage());
            }
        });
    }

    @PluginMethod
    public void hideBanner(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.resolve();
            return;
        }

        isBannerShowing = false;
        isBannerLoaded = false;
        if (bannerRetryRunnable != null) {
            bannerRetryHandler.removeCallbacks(bannerRetryRunnable);
        }

        activity.runOnUiThread(() -> {
            try {
                if (bannerAdView != null) {
                    bannerAdView.setVisibility(View.GONE);
                }
                if (bannerLayout != null && bannerLayout.getParent() != null) {
                    ((ViewGroup) bannerLayout.getParent()).removeView(bannerLayout);
                    bannerLayout = null;
                }
                if (bannerAdView != null) {
                    bannerAdView.destroy();
                    bannerAdView = null;
                }
                Log.i(TAG, "Banner ad removed/destroyed.");
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            } catch (Exception e) {
                Log.e(TAG, "Error hiding banner ad", e);
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void loadRewardedAd(PluginCall call) {
        String adUnitId = call.getString("adUnitId");
        if (adUnitId == null || adUnitId.trim().isEmpty()) {
            call.reject("adUnitId is required.");
            return;
        }

        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity unavailable.");
            return;
        }

        if (rewardedAd != null) {
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("ready", true);
            call.resolve(ret);
            return;
        }

        if (isRewardedLoading) {
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("loading", true);
            call.resolve(ret);
            return;
        }

        isRewardedLoading = true;
        activity.runOnUiThread(() -> {
            AdRequest adRequest = new AdRequest.Builder().build();
            RewardedAd.load(activity, adUnitId, adRequest, new RewardedAdLoadCallback() {
                @Override
                public void onAdLoaded(@NonNull RewardedAd ad) {
                    rewardedAd = ad;
                    isRewardedLoading = false;
                    Log.i(TAG, "Rewarded ad loaded successfully.");
                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    ret.put("ready", true);
                    call.resolve(ret);
                }

                @Override
                public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                    rewardedAd = null;
                    isRewardedLoading = false;
                    Log.w(TAG, "Rewarded ad failed to load: " + loadAdError.getMessage());
                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    ret.put("error", loadAdError.getMessage());
                    call.resolve(ret);
                }
            });
        });
    }

    @PluginMethod
    public void showRewardedAd(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity unavailable.");
            return;
        }

        if (rewardedAd == null) {
            call.reject("Rewarded ad not loaded.");
            return;
        }

        activity.runOnUiThread(() -> {
            final boolean[] rewardEarned = {false};

            rewardedAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override
                public void onAdShowedFullScreenContent() {
                    Log.i(TAG, "Rewarded ad displayed fullscreen.");
                }

                @Override
                public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                    Log.w(TAG, "Rewarded ad failed to show: " + adError.getMessage());
                    rewardedAd = null;
                    JSObject err = new JSObject();
                    err.put("error", adError.getMessage());
                    notifyListeners("onRewardDismissed", err);
                }

                @Override
                public void onAdDismissedFullScreenContent() {
                    Log.i(TAG, "Rewarded ad dismissed. Reward earned: " + rewardEarned[0]);
                    rewardedAd = null;
                    JSObject res = new JSObject();
                    res.put("rewardEarned", rewardEarned[0]);
                    if (rewardEarned[0]) {
                        notifyListeners("onRewardEarned", res);
                    } else {
                        notifyListeners("onRewardDismissed", res);
                    }
                }
            });

            rewardedAd.show(activity, (@NonNull RewardItem rewardItem) -> {
                rewardEarned[0] = true;
                Log.i(TAG, "User earned reward: " + rewardItem.getAmount() + " " + rewardItem.getType());
            });

            JSObject started = new JSObject();
            started.put("status", "showing");
            call.resolve(started);
        });
    }

    @PluginMethod
    public void loadInterstitial(PluginCall call) {
        String adUnitId = call.getString("adUnitId");
        if (adUnitId == null || adUnitId.trim().isEmpty()) {
            call.reject("adUnitId is required.");
            return;
        }

        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity unavailable.");
            return;
        }

        if (interstitialAd != null) {
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("ready", true);
            call.resolve(ret);
            return;
        }

        if (isInterstitialLoading) {
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("loading", true);
            call.resolve(ret);
            return;
        }

        isInterstitialLoading = true;
        activity.runOnUiThread(() -> {
            AdRequest adRequest = new AdRequest.Builder().build();
            InterstitialAd.load(activity, adUnitId, adRequest, new InterstitialAdLoadCallback() {
                @Override
                public void onAdLoaded(@NonNull InterstitialAd ad) {
                    interstitialAd = ad;
                    isInterstitialLoading = false;
                    Log.i(TAG, "Interstitial ad loaded successfully.");
                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    ret.put("ready", true);
                    call.resolve(ret);
                }

                @Override
                public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                    interstitialAd = null;
                    isInterstitialLoading = false;
                    Log.w(TAG, "Interstitial ad failed to load: " + loadAdError.getMessage());
                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    ret.put("error", loadAdError.getMessage());
                    call.resolve(ret);
                }
            });
        });
    }

    @PluginMethod
    public void showInterstitial(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity unavailable.");
            return;
        }

        if (interstitialAd == null) {
            call.reject("Interstitial ad not loaded.");
            return;
        }

        activity.runOnUiThread(() -> {
            interstitialAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override
                public void onAdShowedFullScreenContent() {
                    Log.i(TAG, "Interstitial ad displayed fullscreen.");
                }

                @Override
                public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                    Log.w(TAG, "Interstitial ad failed to show: " + adError.getMessage());
                    interstitialAd = null;
                    JSObject err = new JSObject();
                    err.put("error", adError.getMessage());
                    notifyListeners("onInterstitialFailed", err);
                }

                @Override
                public void onAdDismissedFullScreenContent() {
                    Log.i(TAG, "Interstitial ad dismissed.");
                    interstitialAd = null;
                    JSObject res = new JSObject();
                    res.put("status", "dismissed");
                    notifyListeners("onInterstitialDismissed", res);
                }
            });

            interstitialAd.show(activity);

            JSObject started = new JSObject();
            started.put("status", "showing");
            call.resolve(started);
        });
    }

    @Override
    protected void handleOnDestroy() {
        if (bannerAdView != null) {
            bannerAdView.destroy();
            bannerAdView = null;
        }
        super.handleOnDestroy();
    }
}
