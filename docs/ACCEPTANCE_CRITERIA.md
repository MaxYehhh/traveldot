# TravelDot - 驗收標準 (Acceptance Criteria)

## 使用說明

每個功能都用 **Given-When-Then** 格式描述:
- **Given**: 前提條件 (使用者在什麼狀態)
- **When**: 操作 (使用者做了什麼)
- **Then**: 預期結果 (應該發生什麼)

---

## 1. 認證功能

### 1.1 註冊新帳號

**AC-001: 使用 Email 註冊**
> Status: ✅ 完成 (Verified Automated Test)
```
Given: 使用者在登入頁面
  And: 點擊「Sign up」連結
When: 輸入 Email: "test@example.com"
  And: 輸入 Password: "Test1234!"
  And: 點擊「Sign up」按鈕
Then: 帳號建立成功
  And: 自動登入
  And: 跳轉到 Landing Page
  And: 顯示 Toast: "歡迎加入 TravelDot!"
```

**AC-002: Email 格式驗證**
> Status: ⏳ 尚未驗收
```
Given: 使用者在註冊頁面
When: 輸入 Email: "invalid-email"
  And: 失焦 (blur) 輸入框
Then: 輸入框下方顯示紅色錯誤訊息: "請輸入有效的 Email"
  And: 輸入框 border 變紅色
  And: 「Sign up」按鈕為 disabled 狀態
```

**AC-003: 密碼強度驗證**
> Status: ⏳ 尚未驗收
```
Given: 使用者在註冊頁面
When: 輸入 Password: "123"
  And: 失焦輸入框
Then: 顯示錯誤訊息: "密碼至少需要 8 個字元"
  And: 「Sign up」按鈕為 disabled 狀態
```

**AC-004: Email 已被使用**
> Status: ⏳ 尚未驗收
```
Given: Email "test@example.com" 已被註冊
When: 使用者嘗試用相同 Email 註冊
  And: 點擊「Sign up」按鈕
Then: 顯示錯誤 Alert: "此 Email 已被使用,請使用其他 Email 或登入"
  And: 保持在註冊頁面
  And: 按鈕恢復正常狀態
```

### 1.2 登入

**AC-005: 成功登入**
> Status: ✅ 完成 (Verified Automated Test)
```
Given: 使用者已註冊帳號 (test@example.com / Test1234!)
  And: 在登入頁面
When: 輸入正確的 Email 和 Password
  And: 點擊「Login」按鈕
Then: 登入成功
  And: 跳轉到 Landing Page
  And: Header 顯示使用者名稱
```

**AC-006: 錯誤的密碼**
> Status: ⏳ 尚未驗收
```
Given: 使用者在登入頁面
When: 輸入 Email: "test@example.com"
  And: 輸入 Password: "WrongPassword"
  And: 點擊「Login」按鈕
Then: 顯示錯誤 Alert: "帳號或密碼錯誤,請重試"
  And: 保持在登入頁面
  And: 密碼欄位清空
  And: Focus 回到密碼欄位
```

**AC-007: 登入按鈕 Loading 狀態**
> Status: ⏳ 尚未驗收
```
Given: 使用者在登入頁面
When: 點擊「Login」按鈕
Then: 按鈕立即顯示 loading spinner
  And: 按鈕文字變成「登入中...」
  And: 按鈕變為 disabled 狀態
  And: 在收到 API 回應前保持此狀態
```

### 1.3 忘記密碼

**AC-008: 重設密碼流程**
> Status: ⏳ 尚未驗收
```
Given: 使用者在登入頁面
When: 點擊「Forgot password?」連結
Then: 彈出 Modal 顯示 Email 輸入框
When: 輸入 Email: "test@example.com"
  And: 點擊「Send reset link」
Then: 顯示成功訊息: "重設連結已發送到您的信箱"
  And: 關閉 Modal
  And: 實際收到重設密碼的 Email
```

---

## 2. Landing Page (旅程列表)

### 2.1 顯示旅程列表

**AC-009: 首次登入顯示空狀態**
> Status: ⏳ 尚未驗收
```
Given: 新註冊的使用者登入
When: 進入 Landing Page
Then: 顯示標題「My Trips」
  And: 顯示空狀態提示: "還沒有旅程,點擊右上角 + 按鈕開始記錄吧!"
  And: 顯示 [+ New Trip] 按鈕
```

**AC-010: 顯示現有旅程**
> Status: ⏳ 尚未驗收
```
Given: 使用者有 3 個旅程
When: 進入 Landing Page
Then: 顯示 3 張 Trip Card
  And: 每張卡片顯示:
    - 封面圖 (如果有)
    - 旅程名稱
    - 日期 (格式: Mar 1-15, 2024)
    - 地點數量 (12 places)
  And: 卡片按建立時間倒序排列 (最新的在最前面)
```

**AC-011: Trip Card Hover 效果**
> Status: ⏳ 尚未驗收
```
Given: 使用者在 Landing Page (桌面版)
When: 滑鼠移到 Trip Card 上
Then: 卡片陰影加深 (shadow-md → shadow-lg)
  And: 卡片向上移動 4px (translateY(-4px))
  And: 轉場時間 200ms
  And: Cursor 變成 pointer
```

### 2.2 建立新旅程

**AC-012: 開啟建立旅程 Modal**
> Status: ⏳ 尚未驗收
```
Given: 使用者在 Landing Page
When: 點擊 [+ New Trip] 按鈕
Then: 彈出「建立旅程」Modal
  And: Modal 包含:
    - 標題: "建立新旅程"
    - 輸入框: 旅程名稱 (必填)
    - 日期選擇器: 開始日期 (必填)
    - 日期選擇器: 結束日期 (必填)
    - 上傳封面圖 (選填)
    - 按鈕: [取消] [建立]
  And: Focus 在「旅程名稱」輸入框
```

**AC-013: 成功建立旅程**
> Status: ⏳ 尚未驗收
```
Given: 使用者在「建立旅程」Modal
When: 輸入旅程名稱: "泰國之旅"
  And: 選擇開始日期: 2024/03/01
  And: 選擇結束日期: 2024/03/15
  And: 點擊「建立」按鈕
Then: Modal 關閉
  And: 新的 Trip Card 出現在列表最前方
  And: 顯示 Toast: "旅程已建立"
  And: 卡片顯示:
    - 名稱: "泰國之旅"
    - 日期: "Mar 1-15, 2024"
    - 地點數: "0 places"
```

**AC-014: 必填欄位驗證**
> Status: ⏳ 尚未驗收
```
Given: 使用者在「建立旅程」Modal
When: 旅程名稱留空
  And: 點擊「建立」按鈕
Then: 顯示錯誤訊息: "請輸入旅程名稱"
  And: 輸入框 border 變紅色
  And: Modal 不關閉
  And: Focus 回到名稱輸入框
```

**AC-015: 日期邏輯驗證**
> Status: ⏳ 尚未驗收
```
Given: 使用者在「建立旅程」Modal
When: 選擇開始日期: 2024/03/15
  And: 選擇結束日期: 2024/03/01 (早於開始日期)
  And: 點擊「建立」按鈕
Then: 顯示錯誤訊息: "結束日期不能早於開始日期"
  And: Modal 不關閉
```

### 2.3 編輯旅程

**AC-016: 開啟編輯 Modal**
> Status: ⏳ 尚未驗收
```
Given: 使用者在 Landing Page
  And: 有一個旅程「泰國之旅」
When: 右鍵點擊 Trip Card (或長按在手機上)
Then: 顯示選單:
    - 編輯
    - 刪除
    - 分享
When: 點擊「編輯」
Then: 彈出編輯 Modal
  And: 預填現有資料:
    - 名稱: "泰國之旅"
    - 開始日期: 2024/03/01
    - 結束日期: 2024/03/15
```

**AC-017: 成功更新旅程**
> Status: ⏳ 尚未驗收
```
Given: 使用者在編輯旅程 Modal
When: 修改名稱為: "泰國清邁之旅"
  And: 點擊「儲存」
Then: Modal 關閉
  And: Trip Card 顯示更新後的名稱
  And: 顯示 Toast: "旅程已更新"
```

### 2.4 刪除旅程

**AC-018: 刪除確認對話框**
> Status: ⏳ 尚未驗收
```
Given: 使用者在 Landing Page
When: 右鍵點擊 Trip Card
  And: 選擇「刪除」
Then: 彈出確認對話框:
    - 標題: "確定要刪除這個旅程嗎?"
    - 說明: "此操作無法復原,旅程中的所有地點也會被刪除。"
    - 按鈕: [取消] [確定刪除] (紅色)
```

**AC-019: 確認刪除**
> Status: ⏳ 尚未驗收
```
Given: 使用者在刪除確認對話框
When: 點擊「確定刪除」
Then: 對話框關閉
  And: Trip Card 以動畫方式消失 (fade-out + slide-up, 200ms)
  And: 其他卡片向上移動填補空位
  And: 顯示 Toast: "旅程已刪除"
  And: 該旅程的資料從資料庫刪除
```

---

## 3. 地圖主頁面

### 3.1 地圖顯示

**AC-020: 進入旅程地圖**
> Status: ✅ 完成
```
Given: 使用者在 Landing Page
  And: 有一個旅程「泰國之旅」(包含 5 個地點)
When: 點擊該 Trip Card
Then: 跳轉到地圖頁面
  And: URL 變成: /trips/{tripId}/map
  And: Header 顯示旅程名稱: "泰國之旅"
  And: 地圖載入完成 (< 2 秒)
  And: 地圖中心自動移到所有地點的中心位置
  And: Zoom level 自動調整以顯示所有地點
  And: 顯示 5 個 Pin 標記
```

**AC-021: Pin 標記顯示**
> Status: ✅ 完成
```
Given: 使用者在地圖頁面
  And: 有 3 個地點
When: 地圖載入完成
Then: 每個地點顯示一個 Pin
  And: Pin 的顏色為藍色 (#3B82F6)
  And: Pin 的尺寸為 32x40px
  And: Pin 位置精確對應地點座標
```

**AC-022: Pin Hover 效果 (桌面版)**
> Status: ✅ 完成
```
Given: 使用者在地圖頁面 (桌面版)
When: 滑鼠移到 Pin 上
Then: Pin 放大 1.2 倍 (scale: 1.2)
  And: Cursor 變成 pointer
  And: 轉場時間 150ms
```

### 3.2 地點聚合 (Clustering)

**AC-055: 自訂地點圖標顏色**
> Status: ⏳ 需要重新驗收 (有問題)
```
Given: 使用者在編輯地點 Modal
When: 查看「圖標顏色」選擇器
Then: 顯示顏色選項:
  - 藍色 (#3B82F6) - 預設
  - 紅色 (#EF4444)
  - 綠色 (#10B981)
  - 紫色 (#8B5CF6)
  - 橘色 (#F97316)
  - 黃色 (#F59E0B)
When: 點擊紅色選項
Then: 該按鈕立即顯示選中狀態:
  - border: 2px solid 該顏色
  - scale: 1.1
  - 其他按鈕恢復 normal 狀態
When: 儲存後 (編輯現有地點)
Then: **地圖上該地點的 Pin 立即變為紅色**
  And: **側邊欄列表中的縮圖圖標也立即變為紅色**
  And: **顏色變化應有 200ms 淡入淡出過渡動畫**
When: 點擊已選取的地點 Pin
Then: Pin 顯示為選中的橘色 (#F59E0B) 覆蓋層
  And: 關閉 Preview Card 後 Pin 恢復原本設定的顏色
```


**AC-023: 自動聚合相近地點**
> Status: ✅ 完成
```
Given: 地圖上有 50 個地點
  And: 使用者縮小地圖 (zoom out)
When: Zoom level < 12
Then: 相近的地點自動聚合成圓形 cluster
  And: Cluster 顯示內含地點數量 (如 "5")
  And: Cluster 背景色為藍色 (#3B82F6)
  And: 文字為白色
  And: Cluster 尺寸隨數量增加:
    - 2-10 個: 40px
    - 11-50 個: 50px
    - 51+ 個: 60px
When: Zoom level 降至極低 (< 5)
Then: **所有地點仍然顯示為聚合的 cluster**
  And: **不可完全消失或不可見**
  And: **Cluster 仍然可點擊並執行 zoom in**
When: 使用者重新 zoom in (zoom level >= 12)
Then: Cluster 自動分解回獨立 Pin
  And: 過渡動畫流暢 (300ms)
```

**AC-024: 點擊 Cluster 展開**
> Status: ✅ 完成
```
Given: 地圖上有一個 cluster (包含 5 個地點)
When: 點擊該 cluster
Then: 地圖自動 zoom in
  And: Cluster 分解成 5 個獨立 Pin
  And: 動畫流暢 (300ms)
```

### 3.3 點擊 Pin 顯示預覽

**AC-025: 顯示 Place Preview Card**
> Status: ✅ 完成
```
Given: 使用者在地圖頁面
When: 點擊任一 Pin
Then: **地圖自動 Zoom in (如 < 15) 並 Center 該地點**
  And: 在地圖中央彈出 Place Preview Card
  And: Card 包含:
    - 關閉按鈕 (X)
    - 照片輪播 (如果有照片) / 顯示「無照片」placeholder (如果無照片)
    - 地點名稱
    - 地址 (帶 📍 icon)
    - 日期 (帶 📅 icon)
    - 評分 (星星)
    - 文字內容 (如果有) / 不顯示任何預設文字 (如果無內容)
    - 標籤 (如果有)
    - 按鈕: [Edit] [Delete] (**尚未儲存的地點不顯示 Delete**)
  And: 該 Pin 變成橘色 (#F59E0B) 表示選中
  And: Card 以 scale-up 動畫出現 (200ms)
  And: **絕對不可顯示「這是一個非常棒的地點...」等預設填充文字**
```

**AC-026: 照片輪播功能**
> Status: ✅ 完成
```
Given: Place Preview Card 顯示中
  And: 該地點有 3 張照片
When: Card 載入
Then: 顯示第一張照片
  And: 照片高度 240px
  And: 左右兩側顯示箭頭按鈕
  And: 底部顯示 3 個 dots (第一個為實心)
When: 點擊右箭頭
Then: 切換到第二張照片
  And: 第二個 dot 變實心
  And: 轉場動畫: slide (300ms)
```

**AC-027: 關閉 Preview Card**
> Status: ✅ 完成
```
Given: Place Preview Card 顯示中
When: 點擊 [X] 按鈕
Then: Card 以 scale-down 動畫消失 (200ms)
  And: 橘色 Pin 恢復藍色
When: 點擊 Card 外的地圖區域
Then: Card 關閉 (同上)
When: 按 ESC 鍵
Then: Card 關閉 (同上)
```

### 3.4 新增地點

**AC-028: FAB 選單展開**
> Status: ✅ 完成
註：已改為單一「目前位置」按鈕
```
Given: 使用者在地圖頁面
When: 點擊右下角 FAB (+) 按鈕
Then: 向上展開選單 (150ms 動畫)
  And: 選項包括:
    - 📍 搜尋地點
    - 📌 使用當前位置
    - 🗺️ 在地圖上選點
  And: FAB 旋轉 45 度 (變成 X)
  And: 背景出現半透明遮罩
```

**AC-029: 搜尋地點流程**
> Status: ✅ 完成
```
Given: FAB 選單已展開
When: 點擊「📍 搜尋地點」
Then: 彈出全螢幕搜尋介面
  And: 頂部顯示搜尋框 + [取消] 按鈕
  And: Focus 在搜尋框
  And: 下方顯示「最近搜尋」(如果有)
When: 輸入 "cafe"
Then: 即時顯示 Google Places 建議 (< 500ms)
  And: 每個建議顯示:
    - 地點名稱
    - 地址
    - 距離 (如果有位置權限)
When: 點擊一個建議 "Cafe Amazon"
Then: 搜尋介面關閉
  And: 地圖中心移到該地點
  And: 顯示 Pin
  And: 跳到 AC-034 (開啟編輯器)
```

**AC-030: 使用當前位置**
> Status: ✅ 完成
```
Given: FAB 選單已展開
  And: 使用者已授予位置權限
When: 點擊「📌 使用當前位置」
Then: 顯示 loading: "正在定位..."
  And: 抓取 GPS 座標 (< 3 秒)
  And: 地圖中心移到當前位置
  And: 顯示藍色 Pin
  And: 跳到 AC-034 (開啟編輯器)
```

**AC-031: 位置權限被拒絕**
> Status: ✅ 完成
```
Given: FAB 選單已展開
  And: 使用者尚未授予位置權限
When: 點擊「📌 使用當前位置」
Then: 瀏覽器彈出位置權限請求
When: 使用者點擊「拒絕」
Then: 顯示 Toast: "需要位置權限才能使用此功能"
  And: 保持在地圖頁面
```

**AC-032: 在地圖上選點**
> Status: ✅ 完成
註：此功能已移除
```
Given: FAB 選單已展開
When: 點擊「🗺️ 在地圖上選點」
Then: 進入「選點模式」
  And: 地圖中央顯示十字準星 (crosshair)
  And: 底部顯示提示: "拖動地圖調整位置"
  And: 底部顯示 [取消] [確認位置] 按鈕
  And: 十字準星固定在地圖中央
When: 拖動地圖
Then: 十字準星位置不變 (保持在中央)
  And: 地圖下方持續更新座標顯示
When: 點擊 [確認位置]
Then: 在十字準星位置放置 Pin
  And: 跳到 AC-034 (開啟編輯器)
```

**AC-033: 點擊地圖原生圖標 (POI)**
> Status: ✅ 完成
```
Given: 使用者在地圖頁面
When: 點擊地圖上的原生圖標 (例如: 餐廳、景點 icon)
Then: 系統捕捉該 POI 事件
  And: 取得該地點的 placeId
  And: 自動選取該地點 (同 AC-029 搜尋結果)
  And: 顯示 Place Preview Card
  And: 地圖中心移至該地點
```

### 3.5 地點編輯器

**AC-034: 開啟編輯器 Modal (新增模式)**
> Status: ✅ 完成 (Verified Manual)
```
Given: 使用者選擇了一個地點 (透過 AC-029/030/032)
When: 地點選擇完成
Then: 彈出「新增地點」Modal
  And: Modal 為全螢幕 (手機) 或置中 600px 寬 (桌面)
  And: 預填資料:
    - 地點名稱: 從 Google Places 取得 (如果有)
    - 地址: 從 Google Places 取得 (如果有)
    - 座標: 已確定
    - 日期: 今天
    - 時間: 現在
    - 圖標顏色: 預設藍色
  And: Focus 在「內容」編輯區 (如果名稱已預填)
  And: 「心得筆記」欄位預設為空 (Placeholder: "寫下你的心得...")
  And: **絕對不可出現 "這是一個非常棒的地點..." 等預設填充文字**
  And: 其他欄位為空白
  And: 儲存後,Preview Card 同樣不可顯示預設文字
```

**AC-035: 上傳照片**
> Status: ✅ 完成
```
Given: 使用者在編輯器 Modal
When: 點擊 [+ 新增] 照片按鈕
Then: 開啟檔案選擇器
  And: 限制只能選擇圖片 (jpg, png, webp)
  And: 可多選
When: 選擇 3 張照片 (各 5MB)
Then: 每張照片顯示上傳進度條
  And: 同時進行壓縮 (保持品質)
  And: 壓縮後大小 < 1MB
  And: 上傳到 Firebase Storage
  And: 上傳完成後顯示縮圖
  And: 整個流程 < 5 秒
```

**AC-036: 拖曳調整照片順序**
> Status: ✅ 完成
```
Given: 編輯器中有 3 張照片
When: 拖動第 3 張照片到第 1 張位置
Then: 照片順序變成: 3, 1, 2
  And: 拖動時照片半透明
  And: 其他照片移動讓出位置
  And: 放開時順序更新
```

**AC-037: 刪除照片**
> Status: ✅ 完成
```
Given: 編輯器中有 3 張照片
When: Hover 到第 2 張照片
Then: 右上角顯示 X 按鈕
When: 點擊 X
Then: 彈出確認: "確定刪除這張照片?"
When: 點擊「確定」
Then: 照片消失
  And: 從 Firebase Storage 刪除
  And: 其他照片位置調整
```

**AC-038: 新增標籤**
> Status: ✅ 完成
```
Given: 使用者在編輯器 Modal
When: 點擊 [+ 新增標籤]
Then: 彈出輸入框
  And: Focus 在輸入框
When: 輸入 "咖啡"
Then: 自動顯示建議 (如果之前用過這個標籤)
When: 按 Enter
Then: 輸入框關閉
  And: 新增一個標籤 chip: "#咖啡"
  And: 可繼續新增其他標籤
```

**AC-039: 儲存地點 (成功)**
> Status: ✅ 完成
```
Given: 使用者在編輯器 Modal
  And: 已填寫:
    - 地點名稱: "Cafe Amazon"
    - 日期: 2024/03/05
    - 上傳 2 張照片
    - 內容: "很棒的工作空間..."
    - 標籤: #咖啡
    - 評分: 5 星
When: 點擊 [儲存] 按鈕
Then: 按鈕顯示 loading: "儲存中..."
  And: 按鈕變 disabled
  And: 資料儲存到 Firestore (< 1 秒)
  And: Modal 關閉
  And: **地圖自動 Zoom in 至 zoom level 16 (如果當前 < 16)**
  And: **地圖平滑移動 (pan) 到新地點座標 (動畫 500ms)**
  And: 地圖上出現新 Pin (使用者選擇的顏色)
  And: 側邊欄列表更新 (新地點出現在最上方)
  And: 顯示 Toast: "地點已新增"
```

**AC-040: 儲存地點 (驗證失敗)**
> Status: ✅ 完成
```
Given: 使用者在編輯器 Modal
  And: 地點名稱為空白
When: 點擊 [儲存] 按鈕
Then: 地點名稱欄位顯示紅色錯誤: "請輸入地點名稱"
  And: 輸入框 border 變紅色
  And: 捲動到該欄位
  And: Focus 到該欄位
  And: Modal 不關閉
```

**AC-041: 編輯現有地點**
> Status: ✅ 完成
```
Given: 使用者點擊 Place Preview Card 的 [Edit] 按鈕
When: Modal 打開
Then: 所有欄位預填現有資料
  And: Modal 標題變成「編輯地點」
  And: 按鈕文字變成「更新」
When: 修改內容後點擊 [更新]
Then: 資料更新到 Firestore
  And: Modal 關閉
  And: Preview Card (如果還開著) 顯示更新內容
  And: 顯示 Toast: "地點已更新"
```

### 3.6 側邊欄 (Sidebar)

**AC-042: 側邊欄顯示地點列表 (桌面版)**
> Status: ✅ 完成
```
Given: 使用者在地圖頁面 (桌面版)
  And: 有 5 個地點
When: 頁面載入完成
Then: 右側顯示側邊欄
  And: 寬度 360px
  And: 頂部顯示: 
    - 旅程名稱
    - 地點總數: "5 places"
  And: 下方顯示地點列表
  And: 每個列表項顯示:
    - Checkbox (用於選擇)
    - 地點名稱
    - 日期時間
    - 第一張照片縮圖 (如果有)
  And: 按日期倒序排列 (最新的在上面)
```

**AC-043: 點擊列表項目**
> Status: ✅ 完成
```
Given: 側邊欄顯示 5 個地點
When: 點擊列表中的「Cafe Amazon」
Then: 地圖中心移到該地點
  And: 該地點的 Pin 變橘色
  And: 彈出 Place Preview Card
  And: 列表中該項目高亮顯示 (背景色變淺藍)
```

**AC-044: 側邊欄收合 (桌面版)**
> Status: ✅ 完成
```
Given: 側邊欄顯示中
When: 點擊側邊欄頂部的收合按鈕 (◀)
Then: 側邊欄向右滑出畫面 (300ms)
  And: 地圖寬度擴展到 100%
  And: 收合按鈕變成 (▶)
When: 再次點擊 (▶)
Then: 側邊欄滑回來 (300ms)
  And: 地圖寬度恢復 70%
```

**AC-045: Bottom Sheet (手機版)**
> Status: ✅ 完成
```
Given: 使用者在地圖頁面 (手機版)
  And: 有 5 個地點
When: 頁面載入完成
Then: 底部顯示 Bottom Sheet
  And: 預設高度 160px (顯示前 2 個地點)
  And: 頂部有拖曳手柄 (灰色橫條)
When: 向上拖動手柄
Then: Sheet 展開到 80vh
  And: 顯示所有地點
  And: 可捲動
When: 向下拖動
Then: Sheet 收回到 160px
```

### 3.7 篩選功能

**AC-046: 依標籤篩選**
> Status: ⏳ 尚未驗收
```
Given: 使用者在地圖頁面
  And: 有 10 個地點,其中 3 個有標籤 #咖啡
When: 點擊 Header 的 [Filter] 按鈕
Then: 彈出篩選 Modal
  And: 顯示所有已使用的標籤列表
When: 選擇 #咖啡
  And: 點擊 [套用]
Then: 地圖只顯示 3 個有 #咖啡 標籤的 Pin
  And: 側邊欄只顯示這 3 個地點
  And: Header 顯示篩選狀態: "篩選中 (1)" (藍色 badge)
```

**AC-047: 清除篩選**
> Status: ⏳ 尚未驗收
```
Given: 正在篩選 #咖啡 標籤 (只顯示 3 個地點)
When: 點擊 Header 的 [Filter] 按鈕
  And: 點擊 [清除篩選]
Then: 所有 10 個地點重新顯示
  And: Header 篩選 badge 消失
```

---

## 4. 列表模式

**AC-048: 切換到列表模式**
> Status: ⏳ 尚未驗收
```
Given: 使用者在地圖模式
When: 點擊 Header 的 [List] 按鈕
Then: 畫面切換到列表模式 (fade transition 300ms)
  And: 顯示時間軸式列表
  And: 每個地點顯示為卡片:
    - 日期 (大字,左側)
    - 地點名稱
    - 地址
    - 第一張照片 (方形,右側)
    - 評分
    - 標籤
  And: 按日期倒序排列
```

**AC-049: 列表模式點擊地點**
> Status: ⏳ 尚未驗收
```
Given: 使用者在列表模式
When: 點擊一個地點卡片
Then: 彈出 Place Preview Card (同地圖模式)
  And: 可編輯或刪除
```

**AC-050: 切換回地圖模式**
> Status: ⏳ 尚未驗收
```
Given: 使用者在列表模式
When: 點擊 Header 的 [Map] 按鈕
Then: 切換回地圖模式
  And: 保持篩選條件 (如果有)
```

---

## 5. 分享功能

**AC-051: 產生地點分享連結**
> Status: ⏳ 尚未驗收
```
Given: 使用者在 Place Preview Card
When: 點擊 [Share] 按鈕 (如果有)
  Or: 在側邊欄地點列表項目右鍵選擇「分享」
Then: 彈出分享 Modal
  And: 顯示:
    - 分享連結 (唯讀文字框)
    - [複製連結] 按鈕
    - 預覽: "其他人將看到..."
When: 點擊 [複製連結]
Then: 連結複製到剪貼簿
  And: 按鈕文字變成「已複製!」(2 秒)
  And: 顯示 Toast: "連結已複製"
```

**AC-052: 訪問分享頁面 (地點)**
> Status: ⏳ 尚未驗收
```
Given: 使用者獲得分享連結
When: 在瀏覽器打開連結 (未登入狀態)
Then: 顯示唯讀的地點頁面
  And: 包含:
    - 地圖 (定位在該地點)
    - 地點名稱
    - 日期
    - 評分
    - 照片輪播
    - 文字內容
    - 標籤
  And: 不顯示 Edit/Delete 按鈕
  And: 頁面美觀,響應式設計
  And: 可列印成 PDF
```

**AC-053: 產生旅程分享連結**
> Status: ⏳ 尚未驗收
```
Given: 使用者在 Landing Page
When: 右鍵點擊 Trip Card
  And: 選擇「分享」
Then: 彈出分享 Modal
  And: 產生旅程分享連結
When: 點擊 [複製連結]
Then: 連結複製到剪貼簿
```

**AC-054: 訪問分享頁面 (旅程)**
> Status: ⏳ 尚未驗收
```
Given: 使用者獲得旅程分享連結
When: 在瀏覽器打開連結 (未登入狀態)
Then: 顯示唯讀的旅程頁面
  And: 包含:
    - 旅程名稱
    - 日期
    - 封面圖
    - 地圖 (顯示所有地點)
    - 地點列表 (卡片式)
  And: 可點擊地點卡片查看詳情
  And: 頁面類似個人 mini blog
```

---

## 6. 資料匯出

**AC-066: 匯出所有資料**
> Status: ⏳ 尚未驗收
```
Given: 使用者已登入
  And: 有 2 個旅程,共 10 個地點
When: 在設定頁面點擊 [匯出資料] 按鈕
Then: 顯示確認 Modal:
    - "即將匯出您的所有資料"
    - 預估檔案大小: "約 150MB"
    - [取消] [開始匯出]
When: 點擊 [開始匯出]
Then: 顯示進度條
  And: 提示: "正在打包資料... (1/3)"
  And: 產生 ZIP 檔案
  And: ZIP 包含:
    - trips.json
    - trips/thailand_2024/trip.json
    - trips/thailand_2024/media/photo_001.jpg
    - trips/thailand_2024/media/photo_002.jpg
    - ... (所有照片)
    - README.txt (說明檔案結構)
When: 完成
Then: 自動下載 ZIP 檔
  And: 檔名: traveldot-export-{timestamp}.zip
  And: 顯示 Toast: "資料已匯出"
```

**AC-067: 匯出失敗處理**
> Status: ⏳ 尚未驗收
```
Given: 使用者點擊 [開始匯出]
When: 網路連線中斷
Then: 顯示錯誤訊息: "匯出失敗,請檢查網路連線"
  And: 提供 [重試] 按鈕
```

---

## 7. 效能與 UX

**AC-057: 首頁載入效能**
> Status: ⏳ 尚未驗收
```
Given: 使用者登入後
When: 進入 Landing Page
Then: First Contentful Paint (FCP) < 1.5 秒
  And: 旅程卡片圖片使用 lazy loading
  And: 如果圖片尚未載入,顯示灰色 placeholder
```

**AC-058: 地圖載入效能**
> Status: ⏳ 尚未驗收
```
Given: 使用者點擊 Trip Card
When: 進入地圖頁面
Then: 地圖完全載入 < 2 秒
  And: 在載入期間顯示 skeleton screen:
    - 灰色地圖區域
    - 灰色側邊欄
    - Loading spinner
```

**AC-059: 離線記錄**
> Status: ⏳ 尚未驗收
```
Given: 使用者在地圖頁面
  And: 網路連線中斷
When: 新增一個地點 (不含照片)
Then: 地點儲存到本地 (IndexedDB or LocalStorage)
  And: 顯示 Toast: "離線模式,資料將在有網路時同步"
  And: 地點卡片右上角顯示「未同步」icon
When: 網路恢復
Then: 自動同步到 Firestore
  And: 「未同步」icon 消失
  And: 顯示 Toast: "資料已同步"
```

**AC-060: 搜尋回應時間**
> Status: ⏳ 尚未驗收
```
Given: 使用者在搜尋地點介面
When: 輸入 "cafe"
Then: 在 500ms 內顯示搜尋建議
  And: 如果超過 500ms,顯示 loading skeleton
```

---

## 8. 錯誤處理

**AC-061: 網路錯誤**
> Status: ⏳ 尚未驗收
```
Given: 使用者在任何頁面
When: 執行需要網路的操作 (登入、儲存、載入)
  And: 網路連線失敗
Then: 顯示友善的錯誤訊息 (不是技術錯誤碼)
  And: 例如: "無法連線到伺服器,請檢查網路連線"
  And: 提供 [重試] 按鈕
  And: 不要讓使用者看到空白畫面
```

**AC-062: 檔案上傳失敗**
> Status: ⏳ 尚未驗收
```
Given: 使用者上傳照片
When: 上傳失敗 (網路中斷、檔案過大、格式不支援)
Then: 該照片顯示紅色錯誤狀態
  And: 顯示錯誤原因:
    - "檔案過大,請選擇小於 10MB 的照片"
    - "不支援此格式,請選擇 JPG 或 PNG"
  And: 其他照片繼續上傳
  And: 提供 [重試] 按鈕
```

**AC-063: 未授權訪問**
> Status: ⏳ 尚未驗收
```
Given: 使用者未登入
When: 嘗試訪問 /trips/abc123/map
Then: 自動跳轉到登入頁面
  And: URL 記錄在 redirect 參數
  And: 登入成功後跳回原頁面
```

---

## 9. 可訪問性 (A11y)

**AC-064: 鍵盤導航**
> Status: ✅ 完成
```
Given: 使用者只使用鍵盤 (不用滑鼠)
When: 按 Tab 鍵
Then: Focus 按邏輯順序移動:
    - Header → Content → Sidebar → Footer
  And: 當前 focus 的元素有明顯視覺提示 (outline)
When: Focus 在按鈕上,按 Enter
Then: 觸發按鈕點擊
When: Modal 打開,按 ESC
Then: Modal 關閉
```

**AC-065: 螢幕閱讀器支援**
> Status: ⏳ 尚未驗收
```
Given: 使用者使用螢幕閱讀器 (如 NVDA)
When: 進入地圖頁面
Then: 讀出: "TravelDot 地圖頁面,泰國之旅,共 5 個地點"
When: Focus 到 FAB 按鈕
Then: 讀出: "新增地點按鈕"
When: Focus 到地點列表項目
Then: 讀出: "Cafe Amazon, 2024 年 3 月 5 日下午 2 點 30 分,評分 5 星"
```

---

## 檢查清單使用方式

**每完成一個功能,檢查:**
- [ ] 所有相關的 AC (Acceptance Criteria) 都通過
- [ ] 在手機、平板、桌面都測試過
- [ ] 有處理錯誤情況
- [ ] 效能符合標準
- [ ] 可用鍵盤操作

**如果 AC 未通過:**
1. 記錄具體問題
2. 回去修改程式碼
3. 重新測試
4. 重複直到所有 AC 通過

**這份文件是「最低標準」:**
- 實際實作可以超越這些標準
- 但絕對不能低於這些標準
- 如果發現 AC 不合理,更新文件並通知團隊
