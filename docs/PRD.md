# TravelDot - 產品需求文件 (PRD)

## 1. 產品架構 (Data Structure)
系統採階層式結構設計：
- **旅程 (Trip)**: 頂層容器，儲存日期區間、名稱、封面。
- **目的地 (Destination)**: 城市或地區級別的聚合。
- **地點 (Place)**: 具體的座標點。
- **記錄內容 (Memory)**: 文字、照片、影片、評分、標籤。

## 2. MVP 功能規格

### 2.1 地圖介面與新增地點
- **Google Maps API**: 整合 Pin 標記與 Marker Clustering。
- **搜尋功能**: 整合 Google Places API，支援關鍵字搜尋與當前定位。

### 2.2 內容編輯器
- **基礎編輯**: 支援粗體、斜體、連結等 Rich Text 格式 (推薦 TipTap)。
- **媒體處理**: 照片批次上傳、自動壓縮與 Caption 功能。
- **屬性標記**: 支援 1-5 星評分及自訂標籤系統。

### 2.3 瀏覽與分享
- **列表模式**: 提供時間軸形式的內容清單。
- **匯出功能**: 一鍵壓縮為 ZIP 包，包含結構化 JSON 與媒體檔案。
- **分享頁面**: 產生唯讀的 Web 連結，適配行動裝置與桌面網覽。

## 3. 技術棧與標準
- **Frontend**: React + TypeScript + Vite, Tailwind CSS + shadcn/ui.
- **Backend/Services**: Firebase (Auth, Firestore, Storage).
- **效能指標**:
    - 地圖載入 < 2s
    - 搜尋響應 < 0.5s
    - 地點聚合渲染 < 0.3s

## 4. UI/UX 設計原則
- **Less is More**: 保持乾淨的介面，地圖始終是核心。
- **全平台優化**: 符合 Mobile-First 原則，同時在 Web/Desktop 提供側欄的高效佈局。

## 5. 開發優先順序
1. **Week 1-2**: 地圖與地點搜尋標記。
2. **Week 3-4**: 內容編輯器與儲存機制。
3. **Week 5-6**: 旅程管理與列表瀏覽。
4. **Week 7-8**: 分享頁面、資料匯出與帳號系統。
