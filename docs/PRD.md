# TravelDot - 產品需求文件 (PRD)

## 1. Executive Summary

### Problem Statement
現有的旅行記錄工具存在以下痛點：
- **Google Maps** 專注於導航功能，缺乏「故事感」與「回憶沈浸感」
- **相簿 App** 以時間軸為主，難以直觀呈現旅行的「空間移動軌跡」
- **Instagram** 側重公開展示，而非私人、完整的真實記錄
- **Google My Maps** 介面冰冷且創作門檻高，不適合一般使用者

使用者需要一個能同時滿足「地理視覺化」與「深度內容記錄」的工具，讓旅行記憶與地點產生永久連結。

### Proposed Solution
TravelDot 是一款「地圖式旅行日記」，讓使用者以最快的方式記錄旅行，並能永久優雅地回顧每個地點的回憶。

**核心差異化：**
- **極速記錄體驗**：30 秒完成一次記錄，不干擾旅行節奏
- **地圖 + 回憶結合**：不只是標記地點，而是承載完整的故事與情感
- **智慧整理功能**：自動讀取照片 EXIF，1 小時整理 10 天旅程
- **優雅分享體驗**：產生高品質的分享頁面，適合作為個人 mini-blog

### Success Criteria
MVP 成功標準（可測量的 KPI）：

1. **記錄效率**：從打開 app 到完成一個地點的記錄 ≤ 30 秒
2. **整理效率**：整理一趟 10 天旅程（30 個地點）≤ 1 小時
3. **回顧效率**：找到特定地點的記錄 ≤ 10 秒
4. **效能指標**：
   - 地圖載入時間 < 2 秒
   - 照片上傳後顯示 < 1 秒
   - 搜尋地點回應 < 0.5 秒
   - 地點聚合渲染 < 0.3 秒
5. **分享效率**：產生分享連結 ≤ 3 次點擊

---

## 2. User Experience & Functionality

### User Personas

#### Persona A: 深度旅行者（主要目標用戶）
- **年齡**：25-40 歲
- **特徵**：喜歡深度探索、重視體驗品質、願意花時間整理回憶
- **痛點**：現有工具無法同時滿足「地理視覺化」與「深度內容記錄」
- **使用場景**：
  - 旅行當下快速記錄（30 秒內完成）
  - 旅行後深度整理（1 小時整理 10 天旅程）
  - 日常回顧（10 秒內找到特定回憶）

#### Persona B: 數位遊民（次要目標用戶）
- **年齡**：28-45 歲
- **特徵**：長期移動工作、需要記錄多個城市的生活點滴
- **痛點**：需要更系統化的方式管理跨城市的生活記錄
- **使用場景**：記錄工作空間、生活據點、推薦地點

#### Persona C: 家庭旅行記錄者（潛在目標用戶）
- **年齡**：30-50 歲
- **特徵**：重視家庭回憶保存、希望為孩子留下完整的成長足跡
- **痛點**：照片散落各處，難以系統化整理與分享
- **使用場景**：家庭旅行記錄、親子活動軌跡

### User Stories & Acceptance Criteria

#### Epic 1: 使用者認證與帳號管理

**US-1.1: 註冊新帳號**
```
As a 新使用者
I want to 使用 Email 註冊帳號
So that 我可以開始記錄旅行
```
**Acceptance Criteria:**
- Email 格式驗證（顯示即時錯誤訊息）
- 密碼強度驗證（至少 8 個字元）
- 註冊成功後自動登入並跳轉到 Landing Page
- 顯示歡迎 Toast 訊息

**US-1.2: 登入與登出**
```
As a 已註冊使用者
I want to 使用 Email 和密碼登入
So that 我可以存取我的旅行記錄
```
**Acceptance Criteria:**
- 登入按鈕顯示 loading 狀態（防止重複提交）
- 錯誤密碼顯示明確錯誤訊息
- 登入成功後跳轉到 Landing Page
- 支援「忘記密碼」功能（發送重設連結到 Email）

#### Epic 2: 旅程管理

**US-2.1: 建立新旅程**
```
As a 使用者
I want to 建立新旅程並設定名稱、日期
So that 我可以開始記錄這趟旅行的地點
```
**Acceptance Criteria:**
- 旅程名稱為必填（顯示驗證錯誤）
- 開始日期與結束日期為必填
- 結束日期不能早於開始日期（顯示驗證錯誤）
- 封面照片為選填
- 建立成功後新旅程出現在列表最前方

**US-2.2: 編輯與刪除旅程**
```
As a 使用者
I want to 編輯或刪除現有旅程
So that 我可以修正錯誤或移除不需要的旅程
```
**Acceptance Criteria:**
- 右鍵點擊（或長按）Trip Card 顯示選單（編輯、刪除、分享）
- 刪除前顯示確認對話框（說明此操作無法復原）
- 刪除時以動畫方式消失（fade-out + slide-up, 200ms）

#### Epic 3: 地圖介面與地點標記

**US-3.1: 顯示地圖與地點**
```
As a 使用者
I want to 在地圖上看到我所有記錄的地點
So that 我可以視覺化回顧我的旅行軌跡
```
**Acceptance Criteria:**
- 地圖載入時間 < 2 秒
- 地圖自動縮放以顯示所有地點
- 每個地點顯示藍色 Pin 標記（32x40px）
- 當地點數量 > 10 且 zoom level < 12 時，自動聚合為 cluster
- Cluster 顯示內含地點數量，尺寸隨數量增加

**US-3.2: 新增地點（搜尋）**
```
As a 使用者
I want to 搜尋地點並加入旅程
So that 我可以快速記錄我去過的地方
```
**Acceptance Criteria:**
- 點擊 FAB (+) 按鈕展開選單（搜尋地點、使用當前位置、在地圖上選點）
- 搜尋框即時顯示 Google Places 建議（< 500ms）
- 每個建議顯示地點名稱、地址、距離（如果有位置權限）
- 點擊建議後地圖中心移到該地點並開啟編輯器

**US-3.3: 新增地點（當前位置）**
```
As a 使用者
I want to 使用當前 GPS 位置新增地點
So that 我可以快速記錄我現在所在的地方
```
**Acceptance Criteria:**
- 點擊「使用當前位置」後顯示 loading（正在定位...）
- GPS 定位時間 < 3 秒
- 定位成功後地圖中心移到當前位置並開啟編輯器
- 如果位置權限被拒絕，顯示 Toast 提示

**US-3.4: 新增地點（地圖選點）**
```
As a 使用者
I want to 在地圖上手動選擇位置
So that 我可以標記沒有在 Google Places 中的地點
```
**Acceptance Criteria:**
- 進入「選點模式」後地圖中央顯示十字準星
- 拖動地圖時十字準星固定在中央
- 底部顯示 [取消] [確認位置] 按鈕
- 點擊 [確認位置] 後在十字準星位置放置 Pin 並開啟編輯器

#### Epic 4: 內容編輯器

**US-4.1: 編輯地點內容**
```
As a 使用者
I want to 為地點新增文字、照片、標籤、評分
So that 我可以記錄完整的旅行回憶
```
**Acceptance Criteria:**
- 地點名稱為必填（顯示驗證錯誤）
- 支援 Rich Text 編輯（粗體、斜體、項目符號、連結）
- 日期時間預設為今天與現在
- 評分為 1-5 星（選填）
- 公開/私密設定（預設為私密）

**US-4.2: 上傳照片**
```
As a 使用者
I want to 上傳多張照片並為每張照片加 caption
So that 我可以完整記錄地點的視覺回憶
```
**Acceptance Criteria:**
- 支援拖曳上傳與點擊選擇
- 支援批次上傳（可多選）
- 每張照片限制 10MB
- 自動壓縮至 < 1MB（保持品質）
- 上傳完成後顯示縮圖
- 可為每張照片加 caption
- 可拖曳調整照片順序
- 整個上傳流程 < 5 秒

**US-4.3: 標籤管理**
```
As a 使用者
I want to 為地點新增標籤
So that 我可以快速篩選與分類地點
```
**Acceptance Criteria:**
- 點擊 [+ 新增標籤] 彈出輸入框
- 自動顯示建議（如果之前用過這個標籤）
- 按 Enter 新增標籤
- 標籤顯示為 chip（可點擊刪除）

**US-4.4: 儲存地點**
```
As a 使用者
I want to 儲存地點資料
So that 我的記錄可以永久保存
```
**Acceptance Criteria:**
- 點擊 [儲存] 按鈕顯示 loading（儲存中...）
- 資料儲存到 Firestore < 1 秒
- Modal 關閉後地圖上出現新 Pin
- 側邊欄列表更新
- 顯示 Toast（地點已新增）

#### Epic 5: 瀏覽與篩選

**US-5.1: 側邊欄顯示地點列表（桌面版）**
```
As a 使用者
I want to 在側邊欄看到所有地點的列表
So that 我可以快速瀏覽與選擇地點
```
**Acceptance Criteria:**
- 側邊欄寬度 360px
- 顯示旅程名稱與地點總數
- 每個列表項顯示：地點名稱、日期時間、評分、第一張照片縮圖
- 按日期倒序排列（最新的在上面）
- 點擊列表項目後地圖中心移到該地點並彈出 Preview Card

**US-5.2: Bottom Sheet（手機版）**
```
As a 使用者
I want to 在手機上透過 Bottom Sheet 瀏覽地點
So that 我可以在小螢幕上方便地查看列表
```
**Acceptance Criteria:**
- 預設高度 160px（顯示前 2 個地點）
- 頂部有拖曳手柄（灰色橫條）
- 向上拖動展開到 80vh
- 向下拖動收回到 160px

**US-5.3: 切換列表模式**
```
As a 使用者
I want to 切換到列表模式（時間軸）
So that 我可以以時間順序瀏覽地點
```
**Acceptance Criteria:**
- 點擊 Header 的 [List] 按鈕切換到列表模式（fade transition 300ms）
- 每個地點顯示為卡片（日期、地點名稱、地址、第一張照片、評分、標籤）
- 按日期倒序排列
- 點擊卡片彈出 Place Preview Card

**US-5.4: 篩選地點**
```
As a 使用者
I want to 依標籤或日期篩選地點
So that 我可以快速找到特定類型的地點
```
**Acceptance Criteria:**
- 點擊 Header 的 [Filter] 按鈕彈出篩選 Modal
- 顯示所有已使用的標籤列表
- 選擇標籤後地圖與側邊欄只顯示符合的地點
- Header 顯示篩選狀態（藍色 badge）
- 可清除篩選恢復顯示所有地點

#### Epic 6: 資料匯出

**US-6.1: 匯出所有資料**
```
As a 使用者
I want to 一鍵匯出所有旅行資料
So that 我可以備份或轉移到其他平台
```
**Acceptance Criteria:**
- 在設定頁面點擊 [匯出資料] 按鈕
- 顯示確認 Modal（預估檔案大小）
- 顯示進度條（正在打包資料...）
- 產生 ZIP 檔案包含：
  - trips.json（索引檔）
  - 各旅程的 trip.json
  - 所有照片檔案
  - README.txt（說明檔案結構）
- 自動下載 ZIP 檔（檔名：traveldot-export-{timestamp}.zip）
- 顯示 Toast（資料已匯出）

### Non-Goals (MVP 階段不開發)

以下功能將在 Phase 2 或更晚的版本中開發：

- ❌ **影片上傳功能**：專注於照片記錄，避免流量成本與複雜度
- ❌ **AI 自動整理功能**：EXIF 自動分析與描述摘要
- ❌ **社群功能**：搜尋其他用戶的公開紀錄、收藏、複製
- ❌ **資料匯入功能**：從 Google Photos、iCloud、GPX、KML 匯入
- ❌ **分享功能**：產生唯讀連結分享地點或旅程（Phase 2）
- ❌ **複雜的權限設定**：分享連結有效期限、細粒度權限控制
- ❌ **離線記錄功能**：離線時記錄，有網路時自動同步（Phase 2）

---

## 3. Technical Specifications

### Architecture Overview

#### Frontend Architecture
```
React + TypeScript (Vite)
├── Components
│   ├── Map (Google Maps API)
│   ├── PlaceEditor (TipTap Rich Text Editor)
│   ├── TripList
│   └── Sidebar / BottomSheet
├── State Management (Zustand)
│   ├── authStore (使用者認證狀態)
│   ├── tripStore (旅程與地點資料)
│   └── mapStore (地圖狀態)
└── Styling (Tailwind CSS + shadcn/ui)
```

#### Backend Architecture (Firebase)
```
Firebase
├── Authentication (Email/Password)
├── Firestore (NoSQL Database)
│   ├── users/{userId}
│   │   ├── profile
│   │   └── trips/{tripId}
│   │       ├── metadata
│   │       └── places/{placeId}
│   └── media/{userId}/{tripId}/{mediaId}
└── Storage (照片儲存)
```

### Data Schema

#### Firestore Structure
```javascript
// users/{userId}/profile
{
  email: string,
  displayName: string,
  createdAt: timestamp,
  updatedAt: timestamp
}

// users/{userId}/trips/{tripId}
{
  id: string,
  title: string,
  description: string,
  startDate: timestamp,
  endDate: timestamp,
  coverImage: string (Storage URL),
  placesCount: number,
  createdAt: timestamp,
  updatedAt: timestamp
}

// users/{userId}/trips/{tripId}/places/{placeId}
{
  id: string,
  tripId: string,
  name: string,
  coordinates: {
    lat: number,
    lng: number
  },
  address: string,
  visitedDate: timestamp,
  content: {
    text: string (Rich Text HTML),
    media: [
      {
        type: 'photo',
        url: string (Storage URL),
        caption: string,
        timestamp: timestamp
      }
    ]
  },
  tags: string[],
  rating: number (1-5),
  isPublic: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Export Data Format (JSON)
```json
{
  "version": "1.0",
  "exported_at": "2024-03-20T10:30:00Z",
  "trips": [
    {
      "id": "thailand_2024",
      "title": "2024 泰國之旅",
      "start_date": "2024-03-01",
      "end_date": "2024-03-15",
      "cover_image": "trips/thailand_2024/media/cover.jpg",
      "places": [
        {
          "id": "cafe_amazon_cmu",
          "name": "Cafe Amazon (清邁大學分店)",
          "coordinates": { "lat": 18.8038, "lng": 98.9520 },
          "address": "239 Nimmana Haeminda Rd Lane 1, Chiang Mai",
          "visited_date": "2024-03-05T14:30:00Z",
          "content": {
            "text": "很棒的工作空間...",
            "media": [
              {
                "type": "photo",
                "file": "media/photo_001.jpg",
                "caption": "店內環境"
              }
            ]
          },
          "tags": ["咖啡", "工作空間", "推薦"],
          "rating": 5,
          "is_public": true
        }
      ]
    }
  ]
}
```

### Integration Points

#### Google Maps JavaScript API
- **用途**：地圖顯示、地點標記、地點聚合（Clustering）
- **API Key**：需要在 `.env` 設定 `VITE_GOOGLE_MAPS_API_KEY`
- **費用預估**：$100-300/月（基於預估使用量）

#### Google Places API
- **用途**：地點搜尋、自動完成建議
- **API Key**：與 Google Maps 共用
- **費用預估**：包含在 Google Maps API 費用中

#### Firebase Services
- **Authentication**：Email/Password 登入
- **Firestore**：NoSQL 資料庫（使用者、旅程、地點資料）
- **Storage**：照片儲存（每張照片壓縮至 < 1MB）
- **Hosting**：網站部署
- **費用預估**：初期使用免費額度，隨用戶增長調整

### Security & Privacy

#### 使用者資料保護
- 所有使用者資料儲存在 Firebase Firestore，受 Firebase Security Rules 保護
- 每個使用者只能存取自己的資料（透過 `userId` 驗證）
- 照片儲存在 Firebase Storage，URL 包含 token 防止未授權存取

#### Firebase Security Rules
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /trips/{tripId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        match /places/{placeId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
  }
}

// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /media/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### 密碼處理
- 使用 Firebase Authentication 處理密碼（自動加密與雜湊）
- 密碼強度驗證：至少 8 個字元
- 支援密碼重設（發送重設連結到 Email）

### Performance Requirements

#### 載入時間
- **地圖載入**：< 2 秒（從點擊 Trip Card 到地圖完全顯示）
- **照片上傳**：< 1 秒（上傳後顯示縮圖）
- **搜尋響應**：< 0.5 秒（輸入關鍵字到顯示建議）
- **地點聚合渲染**：< 0.3 秒（zoom 變化到 cluster 更新）

#### 圖片優化
- **上傳前壓縮**：每張照片壓縮至 < 1MB（保持品質）
- **Lazy Loading**：旅程卡片圖片使用 lazy loading
- **Placeholder**：圖片尚未載入時顯示灰色 placeholder

#### 響應式設計
- **手機**：375px - 767px（主要使用場景）
- **平板**：768px - 1023px
- **桌面**：1024px+（用於旅行後整理）

---

## 4. Risks & Roadmap

### Phased Rollout

#### Phase 1: MVP (Week 1-8)
**目標**：完成核心功能，讓使用者可以記錄、整理、回顧旅行

- **Week 1-2**：地圖與地點新增
  - 整合 Google Maps API
  - 實作地點搜尋功能
  - 實作地點 Pin 顯示
  - 實作地點聚合（clustering）

- **Week 3-4**：內容編輯器
  - 建立 Rich Text 編輯器（TipTap）
  - 實作照片上傳與顯示
  - 實作標籤管理
  - 實作評分與公開設定
  - 資料儲存到 Firestore

- **Week 5-6**：旅程管理與瀏覽
  - 旅程建立/編輯/刪除
  - 地圖模式瀏覽
  - 列表模式瀏覽
  - 篩選功能

- **Week 7-8**：資料匯出與帳號系統
  - 資料匯出功能
  - 使用者帳號系統（Firebase Authentication）
  - 測試與 Bug 修復

#### Phase 2: 進階功能 (未來擴充)
- 智慧化功能（EXIF 自動分析、AI 描述摘要）
- 分享功能（唯讀連結、mini-blog）
- 社群功能（搜尋、收藏、複製）
- 資料匯入（Google Photos、iCloud、GPX、KML）
- 離線記錄功能

### Technical Risks

#### Risk 1: Google Maps API 費用超支
- **影響**：HIGH
- **可能性**：MEDIUM
- **緩解策略**：
  - 監控 API 使用量
  - 設定每日配額上限
  - 實作 API 呼叫快取機制
  - 考慮使用 Mapbox 作為備選方案

#### Risk 2: Firebase 免費額度不足
- **影響**：MEDIUM
- **可能性**：LOW（初期使用者少）
- **緩解策略**：
  - 監控 Firestore 讀寫次數
  - 優化查詢（使用索引、限制查詢範圍）
  - 實作前端快取（減少重複查詢）
  - 預算準備升級到 Blaze Plan

#### Risk 3: 照片儲存成本
- **影響**：MEDIUM
- **可能性**：MEDIUM
- **緩解策略**：
  - 上傳前自動壓縮（< 1MB）
  - 限制每張照片大小（10MB）
  - 免費版限制儲存空間（5GB）
  - 付費版提供更大儲存空間（100GB）

#### Risk 4: 地點聚合效能問題
- **影響**：MEDIUM
- **可能性**：LOW
- **緩解策略**：
  - 使用成熟的 Clustering 套件（如 @googlemaps/markerclusterer）
  - 限制單次顯示的地點數量
  - 實作虛擬化（只渲染可見區域的地點）

#### Risk 5: 開發時程延遲
- **影響**：HIGH
- **可能性**：MEDIUM
- **緩解策略**：
  - 嚴格遵循 Non-Goals（不開發 Phase 2 功能）
  - 每週 Sprint Review（檢查進度）
  - 預留 Buffer Time（Week 7-8 用於測試與修復）
  - 必要時縮減功能範圍（如暫時移除列表模式）

---

## 5. Appendix

### UI/UX Design Principles
1. **Less is More**：功能簡潔易懂，地圖始終是核心
2. **快速操作**：每個動作最多 3 步驟完成
3. **視覺優先**：地圖為主，列表為輔
4. **即時回饋**：所有操作要有明確的視覺回饋
5. **全平台優化**：
   - Mobile First：單手操作便利性、觸控熱區合理
   - Web/Desktop：善用寬螢幕佈局、側邊欄設計、Hover 狀態回饋

### Tech Stack Summary
- **Frontend**: React + TypeScript + Vite
- **Map**: Google Maps JavaScript API
- **Editor**: TipTap (ProseMirror based)
- **State**: Zustand
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)

### Reference Documents
- **[PLAN.md](./PLAN.md)**: 商業需求與市場分析
- **[ACCEPTANCE_CRITERIA.md](./ACCEPTANCE_CRITERIA.md)**: 詳細的驗收標準（Given-When-Then 格式）
- **[project-rules.md](../.agent/rules/project-rules.md)**: 開發規範與 UI/UX 設計準則
