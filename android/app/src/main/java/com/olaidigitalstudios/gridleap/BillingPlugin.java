package com.olaidigitalstudios.gridleap;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.AcknowledgePurchaseResponseListener;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.ProductDetailsResponseListener;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesResponseListener;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryProductDetailsResult;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Native Google Play Billing Plugin for Grid Leap.
 * Directly communicates with Google Play BillingClient 7.0.0 without external 3rd-party servers.
 */
@CapacitorPlugin(name = "BillingPlugin")
public class BillingPlugin extends Plugin implements PurchasesUpdatedListener {

    private static final String TAG = "GridLeapBilling";
    private static final String DEFAULT_PRODUCT_ID = "remove_ads";

    private BillingClient billingClient;
    private boolean isClientReady = false;
    private final Map<String, ProductDetails> cachedProductDetails = new HashMap<>();
    private PluginCall activePurchaseCall = null;
    private boolean isRemoveAdsOwned = false;

    @Override
    public void load() {
        super.load();
        initBillingClient();
    }

    private void initBillingClient() {
        if (getContext() == null) return;

        PendingPurchasesParams pendingPurchasesParams = PendingPurchasesParams.newBuilder()
                .enableOneTimeProducts()
                .build();

        billingClient = BillingClient.newBuilder(getContext())
                .setListener(this)
                .enablePendingPurchases(pendingPurchasesParams)
                .build();

        startConnection(null);
    }

    private void startConnection(@Nullable final Runnable onConnected) {
        if (billingClient == null) return;

        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    isClientReady = true;
                    Log.i(TAG, "Google Play BillingClient setup succeeded.");
                    queryExistingPurchases(null);
                    prefetchDefaultProducts();
                    if (onConnected != null) {
                        onConnected.run();
                    }
                } else {
                    isClientReady = false;
                    Log.w(TAG, "Billing setup failed: " + billingResult.getDebugMessage());
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                isClientReady = false;
                Log.w(TAG, "Billing service disconnected. Will reconnect on next request.");
            }
        });
    }

    private void prefetchDefaultProducts() {
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(QueryProductDetailsParams.Product.newBuilder()
                .setProductId(DEFAULT_PRODUCT_ID)
                .setProductType(BillingClient.ProductType.INAPP)
                .build());

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build();

        billingClient.queryProductDetailsAsync(params, new ProductDetailsResponseListener() {
            @Override
            public void onProductDetailsResponse(@NonNull BillingResult billingResult, @NonNull QueryProductDetailsResult queryProductDetailsResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    List<ProductDetails> list = queryProductDetailsResult.getProductDetailsList();
                    if (list != null) {
                        for (ProductDetails details : list) {
                            cachedProductDetails.put(details.getProductId(), details);
                            Log.i(TAG, "Prefetched product: " + details.getProductId() + " (" + details.getTitle() + ")");
                        }
                    }
                }
            }
        });
    }

    private void queryExistingPurchases(@Nullable final PluginCall call) {
        if (!isClientReady || billingClient == null) {
            if (call != null) {
                JSObject ret = new JSObject();
                ret.put("isPurchased", isRemoveAdsOwned);
                ret.put("status", "disconnected");
                call.resolve(ret);
            }
            return;
        }

        QueryPurchasesParams queryParams = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.INAPP)
                .build();

        billingClient.queryPurchasesAsync(queryParams, new PurchasesResponseListener() {
            @Override
            public void onQueryPurchasesResponse(@NonNull BillingResult billingResult, @NonNull List<Purchase> purchases) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    boolean foundRemoveAds = false;
                    for (Purchase purchase : purchases) {
                        if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                            for (String product : purchase.getProducts()) {
                                if (DEFAULT_PRODUCT_ID.equals(product)) {
                                    foundRemoveAds = true;
                                    break;
                                }
                            }
                            // Acknowledge if not acknowledged yet
                            if (!purchase.isAcknowledged()) {
                                acknowledgePurchase(purchase);
                            }
                        }
                    }
                    isRemoveAdsOwned = foundRemoveAds;
                    Log.i(TAG, "Existing purchases query complete. remove_ads owned: " + isRemoveAdsOwned);

                    if (call != null) {
                        JSObject ret = new JSObject();
                        ret.put("isPurchased", isRemoveAdsOwned);
                        ret.put("status", "ok");
                        call.resolve(ret);
                    }
                } else {
                    if (call != null) {
                        JSObject ret = new JSObject();
                        ret.put("isPurchased", isRemoveAdsOwned);
                        ret.put("status", "error");
                        ret.put("error", billingResult.getDebugMessage());
                        call.resolve(ret);
                    }
                }
            }
        });
    }

    @PluginMethod
    public void isPurchased(final PluginCall call) {
        String productId = call.getString("productId", DEFAULT_PRODUCT_ID);
        if (DEFAULT_PRODUCT_ID.equals(productId)) {
            JSObject ret = new JSObject();
            ret.put("productId", productId);
            ret.put("isPurchased", isRemoveAdsOwned);
            call.resolve(ret);
        } else {
            queryExistingPurchases(call);
        }
    }

    @PluginMethod
    public void restorePurchases(final PluginCall call) {
        if (!isClientReady) {
            startConnection(new Runnable() {
                @Override
                public void run() {
                    queryExistingPurchases(call);
                }
            });
        } else {
            queryExistingPurchases(call);
        }
    }

    @PluginMethod
    public void getProductDetails(final PluginCall call) {
        final String productId = call.getString("productId", DEFAULT_PRODUCT_ID);

        Runnable queryAction = new Runnable() {
            @Override
            public void run() {
                if (cachedProductDetails.containsKey(productId)) {
                    ProductDetails details = cachedProductDetails.get(productId);
                    call.resolve(formatProductDetails(details));
                    return;
                }

                List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
                productList.add(QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(productId)
                        .setProductType(BillingClient.ProductType.INAPP)
                        .build());

                QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                        .setProductList(productList)
                        .build();

                billingClient.queryProductDetailsAsync(params, new ProductDetailsResponseListener() {
                    @Override
                    public void onProductDetailsResponse(@NonNull BillingResult billingResult, @NonNull QueryProductDetailsResult queryProductDetailsResult) {
                        List<ProductDetails> list = queryProductDetailsResult.getProductDetailsList();
                        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && list != null && !list.isEmpty()) {
                            ProductDetails details = list.get(0);
                            cachedProductDetails.put(details.getProductId(), details);
                            call.resolve(formatProductDetails(details));
                        } else {
                            call.reject("Product not found or Google Play billing error: " + billingResult.getDebugMessage());
                        }
                    }
                });
            }
        };

        if (!isClientReady) {
            startConnection(queryAction);
        } else {
            queryAction.run();
        }
    }

    @PluginMethod
    public void purchase(final PluginCall call) {
        final String productId = call.getString("productId", DEFAULT_PRODUCT_ID);
        this.activePurchaseCall = call;

        Runnable launchAction = new Runnable() {
            @Override
            public void run() {
                ProductDetails details = cachedProductDetails.get(productId);
                if (details == null) {
                    // Query on-demand
                    List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
                    productList.add(QueryProductDetailsParams.Product.newBuilder()
                            .setProductId(productId)
                            .setProductType(BillingClient.ProductType.INAPP)
                            .build());

                    QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                            .setProductList(productList)
                            .build();

                    billingClient.queryProductDetailsAsync(params, new ProductDetailsResponseListener() {
                        @Override
                        public void onProductDetailsResponse(@NonNull BillingResult billingResult, @NonNull QueryProductDetailsResult queryProductDetailsResult) {
                            List<ProductDetails> list = queryProductDetailsResult.getProductDetailsList();
                            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && list != null && !list.isEmpty()) {
                                cachedProductDetails.put(productId, list.get(0));
                                launchBillingFlow(list.get(0));
                            } else {
                                if (activePurchaseCall != null) {
                                    activePurchaseCall.reject("Unable to find product details on Google Play: " + billingResult.getDebugMessage());
                                    activePurchaseCall = null;
                                }
                            }
                        }
                    });
                } else {
                    launchBillingFlow(details);
                }
            }
        };

        if (!isClientReady) {
            startConnection(launchAction);
        } else {
            launchAction.run();
        }
    }

    private void launchBillingFlow(ProductDetails productDetails) {
        Activity activity = getActivity();
        if (activity == null) {
            if (activePurchaseCall != null) {
                activePurchaseCall.reject("Activity context unavailable.");
                activePurchaseCall = null;
            }
            return;
        }

        List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = new ArrayList<>();
        productDetailsParamsList.add(
                BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(productDetails)
                        .build()
        );

        BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(productDetailsParamsList)
                .build();

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                BillingResult result = billingClient.launchBillingFlow(activity, billingFlowParams);
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    if (activePurchaseCall != null) {
                        activePurchaseCall.reject("Failed to launch billing flow: " + result.getDebugMessage());
                        activePurchaseCall = null;
                    }
                }
            }
        });
    }

    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult, @Nullable List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                handlePurchase(purchase);
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            Log.i(TAG, "User canceled Google Play purchase.");
            if (activePurchaseCall != null) {
                activePurchaseCall.reject("USER_CANCELED");
                activePurchaseCall = null;
            }
        } else {
            Log.w(TAG, "Purchase failed: " + billingResult.getDebugMessage());
            if (activePurchaseCall != null) {
                activePurchaseCall.reject("Purchase error: " + billingResult.getDebugMessage());
                activePurchaseCall = null;
            }
        }
    }

    private void handlePurchase(Purchase purchase) {
        if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
            isRemoveAdsOwned = true;
            if (!purchase.isAcknowledged()) {
                acknowledgePurchase(purchase);
            }

            JSObject notifyData = new JSObject();
            notifyData.put("productId", DEFAULT_PRODUCT_ID);
            notifyData.put("orderId", purchase.getOrderId());
            notifyData.put("purchaseToken", purchase.getPurchaseToken());
            notifyData.put("isPurchased", true);

            notifyListeners("onPurchaseCompleted", notifyData);

            if (activePurchaseCall != null) {
                activePurchaseCall.resolve(notifyData);
                activePurchaseCall = null;
            }
        }
    }

    private void acknowledgePurchase(Purchase purchase) {
        AcknowledgePurchaseParams acknowledgePurchaseParams =
                AcknowledgePurchaseParams.newBuilder()
                        .setPurchaseToken(purchase.getPurchaseToken())
                        .build();

        billingClient.acknowledgePurchase(acknowledgePurchaseParams, new AcknowledgePurchaseResponseListener() {
            @Override
            public void onAcknowledgePurchaseResponse(@NonNull BillingResult billingResult) {
                Log.i(TAG, "Purchase acknowledged response: " + billingResult.getResponseCode());
            }
        });
    }

    private JSObject formatProductDetails(ProductDetails details) {
        JSObject obj = new JSObject();
        obj.put("productId", details.getProductId());
        obj.put("title", details.getTitle());
        obj.put("description", details.getDescription());
        ProductDetails.OneTimePurchaseOfferDetails oneTime = details.getOneTimePurchaseOfferDetails();
        if (oneTime != null) {
            obj.put("formattedPrice", oneTime.getFormattedPrice());
            obj.put("priceAmountMicros", oneTime.getPriceAmountMicros());
            obj.put("priceCurrencyCode", oneTime.getPriceCurrencyCode());
        }
        return obj;
    }
}
