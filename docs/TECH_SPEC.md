# TravelDot - 技術規格文件 (Technical Spec)

## 目的

本文件由工程師撰寫，包含資料庫 Table 設計、API 定義、系統效能要求及架構設計，確保開發團隊能精確實作。

---

## 1. System Architecture 系統架構

### 1.1 Overall Architecture 整體架構

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Web App    │  │  Mobile Web  │  │  PWA (Future)│  │
│  │ React + Vite │  │  Responsive  │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   API Gateway Layer                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Firebase SDK (Client-side)             │  │
│  │  - Authentication                                │  │
│  │  - Firestore (Real-time Database)               │  │
│  │  - Storage (File Upload)                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  External Services                      │
│  ┌────────────────┐  ┌────────────────┐                │
│  │ Google Maps    │  │ Google Places  │                │
│  │ JavaScript API │  │      API       │                │
│  └────────────────┘  └────────────────┘                │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend Services                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Firebase Backend                    │  │
│  │  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │  Firestore   │  │   Storage    │             │  │
│  │  │  (NoSQL DB)  │  │ (Cloud Files)│             │  │
│  │  └──────────────┘  └──────────────┘             │  │
│  │  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │     Auth     │  │   Hosting    │             │  │
│  │  │  (Identity)  │  │ (Static CDN) │             │  │
│  │  └──────────────┘  └──────────────┘             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Frontend Architecture 前端架構

```
src/
├── components/           # React 元件
│   ├── common/          # 通用元件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── Card.tsx
│   ├── map/             # 地圖相關元件
│   │   ├── MapContainer.tsx
│   │   ├── MapMarkers.tsx
│   │   ├── PlacePreview.tsx
│   │   └── PlaceSearch.tsx
│   ├── trip/            # 旅程相關元件
│   │   ├── TripList.tsx
│   │   ├── TripCard.tsx
│   │   └── TripForm.tsx
│   └── editor/          # 編輯器相關元件
│       ├── PlaceEditor.tsx
│       ├── PhotoUpload.tsx
│       ├── TagManager.tsx
│       └── RichTextEditor.tsx
├── hooks/               # Custom Hooks
│   ├── useAuth.ts
│   ├── useTrips.ts
│   ├── usePlaces.ts
│   └── useMap.ts
├── stores/              # Zustand State Management
│   ├── authStore.ts
│   ├── tripStore.ts
│   ├── placeStore.ts
│   └── mapStore.ts
├── services/            # API Services
│   ├── firebase.ts
│   ├── googleMaps.ts
│   ├── googlePlaces.ts
│   └── storage.ts
├── utils/               # Utility Functions
│   ├── imageCompression.ts
│   ├── dateFormatter.ts
│   ├── validation.ts
│   └── exportData.ts
├── types/               # TypeScript Types
│   ├── trip.ts
│   ├── place.ts
│   ├── user.ts
│   └── api.ts
└── pages/               # Page Components
    ├── LandingPage.tsx
    ├── MapPage.tsx
    ├── LoginPage.tsx
    └── SettingsPage.tsx
```

---

## 2. Database Schema 資料庫設計

### 2.1 Firestore Collections 集合結構

#### Collection: `users`
```typescript
users/{userId}
{
  email: string;                    // 使用者 Email
  displayName: string;              // 顯示名稱
  photoURL?: string;                // 頭像 URL (選填)
  createdAt: Timestamp;             // 建立時間
  updatedAt: Timestamp;             // 更新時間
  settings: {
    defaultView: 'map' | 'list';    // 預設檢視模式
    language: 'zh-TW' | 'en';       // 語言
  };
}
```

#### Collection: `trips`
```typescript
users/{userId}/trips/{tripId}
{
  id: string;                       // 旅程 ID
  title: string;                    // 旅程名稱
  description?: string;             // 旅程描述 (選填)
  startDate: Timestamp;             // 開始日期
  endDate: Timestamp;               // 結束日期
  coverImage?: string;              // 封面圖 URL (選填)
  placesCount: number;              // 地點數量 (denormalized)
  createdAt: Timestamp;             // 建立時間
  updatedAt: Timestamp;             // 更新時間
}
```

#### Collection: `places`
```typescript
users/{userId}/trips/{tripId}/places/{placeId}
{
  id: string;                       // 地點 ID
  tripId: string;                   // 所屬旅程 ID
  name: string;                     // 地點名稱
  coordinates: {
    lat: number;                    // 緯度
    lng: number;                    // 經度
  };
  address?: string;                 // 地址 (選填)
  visitedDate: Timestamp;           // 造訪日期時間
  content: {
    text: string;                   // Rich Text HTML
    media: Array<{
      type: 'photo';                // 媒體類型 (MVP 只支援照片)
      url: string;                  // Storage URL
      caption?: string;             // 照片說明 (選填)
      timestamp: Timestamp;         // 拍攝時間
    }>;
  };
  tags: string[];                   // 標籤陣列
  rating?: number;                  // 評分 1-5 (選填)
  isPublic: boolean;                // 是否公開 (預設 false)
  createdAt: Timestamp;             // 建立時間
  updatedAt: Timestamp;             // 更新時間
}
```

### 2.2 Firestore Indexes 索引

#### Composite Indexes 複合索引

**Index 1: 依旅程與日期查詢地點**
```
Collection: users/{userId}/trips/{tripId}/places
Fields:
  - tripId (Ascending)
  - visitedDate (Descending)
```

**Index 2: 依標籤查詢地點**
```
Collection: users/{userId}/trips/{tripId}/places
Fields:
  - tags (Array-contains)
  - visitedDate (Descending)
```

**Index 3: 依旅程與建立時間查詢地點**
```
Collection: users/{userId}/trips/{tripId}/places
Fields:
  - tripId (Ascending)
  - createdAt (Descending)
```

### 2.3 Firestore Security Rules 安全規則

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper Functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isValidEmail(email) {
      return email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    }
    
    function isValidTrip(trip) {
      return trip.title is string
        && trip.title.size() >= 1
        && trip.title.size() <= 200
        && trip.startDate is timestamp
        && trip.endDate is timestamp
        && trip.endDate >= trip.startDate;
    }
    
    function isValidPlace(place) {
      return place.name is string
        && place.name.size() >= 1
        && place.name.size() <= 200
        && place.coordinates.lat is number
        && place.coordinates.lng is number
        && place.coordinates.lat >= -90
        && place.coordinates.lat <= 90
        && place.coordinates.lng >= -180
        && place.coordinates.lng <= 180;
    }
    
    // Users Collection
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isOwner(userId) && isValidEmail(request.resource.data.email);
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);
      
      // Trips Subcollection
      match /trips/{tripId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && isValidTrip(request.resource.data);
        allow update: if isOwner(userId) && isValidTrip(request.resource.data);
        allow delete: if isOwner(userId);
        
        // Places Subcollection
        match /places/{placeId} {
          allow read: if isOwner(userId);
          allow create: if isOwner(userId) && isValidPlace(request.resource.data);
          allow update: if isOwner(userId) && isValidPlace(request.resource.data);
          allow delete: if isOwner(userId);
        }
      }
    }
  }
}
```

### 2.4 Firebase Storage Rules 儲存規則

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper Functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isValidSize() {
      return request.resource.size < 10 * 1024 * 1024; // 10MB
    }
    
    // Media Files
    match /media/{userId}/{tripId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) && isImage() && isValidSize();
      allow delete: if isOwner(userId);
    }
  }
}
```

---

## 3. API Specifications API 規格

### 3.1 Firebase Authentication API

#### 註冊
```typescript
// Method: createUserWithEmailAndPassword
async function signUp(email: string, password: string): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('此 Email 已被使用');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('密碼強度不足');
    }
    throw error;
  }
}
```

#### 登入
```typescript
// Method: signInWithEmailAndPassword
async function signIn(email: string, password: string): Promise<UserCredential> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('帳號或密碼錯誤');
    }
    throw error;
  }
}
```

#### 登出
```typescript
// Method: signOut
async function signOut(): Promise<void> {
  await signOut(auth);
}
```

#### 重設密碼
```typescript
// Method: sendPasswordResetEmail
async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}
```

---

### 3.2 Firestore API

#### 建立旅程
```typescript
async function createTrip(userId: string, tripData: TripInput): Promise<string> {
  const tripRef = doc(collection(db, `users/${userId}/trips`));
  const trip: Trip = {
    id: tripRef.id,
    title: tripData.title,
    description: tripData.description || '',
    startDate: Timestamp.fromDate(tripData.startDate),
    endDate: Timestamp.fromDate(tripData.endDate),
    coverImage: tripData.coverImage || null,
    placesCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(tripRef, trip);
  return tripRef.id;
}
```

#### 讀取所有旅程
```typescript
async function getTrips(userId: string): Promise<Trip[]> {
  const tripsRef = collection(db, `users/${userId}/trips`);
  const q = query(tripsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Trip);
}
```

#### 更新旅程
```typescript
async function updateTrip(userId: string, tripId: string, updates: Partial<Trip>): Promise<void> {
  const tripRef = doc(db, `users/${userId}/trips/${tripId}`);
  await updateDoc(tripRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}
```

#### 刪除旅程
```typescript
async function deleteTrip(userId: string, tripId: string): Promise<void> {
  // 1. 刪除所有地點
  const placesRef = collection(db, `users/${userId}/trips/${tripId}/places`);
  const placesSnapshot = await getDocs(placesRef);
  const batch = writeBatch(db);
  placesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  
  // 2. 刪除旅程
  const tripRef = doc(db, `users/${userId}/trips/${tripId}`);
  await deleteDoc(tripRef);
}
```

#### 建立地點
```typescript
async function createPlace(userId: string, tripId: string, placeData: PlaceInput): Promise<string> {
  const placeRef = doc(collection(db, `users/${userId}/trips/${tripId}/places`));
  const place: Place = {
    id: placeRef.id,
    tripId,
    name: placeData.name,
    coordinates: placeData.coordinates,
    address: placeData.address || '',
    visitedDate: Timestamp.fromDate(placeData.visitedDate),
    content: {
      text: placeData.content.text,
      media: placeData.content.media || [],
    },
    tags: placeData.tags || [],
    rating: placeData.rating || null,
    isPublic: placeData.isPublic || false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(placeRef, place);
  
  // 更新旅程的地點數量
  const tripRef = doc(db, `users/${userId}/trips/${tripId}`);
  await updateDoc(tripRef, {
    placesCount: increment(1),
  });
  
  return placeRef.id;
}
```

#### 讀取旅程的所有地點
```typescript
async function getPlaces(userId: string, tripId: string): Promise<Place[]> {
  const placesRef = collection(db, `users/${userId}/trips/${tripId}/places`);
  const q = query(placesRef, orderBy('visitedDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Place);
}
```

#### 即時監聽地點變更
```typescript
function subscribeToPlaces(
  userId: string,
  tripId: string,
  callback: (places: Place[]) => void
): () => void {
  const placesRef = collection(db, `users/${userId}/trips/${tripId}/places`);
  const q = query(placesRef, orderBy('visitedDate', 'desc'));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const places = snapshot.docs.map(doc => doc.data() as Place);
    callback(places);
  });
  
  return unsubscribe;
}
```

---

### 3.3 Firebase Storage API

#### 上傳照片
```typescript
async function uploadPhoto(
  userId: string,
  tripId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // 1. 壓縮照片
  const compressedFile = await compressImage(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });
  
  // 2. 產生檔名
  const fileName = `${Date.now()}_${file.name}`;
  const storagePath = `media/${userId}/${tripId}/${fileName}`;
  
  // 3. 上傳到 Storage
  const storageRef = ref(storage, storagePath);
  const uploadTask = uploadBytesResumable(storageRef, compressedFile);
  
  // 4. 監聽上傳進度
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}
```

#### 刪除照片
```typescript
async function deletePhoto(photoURL: string): Promise<void> {
  const photoRef = ref(storage, photoURL);
  await deleteObject(photoRef);
}
```

---

### 3.4 Google Maps JavaScript API

#### 初始化地圖
```typescript
function initMap(container: HTMLElement, options: google.maps.MapOptions): google.maps.Map {
  const map = new google.maps.Map(container, {
    zoom: 12,
    center: { lat: 25.0330, lng: 121.5654 }, // 台北
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    ...options,
  });
  return map;
}
```

#### 新增標記
```typescript
function addMarker(
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  options?: google.maps.MarkerOptions
): google.maps.Marker {
  const marker = new google.maps.Marker({
    position,
    map,
    icon: {
      url: '/pin-blue.svg',
      scaledSize: new google.maps.Size(32, 40),
    },
    ...options,
  });
  return marker;
}
```

#### 地點聚合
```typescript
import { MarkerClusterer } from '@googlemaps/markerclusterer';

function createClusterer(
  map: google.maps.Map,
  markers: google.maps.Marker[]
): MarkerClusterer {
  return new MarkerClusterer({
    map,
    markers,
    algorithm: new SuperClusterAlgorithm({ radius: 100 }),
    renderer: {
      render: ({ count, position }) => {
        const size = count < 10 ? 40 : count < 50 ? 50 : 60;
        return new google.maps.Marker({
          position,
          icon: {
            url: `data:image/svg+xml,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
                <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#3B82F6"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="14" font-weight="bold">${count}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(size, size),
          },
          label: {
            text: String(count),
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
          },
        });
      },
    },
  });
}
```

---

### 3.5 Google Places API

#### 搜尋地點
```typescript
async function searchPlaces(query: string, location?: google.maps.LatLngLiteral): Promise<google.maps.places.PlaceResult[]> {
  const service = new google.maps.places.PlacesService(document.createElement('div'));
  
  return new Promise((resolve, reject) => {
    service.textSearch(
      {
        query,
        location: location ? new google.maps.LatLng(location) : undefined,
        radius: location ? 5000 : undefined, // 5km
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      }
    );
  });
}
```

#### 自動完成
```typescript
function initAutocomplete(
  input: HTMLInputElement,
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void
): google.maps.places.Autocomplete {
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['establishment', 'geocode'],
    fields: ['name', 'formatted_address', 'geometry', 'place_id'],
  });
  
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      onPlaceSelected(place);
    }
  });
  
  return autocomplete;
}
```

---

## 4. Performance Requirements 效能要求

### 4.1 載入時間

| 指標 | 目標 | 測量方式 |
|------|------|---------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Time to Interactive (TTI) | < 3.5s | Lighthouse |
| 地圖載入時間 | < 2s | Custom Metric |
| 照片上傳後顯示 | < 1s | Custom Metric |

### 4.2 響應時間

| 操作 | 目標 | 測量方式 |
|------|------|---------|
| 搜尋地點 | < 500ms | Network Tab |
| 地點聚合渲染 | < 300ms | Performance API |
| 按鈕點擊回饋 | < 100ms | Performance API |
| 地圖平移/縮放 | 60 FPS | Chrome DevTools |

### 4.3 優化策略

#### Code Splitting 程式碼分割
```typescript
// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Route-based code splitting
<Routes>
  <Route path="/" element={<Suspense fallback={<Loading />}><LandingPage /></Suspense>} />
  <Route path="/trips/:tripId" element={<Suspense fallback={<Loading />}><MapPage /></Suspense>} />
  <Route path="/settings" element={<Suspense fallback={<Loading />}><SettingsPage /></Suspense>} />
</Routes>
```

#### Image Optimization 圖片優化
```typescript
// 使用 browser-image-compression
import imageCompression from 'browser-image-compression';

async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp', // 轉換為 WebP
  };
  return await imageCompression(file, options);
}
```

#### Lazy Loading 延遲載入
```typescript
// 使用 Intersection Observer
function useLazyLoad(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Load content
        }
      },
      { rootMargin: '100px' }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [ref]);
}
```

#### Debounce & Throttle 防抖與節流
```typescript
// Debounce for search input
const debouncedSearch = useMemo(
  () => debounce((query: string) => searchPlaces(query), 300),
  []
);

// Throttle for map zoom
const throttledZoom = useMemo(
  () => throttle(() => updateClusters(), 300),
  []
);
```

---

## 5. Security & Privacy 安全與隱私

### 5.1 Authentication 認證機制

- **Email/Password**：使用 Firebase Authentication
- **密碼強度**：最少 8 個字元
- **Session Management**：Firebase 自動管理 session token
- **Token Refresh**：自動刷新，無需手動處理

### 5.2 Data Protection 資料保護

- **傳輸加密**：所有 API 請求使用 HTTPS
- **儲存加密**：Firebase 自動加密靜態資料
- **權限控制**：Firestore Security Rules 限制存取
- **資料隔離**：每個使用者只能存取自己的資料

### 5.3 Input Validation 輸入驗證

#### Client-side Validation 客戶端驗證
```typescript
// Email validation
function validateEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// Password validation
function validatePassword(password: string): boolean {
  return password.length >= 8;
}

// Trip name validation
function validateTripName(name: string): boolean {
  return name.length >= 1 && name.length <= 200;
}

// Coordinates validation
function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
```

#### Server-side Validation 伺服器端驗證
- 使用 Firestore Security Rules 進行二次驗證
- 所有寫入操作都會經過 Security Rules 檢查

### 5.4 XSS Protection XSS 防護

```typescript
// Sanitize HTML content
import DOMPurify from 'dompurify';

function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
  });
}
```

---

## 6. Error Handling & Logging 錯誤處理與日誌

### 6.1 Error Handling Strategy 錯誤處理策略

```typescript
// Global error boundary
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to monitoring service (e.g., Sentry)
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Show user-friendly error message
    this.setState({ hasError: true });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 6.2 Logging 日誌記錄

```typescript
// Log levels
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

// Logger utility
class Logger {
  static log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
    };
    
    // Console log (development)
    if (import.meta.env.DEV) {
      console[level](message, data);
    }
    
    // Send to monitoring service (production)
    if (import.meta.env.PROD) {
      // Send to Sentry, LogRocket, etc.
    }
  }
  
  static error(message: string, error: Error) {
    this.log(LogLevel.ERROR, message, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }
}
```

---

## 7. Testing Strategy 測試策略

### 7.1 Unit Tests 單元測試

```typescript
// Example: Test image compression utility
describe('compressImage', () => {
  it('should compress image to less than 1MB', async () => {
    const file = new File([/* ... */], 'test.jpg', { type: 'image/jpeg' });
    const compressed = await compressImage(file);
    expect(compressed.size).toBeLessThan(1024 * 1024);
  });
  
  it('should maintain image quality', async () => {
    const file = new File([/* ... */], 'test.jpg', { type: 'image/jpeg' });
    const compressed = await compressImage(file);
    // Check image dimensions, etc.
  });
});
```

### 7.2 Integration Tests 整合測試

```typescript
// Example: Test Firestore operations
describe('Trip CRUD operations', () => {
  it('should create a trip', async () => {
    const tripData = {
      title: 'Test Trip',
      startDate: new Date(),
      endDate: new Date(),
    };
    const tripId = await createTrip('testUserId', tripData);
    expect(tripId).toBeDefined();
  });
  
  it('should read trips', async () => {
    const trips = await getTrips('testUserId');
    expect(trips).toBeInstanceOf(Array);
  });
});
```

### 7.3 E2E Tests 端對端測試

```typescript
// Example: Playwright test
test('user can create a trip', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("+ New Trip")');
  await page.fill('input[name="title"]', 'Test Trip');
  await page.fill('input[name="startDate"]', '2024-03-01');
  await page.fill('input[name="endDate"]', '2024-03-15');
  await page.click('button:has-text("建立")');
  await expect(page.locator('text=Test Trip')).toBeVisible();
});
```

---

## 8. Deployment & CI/CD 部署與持續整合

### 8.1 Build Configuration 建置設定

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'maps-vendor': ['@googlemaps/js-api-loader', '@googlemaps/markerclusterer'],
        },
      },
    },
  },
});
```

### 8.2 Environment Variables 環境變數

```bash
# .env.production
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_GOOGLE_MAPS_API_KEY=xxx
```

### 8.3 Firebase Hosting 部署

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

---

## 附錄

### A. TypeScript Types 型別定義

```typescript
// types/trip.ts
export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  coverImage?: string;
  placesCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TripInput {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  coverImage?: string;
}

// types/place.ts
export interface Place {
  id: string;
  tripId: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address?: string;
  visitedDate: Timestamp;
  content: {
    text: string;
    media: Media[];
  };
  tags: string[];
  rating?: number;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Media {
  type: 'photo';
  url: string;
  caption?: string;
  timestamp: Timestamp;
}

export interface PlaceInput {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address?: string;
  visitedDate: Date;
  content: {
    text: string;
    media?: Media[];
  };
  tags?: string[];
  rating?: number;
  isPublic?: boolean;
}
```

### B. 參考文件
- [PRD.md](./PRD.md)：產品需求文件
- [FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md)：功能規格
- [DESIGN_SPEC.md](./DESIGN_SPEC.md)：設計規格
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
