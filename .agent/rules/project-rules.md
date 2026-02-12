---
trigger: always_on
---

# TravelDot 開發規則與規範 (Development Rules)

本文件定義 TravelDot 專案的開發標準、技術規範與核心原則。所有開發與合作過程應嚴格遵循此文件。

## 1. 開發文件遵循 (Development Compliance)
開發過程必須嚴格遵照以下技術與產品文件之規範：
*   **[PLAN.md](../../docs/PLAN.md):** 產品願景、市場分析與開發路線規劃。
*   **[PRD.md](../../docs/PRD.md):** 產品需求文件，定義核心功能與成功指標。
*   **[FUNCTIONAL_SPEC.md](../../docs/FUNCTIONAL_SPEC.md):** 功能規格，包含操作流程與邊界案例。
*   **[DESIGN_SPEC.md](../../docs/DESIGN_SPEC.md):** 設計規格，包含 UI/UX 標註、色號、字體與動畫。
*   **[TECH_SPEC.md](../../docs/TECH_SPEC.md):** 技術規格，包含架構、資料庫 Schema 與 API 定義。
*   **[ACCEPTANCE_CRITERIA.md](../../docs/ACCEPTANCE_CRITERIA.md):** 驗收標準，作為最終功能交付與驗收的唯一依據。

## 2. 開發準則
### 2.1 品質保證與自我審查 (Quality Assurance)
*   **Mandatory Self-Review:** 在提交任務或交付程式碼給使用者之前，**必須**進行自我程式碼審查 (Code Review) 與功能驗證。
*   **Bug-Free Delivery:** 確保交付的程式碼無語法錯誤、邏輯漏洞，並已通過基本的快樂路徑 (Happy Path) 測試。
*   **Mandatory Phase Demo:** 當每一階段開發完成並通過自我審查後，**必須**向使用者執行完整的 Demo，展示該階段所有功能的實際運作情形。

### 2.2 錯誤處理與回報機制 (Error Handling & Escalation)
*   **3-Strike Rule:** 針對單一功能或 Bug 的修復，嘗試次數上限為 **3 次**。
*   **Stop & Discuss:** 若嘗試 3 次仍失敗，**立即停止操作**。禁止繼續盲目嘗試。
*   **Report:** 停止後，需向使用者詳細回報：
    1. 當前狀況
    2. 已嘗試的方法
    3. 失敗原因分析
    4. 建議的替代方案或討論點

### 2.3 安全操作協議 (Safety Protocol)
*   **User Approval Required:** 執行任何不可逆或具破壞性的指令（例如：刪除檔案 `rm`、刪除資料庫資料、移除依賴等）之前，**必須**明確詢問使用者並獲得授權。
