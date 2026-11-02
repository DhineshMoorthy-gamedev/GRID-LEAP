package com.olaidigitalstudios.gridleap;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.appupdate.AppUpdateOptions;
import com.google.android.play.core.install.InstallState;
import com.google.android.play.core.install.InstallStateUpdatedListener;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.InstallStatus;
import com.google.android.play.core.install.model.UpdateAvailability;

/**
 * Native Google Play In-App Updates Plugin for Grid Leap.
 * Supports Flexible (background download) and Immediate update flows.
 */
@CapacitorPlugin(name = "AppUpdatePlugin")
public class AppUpdatePlugin extends Plugin implements InstallStateUpdatedListener {

    private static final String TAG = "GridLeapAppUpdate";

    private AppUpdateManager appUpdateManager;
    private AppUpdateInfo cachedAppUpdateInfo;

    @Override
    public void load() {
        super.load();
        if (getContext() != null) {
            appUpdateManager = AppUpdateManagerFactory.create(getContext());
            appUpdateManager.registerListener(this);
            Log.i(TAG, "AppUpdateManager initialized and listener registered.");
        }
    }

    @Override
    protected void handleOnDestroy() {
        if (appUpdateManager != null) {
            appUpdateManager.unregisterListener(this);
        }
        super.handleOnDestroy();
    }

    @Override
    public void onStateUpdate(@NonNull InstallState installState) {
        int status = installState.installStatus();
        Log.i(TAG, "In-App Update InstallState changed to: " + status);

        JSObject data = new JSObject();
        data.put("installStatus", statusToString(status));
        data.put("bytesDownloaded", installState.bytesDownloaded());
        data.put("totalBytesToDownload", installState.totalBytesToDownload());

        if (status == InstallStatus.DOWNLOADED) {
            Log.i(TAG, "Update download completed. Ready to completeUpdate().");
            notifyListeners("onUpdateDownloaded", data);
        } else if (status == InstallStatus.DOWNLOADING) {
            notifyListeners("onUpdateDownloading", data);
        } else if (status == InstallStatus.CANCELED) {
            Log.i(TAG, "Update download canceled.");
            notifyListeners("onUpdateCanceled", data);
        } else if (status == InstallStatus.FAILED) {
            data.put("errorCode", installState.installErrorCode());
            notifyListeners("onUpdateFailed", data);
        }
    }

    @PluginMethod
    public void checkForUpdate(final PluginCall call) {
        if (appUpdateManager == null) {
            JSObject ret = new JSObject();
            ret.put("updateAvailable", false);
            ret.put("error", "AppUpdateManager not initialized");
            call.resolve(ret);
            return;
        }

        Task<AppUpdateInfo> appUpdateInfoTask = appUpdateManager.getAppUpdateInfo();
        appUpdateInfoTask.addOnSuccessListener(new OnSuccessListener<AppUpdateInfo>() {
            @Override
            public void onSuccess(AppUpdateInfo appUpdateInfo) {
                cachedAppUpdateInfo = appUpdateInfo;
                int availability = appUpdateInfo.updateAvailability();
                int installStatus = appUpdateInfo.installStatus();

                boolean isUpdateAvailable = (availability == UpdateAvailability.UPDATE_AVAILABLE);
                boolean isUpdateInProgress = (availability == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS);
                boolean isDownloaded = (installStatus == InstallStatus.DOWNLOADED);

                JSObject ret = new JSObject();
                ret.put("updateAvailable", isUpdateAvailable);
                ret.put("isUpdateInProgress", isUpdateInProgress);
                ret.put("isDownloaded", isDownloaded);
                ret.put("availableVersionCode", appUpdateInfo.availableVersionCode());
                ret.put("updatePriority", appUpdateInfo.updatePriority());
                ret.put("isFlexibleAllowed", appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE));
                ret.put("isImmediateAllowed", appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE));
                ret.put("installStatus", statusToString(installStatus));

                if (appUpdateInfo.clientVersionStalenessDays() != null) {
                    ret.put("stalenessDays", appUpdateInfo.clientVersionStalenessDays());
                }

                Log.i(TAG, "Update check result: available=" + isUpdateAvailable + ", status=" + statusToString(installStatus));
                call.resolve(ret);
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Log.w(TAG, "Failed to get AppUpdateInfo: " + e.getMessage());
                JSObject ret = new JSObject();
                ret.put("updateAvailable", false);
                ret.put("error", e.getMessage());
                call.resolve(ret);
            }
        });
    }

    @PluginMethod
    public void startFlexibleUpdate(final PluginCall call) {
        startUpdateFlow(call, AppUpdateType.FLEXIBLE);
    }

    @PluginMethod
    public void startImmediateUpdate(final PluginCall call) {
        startUpdateFlow(call, AppUpdateType.IMMEDIATE);
    }

    private void startUpdateFlow(final PluginCall call, final int updateType) {
        if (appUpdateManager == null) {
            call.reject("AppUpdateManager unavailable.");
            return;
        }

        final Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity context unavailable.");
            return;
        }

        if (cachedAppUpdateInfo != null && cachedAppUpdateInfo.isUpdateTypeAllowed(updateType)) {
            launchFlow(activity, cachedAppUpdateInfo, updateType, call);
        } else {
            // Refresh AppUpdateInfo on demand
            appUpdateManager.getAppUpdateInfo().addOnSuccessListener(new OnSuccessListener<AppUpdateInfo>() {
                @Override
                public void onSuccess(AppUpdateInfo appUpdateInfo) {
                    cachedAppUpdateInfo = appUpdateInfo;
                    if (appUpdateInfo.isUpdateTypeAllowed(updateType)) {
                        launchFlow(activity, appUpdateInfo, updateType, call);
                    } else {
                        call.reject("Requested update type (" + updateType + ") is not allowed for this update.");
                    }
                }
            }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull Exception e) {
                    call.reject("Failed to query update info: " + e.getMessage());
                }
            });
        }
    }

    private void launchFlow(Activity activity, AppUpdateInfo appUpdateInfo, int updateType, final PluginCall call) {
        AppUpdateOptions options = AppUpdateOptions.newBuilder(updateType).build();

        appUpdateManager.startUpdateFlow(appUpdateInfo, activity, options)
                .addOnSuccessListener(new OnSuccessListener<Integer>() {
                    @Override
                    public void onSuccess(Integer resultCode) {
                        JSObject ret = new JSObject();
                        ret.put("status", "flow_started");
                        ret.put("resultCode", resultCode);
                        if (resultCode == Activity.RESULT_OK) {
                            ret.put("userAccepted", true);
                            ret.put("userCanceled", false);
                        } else if (resultCode == Activity.RESULT_CANCELED) {
                            ret.put("userAccepted", false);
                            ret.put("userCanceled", true);
                        } else {
                            ret.put("userAccepted", false);
                            ret.put("userCanceled", false);
                        }
                        call.resolve(ret);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        call.reject("Failed to start in-app update flow: " + e.getMessage());
                    }
                });
    }

    @PluginMethod
    public void completeUpdate(final PluginCall call) {
        if (appUpdateManager == null) {
            call.reject("AppUpdateManager unavailable.");
            return;
        }

        Log.i(TAG, "Calling completeUpdate() to restart and apply update.");
        appUpdateManager.completeUpdate()
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void unused) {
                        JSObject ret = new JSObject();
                        ret.put("status", "update_completed");
                        call.resolve(ret);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        call.reject("Failed to complete update: " + e.getMessage());
                    }
                });
    }

    @PluginMethod
    public void getAppVersion(final PluginCall call) {
        try {
            android.content.Context ctx = getContext();
            if (ctx != null) {
                android.content.pm.PackageInfo pInfo = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0);
                JSObject ret = new JSObject();
                ret.put("versionName", pInfo.versionName);
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
                    ret.put("versionCode", pInfo.getLongVersionCode());
                } else {
                    ret.put("versionCode", pInfo.versionCode);
                }
                call.resolve(ret);
                return;
            }
        } catch (Exception e) {
            Log.w(TAG, "Failed to get app version: " + e.getMessage());
        }
        JSObject fallback = new JSObject();
        fallback.put("versionName", "0.0.21");
        fallback.put("versionCode", 21);
        call.resolve(fallback);
    }

    @PluginMethod
    public void openNotificationSettings(PluginCall call) {
        try {
            Activity activity = getActivity();
            if (activity != null) {
                Intent intent = new Intent();
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    intent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                    intent.putExtra(Settings.EXTRA_APP_PACKAGE, activity.getPackageName());
                } else {
                    intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    intent.setData(Uri.fromParts("package", activity.getPackageName(), null));
                }
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(intent);
                call.resolve();
                return;
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to open notification settings: " + e.getMessage());
        }
        call.reject("Unable to open notification settings");
    }

    @PluginMethod
    public void getNotificationPermissionStatus(PluginCall call) {
        try {
            Activity activity = getActivity();
            if (activity != null) {
                boolean areEnabled = androidx.core.app.NotificationManagerCompat.from(activity).areNotificationsEnabled();
                boolean shouldShowRationale = false;
                if (Build.VERSION.SDK_INT >= 33) {
                    shouldShowRationale = androidx.core.app.ActivityCompat.shouldShowRequestPermissionRationale(
                        activity,
                        android.Manifest.permission.POST_NOTIFICATIONS
                    );
                }
                JSObject ret = new JSObject();
                ret.put("areEnabled", areEnabled);
                ret.put("shouldShowRationale", shouldShowRationale);
                ret.put("isBlocked", !areEnabled && !shouldShowRationale);
                call.resolve(ret);
                return;
            }
        } catch (Exception e) {
            Log.w(TAG, "Failed to get notification permission status: " + e.getMessage());
        }
        JSObject ret = new JSObject();
        ret.put("areEnabled", false);
        ret.put("isBlocked", false);
        call.resolve(ret);
    }

    private String statusToString(int status) {
        switch (status) {
            case InstallStatus.PENDING: return "PENDING";
            case InstallStatus.DOWNLOADING: return "DOWNLOADING";
            case InstallStatus.DOWNLOADED: return "DOWNLOADED";
            case InstallStatus.INSTALLING: return "INSTALLING";
            case InstallStatus.INSTALLED: return "INSTALLED";
            case InstallStatus.FAILED: return "FAILED";
            case InstallStatus.CANCELED: return "CANCELED";
            case InstallStatus.UNKNOWN:
            default:
                return "UNKNOWN";
        }
    }
}
