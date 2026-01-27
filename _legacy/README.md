# TravelDot 🌍

TravelDot 是一個現代化、圖形化的旅行記錄與社交平台。使用者可以透過地圖精準定位，記錄旅行中的點滴故事，並與全球使用者分享。

## 🏗️ 專案整體架構

本專案採用的技術架構如下：

### 1. 前端框架 (Frontend)
- **Next.js (App Router)**: 使用 React 生態系中最強大的框架，提供流暢的路由切換與高效的性能。
- **TypeScript**: 確保代碼的強類型與可維護性。
- **Tailwind CSS**: 實現回應式、簡約現代的 UI 設計。
- **Lucide React**: 提供優質的開發圖示。

### 2. 後端與資料庫 (Backend & Database)
- **Supabase (PostgreSQL)**: 作為後端資料庫與身分驗證系統。
- **Row Level Security (RLS)**: 確保使用者資料的安全性，僅限擁有者編輯自己的內容。
- **Real-time**: 實現地圖標記的動態讀取。

### 3. 地圖服務 (Map Service)
- **Google Maps API**: 提供核心的地圖渲染、地址搜尋 (Autocomplete) 與精確定位功能。

---

## 📂 主要目錄結構

```text
src/
├── app/                  # Next.js 13+ App Router
│   ├── page.tsx          # 登錄首頁 (Introduction & Landing)
│   ├── map/
│   │   └── page.tsx      # 核心地圖互動頁面 (Logged-in main view)
│   └── globals.css       # 全域樣式定義 (Light Theme default)
├── components/           # 可複用 UI 元件
│   ├── Auth.tsx          # 登入與註冊模組
│   ├── Map.tsx           # Google Maps 整合與標記邏輯
│   ├── TravelCard.tsx    # 新增/編輯旅程紀錄的卡片
│   └── ProfileCenter.tsx # 個人中心與筆記管理
├── lib/                  # 工具函式與標案客戶端初始化
│   └── supabase.ts       # Supabase Client 初始化
└── types/                # TypeScript 類型定義
    └── database.ts       # 資料庫模型結構
```

---

## ✨ 核心功能說明

1. **互動式地圖**: 支援深/淺色切換，並能精確點擊地圖位置。
2. **旅程紀錄**: 使用者可以對特定座標撰寫故事、設定名稱，並選擇公開或私人儲存。
3. **地點搜尋**: 整合 Google Place Autocomplete，快速定位到想去的城市。
4. **個人中心**: 管理屬於自己的所有「旅程點」，支援編輯與刪除。
5. **社交瀏覽**: 可以過濾查看全球其他使用者分享的公開紀錄。

---

## 🚀 快速開始

### 環境變數
請在根目錄建立 `.env.local` 並填入以下資訊：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 啟動開發環境
```bash
npm install
npm run dev
```

---

## 🌐 部署方式

專案已針對 **Vercel** 進行優化。提交代碼至 GitHub 後，可透過 Vercel Dashboard 匯入並設置對應的環境變數即可完成部署。

**正式部署網址**: [https://traveldot-liard.vercel.app/](https://traveldot-liard.vercel.app/)
