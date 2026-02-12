# TravelDot - 設計規格文件 (Design Spec)

## 目的

本文件提供精確的視覺標註，包含間距 (Padding)、字體大小、色號、動態效果等，確保設計與開發團隊能精確執行。

---

## 1. Design System 設計系統基礎

### 1.1 Color Palette 色彩系統

#### Primary Colors 主色
```css
--primary-50:  #EFF6FF;   /* 最淺藍 - 背景 */
--primary-100: #DBEAFE;   /* 淺藍 - Hover 背景 */
--primary-200: #BFDBFE;   /* 淺藍 - Border */
--primary-300: #93C5FD;   /* 中藍 - Disabled */
--primary-400: #60A5FA;   /* 中藍 - Hover */
--primary-500: #3B82F6;   /* 主藍 - Primary Button, Pin */
--primary-600: #2563EB;   /* 深藍 - Active */
--primary-700: #1D4ED8;   /* 深藍 - Pressed */
--primary-800: #1E40AF;   /* 更深藍 */
--primary-900: #1E3A8A;   /* 最深藍 */
```

#### Secondary Colors 次要色
```css
--secondary-50:  #FFF7ED;   /* 最淺橘 */
--secondary-100: #FFEDD5;   /* 淺橘 */
--secondary-200: #FED7AA;   /* 淺橘 */
--secondary-300: #FDBA74;   /* 中橘 */
--secondary-400: #FB923C;   /* 中橘 */
--secondary-500: #F59E0B;   /* 主橘 - Selected Pin, Accent */
--secondary-600: #EA580C;   /* 深橘 */
--secondary-700: #C2410C;   /* 深橘 */
--secondary-800: #9A3412;   /* 更深橘 */
--secondary-900: #7C2D12;   /* 最深橘 */
```

#### Neutral Colors 中性色
```css
--gray-50:  #F9FAFB;   /* 最淺灰 - 背景 */
--gray-100: #F3F4F6;   /* 淺灰 - Card 背景 */
--gray-200: #E5E7EB;   /* 淺灰 - Border */
--gray-300: #D1D5DB;   /* 中灰 - Disabled Text */
--gray-400: #9CA3AF;   /* 中灰 - Placeholder */
--gray-500: #6B7280;   /* 中灰 - Secondary Text */
--gray-600: #4B5563;   /* 深灰 - Body Text */
--gray-700: #374151;   /* 深灰 - Heading */
--gray-800: #1F2937;   /* 更深灰 */
--gray-900: #111827;   /* 最深灰 - Primary Text */
```

#### Semantic Colors 語意色
```css
/* Success */
--success-50:  #F0FDF4;
--success-500: #10B981;   /* 成功訊息 */
--success-700: #047857;   /* 成功按鈕 Pressed */

/* Error */
--error-50:  #FEF2F2;
--error-500: #EF4444;     /* 錯誤訊息, 刪除按鈕 */
--error-700: #B91C1C;     /* 錯誤按鈕 Pressed */

/* Warning */
--warning-50:  #FFFBEB;
--warning-500: #F59E0B;   /* 警告訊息 */
--warning-700: #B45309;   /* 警告按鈕 Pressed */

/* Info */
--info-50:  #EFF6FF;
--info-500: #3B82F6;      /* 資訊訊息 */
--info-700: #1D4ED8;      /* 資訊按鈕 Pressed */
```

#### Background & Surface 背景與表面
```css
--bg-primary:   #FFFFFF;   /* 主背景 */
--bg-secondary: #F9FAFB;   /* 次要背景 */
--bg-tertiary:  #F3F4F6;   /* 第三層背景 */

--surface-primary:   #FFFFFF;   /* Card, Modal 背景 */
--surface-secondary: #F9FAFB;   /* Sidebar 背景 */
--surface-overlay:   rgba(0, 0, 0, 0.5);   /* Modal 遮罩 */
```

---

### 1.2 Typography 字體系統

#### Font Family 字體家族
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

#### Font Size 字體大小
```css
--text-xs:   0.75rem;   /* 12px - Caption, Helper Text */
--text-sm:   0.875rem;  /* 14px - Body Small, Secondary Text */
--text-base: 1rem;      /* 16px - Body, Primary Text */
--text-lg:   1.125rem;  /* 18px - Subtitle */
--text-xl:   1.25rem;   /* 20px - Heading 3 */
--text-2xl:  1.5rem;    /* 24px - Heading 2 */
--text-3xl:  1.875rem;  /* 30px - Heading 1 */
--text-4xl:  2.25rem;   /* 36px - Display */
```

#### Font Weight 字重
```css
--font-normal:    400;   /* Body Text */
--font-medium:    500;   /* Emphasis, Button */
--font-semibold:  600;   /* Heading, Strong */
--font-bold:      700;   /* Display, Hero */
```

#### Line Height 行高
```css
--leading-tight:  1.25;   /* Heading */
--leading-normal: 1.5;    /* Body Text */
--leading-relaxed: 1.75;  /* Long Form Content */
```

#### Letter Spacing 字距
```css
--tracking-tight:  -0.025em;   /* Heading */
--tracking-normal:  0em;       /* Body */
--tracking-wide:    0.025em;   /* Button, Label */
```

---

### 1.3 Spacing Scale 間距系統

```css
--space-0:   0px;      /* 0 */
--space-1:   0.25rem;  /* 4px */
--space-2:   0.5rem;   /* 8px */
--space-3:   0.75rem;  /* 12px */
--space-4:   1rem;     /* 16px */
--space-5:   1.25rem;  /* 20px */
--space-6:   1.5rem;   /* 24px */
--space-8:   2rem;     /* 32px */
--space-10:  2.5rem;   /* 40px */
--space-12:  3rem;     /* 48px */
--space-16:  4rem;     /* 64px */
--space-20:  5rem;     /* 80px */
--space-24:  6rem;     /* 96px */
```

**使用原則**：
- **4px 基準**：所有間距都是 4px 的倍數
- **元件內部**：使用 4px, 8px, 12px, 16px
- **元件之間**：使用 16px, 24px, 32px
- **區塊之間**：使用 48px, 64px, 96px

---

### 1.4 Shadows & Effects 陰影與效果

#### Box Shadow 陰影
```css
--shadow-xs:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm:  0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

**使用場景**：
- `shadow-xs`: Input Focus
- `shadow-sm`: Card, Button
- `shadow-md`: Dropdown, Tooltip
- `shadow-lg`: Modal, Sidebar
- `shadow-xl`: FAB, Floating Element
- `shadow-2xl`: Hero Image, Feature Card

#### Border Radius 圓角
```css
--radius-none: 0px;
--radius-sm:   0.25rem;  /* 4px - Input, Tag */
--radius-md:   0.5rem;   /* 8px - Button, Card */
--radius-lg:   0.75rem;  /* 12px - Modal, Image */
--radius-xl:   1rem;     /* 16px - Hero Card */
--radius-full: 9999px;   /* Circle - Avatar, Badge */
```

---

### 1.5 Animation & Transition 動畫與轉場

#### Duration 持續時間
```css
--duration-fast:   150ms;   /* Hover, Focus */
--duration-normal: 200ms;   /* Button Click, Fade */
--duration-slow:   300ms;   /* Modal, Slide */
--duration-slower: 500ms;   /* Page Transition */
```

#### Easing 緩動函數
```css
--ease-in:      cubic-bezier(0.4, 0, 1, 1);
--ease-out:     cubic-bezier(0, 0, 0.2, 1);
--ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce:  cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

**使用場景**：
- `ease-in`: 元素消失（Fade Out, Slide Out）
- `ease-out`: 元素出現（Fade In, Slide In）
- `ease-in-out`: 元素移動（Slide, Scale）
- `ease-bounce`: 強調動畫（Button Click, Notification）

---

## 2. Component Specifications 元件規格

### 2.1 Button 按鈕

#### Primary Button 主要按鈕
```css
/* Normal State */
background: var(--primary-500);
color: #FFFFFF;
padding: 12px 24px;
border-radius: var(--radius-md);
font-size: var(--text-base);
font-weight: var(--font-medium);
box-shadow: var(--shadow-sm);
transition: all var(--duration-fast) var(--ease-out);

/* Hover State */
background: var(--primary-600);
box-shadow: var(--shadow-md);
transform: translateY(-1px);

/* Active/Pressed State */
background: var(--primary-700);
box-shadow: var(--shadow-xs);
transform: translateY(0);

/* Disabled State */
background: var(--gray-300);
color: var(--gray-500);
cursor: not-allowed;
box-shadow: none;

/* Loading State */
background: var(--primary-500);
opacity: 0.7;
cursor: wait;
/* 顯示 spinner icon */
```

**尺寸變化**：
```css
/* Small */
padding: 8px 16px;
font-size: var(--text-sm);

/* Medium (Default) */
padding: 12px 24px;
font-size: var(--text-base);

/* Large */
padding: 16px 32px;
font-size: var(--text-lg);
```

#### Secondary Button 次要按鈕
```css
/* Normal State */
background: transparent;
color: var(--primary-500);
border: 2px solid var(--primary-500);
padding: 10px 22px; /* 減 2px 補償 border */
border-radius: var(--radius-md);
font-size: var(--text-base);
font-weight: var(--font-medium);
transition: all var(--duration-fast) var(--ease-out);

/* Hover State */
background: var(--primary-50);
border-color: var(--primary-600);
color: var(--primary-600);

/* Active/Pressed State */
background: var(--primary-100);
border-color: var(--primary-700);
color: var(--primary-700);
```

#### Danger Button 危險按鈕
```css
/* Normal State */
background: var(--error-500);
color: #FFFFFF;
/* 其他屬性同 Primary Button */

/* Hover State */
background: var(--error-600);

/* Active/Pressed State */
background: var(--error-700);
```

---

### 2.2 Input 輸入框

#### Text Input 文字輸入框
```css
/* Normal State */
width: 100%;
padding: 12px 16px;
border: 2px solid var(--gray-200);
border-radius: var(--radius-md);
font-size: var(--text-base);
color: var(--gray-900);
background: var(--bg-primary);
transition: all var(--duration-fast) var(--ease-out);

/* Focus State */
border-color: var(--primary-500);
box-shadow: 0 0 0 3px var(--primary-50);
outline: none;

/* Error State */
border-color: var(--error-500);
box-shadow: 0 0 0 3px var(--error-50);

/* Disabled State */
background: var(--gray-100);
color: var(--gray-500);
cursor: not-allowed;
```

**Placeholder 樣式**：
```css
::placeholder {
  color: var(--gray-400);
  font-style: italic;
}
```

**Label 樣式**：
```css
font-size: var(--text-sm);
font-weight: var(--font-medium);
color: var(--gray-700);
margin-bottom: var(--space-2);
display: block;
```

**Error Message 樣式**：
```css
font-size: var(--text-sm);
color: var(--error-500);
margin-top: var(--space-2);
display: flex;
align-items: center;
gap: var(--space-1);
/* Icon: AlertCircle, 16px */
```

---

### 2.3 Card 卡片

#### Trip Card 旅程卡片
```css
/* Container */
width: 100%;
max-width: 360px;
background: var(--surface-primary);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-sm);
overflow: hidden;
transition: all var(--duration-normal) var(--ease-out);
cursor: pointer;

/* Hover State */
box-shadow: var(--shadow-lg);
transform: translateY(-4px);

/* Cover Image */
width: 100%;
height: 200px;
object-fit: cover;
background: var(--gray-200); /* Placeholder */

/* Content */
padding: var(--space-4);

/* Title */
font-size: var(--text-xl);
font-weight: var(--font-semibold);
color: var(--gray-900);
margin-bottom: var(--space-2);
/* 最多顯示 2 行，超過顯示 ... */
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;

/* Date */
font-size: var(--text-sm);
color: var(--gray-500);
margin-bottom: var(--space-1);
display: flex;
align-items: center;
gap: var(--space-1);
/* Icon: Calendar, 16px */

/* Place Count */
font-size: var(--text-sm);
color: var(--gray-500);
display: flex;
align-items: center;
gap: var(--space-1);
/* Icon: MapPin, 16px */
```

#### Place Preview Card 地點預覽卡片
```css
/* Container */
width: 400px;
max-width: 90vw;
background: var(--surface-primary);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-xl);
overflow: hidden;
position: absolute;
z-index: 1000;
/* 出現動畫: scale-up */
animation: scaleUp var(--duration-normal) var(--ease-out);

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Close Button */
position: absolute;
top: var(--space-4);
right: var(--space-4);
width: 32px;
height: 32px;
background: rgba(0, 0, 0, 0.5);
color: #FFFFFF;
border-radius: var(--radius-full);
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: background var(--duration-fast) var(--ease-out);

/* Close Button Hover */
background: rgba(0, 0, 0, 0.7);

/* Photo Carousel */
width: 100%;
height: 240px;
position: relative;

/* Photo */
width: 100%;
height: 100%;
object-fit: cover;

/* Carousel Arrows */
position: absolute;
top: 50%;
transform: translateY(-50%);
width: 40px;
height: 40px;
background: rgba(255, 255, 255, 0.9);
border-radius: var(--radius-full);
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
box-shadow: var(--shadow-md);
transition: all var(--duration-fast) var(--ease-out);

/* Left Arrow */
left: var(--space-4);

/* Right Arrow */
right: var(--space-4);

/* Arrow Hover */
background: #FFFFFF;
box-shadow: var(--shadow-lg);

/* Carousel Dots */
position: absolute;
bottom: var(--space-4);
left: 50%;
transform: translateX(-50%);
display: flex;
gap: var(--space-2);

/* Dot */
width: 8px;
height: 8px;
border-radius: var(--radius-full);
background: rgba(255, 255, 255, 0.5);
cursor: pointer;
transition: all var(--duration-fast) var(--ease-out);

/* Active Dot */
background: #FFFFFF;
width: 24px;

/* Content */
padding: var(--space-6);

/* Place Name */
font-size: var(--text-2xl);
font-weight: var(--font-semibold);
color: var(--gray-900);
margin-bottom: var(--space-3);

/* Address */
font-size: var(--text-sm);
color: var(--gray-500);
margin-bottom: var(--space-2);
display: flex;
align-items: flex-start;
gap: var(--space-2);
/* Icon: MapPin, 16px */

/* Date */
font-size: var(--text-sm);
color: var(--gray-500);
margin-bottom: var(--space-4);
display: flex;
align-items: center;
gap: var(--space-2);
/* Icon: Calendar, 16px */

/* Rating */
display: flex;
gap: var(--space-1);
margin-bottom: var(--space-4);
/* Icon: Star (filled/outlined), 20px, color: #F59E0B */

/* Content Text */
font-size: var(--text-base);
color: var(--gray-700);
line-height: var(--leading-normal);
margin-bottom: var(--space-4);
/* 最多顯示 3 行，超過顯示 ... */
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
overflow: hidden;

/* Tags */
display: flex;
flex-wrap: wrap;
gap: var(--space-2);
margin-bottom: var(--space-6);

/* Tag Chip */
padding: var(--space-1) var(--space-3);
background: var(--primary-50);
color: var(--primary-700);
border-radius: var(--radius-sm);
font-size: var(--text-sm);
font-weight: var(--font-medium);

/* Action Buttons */
display: flex;
gap: var(--space-3);
justify-content: flex-end;
```

---

### 2.4 Modal 對話框

#### Modal Container 對話框容器
```css
/* Overlay */
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: var(--surface-overlay);
z-index: 9999;
display: flex;
align-items: center;
justify-content: center;
padding: var(--space-4);
/* 出現動畫: fade-in */
animation: fadeIn var(--duration-normal) var(--ease-out);

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal */
width: 100%;
max-width: 600px;
max-height: 90vh;
background: var(--surface-primary);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-2xl);
overflow: hidden;
/* 出現動畫: slide-up */
animation: slideUp var(--duration-slow) var(--ease-out);

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
padding: var(--space-6);
border-bottom: 1px solid var(--gray-200);
display: flex;
align-items: center;
justify-content: space-between;

/* Title */
font-size: var(--text-2xl);
font-weight: var(--font-semibold);
color: var(--gray-900);

/* Close Button */
width: 32px;
height: 32px;
border-radius: var(--radius-md);
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: background var(--duration-fast) var(--ease-out);

/* Close Button Hover */
background: var(--gray-100);

/* Body */
padding: var(--space-6);
overflow-y: auto;
max-height: calc(90vh - 160px); /* 減去 header 與 footer */

/* Footer */
padding: var(--space-6);
border-top: 1px solid var(--gray-200);
display: flex;
gap: var(--space-3);
justify-content: flex-end;
```

---

### 2.5 Toast Notification 提示訊息

#### Toast Container 提示容器
```css
/* Container */
position: fixed;
bottom: var(--space-6);
right: var(--space-6);
z-index: 10000;
display: flex;
flex-direction: column;
gap: var(--space-3);
max-width: 400px;

/* Toast */
padding: var(--space-4) var(--space-5);
background: var(--gray-900);
color: #FFFFFF;
border-radius: var(--radius-md);
box-shadow: var(--shadow-lg);
display: flex;
align-items: center;
gap: var(--space-3);
/* 出現動畫: slide-in-right */
animation: slideInRight var(--duration-normal) var(--ease-out);

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Icon */
width: 20px;
height: 20px;
flex-shrink: 0;

/* Message */
font-size: var(--text-base);
flex: 1;

/* Close Button */
width: 20px;
height: 20px;
cursor: pointer;
opacity: 0.7;
transition: opacity var(--duration-fast) var(--ease-out);

/* Close Button Hover */
opacity: 1;

/* Success Toast */
background: var(--success-500);

/* Error Toast */
background: var(--error-500);

/* Warning Toast */
background: var(--warning-500);

/* Info Toast */
background: var(--info-500);
```

---

### 2.6 FAB (Floating Action Button) 浮動操作按鈕

```css
/* Container */
position: fixed;
bottom: var(--space-6);
right: var(--space-6);
z-index: 1000;

/* FAB Button */
width: 56px;
height: 56px;
background: var(--primary-500);
color: #FFFFFF;
border-radius: var(--radius-full);
box-shadow: var(--shadow-xl);
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: all var(--duration-normal) var(--ease-out);

/* Hover State */
background: var(--primary-600);
box-shadow: var(--shadow-2xl);
transform: scale(1.1);

/* Active State (Menu Open) */
background: var(--primary-700);
transform: rotate(45deg);

/* Icon */
width: 24px;
height: 24px;
transition: transform var(--duration-normal) var(--ease-out);

/* Menu */
position: absolute;
bottom: 72px; /* FAB height + gap */
right: 0;
display: flex;
flex-direction: column;
gap: var(--space-3);
/* 出現動畫: stagger */

/* Menu Item */
padding: var(--space-3) var(--space-4);
background: var(--surface-primary);
border-radius: var(--radius-md);
box-shadow: var(--shadow-lg);
display: flex;
align-items: center;
gap: var(--space-3);
cursor: pointer;
white-space: nowrap;
transition: all var(--duration-fast) var(--ease-out);
/* 依序出現，每個延遲 50ms */
animation: slideInUp var(--duration-normal) var(--ease-out);

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Menu Item Hover */
background: var(--primary-50);
box-shadow: var(--shadow-xl);

/* Menu Item Icon */
width: 20px;
height: 20px;
color: var(--primary-500);

/* Menu Item Text */
font-size: var(--text-base);
font-weight: var(--font-medium);
color: var(--gray-900);

/* Backdrop */
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: transparent;
z-index: -1;
```

---

## 3. Page Layouts 頁面佈局

### 3.1 Responsive Breakpoints 響應式斷點

```css
/* Mobile */
@media (max-width: 767px) {
  /* 375px - 767px */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 768px - 1023px */
}

/* Desktop */
@media (min-width: 1024px) {
  /* 1024px+ */
}
```

---

### 3.2 Landing Page 旅程列表頁

#### Layout Structure 佈局結構
```
┌─────────────────────────────────────────┐
│ Header (64px)                           │
├─────────────────────────────────────────┤
│                                         │
│ Content (padding: 24px)                 │
│                                         │
│ ┌─────┐ ┌─────┐ ┌─────┐                │
│ │Card │ │Card │ │Card │                │
│ └─────┘ └─────┘ └─────┘                │
│                                         │
└─────────────────────────────────────────┘
```

#### Header 頁首
```css
/* Container */
height: 64px;
padding: 0 var(--space-6);
background: var(--surface-primary);
border-bottom: 1px solid var(--gray-200);
display: flex;
align-items: center;
justify-content: space-between;

/* Logo */
font-size: var(--text-2xl);
font-weight: var(--font-bold);
color: var(--primary-500);

/* User Menu */
display: flex;
align-items: center;
gap: var(--space-4);

/* Avatar */
width: 40px;
height: 40px;
border-radius: var(--radius-full);
background: var(--primary-100);
color: var(--primary-700);
display: flex;
align-items: center;
justify-content: center;
font-weight: var(--font-semibold);
cursor: pointer;
```

#### Content Area 內容區域
```css
/* Container */
padding: var(--space-6);
max-width: 1200px;
margin: 0 auto;

/* Title */
font-size: var(--text-3xl);
font-weight: var(--font-bold);
color: var(--gray-900);
margin-bottom: var(--space-6);

/* Trip Grid */
display: grid;
grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
gap: var(--space-6);

/* Mobile */
@media (max-width: 767px) {
  grid-template-columns: 1fr;
}
```

---

### 3.3 Map Page 地圖頁面

#### Layout Structure 佈局結構（桌面版）
```
┌─────────────────────────────────────────┐
│ Header (64px)                           │
├──────────────────────┬──────────────────┤
│                      │                  │
│                      │  Sidebar         │
│   Map (70%)          │  (30%, 360px)    │
│                      │                  │
│                      │                  │
└──────────────────────┴──────────────────┘
```

#### Layout Structure 佈局結構（手機版）
```
┌─────────────────────────────────────────┐
│ Header (56px)                           │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│   Map (100%)                            │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ Bottom Sheet (160px, expandable)       │
└─────────────────────────────────────────┘
```

#### Sidebar 側邊欄（桌面版）
```css
/* Container */
width: 360px;
height: calc(100vh - 64px);
background: var(--surface-secondary);
border-left: 1px solid var(--gray-200);
display: flex;
flex-direction: column;
overflow: hidden;

/* Header */
padding: var(--space-6);
border-bottom: 1px solid var(--gray-200);

/* Trip Title */
font-size: var(--text-xl);
font-weight: var(--font-semibold);
color: var(--gray-900);
margin-bottom: var(--space-2);

/* Place Count */
font-size: var(--text-sm);
color: var(--gray-500);

/* Collapse Button */
position: absolute;
top: var(--space-6);
left: -16px;
width: 32px;
height: 32px;
background: var(--surface-primary);
border: 1px solid var(--gray-200);
border-radius: var(--radius-full);
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
box-shadow: var(--shadow-md);

/* List Container */
flex: 1;
overflow-y: auto;
padding: var(--space-4);

/* List Item */
padding: var(--space-4);
background: var(--surface-primary);
border-radius: var(--radius-md);
margin-bottom: var(--space-3);
cursor: pointer;
transition: all var(--duration-fast) var(--ease-out);

/* List Item Hover */
background: var(--primary-50);
box-shadow: var(--shadow-sm);

/* List Item Selected */
background: var(--primary-100);
border: 2px solid var(--primary-500);
```

#### Bottom Sheet 底部面板（手機版）
```css
/* Container */
position: fixed;
bottom: 0;
left: 0;
right: 0;
background: var(--surface-primary);
border-top-left-radius: var(--radius-xl);
border-top-right-radius: var(--radius-xl);
box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
transition: height var(--duration-slow) var(--ease-out);
z-index: 100;

/* Default Height */
height: 160px;

/* Expanded Height */
height: 80vh;

/* Handle */
width: 40px;
height: 4px;
background: var(--gray-300);
border-radius: var(--radius-full);
margin: var(--space-3) auto;
cursor: grab;

/* Handle Active */
cursor: grabbing;
```

---

## 4. Animation Specifications 動畫規格

### 4.1 Page Transitions 頁面轉場

#### Fade Transition 淡入淡出
```css
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.fade-exit {
  opacity: 1;
}

.fade-exit-active {
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-in);
}
```

#### Slide Transition 滑動
```css
.slide-enter {
  transform: translateX(100%);
}

.slide-enter-active {
  transform: translateX(0);
  transition: transform var(--duration-slow) var(--ease-out);
}

.slide-exit {
  transform: translateX(0);
}

.slide-exit-active {
  transform: translateX(-100%);
  transition: transform var(--duration-slow) var(--ease-in);
}
```

---

### 4.2 Micro-interactions 微互動

#### Button Click 按鈕點擊
```css
@keyframes buttonClick {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

button:active {
  animation: buttonClick var(--duration-fast) var(--ease-in-out);
}
```

#### Card Hover 卡片懸停
```css
.card {
  transition: all var(--duration-normal) var(--ease-out);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

#### Pin Bounce 標記彈跳
```css
@keyframes pinBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.pin.new {
  animation: pinBounce 0.6s var(--ease-bounce);
}
```

---

## 5. Accessibility 無障礙設計

### 5.1 Color Contrast 色彩對比

所有文字與背景的對比度必須符合 WCAG 2.1 AA 標準：
- **正常文字**：至少 4.5:1
- **大文字（18px+ 或 14px+ bold）**：至少 3:1

### 5.2 Focus States 焦點狀態

所有可互動元素必須有明顯的焦點狀態：
```css
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### 5.3 Touch Targets 觸控目標

所有可點擊元素的最小尺寸：
- **手機**：44x44px
- **桌面**：32x32px

---

## 附錄

### A. Design Tokens 設計標記

完整的 Design Tokens 可匯出為 JSON 格式，供開發團隊使用：
```json
{
  "colors": {
    "primary": {
      "500": "#3B82F6"
    }
  },
  "spacing": {
    "4": "1rem"
  },
  "typography": {
    "base": {
      "fontSize": "1rem",
      "lineHeight": "1.5"
    }
  }
}
```

### B. 參考文件
- [PRD.md](./PRD.md)：產品需求文件
- [FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md)：功能規格
- [TECH_SPEC.md](./TECH_SPEC.md)：技術規格
