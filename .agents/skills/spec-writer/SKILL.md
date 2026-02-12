---
name: spec-writer
description: 根據 PRD 產出詳細的 Functional Spec、Design Spec 與 Technical Spec 三份規格文件。包含操作流程、邊界案例、視覺標註、資料庫設計、API 定義等完整規格。
license: MIT
---

# Spec Writer - 規格文件撰寫專家

根據產品需求文件 (PRD) 產出三份詳細的規格文件，確保開發、設計與測試團隊能精確執行。

## 何時使用此 Skill

當你需要：
- 將 PRD 轉換為可執行的規格文件
- 撰寫詳細的功能規格（操作流程、邊界案例）
- 定義精確的設計規格（色彩、字體、間距、動畫）
- 建立完整的技術規格（資料庫、API、架構）
- 確保規格文件之間的一致性

## 工作流程

### Step 1: Discovery 發現階段

1. **閱讀現有文件**：
   - `PRD.md`：產品需求文件
   - `PLAN.md`：商業需求與市場分析（如果有）
   - `ACCEPTANCE_CRITERIA.md`：驗收標準（如果有）
   - `project-rules.md`：專案規則與技術棧（如果有）

2. **確認範圍**：
   - 與使用者確認需要撰寫哪些 Spec（Functional / Design / Technical）
   - 確認是否有特殊要求或限制

3. **建立實作計畫**：
   - 列出需要撰寫的文件清單
   - 定義每份文件的結構與參考來源
   - 規劃驗證方式

### Step 2: Execution 執行階段

依序撰寫三份 Spec 文件：

#### 2.1 Functional Spec (FUNCTIONAL_SPEC.md)

**目的**：詳細描述每個功能的操作反饋、狀態變換、邊界案例處理方式。

**結構**：
```markdown
# [專案名稱] - 功能規格文件 (Functional Spec)

## 目的
本文件詳細描述每個功能的操作反饋、狀態變換、邊界案例處理方式。

---

## 1. [功能模組名稱]

### 1.1 [子功能名稱]

#### 操作流程
1. 步驟 1
2. 步驟 2
...

#### 狀態變換
```
[狀態 A] → [狀態 B] → [狀態 C]
```

#### 驗證規則
- **欄位 1**：驗證規則
- **欄位 2**：驗證規則

#### 邊界案例處理

**Case 1: [案例名稱]**
```
Given: 前提條件
When: 操作
Then: 預期結果
```

#### 錯誤處理
- **錯誤類型 1**：處理方式
- **錯誤類型 2**：處理方式

---

## [重複以上結構，涵蓋所有功能模組]

---

## 附錄

### A. 狀態碼對照表
### B. 參考文件
```

**撰寫要點**：
- 每個功能都要有清晰的操作流程（Step-by-step）
- 狀態變換要用圖示或文字清楚表達
- 邊界案例要涵蓋：網路錯誤、權限問題、資料異常、配額限制等
- 錯誤處理要包含：錯誤訊息、建議動作、恢復策略
- 使用 Given-When-Then 格式描述邊界案例

#### 2.2 Design Spec (DESIGN_SPEC.md)

**目的**：提供精確的視覺標註，包含間距、字體大小、色號、動態效果等。

**結構**：
```markdown
# [專案名稱] - 設計規格文件 (Design Spec)

## 目的
本文件提供精確的視覺標註，確保設計與開發團隊能精確執行。

---

## 1. Design System 設計系統基礎

### 1.1 Color Palette 色彩系統

#### Primary Colors 主色
```css
--primary-500: #3B82F6;   /* 主色 */
--primary-600: #2563EB;   /* Hover */
--primary-700: #1D4ED8;   /* Active */
```

#### Semantic Colors 語意色
```css
--success-500: #10B981;   /* 成功 */
--error-500: #EF4444;     /* 錯誤 */
--warning-500: #F59E0B;   /* 警告 */
--info-500: #3B82F6;      /* 資訊 */
```

### 1.2 Typography 字體系統

#### Font Family
```css
--font-sans: 'Inter', sans-serif;
```

#### Font Size
```css
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
```

### 1.3 Spacing Scale 間距系統
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
```

### 1.4 Shadows & Effects
```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
```

### 1.5 Animation & Transition
```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;

--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 2. Component Specifications 元件規格

### 2.1 Button 按鈕

#### Primary Button
```css
/* Normal State */
background: var(--primary-500);
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;
font-size: 16px;
font-weight: 500;

/* Hover State */
background: var(--primary-600);
transform: translateY(-1px);

/* Active State */
background: var(--primary-700);
```

---

## 3. Page Layouts 頁面佈局

### 3.1 Responsive Breakpoints
```css
/* Mobile: 375px - 767px */
/* Tablet: 768px - 1023px */
/* Desktop: 1024px+ */
```

---

## 4. Animation Specifications 動畫規格

### 4.1 Page Transitions
### 4.2 Micro-interactions

---

## 5. Accessibility 無障礙設計

### 5.1 Color Contrast（對比度 ≥ 4.5:1）
### 5.2 Focus States（明顯的焦點狀態）
### 5.3 Touch Targets（最小 44x44px）
```

**撰寫要點**：
- 所有顏色都要提供 HEX 色碼
- 所有間距都要精確到 px 或 rem
- 所有字體大小都要標註 px 與 rem
- 元件要包含所有狀態（Normal, Hover, Active, Disabled, Loading）
- 動畫要標註持續時間與緩動函數
- 響應式設計要明確定義斷點

#### 2.3 Technical Spec (TECH_SPEC.md)

**目的**：包含資料庫設計、API 定義、系統效能要求及架構設計。

**結構**：
```markdown
# [專案名稱] - 技術規格文件 (Technical Spec)

## 目的
本文件包含資料庫設計、API 定義、系統效能要求及架構設計。

---

## 1. System Architecture 系統架構

### 1.1 Overall Architecture 整體架構
```
[架構圖]
```

### 1.2 Frontend Architecture 前端架構
```
src/
├── components/
├── hooks/
├── stores/
├── services/
├── utils/
├── types/
└── pages/
```

---

## 2. Database Schema 資料庫設計

### 2.1 Collections / Tables

#### Collection: `users`
```typescript
{
  id: string;
  email: string;
  createdAt: Timestamp;
}
```

### 2.2 Indexes 索引

**Index 1: [索引名稱]**
```
Collection: users
Fields:
  - email (Ascending)
  - createdAt (Descending)
```

### 2.3 Security Rules 安全規則

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Rules here
  }
}
```

---

## 3. API Specifications API 規格

### 3.1 Authentication API

#### 註冊
```typescript
async function signUp(email: string, password: string): Promise<UserCredential>
```

### 3.2 Database API

#### 建立資料
```typescript
async function createItem(data: ItemInput): Promise<string>
```

---

## 4. Performance Requirements 效能要求

| 指標 | 目標 | 測量方式 |
|------|------|---------|
| FCP | < 1.5s | Lighthouse |
| LCP | < 2.5s | Lighthouse |
| TTI | < 3.5s | Lighthouse |

### 4.1 優化策略
- Code Splitting
- Image Optimization
- Lazy Loading
- Debounce & Throttle

---

## 5. Security & Privacy 安全與隱私

### 5.1 Authentication 認證機制
### 5.2 Data Protection 資料保護
### 5.3 Input Validation 輸入驗證
### 5.4 XSS Protection XSS 防護

---

## 6. Error Handling & Logging 錯誤處理與日誌

### 6.1 Error Handling Strategy
### 6.2 Logging

---

## 7. Testing Strategy 測試策略

### 7.1 Unit Tests 單元測試
### 7.2 Integration Tests 整合測試
### 7.3 E2E Tests 端對端測試

---

## 8. Deployment & CI/CD 部署與持續整合

### 8.1 Build Configuration
### 8.2 Environment Variables
### 8.3 Deployment Process
```

**撰寫要點**：
- 資料庫 Schema 要包含所有欄位與型別
- API 要包含完整的 TypeScript 型別定義
- Security Rules 要涵蓋所有 CRUD 操作
- 效能要求要有明確的數字目標
- 程式碼範例要可以直接使用

### Step 3: Verification 驗證階段

1. **完整性檢查**：
   - ✅ Functional Spec 涵蓋所有 User Stories 的邊界案例
   - ✅ Design Spec 包含精確的視覺標註
   - ✅ Technical Spec 包含完整的資料庫 Schema 與 API 定義

2. **一致性檢查**：
   - ✅ 與 PRD.md 的 User Stories 一致
   - ✅ 與 ACCEPTANCE_CRITERIA.md 的驗收標準一致
   - ✅ 與 project-rules.md 的技術棧一致

3. **可執行性檢查**：
   - ✅ 開發團隊可以根據 Spec 開始開發
   - ✅ 設計團隊可以根據 Spec 產出設計稿
   - ✅ 測試團隊可以根據 Spec 撰寫測試

4. **產出 Walkthrough**：
   - 撰寫成果報告
   - 列出三份文件的主要內容
   - 說明文件之間的關係
   - 提供下一步建議

## 品質標準

### Functional Spec 品質標準
- ✅ 每個功能都有清晰的操作流程
- ✅ 狀態變換圖清楚易懂
- ✅ 邊界案例涵蓋至少 5 種情境
- ✅ 錯誤處理包含明確的錯誤訊息與建議動作
- ✅ 使用 Given-When-Then 格式

### Design Spec 品質標準
- ✅ 色彩系統包含至少 3 種色階（Primary, Secondary, Neutral）
- ✅ 字體系統包含至少 4 種尺寸
- ✅ 間距系統基於 4px 或 8px 基準
- ✅ 元件規格包含所有狀態（Normal, Hover, Active, Disabled）
- ✅ 動畫規格包含持續時間與緩動函數
- ✅ 響應式設計明確定義斷點

### Technical Spec 品質標準
- ✅ 資料庫 Schema 包含所有欄位與型別
- ✅ API 規格包含 TypeScript 型別定義
- ✅ Security Rules 涵蓋所有 CRUD 操作
- ✅ 效能要求有明確的數字目標
- ✅ 程式碼範例可以直接使用
- ✅ 包含測試策略與部署流程

## 參考 Skills

撰寫過程中可參考以下 skills：
- **prd**: PRD 文件的結構與標準
- **executing-plans**: 規劃與執行方法
- **ui-ux-pro-max**: UI/UX 設計原則
- **frontend-design**: 前端美學指南

## 輸出格式

產出三個檔案：
1. `docs/FUNCTIONAL_SPEC.md`
2. `docs/DESIGN_SPEC.md`
3. `docs/TECH_SPEC.md`

每個檔案都應該：
- 使用清晰的標題結構（H1, H2, H3）
- 包含目錄（如果內容超過 5 個主要章節）
- 使用程式碼區塊展示範例
- 包含參考文件連結
- 使用表格整理資訊（如效能要求、狀態碼對照表）

## 常見錯誤與避免方式

❌ **錯誤 1**：邊界案例不夠詳細
✅ **正確做法**：每個功能至少涵蓋 5 種邊界案例（網路錯誤、權限問題、資料異常、配額限制、使用者取消）

❌ **錯誤 2**：設計規格缺少精確數值
✅ **正確做法**：所有顏色、間距、字體大小都要有精確的數值（HEX, px, rem）

❌ **錯誤 3**：技術規格缺少程式碼範例
✅ **正確做法**：每個 API 都要有完整的 TypeScript 型別定義與使用範例

❌ **錯誤 4**：文件之間不一致
✅ **正確做法**：撰寫完成後進行交叉檢查，確保三份文件的功能描述一致

## 範例

完整的範例可參考：
- [TravelDot FUNCTIONAL_SPEC.md](../../docs/FUNCTIONAL_SPEC.md)
- [TravelDot DESIGN_SPEC.md](../../docs/DESIGN_SPEC.md)
- [TravelDot TECH_SPEC.md](../../docs/TECH_SPEC.md)
