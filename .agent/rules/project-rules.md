# TravelDot 開發規則與規範 (Development Rules)

本文件定義 TravelDot 專案的開發標準、技術規範與核心原則。詳細的產品需求請參考 [PRD.md](../../docs/PRD.md)。所有貢獻者應遵循此文件進行開發。

## 1. 產品概述 (Product Overview)
*   **App Name:** TravelDot
*   **Slogan:** Every Dot Tells a Story.
*   **Core Value:** 讓旅行記憶與地點產生永久連結，並能隨時優雅地回顧。
*   **Nature:** 地圖式回憶容器 (非導航工具、非純相簿、非公共社群即時動態)。

## 2. 技術棧 (Tech Stack)
### 前端 (Frontend)
*   **Core Framework:** React + TypeScript (Vite)
*   **Map Integration:** `@vis.gl/react-google-maps` (Google Maps JavaScript API)
*   **State Management:** Zustand
*   **Routing:** React Router
*   **UI/Styling:** Tailwind CSS, shadcn/ui, Lucide React
*   **Rich Text Editor:** TipTap

### 後端 / 服務 (Backend & Services)
*   **Platform:** Firebase (Authentication, Firestore, Storage, Hosting)

## 3. 開發規範 (Coding Standards)
### 3.1 命名慣例 (Naming Conventions)
*   **Components:** PascalCase (e.g., `PlaceCard.tsx`)
*   **Functions/Hooks/Variables:** camelCase
*   **Constants:** UPPER_SNAKE_CASE
*   **Folders:** kebab-case

### 3.2 程式碼風格 (Code Style)
*   使用 Functional Components 與 Hooks。
*   TypeScript: 嚴格模式，禁止使用 `any`，明確定義 Interface/Type。
*   Imports: 優先使用清晰的絕對/相對路徑。

### 3.3 元件設計 (Component Design)
*   單一職責原則 (Single Responsibility)。
*   邏輯與 UI 分離 (Logic in Hooks/Store, UI in Components)。

### 3.4 **自我審查與回報 (Self-Review & Reporting)**
*   **開發後審查:** 每次功能開發或修改完畢後，**必須**先進行全面的自我審查。
    *   **功能測試:** 確認功能是否運作正常，是否符合需求。
    *   **程式碼檢查:** 檢查是否有語法錯誤、邏輯漏洞或常見的 Lint 警告。
*   **回報標準:** 只有在確認**沒有問題**後，才向使用者回報任務完成。嚴禁在未經測試或審查的情況下直接交付。

## 4. 資料結構 (Data Structure)
層級：`Trip` > `Destination` > `Place` > `Memory Content`
*   詳細介面定義請參考程式碼中的 `types/` 目錄或本文件初稿。

## 5. UI/UX 設計原則 (Design Principles)
*   **Less is more:** 介面保持乾淨，以地圖為核心，避免過多雜訊干擾地圖視野。
*   **視覺優先:** 優先展示高品質媒體內容，強調沈浸式的視覺回顧體驗。
*   **極速操作:** 記錄流程需在 30 秒內完成，優化所有輸入路徑。
*   **全平台適配與優化 (Cross-Platform Adaptation):**
    *   **Mobile (行動版):** 遵循 Mobile First 原則，確保單手操作便利性、觸控熱區合理，以及離線或不穩定網路下的反應力。
    *   **Web/Desktop (網頁版):** 
        *   **視窗效率:** 善用寬螢幕佈局，使用側邊欄 (Sidebar) 或雙欄式設計同時呈現地圖與內容列表，避免切換頁面的斷裂感。
        *   **滑鼠互動:** 增加細膩的 Hover 狀態回饋、工具提示 (Tooltips) 以及更豐富的滑鼠操作邏輯。
        *   **導航與快捷鍵:** 提供清晰的導航路徑，並針對專業使用者考慮鍵盤快捷鍵 (如 `/` 搜尋、`ESC` 關閉)。
    *   **一致性:** 確保在不同尺寸的網頁環境下，核心操作流程與品牌視覺維持高度一致。

## 6. 開發路線圖 (Development Roadmap)
1.  基礎地圖與地點標記。
2.  內容編輯器與媒體上傳。
3.  旅程管理與列表模式。
4.  分享與資料匯出功能。
