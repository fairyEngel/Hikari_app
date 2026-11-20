// cap sync のあとに実行：AndroidManifest に AdMob のアプリID・縦画面固定などを書き込む（何度実行しても安全）
const fs = require("fs"), path = require("path");
const f = path.join(__dirname, "android", "app", "src", "main", "AndroidManifest.xml");
if (!fs.existsSync(f)) { console.error("android フォルダがありません。先に npx cap add android を実行してください。"); process.exit(1); }
// ★公開前に、自分の AdMob「アプリID」（~ が入ったもの）に変える。下はGoogleのテスト用ID。
const ADMOB_APP_ID = "ca-app-pub-3940256099942544~3347511713";
let x = fs.readFileSync(f, "utf8");
if (!x.includes("com.google.android.gms.ads.APPLICATION_ID")) {
  x = x.replace("</application>", '    <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="' + ADMOB_APP_ID + '"/>\n    </application>');
} else {
  x = x.replace(/(com\.google\.android\.gms\.ads\.APPLICATION_ID"\s+android:value=")[^"]*/, "$1" + ADMOB_APP_ID);
}
if (!x.includes("android.permission.INTERNET")) x = x.replace("</manifest>", '    <uses-permission android:name="android.permission.INTERNET" />\n</manifest>');
if (!x.includes("screenOrientation")) x = x.replace("<activity", '<activity\n            android:screenOrientation="fullUser"');
fs.writeFileSync(f, x);
console.log("OK: AndroidManifest.xml を更新しました（AdMobアプリID: " + ADMOB_APP_ID + "）");
