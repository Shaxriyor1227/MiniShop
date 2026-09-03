# 🎨 MiniShop — Design System & UI/UX Specification (DESIGN.md)

> **MiniShop** — *Simple. Beautiful. Yours.*  
> Yuqori darajadagi zamonaviy elektron tijorat platformasi uchun ishlab chiqilgan to'liq dizayn tizimi, UI/UX arxitekturasi va dizayn tokenlari spetsifikatsiyasi.

---

## 1. 🌟 Dizayn Falsafasi (Design Philosophy)

MiniShop dizayni dunyoning yetakchi brendlari (**Apple**, **Teenage Engineering**, **Linear**) estetikasidan ilhomlanib yaratilgan:

1. **Intellektual Minimalizm (Clean & Clutter-Free):** Har bir piksel va element o'z maqsadiga ega. Ortiqcha shovqin, keraksiz ramkalar va chalg'ituvchi elementlar yo'q.
2. **Optik Chuqurlik va Glassmorphism (Depth & Light):** Nozik radial neon-auralar, nozik borderlar (`rgba(255,255,255,0.08)`) va fonni xiralashtiruvchi (`backdrop-filter: blur(16px)`) shaffof oynasimon qatlamlar.
3. **Mikro-interaksiyalar va Jonli Harakat (Fluid Motion):** Har bir hover, bosish va sahifa almashinuvi silliq fizika qonuniyatlariga (`cubic-bezier(0.16, 1, 0.3, 1)`) asoslangan.
4. **Mutlaq Moslashuvchanlik (Seamless Dual Theme):** Yorug' (Light) va Qorong'i (Dark) rejimlarning har ikkalasida ham 100% kontrast va estetik mukammallik.

---

## 2. 🎨 Ranglar Palitrasi & Dizayn Tokenlari (Color Tokens)

Platforma to'liq **CSS Custom Properties (Variables)** orqali boshqariladi:

```css
/* ==========================================================================
   MINISHOP GLOBAL DESIGN TOKENS
   ========================================================================== */

:root {
  /* --- Light Theme (Default) --- */
  --bg-main: #f5f5f7;              /* Apple Clean Studio Light */
  --bg-surface: #ffffff;           /* Pure White Surface */
  --bg-surface-hover: #f0f0f4;     /* Subtle Gray Hover */
  --bg-surface-glass: rgba(255, 255, 255, 0.82);

  --ink-primary: #1d1d1f;          /* High-Contrast Jet Black */
  --ink-secondary: #6e6e73;        /* Neutral Slate Gray */
  --ink-tertiary: #a1a1a6;         /* Soft Caption Gray */
  --ink-inverted: #ffffff;

  --border-subtle: rgba(0, 0, 0, 0.07);
  --border-focus: rgba(0, 113, 227, 0.4);

  /* --- Brand Accent Palette --- */
  --accent-blue: #0071e3;          /* Signature Electric Blue */
  --accent-blue-hover: #005bb5;
  --accent-blue-subtle: rgba(0, 113, 227, 0.08);

  /* --- Semantic Colors --- */
  --color-success: #34c759;        /* Apple Green */
  --color-success-bg: rgba(52, 199, 89, 0.1);
  --color-warning: #ff9500;        /* Amber Orange */
  --color-warning-bg: rgba(255, 149, 0, 0.1);
  --color-danger: #ff3b30;         /* Crimson Red */
  --color-danger-bg: rgba(255, 59, 48, 0.1);
  --color-purple: #5856d6;         /* Indigo Glow */

  /* --- Geometry & Radii --- */
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 9999px;

  /* --- Shadows & Elevation --- */
  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.06);
  --shadow-elevated: 0 12px 36px rgba(0, 0, 0, 0.09);
  --shadow-modal: 0 20px 60px rgba(0, 0, 0, 0.16);

  /* --- Transitions --- */
  --transition-fast: 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-smooth: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* --- Dark Theme Palette --- */
[data-theme='dark'] {
  --bg-main: #0c0d10;              /* Deep Cyber-Void Charcoal */
  --bg-surface: #15171e;           /* Rich Obsidian Surface */
  --bg-surface-hover: #1e212b;     /* Elevated Slate Hover */
  --bg-surface-glass: rgba(21, 23, 30, 0.85);

  --ink-primary: #f5f5f7;          /* Crisp White Text */
  --ink-secondary: #9da3b4;        /* Soft Cool Gray */
  --ink-tertiary: #5c6275;         /* Muted Slate */
  --ink-inverted: #0c0d10;

  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(0, 113, 227, 0.6);

  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-card: 0 6px 24px rgba(0, 0, 0, 0.45);
  --shadow-elevated: 0 14px 42px rgba(0, 0, 0, 0.65);
  --shadow-modal: 0 24px 70px rgba(0, 0, 0, 0.85);
}
```

---

## 3. ✍️ Tipografiya Tizimi (Typography System)

- **Asosiy shriftlar:** `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif`
- **Texnik kodlar & Shortcutlar:** `'SF Mono', 'JetBrains Mono', Consolas, monospace`

| Element | Size | Weight | Line Height | Letter Spacing | Ishlatilishi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `46px` | 800 | 1.12 | `-0.035em` | Bosh sahifa asosiy sarlavhasi |
| **H1 Page Title** | `32px` | 700 | 1.20 | `-0.025em` | Sahifa sarlavhalari (Catalog, Cart, Orders) |
| **H2 Section** | `24px` | 700 | 1.25 | `-0.02em` | Bo'lim sarlavhalari |
| **H3 Card Header**| `18px` | 600 | 1.30 | `-0.01em` | Mahsulot kartasi va modal sarlavhalari |
| **Body Primary** | `15px` | 400/500 | 1.55 | `0` | Asosiy o'qiladigan matn |
| **Body Secondary**| `13.5px`| 400 | 1.50 | `0` | Tavsiflar, xarakteristika parametrlari |
| **Badge / Caption**| `12px` | 600 | 1.20 | `+0.04em` | Statuslar, til tanlagich, teglar |
| **Micro Tag** | `10.5px` | 700 | 1.10 | `+0.06em` | HOT, Discount pillari, kbd shortcut |

---

## 4. 🧩 Asosiy Komponentlar Arxitekturasi (Component Library)

### 1. Sticky Navigation Header (Navbar)
- **Glassmorphism:** `backdrop-filter: blur(20px)` va `1px border-bottom`.
- **Spotlight Search Trigger:** `Ctrl+K` yoki `⌘K` klaviatura qisqartmasi bilan qidiruv maydoni.
- **Dynamic Action Group:**
  - Qorong'i/Yorug' rejim almashinuvi (`Sun / Moon`).
  - Sevimlilar (`Heart` soni bilan).
  - Savat kapsulasi (`ShoppingBag` soni bilan).
  - Bildirishnomalar markazi (`Bell`).
- **User Profile Flyout & Language Switcher:**
  - Foydalanuvchi menyusi ichida ixcham `UZB` | `RU` | `ENG` til kapsulasi.
  - Mehmonlar uchun headerda nozik dropdown.

### 2. Luxury Hero Banner
- **Ambient Glow:** Rasm orqasida nozik neon aura (`radial-gradient`).
- **Pulsing Badge:** Apple uslubidagi yashil/ko'k yorug'lik indikatori (`● Apple-darajasidagi soddalik`).
- **Floating Glass Highlights:** Rasm ustida silliq suzuvchi 2 ta shaffof texnik ko'rsatkich kartasi.
- **Trust & Performance Metrics:** `🚚 Express Yetkazish` • `🛡️ 100% Original` • `⭐ 4.98 Reyting`.

### 3. Smart Catalog & Filter System
- **Facet Filters:** Kategoriya, Brend, Narx oralig'i (Dual Range Slider), Mavjudlik (In-Stock Only).
- **Active Filter Chips:** Tanlangan filtrlarni bir marta bosish orqali tozalash.
- **Sort Popover:** Eng sara (Featured), Narx: Arzonroq, Narx: Qimmatroq, Eng yuqori reyting.

### 4. Interactive Product Cards
- **Finish Selector:** Dinamik rang/variant doirachalari.
- **Discount & Stock Pill:** Chegirma foizi va cheklangan zaxira ko'rsatkichi.
- **Quick Actions:** Bitta bosishda savatga qo'shish va sevimlilarga saqlash.

### 5. Cart & One-Page Checkout
- **Free Shipping Progress Tracker:** Bepul yetkazib berishga qolgan summani ko'rsatuvchi animatsion bar.
- **Promo Code Box:** Kupon kiritish va real-vaqtda chegirma hisoblash.
- **Checkout Form:** Manzil boshqaruvi, to'lov usullari (Karta, Click/Payme, Naqd) va 256-bit SSL kafolati.

---

## 5. 🌐 Ko'p Tillilik Arxitekturasi (i18n Structure)

MiniShop to'liq xalqaro standartdagi 3 tilda ishlaydi:
1. 🇺🇿 **O'zbekcha (`uz`)** — Default
2. 🇷🇺 **Русский (`ru`)**
3. 🇬🇧 **English (`en`)**

- Tanlangan til `localStorage` orqali saqlanadi (`i18nextLng`).
- Sahifani qayta yuklamasdan barcha komponentlar bir zumda yangilanadi.

---

## 6. ✨ Animatsiyalar & Interaktiv Qoidalar (Motion Guidelines)

```css
/* Smooth Page Transitions */
.page-enter {
  animation: pageEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Interactive Card Elevation */
.card-hover-effect {
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.card-hover-effect:hover {
  transform: translateY(-3px);
  border-color: var(--border-focus);
  box-shadow: var(--shadow-elevated);
}
```

---

## 7. 📱 Moslashuvchanlik Qoidalari (Responsive Breakpoints)

| Breakpoint | Kenglik | Xulq-atvor |
| :--- | :--- | :--- |
| **Desktop Ultra** | `> 1280px` | 4 ustunli mahsulotlar to'ri, to'liq yon filtrlar paneli |
| **Desktop Standard**| `1024px - 1280px` | 3 ustunli to'r, to'liq navigatsiya |
| **Tablet** | `768px - 1023px` | 2 ustunli to'r, yig'iluvchi filtr oynasi |
| **Mobile** | `< 768px` | 1-2 ustunli ixcham kartalar, to'liq mobil Drawer menyu |

---

*MiniShop Design Specification — Production Ready.* 🚀
