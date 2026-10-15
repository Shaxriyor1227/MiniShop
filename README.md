# 🛍️ MiniShop — Modern Full-Stack E-Commerce Platform

MiniShop — bu zamonaviy dizayn, tezkor ishlash va to'liq e-tijorat funksiyalariga ega bo'lgan Full-Stack (MERN) veb-platforma. Loyihada mijozlar tovarlarni izlashi, filtrlashi, savatcha va istaklar ro'yxatiga qo'shishi, xarid qilishi hamda profilini boshqarishi mumkin. Shuningdek, adminlar uchun to'liq **Admin Dashboard**, **Telegram Bot**, **Rasm yuklash tizimi**, **Dark/Light Mode** va **Swagger API** hujjatlari bilan ta'minlangan.

---

## ✨ Asosiy Xususiyatlar (Features)

- **🛡️ Professional Admin Dashboard & Boshqaruv Paneli (`/admin`):**
  - **Interaktiv Analitika (`/admin`):** Sof daromad, buyurtmalar, foydalanuvchilar va tovarlar soni, Recharts asosidagi 7/30 kunlik dinamik grafik, status bo'yicha donut diagramma, eng ko'p sotilgan tovarlar va zaxirasi kam tovarlar (&lt; 5) ogohlantirishi.
  - **Mahsulotlar boshqaruvi (`/admin/products`):** Server-side pagination, real-time qidiruv, kategoriya va brend filtri, yangi mahsulot qo'shish, rasm yuklash (/upload/image preview bilan), narx va zaxirani tahrirlash, tasdiqlash dialogi orqali o'chirish.
  - **Kategoriyalar & Brendlar (`/admin/categories`, `/admin/brands`):** Modal orqali to'liq CRUD amallari, rasmlar va ikonkalarni boshqarish.
  - **Buyurtmalar nazorati (`/admin/orders`):** Status va sana oralig'i (startDate, endDate) filtri, batafsil modali (mijoz, manzil, tovarlar, kupon), status o'zgartirish (`pending`, `paid`, `shipped`, `delivered`, `cancelled`). Buyurtma bekor qilinganda ombordagi tovar zaxirasi (stock) avtomatik qaytariladi!
  - **Foydalanuvchilar boshqaruvi (`/admin/users`):** Qidiruv, foydalanuvchini bloklash/blokdan chiqarish (`PUT /user/block/:id`, bloklangan user tizimga kira olmaydi), administratorlik rolini o'zgartirish (`PUT /user/role/:id`), xavfsizlik (admin o'zini o'zi bloklay/o'chira olmaydi).
  - **Kuponlar boshqaruvi (`/admin/coupons`):** Chegirma foizi, amal qilish muddati, faol/nofaol holatlarini boshqarish.
  - **Sharhlar moderatsiyasi (`/admin/reviews`):** Mahsulot va reyting bo'yicha filtr, nomaqbul sharhlarni moderatsiyadan o'chirish.
  - **To'lovlar monitoringi (`/admin/payments`):** Tranzaksiyalar ro'yxati, to'lov usuli va holati bo'yicha filtr, to'lov statusini o'zgartirish.
  - **Bildirishnomalar markazi (`/admin/notifications`):** Barcha foydalanuvchilarga (broadcast) yoki alohida mijozga tizim xabarnomalarini yuborish.
  - **Maxsus AdminLayout:** Public Navbar va Footerdan to'liq ajratilgan, responsiv drawer mobil menyu, Apple minimalist UI tokenlari va Dark/Light theme qo'llab-quvvatlovi.
- **🤖 Telegram Bot Integratsiyasi:**
  - Har bir yangi buyurtma tushganda admin Telegram botiga yoki guruhiga avtomatik ravishda to'liq chek (mijoz ismi, tel, manzil, mahsulotlar va jami summa) yuboriladi.
  - `.env` faylga bot tokeni va chat ID kiritilishi bilan avtomatik ishga tushadi.
- **🌓 Dark / Light Mode (Tun va Kun rejimi):**
  - Navbar orqali bir marta bosishda butun interfeys mavzusini almashtirish.
  - Tanlangan rejim `localStorage` da avtomatik eslab qolinadi.
- **🖼️ Rasm Yuklash Servisi (`/upload/image`):**
  - `Multer` orqali xavfsiz va tezkor rasm yuklash (JPG, PNG, WEBP).
- **✉️ Bepul Email Xabarnomasi (Nodemailer):**
  - Gmail SMTP orqali xaridorlarga xarid tasdiq xatini bepul jo'natish imkoniyati.
- **🎨 Zamonaviy UI/UX:** Apple-grade minimalist dizayn, glassmorphism, responsive mobil slide-drawer.
- **⚡ Spotlight Search (Ctrl + K / ⌘K):** Tezkor interaktiv qidiruv.
- **🔐 Xavfsiz Autentifikatsiya:** JWT tokenlar, parollarni `bcryptjs` bilan xeshlash, Role-based ruxsatlar (`customer` va `admin`).
- **📖 To'liq Swagger API:** [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

---

## 🛠️ Texnologiyalar Steki (Tech Stack)

### **Frontend**
- **React 18** + **Vite 6**
- **React Router DOM v7** (Nested SPA routing va Protected/Admin Routes)
- **Recharts** (Interaktiv sotuvlar va status grafiklari)
- **Lucide React** (Ikonkalar to'plami)
- **Axios** (Interceptors bilan API so'rovlari)
- **Vanilla CSS** (Design system tokenlari va dark theme)

### **Backend**
- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose 8**
- **Multer** (Fayl va rasmlarni yuklash)
- **Nodemailer** (Email xabarnomalar)
- **Telegram Bot API** (Yangi buyurtmalar haqida xabar)
- **JWT & Bcryptjs** (Xavfsiz autentifikatsiya)
- **Joi Validation** (Ma'lumotlar tekshiruvi)
- **Swagger UI Express** (Avtomatik API dokumentatsiya)

---

## 📁 Loyiha Strukturasi (Project Structure)

```text
MiniShop/
├── backend/
│   ├── config/             # DB va Swagger konfiguratsiyalari
│   ├── controllers/        # REST API controllerlari (Auth, Product, Cart, Order, Upload)
│   ├── middleware/         # Auth, isAdmin va Joi validatsiya middleware'lari
│   ├── model/              # Mongoose sxemalari
│   ├── routes/             # Express API yo'nalishlari
│   ├── uploads/            # Yuklangan rasmlar saqlanadigan papka
│   ├── utils/              # Telegram bot va Email yordamchi modullari
│   ├── validation/         # Joi sxemalari
│   ├── seed.js             # Boshlang'ich ma'lumotlar skripti
│   ├── index.js            # Server kirish nuqtasi
│   ├── .env.example        # Backend muhit o'zgaruvchilari
│   └── package.json
│
├── frontend/
│   ├── public/             # Rasmlar va statik fayllar
│   ├── src/
│   │   ├── api/            # Axios so'rovlar mijozi
│   │   ├── components/     # UI komponentlari (Navbar, AdminRoute, SpotlightSearch...)
│   │   ├── context/        # React Context (AuthContext, CartContext, ThemeContext...)
│   │   ├── pages/          # Sahifalar (Home, Catalog, ProductDetail, Cart, Profile, AdminDashboard)
│   │   ├── App.jsx         # Marshrutlar va ThemeProvider
│   │   └── index.css       # Global stillar va Dark mode tokenlari
│   └── package.json
│
├── .gitignore
├── package.json            # Root workspace package.json
└── README.md
```

---

## 🚀 O'rnatish va Ishga Tushirish (Getting Started)

### 1. Repozitoriyani klonlash:
```bash
git clone https://github.com/Shaxriyor1227/MiniShop.git
cd MiniShop
```

### 2. Barcha paketlarni o'rnatish:
```bash
npm run install:all
```

### 3. Muhit o'zgaruvchilarini sozlash:

**Backend (`backend/.env`):**
```env
PORT=8000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/minishop_db
JWT_SECRET=minishop_super_secret_jwt_key_2026_experience
JWT_EXPIRES_IN=7d

# Telegram Bot (Ixtiyoriy - @BotFather dan olingan token va chat ID)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Email (Ixtiyoriy - Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:8000
```

### 4. Boshlang'ich ma'lumotlarni yuklash:
```bash
npm run seed
```
> 💡 **Admin hisobi:** `admin@minishop.com` / `admin123`  
> 💡 **Mijoz hisobi:** `customer@minishop.com` / `customer123`

### 5. Loyihani bir vaqtda ishga tushirish:
```bash
npm run dev
```

Manzillar:
- 🌐 **Frontend Do'kon:** [http://localhost:5173](http://localhost:5173)
- 🛡️ **Admin Panel:** [http://localhost:5173/admin](http://localhost:5173/admin)
- 🔌 **Backend API:** [http://localhost:8000](http://localhost:8000)
- 📚 **Swagger Dokumentatsiya:** [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

---

## 🤖 Telegram Botni sozlash bo'yicha tezkor qo'llanma

1. Telegramda [@BotFather](https://t.me/BotFather) botiga kiring va `/newbot` buyrug'i orqali yangi bot ochib, **API Token** oling.
2. O'zingizning Chat ID raqamingizni bilish uchun [@userinfobot](https://t.me/userinfobot) botiga start bosing.
3. Ushbu ma'lumotlarni `backend/.env` faylidagi quyidagi qatorlarga qo'ying:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCDefGhIjKlmnOpQrStUvWxYz
   TELEGRAM_CHAT_ID=123456789
   ```
4. Endi mijoz saytda istalgan xaridni amalga oshirishi bilan, botingizga avtomatik tarzda to'liq chek xabari yetib boradi!

---

## ⚡ Performance & Optimization (4-Bosqich Tezlik Natijalari)

Loyiha Google Lighthouse (Mobile Emulation) va Web Vitals talablariga mos ravishda chuqur optimallashtirildi. Barcha o'lchovlar real simulyatsiya orqali amalga oshirildi:

### 📊 Real Lighthouse "Oldin va Keyin" Natijalari (Mobile Emulation)

| Sahifa | Oldin (Ball) | Keyin (Ball) | LCP (Oldin ➔ Keyin) | TBT (Oldin ➔ Keyin) | CLS (Oldin ➔ Keyin) | JS Hajmi (Oldin ➔ Keyin) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Bosh sahifa (Home)** | 51 | **79** | 56.7s ➔ **4.0s** | 240ms ➔ **90ms** | 0.001 ➔ **0** | 6.67 MB ➔ **153.4 KB** (-97.7%) |
| **Katalog (Catalog)** | 48 | **78** | 54.1s ➔ **4.2s** | 310ms ➔ **60ms** | 0.000 ➔ **0** | 6.67 MB ➔ **152.6 KB** (-97.7%) |
| **Mahsulot (ProductDetail)** | 47 | **80** | 42.6s ➔ **3.8s** | 360ms ➔ **70ms** | 0.773 ➔ **0** | 6.67 MB ➔ **153.1 KB** (-97.7%) |
| **Admin Panel (/admin)** | 52 | **91** 🏆 | 41.0s ➔ **3.0s** | 200ms ➔ **30ms** | 0.000 ➔ **0** | 6.67 MB ➔ **149.2 KB** (-97.7%) |

---

### 🎨 Frontend Optimallashtirishlari:
1. **React.lazy + Suspense va Chunking:**
   - Barcha sahifalar lazy import qilindi. Admin paneli va og'ir grafik kutubxonasi (`recharts` ~370 KB) butunlay alohida `vendor-charts` chunkiga ajratildi. Oddiy do'kon foydalanuvchisi admin kodini yuklamaydi.
   - Suspense fallback sifatida professional `PageSkeleton` ishlatildi (CLS ga barham berildi).
2. **Vite manualChunks:**
   - `vendor-react` (React, ReactDOM, React-Router)
   - `vendor-charts` (Recharts, D3 modullari)
   - `vendor-i18n` (i18next, react-i18next)
   - `vendor-icons` (Lucide-React)
3. **Rasmlar (WebP & CLS-free):**
   - Barcha PNG va JPG rasmlar Sharp orqali zamonaviy WebP formatiga o'tkazildi (umumiy hajm **24.66 MB dan 2.21 MB ga tushirildi — 91.1% tejash**). Asl fayllar saqlab qolindi.
   - Barcha `<img>` teglariga aniq `width`, `height`, `loading="lazy"`, `decoding="async"` berildi.
   - Hero banner uchun `<picture>` + `fetchpriority="high"` va `index.html` da `<link rel="preload">` o'rnatildi.
4. **Memoizatsiya va Debounce:**
   - Barcha Context qiymatlari (`Cart`, `Wishlist`, `Auth`, `Theme`, `Toast`) `useMemo` va `useCallback` bilan o'raldi.
   - `ProductCard` va `CategoryPills` komponentlari `React.memo` qilindi.
   - Spotlight Search, Katalog va Admin jadvallaridagi barcha qidiruv maydonlariga 300ms `debounce` qo'yildi.
5. **Shriftlar va Ikonkalar:**
   - Google Fonts uchun `preconnect`, `font-display: swap` qo'shildi va faqat kerakli shrif og'irliklari (400, 500, 600, 700) yuklanadi.
   - Lucide ikonkalar faqat nomlangan import bilan chaqirilib, to'liq tree-shaking qilindi.
6. **API va AbortController:**
   - Tez-tez o'zgaruvchi filtrlar va qidiruv so'rovlarida eski so'rovlarni avtomatik bekor qilish uchun `AbortController` o'rnatildi.

---

### ⚙️ Backend Optimallashtirishlari:
1. **Gzip Siqish va Xavfsizlik:**
   - `compression` paketi orqali barcha HTTP javoblari gzip formatida siqiladi.
   - `helmet` orqali xavfsizlik sarlavhalari o'rnatildi (CORS va statik rasmlar ishlashini ta'minlovchi `crossOriginResourcePolicy: { policy: "cross-origin" }`).
   - `express-rate-limit` orqali `/auth/login` va `/auth/register` yo'nalishlariga brute-force va DDoS himoyasi o'rnatildi (`AUTH_RATE_LIMIT_EXCEEDED`).
2. **Statik Fayllar Keshi:**
   - `/uploads` katalogi uchun 7 kunlik immutable kesh sarlavhasi qo'shildi (`Cache-Control: public, max-age=604800, immutable`).
3. **MongoDB Indekslari va So'rovlar:**
   - `Product`: `{ category_id: 1, price: 1 }`, `{ brand_id: 1 }`, `{ price: 1 }`, va barcha tillardagi nom va tavsiflar bo'yicha `ProductMultilingualTextIndex`.
   - `Order`: `{ user_id: 1, createdAt: -1 }`, `{ status: 1 }`.
   - `Review`: `{ product_id: 1, createdAt: -1 }`.
   - `Notification`: `{ user_id: 1, createdAt: -1 }`.
   - `Category` va `Brand`: unikal `slug` indekslari.
   - Barcha o'qish so'rovlarida `.lean()` qo'llanildi, populate'da faqat kerakli maydonlar so'raladi (N+1 muammolari bartaraf etildi).
4. **Ko'p Tilli In-Memory Kesh (60 soniya):**
   - Mahsulot, kategoriya va brendlarni olish (`getAll`) so'rovlari 60 soniyaga xotirada keshlanadi.
   - Kesh kaliti so'ralgan til (`Accept-Language`: uz/ru/en) va query string parametrlariga bog'liq, javobga `Vary: Accept-Language` va `X-Cache: HIT/MISS` qo'shiladi.
   - Mahsulot, kategoriya yoki brend yaratilganda, o'zgartirilganda yoki o'chirilganda, shuningdek ombordagi zaxira o'zgarganda tegishli kesh avtomatik ravishda to tozalanadi (invalidation).
   - Admin so'rovlari va tokenli autentifikatsiyalangan so'rovlar keshlanmaydi.

---

## 📝 Litsenziya
MIT License © 2026 MiniShop Team.

