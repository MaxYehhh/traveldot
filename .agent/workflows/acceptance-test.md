---
description: 執行 Web 應用程式的驗收測試 (Acceptance Testing)
---

這個 Workflow 負責根據驗收標準 (Acceptance Criteria) 進行自動化或手動的驗收測試，確保功能符合預期。

# 使用 Skill
- **Web App Testing**: `view_file .agents/skills/webapp-testing/SKILL.md`

# 步驟 (Steps)

1. **分析驗收標準 (Analyze Criteria)**:
   - 讀取使用者指定的驗收標準文件 (預設為 `docs/ACCEPTANCE_CRITERIA.md`)。
   - 鎖定特定的測試範圍 (例如：1.1 註冊新帳號)。
   - 確認該功能的「成功情境 (Happy Path)」與「預期結果」。

2. **撰寫測試腳本 (Write Test Script)**:
   - 參照 `.agents/skills/webapp-testing/SKILL.md` 的範例。
   - 建立測試腳本於 `tests/acceptance/` 目錄下 (若無目錄請建立)，例如 `tests/acceptance/test_auth_register.py`。
   - **腳本要求**:
     - 使用 Python Playwright (`sync_playwright`).
     - 包含關鍵步驟的截圖 (`page.screenshot`) 以作為證明。
     - 必須包含 `page.wait_for_load_state('networkidle')` 確保頁面載入。
     - 針對 AC 中的檢查點進行 Assert 驗證。

3. **執行測試 (Execute Test)**:
   - 使用 `webapp-testing` skill 提供的 `with_server.py` helper 來確保開發伺服器運行。
   - 執行指令範例：
     ```bash
     python .agents/skills/webapp-testing/scripts/with_server.py \
       --server "npm run dev" \
       --port 5173 \
       -- python tests/acceptance/YOUR_SCRIPT_NAME.py
     ```
   - **注意**: 若測試涉及後端或其他服務，需同時啟動 (參考 SKILL.md 的 Multiple servers 範例)。

4. **結果驗證與修復 (Verification & Fix)**:
   - 檢查測試執行結果與截圖。
   - **若測試失敗**:
     - 分析是「程式 Bug」還是「測試腳本錯誤」。
     - 若為程式 Bug，嘗試修復程式碼 (遵循 `project-rules.md` 的 **3-Strike Rule**，最多嘗試修復 3 次)。
     - 若為腳本錯誤，修正腳本。
     - 重新執行步驟 3。
   - **若測試成功**:
     - 確認產出的截圖符合 UI 預期。
     - 輸出測試通過的報告。

5. **交付確認 (Final Confirmation)**:
   - 確保符合 `project-rules.md` 中的 "Bug-Free Delivery"。
   - 告知使用者測試完成，並提供截圖或錄影證明。
