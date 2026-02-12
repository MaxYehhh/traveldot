# TravelDot 開發任務清單 (Redevelopment)

本清單依據 `docs/PLAN.md` 與 `docs/ACCEPTANCE_CRITERIA.md` 重新制定。所有項目完成前必須經過自我審查。

- [x] **Phase 1: 核心地圖功能 (MVP Core)** <!-- Week 1-2 -->
    - [x] **1.1 專案架構與基礎建設**
        - [x] 審查並修正專案結構 (符合 `TECH_SPEC.md` 1.2)
        - [x] 確認 Tailwind CSS 與 shadcn/ui 配置
        - [x] 設定 Google Maps API Key 環境變數
    - [x] **1.2 地圖顯示 (AC-020 ~ AC-022)**
        - [x] 整合 Google Maps JS API
        - [x] 實作地圖顯示與中心定位
        - [x] 實作 Pin 標記與 Hover 效果
    - [x] **1.3 地點聚合 (AC-023 ~ AC-024)**
        - [x] 實作 Marker Clustering
        - [x] 處理聚合點擊展開互動
    - [x] **1.4 地點新增交互 (Refined)**
        - [x] 搜尋框固定於左上角 (Persistent)
        - [x] 移除 FAB 選單，改為單一「目前位置」按鈕
        - [x] 移除「在地圖上選點」功能
        - [x] 實作地圖原生 POI 點擊偵測 (AC-033)
    - [x] **1.5 Phase 1 自我審查與驗收**

- [x] **Phase 2: 內容編輯器 (MVP Editor)** <!-- Week 3-4 -->
    - [x] Phase 2.1: 內容編輯器 UI 框架 @id:phase-2.1
    - [x] 實作地點預覽卡片 (Place Preview Card) @id:AC-025, AC-026, AC-027
    - [x] 建立側邊欄地點列表 (Sidebar) @id:AC-042
    - [x] 實作側邊欄互動 (點擊選取、收合/展開) @id:AC-043, AC-044
    - [x] 實作側邊欄底部 Sheet 模式 (Mobile) @id:AC-045
    - [x] 建立地點編輯器 Modal (Add/Edit Place) @id:AC-034
    - [x] 實作照片上傳與預覽 UI (模擬/File Input) @id:AC-035, AC-036, AC-037
    - [x] 實作標籤管理功能 @id:AC-038
    - [x] 實作地點儲存與更新邏輯 (Local State) @id:AC-039, AC-040, AC-041
    - [x] **2.2 內容編輯功能 (AC-034 ~ AC-041)**
        - [x] 整合 TipTap 富文本編輯器
        - [x] 實作照片上傳、壓縮與預覽 (AC-035 ~ AC-037)
        - [x] 實作標籤管理 (AC-038)
        - [x] 實作表單驗證邏輯 (AC-040)
    - [x] **2.3 資料狀態管理**
        - [x] 定義 Zustand Store (符合 `TECH_SPEC.md`)
        - [x] 串接前端暫存邏輯
    - [x] **2.4 Phase 2 自我審查與驗收**
        - [x] 驗證編輯器 Bug 修復 (Tags, RichText)
        - [x] 驗證可訪問性 (Search Keyboard Nav)
        - [x] 驗證側邊欄功能 (Delete, Collapse)

- [x] **Phase 3: 後端整合 (Firebase)**
    - [x] **3.1 基礎設施**
        - [x] 初始化 Firebase 專案 (`src/services/firebase.ts`)
        - [x] 設定 Firestore Security Rules (`firestore.rules`)
        - [x] 設定 Storage Rules (`storage.rules`)
    - [x] **3.2 使用者認證 (AC-001 ~ AC-008)**
        - [x] 實作註冊/登入/登出 API (`useAuthStore`)
        - [x] 實作登入頁面 UI (`LoginForm`, `SignupForm`)
    - [x] **3.3 資料串接 (CRUD)**
        - [x] 實作旅程 (Trip) CRUD (`firestore.ts`, `useTripStore`)
        - [x] 實作地點 (Place) CRUD (Integrated in `PlaceEditor` & `mapStore`)
        - [x] 實作照片上傳至 Storage (`storage.ts`)
    - [x] **3.4 Phase 3 自我審查與驗收**

- [ ] **Phase 4: 旅程管理與列表模式** <!-- Week 5-6 -->
    - [ ] 實作 Landing Page 旅程列表 (AC-009 ~ AC-019)
    - [ ] 實作地點列表模式 (Timeline) (AC-048 ~ AC-050)
    - [ ] 實作篩選功能 (Tags, Date) (AC-046 ~ AC-047)

- [ ] **Phase 5: 資料匯出與分享** <!-- Week 7-8 -->
    - [ ] 實作資料匯出 (ZIP) (AC-055 ~ AC-056)
    - [ ] (Future) 實作分享頁面
