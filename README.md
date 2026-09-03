# 🛍️ MiniShop — Modern Full-Stack E-Commerce Platform

MiniShop — bu zamonaviy dizayn, tezkor ishlash va to'liq e-tijorat funksiyalariga ega bo'lgan Full-Stack (MERN) veb-platforma. Loyihada mijozlar tovarlarni izlashi, filtrlashi, savatcha va istaklar ro'yxatiga qo'shishi, xarid qilishi hamda profilini boshqarishi mumkin. Shuningdek, adminlar uchun to'liq **Admin Dashboard**, **Telegram Bot**, **Rasm yuklash tizimi**, **Dark/Light Mode** va **Swagger API** hujjatlari bilan ta'minlangan.

---

## ✨ Asosiy Xususiyatlar (Features)

- **🛡️ Admin Dashboard & Boshqaruv Paneli (`/admin`):**
  - **Statistika:** Jami tushum, jami buyurtmalar, tovarlar soni va kam qolgan zaxiralar monitoringi.
  - **Tovarlar CRUD:** Yangi tovar qo'shish, narx va zaxirasini tahrirlash, o'chirish.
  - **Rasm yuklash:** Yangi tovar qo'shishda kompyuterdan rasm yuklash (Multer orqali).
  - **Buyurtmalar nazorati:** Buyurtma holatini darhol o'zgartirish (`pending` ➔ `paid` ➔ `shipped` ➔ `delivered` ➔ `cancelled`).
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
- **React Router DOM v7** (SPA routing va Protected Routes)
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

## 📝 Litsenziya
MIT License © 2026 MiniShop Team.
