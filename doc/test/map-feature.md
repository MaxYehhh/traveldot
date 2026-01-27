---
description: 核心地圖與功能測試案例
---

> 狀態：初始為 [ ]、完成為 [x]
> 注意：狀態只能在測試通過後由流程更新。
> 測試類型：前端元素、function 邏輯、Mock API、驗證權限...

---

## [x] 【function 邏輯】useMapStore 初始狀態驗證
**範例輸入**：呼叫 `useMapStore.getState()`
**期待輸出**：`currentLocation` 為曼谷座標, `zoom` 為 12, `selectedPlace` 為 null, `isAddingMode` 為 false

---

## [x] 【function 邏輯】useMapStore 更新狀態驗證
**範例輸入**：呼叫 `setMapState({ zoom: 15 })`
**期待輸出**：`zoom` 變更為 15

---

## [x] 【function 邏輯】utils.cn 樣式合併驗證
**範例輸入**：`cn('bg-red-500', 'bg-blue-500')`
**期待輸出**：`bg-blue-500` (Tailwind 合併邏輯)

---

## [x] 【前端元素】MapContainer 缺失 API Key 顯示驗證
**範例輸入**：環境變數 `VITE_GOOGLE_MAPS_API_KEY` 為空時渲染組件
**期待輸出**：顯示 "Missing API Key" 錯誤訊息

---

## [] 【Mock API】PlaceSearch 搜尋功能驗證
**範例輸入**：於搜尋框輸入 "Bangkok"，並 Mock Google Autocomplete 返回結果
**期待輸出**：清單顯示搜尋預測結果

---

## [] 【function 邏輯】PlaceSearch 選取地點驗證
**範例輸入**：點擊搜尋結果，並 Mock `getDetails` 返回位置資訊
**期待輸出**：呼叫 `setMapState` 更新位置，呼叫 `setSelectedPlace` 儲存地點，且地圖中心偏移至該位置

---

## [x] 【前端元素】MapMarkers 標記渲染驗證
**範例輸入**：渲染固定測試地點 (Grand Palace, Wat Arun, Chatuchak Market)
**期待輸出**：地圖上出現三個 Pin 標記

---

## [x] 【前端元素】MapMarkers 選定地點標記顏色驗證
**範例輸入**：`selectedPlace` 有值時
**期待輸出**：地圖上多出一個黃色預覽 Pin (#FBBC04)

---

## [x] 【前端元素】App 組件渲染驗證
**範例輸入**：正常渲染 App 組件
**期待輸出**：包含 `MapContainer` 的容器被正確掛載
