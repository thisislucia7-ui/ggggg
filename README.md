# 轉身成為小寵物

一個溫馨的寵物養成網頁遊戲：30 種動物、8 種個性、餵食玩耍洗澡、心情日記、三個小遊戲、房間佈置、好友拜訪與留言板。

## 公開網站（Firebase）設定步驟

只要做一次，之後每次更新 `main` 分支，網站就會自動重新部署。

1. **建立專案**：到 [Firebase 主控台](https://console.firebase.google.com/) 按「新增專案」，取個名字（例如 `pet-diary`）。
2. **開啟登入功能**：左側「建構 → Authentication → 開始使用」，在「登入方式」啟用 **電子郵件/密碼**。
3. **建立資料庫**：左側「建構 → Firestore Database → 建立資料庫」，選「以正式版模式啟動」，地區建議選 `asia-east1`（台灣）。
4. **產生部署金鑰**：齒輪圖示「專案設定 → 服務帳戶 → 產生新的私密金鑰」，會下載一個 `.json` 檔。這個檔案是密碼，**不要傳給任何人、不要上傳到存放庫**。
5. **把金鑰交給 GitHub**：到這個存放庫的「Settings → Secrets and variables → Actions → New repository secret」
   - Name：`FIREBASE_SERVICE_ACCOUNT`
   - Secret：用記事本打開剛剛的 `.json`，把全部內容貼上
6. **部署**：到「Actions → 部署到 Firebase → Run workflow」，或推送到 `main`。完成後網址是 `https://你的專案ID.web.app`，也會顯示在那次執行的摘要裡。

部署流程會自動建立網頁應用程式並填好 `fbconfig.js`；如果失敗，可以手動把 Firebase 主控台「專案設定 → 一般 → 你的應用程式」裡的 `firebaseConfig` 貼進 `fbconfig.js`。

## 三種執行方式

| 在哪裡開 | 登入方式 | 存檔與好友 |
|---|---|---|
| Firebase 網站 | 電子郵件＋密碼 | 雲端存檔、好友、留言板 |
| claude.ai artifact | Claude 帳號 | 雲端存檔、好友、留言板 |
| 直接開檔案／其他網站 | 不需要 | 單機，紀錄只存在該瀏覽器 |

## 檔案

| 檔案 | 內容 |
|---|---|
| `index.html` | 頁面與樣式 |
| `pets.js` | 30 種動物與飼料圖示 |
| `room.js` | 房間佈置與家具 |
| `audio.js` | 音樂與音效 |
| `fbconfig.js` | Firebase 網站設定 |
| `net.js` | 登入、雲端存檔、好友與留言板 |
| `games.js` | 三個小遊戲 |
| `app.js` | 養成、心情、日記等核心功能 |
| `world.js` | 多寵物同房、髒亂、打架、商店、好友拜訪 |
| `life.js` | 個性、咬人、手機選單、個人資訊、放養／賣出 |
| `firebase.json`、`firestore.rules` | Firebase 部署設定與資料庫安全規則 |
| `.github/workflows/firebase.yml` | 自動部署流程 |
