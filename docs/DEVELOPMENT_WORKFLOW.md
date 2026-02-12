# TravelDot 開發工作流程 (Development Workflow)

## 🎯 目的

此文件定義 AI 進行開發時的**強制流程**，確保每個功能都符合 PRD 與驗收標準。

---

## 🤖 Step 0: Agent 路由 (Task Routing)

**收到任何指令時，主 session 必須先完成路由，再開始執行。**

### 任務類型判斷

```
指令包含「規劃 / 設計 / 定義 / 新功能 / 補充 AC / 更新規格」
  → spec-agent

指令包含「實作 / 修復 / 加上 / 做出 / 整合」
  → 判斷性質：
      Store / Firebase / API / 地圖邏輯   → feature-agent
      樣式 / 動畫 / 響應式 / UI 元件      → uiux-agent
      同時涉及邏輯與樣式                  → 兩個 agent 並行

指令包含「驗收 / 測試 / 確認畫面 / 截圖」
  → test-agent

指令包含「檢視 / 說明 / 分析 / 目前狀況」
  → 主 session 直接處理（不需分派）
```

### 並行 vs 循序

| 情境 | 執行方式 |
|------|---------|
| 純邏輯功能（無 UI 設計需求） | feature-agent 獨立執行 |
| 純 UI 調整（無資料層變動） | uiux-agent 獨立執行 |
| 新功能（有資料 + 有 UI） | feature-agent + uiux-agent 並行 |
| 實作完成後驗收 | test-agent 循序執行 |
| 需求不明確 | spec-agent 先產出規格再實作 |

---

## 📋 開發前置檢查 (Pre-Development Checklist)

在開始寫任何 code 之前，**必須**完成以下檢查：

### Step 1: 確認任務範圍

```bash
# 讀取任務定義
1. 閱讀 docs/task.md - 確認當前 Phase 與任務項目
2. 找到對應的 User Stories (docs/PRD.md)
3. 找到所有相關的 AC (Acceptance Criteria) 編號
```

**範例：**
```
任務: "實作地點編輯器 Modal"
→ 對應 AC: AC-034, AC-035, AC-036, AC-037, AC-038, AC-039, AC-040, AC-041
```

### Step 2: 閱讀完整規格

**強制閱讀順序：**

1. **ACCEPTANCE_CRITERIA.md** - 找到所有相關的 AC-XXX
   - 用 Given-When-Then 理解預期行為
   - **特別注意帶有 ⚠️ 或粗體強調的規範**

2. **FUNCTIONAL_SPEC.md** - 理解操作流程與邊界案例
   - 狀態變換邏輯
   - 錯誤處理方式

3. **DESIGN_SPEC.md** - 取得視覺規格
   - 色號、間距、字體大小
   - 動畫持續時間與緩動函數
   - 各狀態的樣式 (Normal, Hover, Active, Disabled)

4. **TECH_SPEC.md** - 確認技術實作方式
   - 資料結構
   - API 呼叫方式
   - Store 管理

### Step 3: 列出關鍵檢查點

根據 AC 列出**開發完成後必須驗證的項目**：

**範例 (AC-034 地點編輯器):**
```markdown
開發完成後必須驗證：
- [ ] Modal 在手機為全螢幕，桌面為 600px 置中
- [ ] 預填資料：名稱、地址、座標、日期、時間
- [ ] Focus 在「內容」編輯區 (如果名稱已預填)
- [ ] 「心得筆記」欄位 Placeholder: "寫下你的心得..."
- [ ] **絕對不可出現預設填充文字**
- [ ] 圖標顏色預設藍色
```

---

## 🛠️ 開發階段 (Development Phase)

### 實作原則

1. **嚴格遵守 AC 定義** - 不要「自由發揮」或「優化」未要求的部分
2. **一次只做一個 AC** - 不要批次實作多個功能
3. **即時測試** - 每完成一個 AC 立即手動測試

### 程式碼品質要求

參考 `.agent/rules/project-rules.md`:

1. **3-Strike Rule** - 單一問題最多嘗試 3 次
2. **Bug-Free Delivery** - 交付前必須自我審查
3. **Safety Protocol** - 破壞性操作需用戶批准

---

## ✅ 開發後驗證 (Post-Implementation Verification)

### Verification Checklist

完成開發後，**逐項檢查**以下項目：

#### 1. 功能驗證

針對每個 AC，執行 Given-When-Then 測試：

```markdown
範例 (AC-039 儲存地點):

Given: 使用者在編輯器 Modal
  And: 已填寫地點名稱、日期、上傳照片、內容、標籤、評分
When: 點擊 [儲存] 按鈕
Then:
  - [ ] 按鈕顯示 loading: "儲存中..."
  - [ ] 按鈕變 disabled
  - [ ] 資料儲存到 Firestore (< 1 秒)
  - [ ] Modal 關閉
  - [ ] 地圖上出現新 Pin
  - [ ] 側邊欄列表更新
  - [ ] 顯示 Toast: "地點已新增"
```

#### 2. 視覺驗證

檢查 DESIGN_SPEC.md 中的規格是否正確實作：

- [ ] 顏色使用 CSS 變數 (如 `var(--primary-500)`)
- [ ] 間距符合設計系統 (4px 倍數)
- [ ] 字體大小正確 (text-base, text-lg, etc.)
- [ ] 動畫持續時間正確 (150ms, 200ms, 300ms)
- [ ] Hover/Active/Disabled 狀態都有實作

#### 3. 邊界案例驗證

檢查 FUNCTIONAL_SPEC.md 中的錯誤處理：

- [ ] 必填欄位驗證
- [ ] 網路錯誤處理
- [ ] 檔案大小/格式驗證
- [ ] Loading 狀態顯示
- [ ] 錯誤訊息清晰易懂 (中文)

#### 4. 響應式驗證

測試以下螢幕尺寸：

- [ ] 手機: 375px (iPhone SE)
- [ ] 平板: 768px (iPad)
- [ ] 桌面: 1024px, 1440px

#### 5. 可訪問性驗證

- [ ] 鍵盤可操作 (Tab 導航, Enter 確認, ESC 關閉)
- [ ] Focus 狀態明顯 (outline 可見)
- [ ] aria-label 正確設定 (icon-only 按鈕)

---

## 🔍 常見錯誤防範 (Common Pitfalls)

### 1. 忽略粗體強調的規範

**錯誤範例:**
```typescript
// ❌ 忽略了 AC-025: "尚未儲存的地點不顯示 Delete"
<PlacePreviewCard>
  <button>Edit</button>
  <button>Delete</button>  // 錯誤：新地點也顯示刪除按鈕
</PlacePreviewCard>
```

**正確做法:**
```typescript
// ✅ 根據 AC-025 條件顯示
<PlacePreviewCard>
  <button>Edit</button>
  {place.id && <button>Delete</button>}  // 只有已儲存的才顯示
</PlacePreviewCard>
```

### 2. 自行補充預設內容

**錯誤範例:**
```typescript
// ❌ AC-034 明確禁止預設填充文字
const [content, setContent] = useState("這是一個非常棒的地點...")
```

**正確做法:**
```typescript
// ✅ 預設為空，只有 placeholder
<textarea placeholder="寫下你的心得..." />
```

### 3. 缺少動畫或互動反饋

**錯誤範例:**
```typescript
// ❌ AC-025 要求 "地圖自動 Zoom in (如 < 15) 並 Center 該地點"
const handlePinClick = (place) => {
  setSelectedPlace(place)  // 沒有 zoom in 和 center
}
```

**正確做法:**
```typescript
// ✅ 完整實作所有 AC 要求
const handlePinClick = (place) => {
  if (map.getZoom() < 15) {
    map.setZoom(15)  // Zoom in
  }
  map.panTo(place.coordinates)  // Center
  setSelectedPlace(place)
}
```

### 4. 顏色寫死而非使用變數

**錯誤範例:**
```css
/* ❌ 寫死顏色 */
.button {
  background: #3B82F6;
  color: #FFFFFF;
}
```

**正確做法:**
```css
/* ✅ 使用 Design System 變數 */
.button {
  background: var(--primary-500);
  color: var(--text-inverse);
}
```

---

## 🚨 驗收失敗處理 (Acceptance Failure Protocol)

如果任何 AC 驗證失敗：

### Step 1: 停止開發

**不要**繼續實作其他功能，立即處理當前問題。

### Step 2: 診斷問題

1. 重新閱讀該 AC 的 Given-When-Then
2. 檢查是否誤解需求
3. 確認是否有技術障礙

### Step 3: 修正或回報

**如果可自行修正:**
- 修改 code
- 重新測試
- 更新驗證清單

**如果遇到技術障礙或需求不明確:**
- 停止嘗試 (3-Strike Rule)
- 向使用者回報:
  - 當前狀況
  - 已嘗試的方法
  - 失敗原因分析
  - 建議的替代方案

---

## 📦 交付標準 (Delivery Standards)

完成開發後，提供以下交付物：

### 1. 功能 Demo 報告

```markdown
## AC-034 地點編輯器 Modal - 實作完成

### 已實作功能
- ✅ Modal 響應式設計 (手機全螢幕 / 桌面 600px)
- ✅ 預填資料 (名稱、地址、座標、日期、時間)
- ✅ Focus 管理
- ✅ 無預設填充文字

### 驗證結果
- ✅ 手機測試通過 (375px)
- ✅ 桌面測試通過 (1440px)
- ✅ 鍵盤導航正常

### 已知問題
- 無
```

### 2. 程式碼變更摘要

列出修改的檔案與主要變更：

```
src/components/PlaceEditor.tsx - 新增地點編輯器 Modal
src/stores/mapStore.ts - 新增 editorMode 狀態
src/services/firestore.ts - 新增 createPlace API
```

### 3. 測試截圖或螢幕錄影

提供關鍵功能的視覺驗證。

---

## 🔄 迭代改進 (Iteration Protocol)

如果使用者回報問題：

1. **定位 AC** - 找出對應的驗收標準
2. **確認差異** - 實作與 AC 的差異在哪
3. **優先修正** - 先修正 AC 明確定義的問題
4. **補充文件** - 如果是 AC 缺漏，建議更新文件

---

## 📚 參考文件優先級

開發時文件查閱優先級：

1. **ACCEPTANCE_CRITERIA.md** (最高) - 這是驗收的唯一標準
2. **FUNCTIONAL_SPEC.md** - 操作流程與邊界案例
3. **DESIGN_SPEC.md** - 視覺規格
4. **TECH_SPEC.md** - 技術實作細節
5. **PRD.md** - 產品需求背景
6. **project-rules.md** - 開發規範

---

## ✨ 成功案例參考

**Phase 1 & 2 完成項目** (可作為參考):

- ✅ AC-020~022: 地圖顯示與 Pin 標記
- ✅ AC-023~024: 地點聚合
- ✅ AC-025~027: Place Preview Card
- ✅ AC-034~041: 地點編輯器

這些項目都通過了完整的驗證流程。

---

## 🎯 開發流程總結

```
User 概念性指令
   ↓
Step 0: 主 session 路由判斷
   ↓
[需要規格?] → spec-agent → 產出 AC + SPEC
   ↓
Step 1: Pre-Development Checklist（確認 AC 範圍）
   ↓
Step 2: 閱讀完整規格 (AC, SPEC)
   ↓
Step 3: 列出驗證清單
   ↓
Step 4: 分派 agent 實作（一次一個 AC）
         feature-agent ←→ uiux-agent（可並行）
   ↓
Step 5: test-agent 驗收（截圖存證）
   ↓
Step 6: 回報 Demo 報告
   ↓
[有問題?] → 回到 Step 4 迭代
```

**記住：寧可多花 10 分鐘確認需求，也不要花 1 小時重寫錯誤的實作。**
