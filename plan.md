# 設計與實作方向

依照已確認的藍圖，網站服務香港法律專業人士，以置中搜尋列為首頁焦點，保留法律資訊、簡報、法例與判例研究、AI 輔助研究及律所方案入口。網站只包含前端原型，不接入帳戶、服務端、真實法律搜尋、AI 模型、付款或通知。

## 設計

- **設計運動**：瑞士國際主義的清晰網格與當代高端科技產品介面，藉精準排版和留白傳達可信度。
- **核心原則**：搜尋先行；資訊層級清楚；讓來源可回查；互動低摩擦並誠實標示原型限制。
- **色彩哲學**：白底與近黑字為主，冷調淺灰用於分隔；少量電光青 `#16D9C5` 作為焦點及狀態提示。
- **版面架構**：編輯式首頁以置中搜尋為視覺核心，再由水平分隔線引導資訊流、簡報、研究與方案；內頁共用導覽及內容層級。桌機與手機均需保留清楚的搜尋、切換和入口。
- **識別元素**：使用者提供的 Kortex Insight 標誌原圖取代先前自製標誌；以細線、章節編號和少量青色狀態標記延續原有科技感。
- **互動與動效**：搜尋框聚焦以柔和細青框提示；展示搜尋和 AI 固定示例，不模擬真實服務。頁面導覽保留輕微淡入，尊重 `prefers-reduced-motion`。
- **字體系統**：繁體中文採系統中文字型堆疊；英文採 Inter／系統無襯線。日期、法規識別碼和章節編號使用等寬字體。
- **品牌精髓**：Kortex Insight 為香港法律專業工作提供資訊與研究入口；個性為精準、克制、敏銳。中英文介面共用相同標誌與版面設計。

## 實作與結構

以原生 HTML、CSS、JavaScript 和 Node 內建 HTTP server 提供純靜態前端。History API 支援繁體中文 `/`、`/insights`、`/briefings`、`/research`、`/assistant`、`/solutions` 六頁，以及對應 `/en`、`/en/insights`、`/en/briefings`、`/en/research`、`/en/assistant`、`/en/solutions` 六個英文頁。語言切換對應到目前頁面的另一語系；兩種語言的搜尋、篩選、簡報切換和聊天均只展示固定示例。`public/manus-routes.json` 宣告十二個前端頁面路由，server 只提供網站入口和公開靜態檔案，沒有資料庫或服務端 API。

- `server.js`：Node 原生 HTTP 靜態檔案伺服器、已知頁面 SPA fallback 與安全路徑範圍。
- `index.html`：中英文共用的頁首、語言切換、頁尾與 SEO／無障礙標記。
- `src/styles.css`：白底極簡品牌、版面、responsive 樣式、Kortex 標誌與語言切換鈕。
- `src/app.js`：繁體中文頁面內容與既有示例互動。
- `src/en.js`：六個入口的完整英文頁面模板。
- `src/bilingual.js`：英文路由、語言狀態、導覽與英文示例互動；繁體中文頁維持原有應用路由。
- `public/kortex-insight.png`：原樣保存的使用者提供標誌；`app.config.ts` 專案 `logoUrl` 指向相同標誌圖的 HTTPS URL。
- `public/manus-routes.json`：中英文十二條頁面路由清單。
- `package.json`：原生 Node 啟動命令及專案資訊。

## Cloudflare Pages 部署增補

- 使用 Node 內建模組的 `build.js` 建立 `dist/`；輸出只包含 `index.html`、`src/`、`public/`、網站路由 JSON，以及 Cloudflare Pages `_redirects`，不發布 `server.js`、`plan.md`、`TODO.md` 或專案組態檔。
- `npm run build` 為無外部套件的靜態建置命令；Cloudflare Pages 輸出目錄設定為 `dist`，以明確的繁中／英文頁面路由 fallback 支援單頁應用導覽。
- 部署至新的公開 Cloudflare Pages 專案 `kortex-insight`；來源為 GitHub `Shawnyauhk/Kortex_insight` 的 `main` 分支，使用預設 `pages.dev` 網址，不配置自訂網域或後端服務。
