# 🛍️ MiniShop — Modern Full-Stack E-Commerce Platform

MiniShop — bu zamonaviy dizayn, tezkor ishlash va to'liq e-tijorat funksiyalariga ega bo'lgan Full-Stack (MERN) veb-platforma. Loyihada foydalanuvchilar mahsulotlarni qidirish, filtrlash, savatchaga va istaklar ro'yxatiga qo'shish, buyurtma berish, sharhlar qoldirish va profillarini boshqarishlari mumkin. Shuningdek, to'liq Swagger API hujjatlari bilan ta'minlangan.

---

## ✨ Asosiy Xususiyatlar (Features)

- **🎨 Zamonaviy va Premium UI/UX:** Glassmorphism, yumshoq animatsiyalar, to'liq responsive dizayn (mobil, planshet, desktop).
- **🔐 Autentifikatsiya va Xavfsizlik:** JWT tokenlar, parollarni `bcryptjs` bilan xeshlash, ro'yxatdan o'tish, kirish va profil boshqaruvi.
- **⚡ Spotlight Search (Ctrl + K):** Tezkor qidiruv va kategoriyalar bo'yicha navigatsiya.
- **📦 Mahsulotlar Katalogi va Filtrlash:** Narx, brend, kategoriya, reyting bo'yicha real-vaqtda saralash va filtrlash.
- **🛒 Savat va Istaklar ro'yxati (Wishlist):** LocalStorage va backend sinxronizatsiyasi bilan to'liq boshqaruv.
- **🏷️ Kupon va Chegirmalar:** Promokodlarni tekshirish va chegirmalarni hisoblash.
- **💳 Buyurtma va To'lov Tizimi:** Yetkazib berish manzillari, to'lov usullari (Karta, Naqd, Click/Payme simulyatsiyasi) va buyurtma holatini kuzatish.
- **⭐ Sharhlar va Reytinglar:** Mahsulotlarga baho berish va foydalanuvchi fikr-mulohazalari.
- **🔔 Bildirishnomalar Tizimi:** Foydalanuvchi hisobi bo'yicha bildirishnomalar va yangiliklar.
- **📖 To'liq Swagger API:** Barcha backend endpointlar uchun interaktiv Swagger UI hujjati.

---

## 🛠️ Texnologiyalar Steki (Tech Stack)

### **Frontend**
- **React 18** + **Vite 6**
- **React Router DOM v7** (SPA routing)
- **Lucide React** (Zamonaviy vektor ikonkalari)
- **Axios** (Interceptors bilan API so'rovlari)
- **Vanilla CSS** (Dizayn tizimi, CSS o'zgaruvchilari, glassmorphism)

### **Backend**
- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose 8**
- **JWT (JSON Web Tokens)** & **Bcryptjs**
- **Joi Validation** (Barcha so'rovlar uchun qat'iy ma'lumotlar tekshiruvi)
- **Swagger UI Express** + **Swagger-jsdoc** (Avtomatlashtirilgan API dokumentatsiyasi)
- **Cors** & **Dotenv**

---

## 📁 Loyiha Strukturasi (Project Structure)

```text
MiniShop/
├── backend/
│   ├── config/             # DB va Swagger konfiguratsiyalari
│   ├── controllers/        # REST API controllerlari (Auth, Product, Cart, Order, ...)
│   ├── middleware/         # Auth va Joi validatsiya middleware'lari
│   ├── model/              # Mongoose sxemalari va modellari
│   ├── routes/             # Express API yo'nalishlari
│   ├── validation/         # Joi validatsiya sxemalari
│   ├── seed.js             # Boshlang'ich test ma'lumotlarini yuklash skripti
│   ├── index.js            # Server asosiy kirish nuqtasi
│   ├── .env.example        # Backend muhit o'zgaruvchilari namunasi
│   └── package.json
│
├── frontend/
│   ├── public/             # Statik fayllar va rasmlar
│   ├── src/
│   │   ├── api/            # Axios API mijozi
│   │   ├── components/     # UI komponentlari (Navbar, Hero, ProductCard, Search, ...)
│   │   ├── context/        # React Context (Auth, Cart, Wishlist)
│   │   ├── pages/          # Sahifalar (Home, Catalog, ProductDetail, Cart, Checkout, Profile, ...)
│   │   ├── App.jsx         # Asosiy router va sahifalar marshruti
│   │   ├── index.css       # Global stillar va ranglar palitrasi
│   │   └── main.jsx        # React kirish nuqtasi
│   ├── .env.example        # Frontend muhit o'zgaruvchilari namunasi
│   └── package.json
│
├── .gitignore              # Git tomonidan e'tiborsiz qoldiriladigan fayllar
├── package.json            # Root workspace package.json (Concurrently orqali boshqarish)
└── README.md               # Loyiha hujjati
```

---

## 🚀 O'rnatish va Ishga Tushirish (Getting Started)

### 1. Repozitoriyani klonlash:
```bash
git clone <SPOY_GITHUB_REPO_URL>
cd MiniShop
```

### 2. Barcha bog'liqliklarni o'rnatish (Root, Backend, Frontend):
```bash
npm run install:all
```
*(yoki alohida `cd backend && npm install`, `cd ../frontend && npm install`)*

### 3. Muhit o'zgaruvchilarini sozlash:

**Backend (`backend/.env`):**
```env
PORT=8000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/minishop_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:8000
```

### 4. Boshlang'ich ma'lumotlarni bazaga yuklash (Seed Database):
```bash
npm run seed
```

### 5. Loyihani ishga tushirish (Frontend va Backend birgalikda):
```bash
npm run dev
```

Platforma manzillari:
- 🌐 **Frontend:** [http://localhost:5173](http://localhost:5173)
- 🔌 **Backend API:** [http://localhost:8000](http://localhost:8000)
- 📚 **Swagger API Docs:** [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

---

## 📚 API Endpointlar (Swagger orqali ham mavjud)

| Bo'lim | Metod | Endpoint | Tavsif |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Yangi foydalanuvchi ro'yxatdan o'tkazish |
| **Auth** | `POST` | `/api/auth/login` | Tizimga kirish (JWT token olish) |
| **Products** | `GET` | `/api/products` | Mahsulotlar ro'yxatini olish (Filtrlash, Qidiruv, Sahifalash) |
| **Products** | `GET` | `/api/products/:id` | Bitta mahsulot tafsilotlarini olish |
| **Categories** | `GET` | `/api/categories` | Kategoriyalar ro'yxati |
| **Cart** | `GET` / `POST` | `/api/cart` | Savatchani ko'rish va mahsulot qo'shish |
| **Wishlist** | `GET` / `POST` | `/api/wishlist` | Istaklar ro'yxatini boshqarish |
| **Orders** | `GET` / `POST` | `/api/orders` | Buyurtmalar tarixi va yangi buyurtma yaratish |
| **Reviews** | `GET` / `POST` | `/api/reviews` | Sharhlarni ko'rish va yangi sharh qoldirish |
| **Coupons** | `POST` | `/api/coupons/validate` | Chegirma promokodini tekshirish |

---

## 📝 Muallif va Litsenziya

Loyiha ochiq manbali va o'rganish yoki tijoriy loyihalarda foydalanish uchun qulay qilib tuzilgan.
MIT License © 2026 MiniShop Team.
