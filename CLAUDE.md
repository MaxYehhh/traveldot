# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language

**所有與使用者的對話必須使用繁體中文。** 程式碼、變數名稱、註解風格維持原有語言，僅對話回覆需使用繁體中文。

## Project Overview

**TravelDot** is a map-based travel journaling application that bridges the gap between navigation tools (Google Maps), photo galleries, and social media. The core philosophy: *"Every Dot Tells a Story."*

**Key Metrics:**
- Record efficiency: ≤ 30 seconds per place
- Organization efficiency: ≤ 1 hour for 10-day trip (30 places)
- Recall efficiency: ≤ 10 seconds to find specific memory
- Map load time: < 2 seconds
- Photo upload/display: < 1 second

**Target Users:**
- Deep travelers (25-40): Want geographic + emotional context
- Digital nomads (28-45): Track multi-city experiences
- Family archivists (30-50): Preserve travel memories

## Agent System

本專案使用 **4 個專職 Agent** 處理不同類型的任務，主 session 負責解讀指令並分派。

### Agent 一覽

| Agent | 職責 | 啟動時機 |
|-------|------|---------|
| **spec-agent** | 規格文件撰寫與維護 | 新功能規劃、AC 新增、規格細化 |
| **feature-agent** | 業務邏輯、Store、Firebase | Store 狀態管理、API CRUD、地圖邏輯 |
| **uiux-agent** | 樣式、動畫、響應式佈局 | 視覺元件、Tailwind、互動效果 |
| **test-agent** | AC 驗收、Playwright 測試 | 功能實作完成後的驗收 |

### 指令路由規則

收到模糊/概念性指令時，主 session 依以下邏輯分派：

```
「設計 / 規劃 / 定義 / 我想要一個新功能」
    → spec-agent（先產出規格，再交給實作）

「實作 / 做出 / 加上 / 修復」
    → 判斷任務性質：
        業務邏輯 / 資料 / Store  → feature-agent
        畫面 / 樣式 / 動畫       → uiux-agent
        橫跨兩者                 → 兩個 agent 並行

「驗收 / 測試 / 確認是否正確 / 截圖確認」
    → test-agent

「更新文件 / 規格有誤 / 補充 AC」
    → spec-agent
```

### 協作流程

```
User 概念性指令
      ↓
主 session 解讀 + 拆解任務
      ↓
spec-agent（如需規格）→ 產出 AC + Spec
      ↓
feature-agent ←→ uiux-agent（並行實作）
      ↓
test-agent（AC 驗收）
      ↓
回報結果給 User
```

> Agent 設定檔位於 `.claude/agents/`，各 agent 會自行掃描 `.claude/skills/` 按需取用。

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Run tests (single run)
npm run test

# Preview production build
npm run preview
```

## Core Architecture

### State Management Pattern (Zustand)

Three primary stores manage application state:

**1. `authStore.ts`** - Authentication State
- Manages: `currentUser`, `loading`, `error`, `isInitialized`
- Firebase listener automatically updates on auth state changes
- Auto-initializes when app loads

**2. `tripStore.ts`** - Trip Data Management
- Manages: `trips[]`, `currentTrip`, `loading`, `error`
- Subscribes to Firestore collection
- Provides: `fetchTrips()`, `createTrip()`, `setCurrentTrip()`

**3. `mapStore.ts`** - Map UI State
- Manages map interaction: `currentLocation`, `zoom`, `mapCenter`
- Selection state: `selectedPlace`, `activeMemory`
- UI toggles: `isSidebarOpen`, `isEditorOpen`, `editorMode` ('add' | 'edit')
- Data cache: `places[]`

### Real-time Data Flow

```
Firestore Collection
    ↓
subscribeToPlaces() listener (firestore.ts)
    ↓
MapDataManager.tsx
    ↓
mapStore.setPlaces()
    ↓
Components re-render with updated places
```

### Firestore Data Structure

```javascript
users/{userId}/
└── trips/{tripId}/
    ├── title, description, startDate, endDate
    ├── coverImage (Storage URL)
    ├── placesCount (denormalized counter)
    └── places/{placeId}/
        ├── name, coordinates {lat, lng}, address
        ├── visitedDate, rating, tags[], color
        ├── content: {
        │   text (HTML from TipTap),
        │   media: [{ type, url, caption, timestamp }]
        │ }
        ├── isPublic, createdAt, updatedAt
```

**Firebase Storage Path:**
```
media/{userId}/{tripId}/{timestamp}_{filename}
```

### Key Component Architecture

**Map System:**
- `MapContainer.tsx` - Orchestrates map, search, and event handlers
- `MapDataManager.tsx` - Subscribes to Firestore, syncs to mapStore
- `MapMarkers.tsx` - Renders markers with clustering (@googlemaps/markerclusterer)
- `MapEventHandler.tsx` - Handles POI click events (Google Places API)
- `PlaceSearch.tsx` - Google Places autocomplete with session tokens

**Editor System:**
- `PlaceEditor.tsx` - Modal for add/edit with form validation
- `RichTextEditor.tsx` - TipTap WYSIWYG (Bold, Italic, Lists, Links)
- `ImageUploader.tsx` - Photo upload with browser-image-compression (< 1MB)
- `TagInput.tsx` - Tag management with autocomplete

**Responsive Layout:**
- Desktop: Sidebar (360px right panel)
- Mobile: Bottom sheet (50vh expandable)

## Development Workflow (MANDATORY)

**🚨 CRITICAL: Before implementing ANY feature, you MUST follow the workflow defined in [DEVELOPMENT_WORKFLOW.md](./docs/DEVELOPMENT_WORKFLOW.md)**

完整流程說明見 `docs/DEVELOPMENT_WORKFLOW.md`。以下為快速摘要：

1. **解讀指令** → 確認任務類型，決定分派哪個 agent
2. **確認 AC 範圍** → 讀 `docs/task.md` + `docs/ACCEPTANCE_CRITERIA.md`
3. **分派 agent 執行** → 一次一個 AC，不批次處理
4. **驗收** → test-agent 執行 AC 驗證，截圖存證
5. **回報** → 列出完成項目、修改檔案、已知問題

### Common Mistakes to AVOID

❌ **Ignoring bold-emphasized rules in AC**
- Example: AC-025 states "**尚未儲存的地點不顯示 Delete**" - MUST implement this condition

❌ **Adding default placeholder text**
- AC-034 explicitly forbids "這是一個非常棒的地點..." text - leave content empty

❌ **Missing animations or interactive feedback**
- AC-025 requires "地圖自動 Zoom in (如 < 15) 並 Center 該地點" - implement ALL parts

❌ **Hardcoding colors instead of using CSS variables**
- Use `var(--primary-500)` not `#3B82F6`

## Development Rules

### Quality Assurance Protocol

**Mandatory Self-Review:**
Before submitting tasks or delivering code, you MUST perform self-review and functionality verification.

**Mandatory Phase Demo:**
When each development phase is complete and passes self-review, you MUST demonstrate all features to the user.

**Bug-Free Delivery:**
Ensure delivered code has no syntax errors, logic bugs, and has passed basic happy path testing.

### 3-Strike Rule for Error Handling

When fixing a single feature or bug:
1. Maximum **3 attempts** per issue
2. If 3 attempts fail → **STOP immediately**
3. Report to user:
   - Current status
   - Methods attempted
   - Failure analysis
   - Suggested alternatives or discussion points

**禁止盲目嘗試** (No blind attempts)

### Safety Protocol

**User Approval Required** before executing:
- Destructive commands (`rm`, database deletion, dependency removal)
- Any irreversible operations

## Critical Technical Patterns

### Image Upload Workflow

```
User selects photos
  → Compress each (max 1MB, 1920px) using browser-image-compression
  → uploadPhoto() to Firebase Storage
  → Get downloadURL
  → Add to content.media[]
  → createPlace() with timeout wrapper (20s photo, 10s Firestore)
  → Real-time sync updates mapStore
```

### Trip Initialization Flow

```
App mounts
  → authStore Firebase listener checks auth state
  → If user exists:
    → fetchTrips()
    → If no trips: auto-create "My First Trip"
    → MapDataManager subscribes to places
  → Otherwise: show AuthPage
```

### Error Handling Pattern

- **Network resilience:** Timeout wrappers, online status checks (`navigator.onLine`)
- **User feedback:** Toast notifications (Sonner) for success/error
- **Form validation:** Inline error messages in Chinese
- **Graceful degradation:** Loading states with spinner icons

## Technology Stack

**Frontend:**
- React 19 + TypeScript 5.9
- Vite 7 (build tool with HMR)
- Tailwind CSS + shadcn/ui components
- @vis.gl/react-google-maps (Google Maps wrapper)
- TipTap 3 (ProseMirror-based WYSIWYG editor)
- Zustand 5 (state management)
- browser-image-compression (client-side optimization)

**Backend:**
- Firebase Auth (Email/Password)
- Cloud Firestore (real-time NoSQL)
- Firebase Cloud Storage (media files)

**Key Libraries:**
- `@googlemaps/markerclusterer` - Marker clustering for performance
- `sonner` - Toast notifications
- `lucide-react` - Icon library
- `date-fns` - Date handling
- `react-router-dom` - Client-side routing

## Environment Variables

Required in `.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_FIREBASE_CONFIG=...
```

## Performance Optimization

- **Image compression:** Client-side before upload (< 1MB target)
- **Marker clustering:** Reduces DOM elements for 100+ places
- **Firestore converters:** Automatic date serialization
- **Session tokens:** Google Places API cost reduction
- **Lazy loading:** Route-based code splitting

## Known Limitations (Phase 2 Features)

- No multi-trip collaboration (single user focus)
- No export/sharing yet
- No offline support
- No EXIF auto-reading
- Rating UI not implemented (TODO: PlaceEditor.tsx:154)

## Reference Documents

- **[PLAN.md](./docs/PLAN.md)** - Business requirements and market analysis
- **[PRD.md](./docs/PRD.md)** - Product requirements and data structures
- **[DESIGN_SPEC.md](./docs/DESIGN_SPEC.md)** - UI/UX specifications
- **[TECH_SPEC.md](./docs/TECH_SPEC.md)** - Technical architecture
- **[ACCEPTANCE_CRITERIA.md](./docs/ACCEPTANCE_CRITERIA.md)** - Acceptance criteria (Given-When-Then format)
- **[.agent/rules/project-rules.md](./.agent/rules/project-rules.md)** - Development standards
