# 光と鏡のパズル：Androidアプリ化キット

※このキットは、私（Claude）の環境ではインストール・ビルドを試せていません（ネットワーク制限のため）。
 書いたJavaScriptの文法チェックと、www/index.html の生成までは確認済みです。
 実際の動作確認は、あなたのPCのエミュレーターで行ってください。

## 0. 先に入れるもの
- Node.js（LTS版）… https://nodejs.org
- Android Studio … https://developer.android.com/studio

## 1. 最初の1回だけ（このフォルダで、ターミナルを開いて実行）
    npm install
    npm i @capacitor/core @capacitor/android @capacitor/app @capacitor/status-bar @capacitor-community/admob
    npm i -D @capacitor/cli
    npx cap add android

（package.json に最新の組み合わせが自動で入ります。エラーが出たら、メッセージをそのまま私に送ってください）

先に capacitor.config.json の `appId` を、自分用の名前に変えてください（例：com.taro.hikari）。
**公開後は変更できません。** 小文字の英数字とドットだけ。

## 2. ゲームを更新するたびに
    npm run sync
（src/hikari-puzzle.html を www/index.html にして Android 側へ反映します）

## 3. エミュレーターで動かす
    npm run open
→ Android Studio が開く
→ 右上の Device Manager で仮想端末（Pixel など）を作成
→ 緑の ▶ ボタンで実行
確認すること：
- タイトル→ステージ選択→プレイ→クリア
- 戻るボタン（メニュー／戻る／アプリ終了）
- 画面を横向きにしても崩れないか
- 保存（アプリを終了して開き直しても進行が残る）
- テスト広告（バナー／ステージ間／リワード）が出るか。テスト広告には “Test Ad” と出ます

## 4. 公開用ファイル（.aab）を作る
Android Studio：Build → Generate Signed App Bundle / APK → Android App Bundle
- 初回は「Create new…」で署名キー（keystore）を作る
- **keystoreファイルとパスワードは、2か所以上にバックアップ。失くすと更新できなくなります**
- 版を上げるとき：android/app/build.gradle の versionCode を +1（毎回必須）、versionName は表示用

## 5. 公開前に必ずやる（広告）
1. AdMob（https://admob.google.com）に登録し、アプリを追加
2. 「アプリID」と、広告ユニット3つ（リワード／インタースティシャル／バナー）を作る
3. patch-android.js の ADMOB_APP_ID を本物のアプリIDに変える
4. ads-bridge.js の USE_TEST_IDS を false にして、PROD に3つのIDを入れる
5. npm run sync
※テスト中に、本番IDの広告を自分でタップしないこと（アカウント停止の恐れ）。
※広告を出さずに公開するなら、ads-bridge.js の AdMob 部分は不要です（私に言ってください）。

## ファイル構成
- src/hikari-puzzle.html … ゲーム本体（更新したらここに置き換え）
- ads-bridge.js … ゲームと AdMob をつなぐ部品（戻るボタン処理も入っています）
- build.js … 上の2つを合体して www/index.html を作る
- patch-android.js … AndroidManifest に広告IDなどを書き込む
- capacitor.config.json … アプリ名・ID
