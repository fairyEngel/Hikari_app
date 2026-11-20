// アプリ（Capacitor）の中でだけ動く部品：ゲームの広告の受け口（HikariAdsBridge）に AdMob をつなぐ。
// ブラウザで開いたときは何もしない（Capacitor がないため）。
(function () {
  const C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  const P = C.Plugins || {};
  const AdMob = P.AdMob, App = P.App, StatusBar = P.StatusBar;

  // ★★★ 公開前に、ここを本物の広告ユニットIDに変える（AdMobの管理画面で作成）★★★
  const USE_TEST_IDS = true; // 本番では false にして、下の PROD に自分のIDを入れる
  const TEST = {
    rewarded: "ca-app-pub-3940256099942544/5224354917",
    interstitial: "ca-app-pub-3940256099942544/1033173712",
    banner: "ca-app-pub-3940256099942544/6300978111",
  };
  const PROD = { rewarded: "", interstitial: "", banner: "" };
  const ID = USE_TEST_IDS ? TEST : PROD;

  try { StatusBar && StatusBar.hide(); } catch (e) {}

  // 戻るボタン：メニューへ戻る → なければアプリを閉じる
  if (App && App.addListener) {
    const vis = (el) => el && !el.hidden && el.offsetParent !== null;
    App.addListener("backButton", () => {
      const $ = (id) => document.getElementById(id);
      const overlayClose = ["guide-ok", "cal-ok", "ach-ok", "code-ok"].map($).find(vis);
      if (overlayClose) return overlayClose.click();
      const m = document.querySelector("#gtop #menu");
      if (vis(m)) return m.click();
      if (vis($("back"))) return $("back").click();
      App.exitApp();
    });
  }

  if (!AdMob) return; // プラグインが無ければ広告なし（ゲームはそのまま遊べる）

  let ready = null;
  const init = () => ready || (ready = (async () => {
    try {
      const info = await AdMob.requestConsentInfo();
      if (info && info.isConsentFormAvailable && info.status === "REQUIRED") await AdMob.showConsentForm();
    } catch (e) {}
    await AdMob.initialize({ initializeForTesting: USE_TEST_IDS });
  })());

  let canShowBanner = false;
  window.HikariAdsBridge = {
    async showRewarded() {
      try {
        await init();
        let rewarded = false;
        const h = await AdMob.addListener("onRewardedVideoAdReward", () => { rewarded = true; });
        await AdMob.prepareRewardVideoAd({ adId: ID.rewarded });
        await AdMob.showRewardVideoAd();
        try { h.remove(); } catch (e) {}
        return rewarded ? "done" : "closed";
      } catch (e) { return "error"; }
    },
    async showInterstitial() {
      try { await init(); await AdMob.prepareInterstitial({ adId: ID.interstitial }); await AdMob.showInterstitial(); } catch (e) {}
    },
    async showBanner() {
      try { await init(); await AdMob.showBanner({ adId: ID.banner, adSize: "BANNER", position: "BOTTOM_CENTER", margin: 0, isTesting: USE_TEST_IDS }); canShowBanner = true; } catch (e) {}
    },
    async hideBanner() { try { if (canShowBanner) await AdMob.removeBanner(); canShowBanner = false; } catch (e) {} },
    async showConsent() { try { await init(); await AdMob.showPrivacyOptionsForm(); } catch (e) {} },
  };
})();
