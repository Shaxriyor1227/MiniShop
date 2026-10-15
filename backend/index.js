require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const setupSwagger = require('./config/swagger');

// Import routes
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const addressRoute = require('./routes/addressRoute');
const categoryRoute = require('./routes/categoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const reviewRoute = require('./routes/reviewRoute');
const cartRoute = require('./routes/cartRoute');
const wishlistRoute = require('./routes/wishlistRoute');
const orderRoute = require('./routes/orderRoute');
const paymentRoute = require('./routes/paymentRoute');
const couponRoute = require('./routes/couponRoute');
const notificationRoute = require('./routes/notificationRoute');
const uploadRoute = require('./routes/uploadRoute');
const adminRoute = require('./routes/adminRoute');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MiniShop API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/address', addressRoute);
app.use('/category', categoryRoute);
app.use('/brand', brandRoute);
app.use('/product', productRoute);
app.use('/review', reviewRoute);
app.use('/cart', cartRoute);
app.use('/wishlist', wishlistRoute);
app.use('/order', orderRoute);
app.use('/payment', paymentRoute);
app.use('/coupon', couponRoute);
app.use('/notification', notificationRoute);
app.use('/upload', uploadRoute);
app.use('/admin', adminRoute);

// Swagger Documentation
setupSwagger(app);

// Global 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Marshrut topilmadi (Route not found): ${req.method} ${req.originalUrl}`,
    innerData: null
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server ichki xatosi (Internal Server Error)',
    innerData: null
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[MiniShop Server] Running on http://localhost:${PORT}`);
  console.log(`[MiniShop Swagger] API Docs at http://localhost:${PORT}/api-docs`);
});
