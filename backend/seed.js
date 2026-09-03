require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./model/userSchema');
const Category = require('./model/categorySchema');
const Brand = require('./model/brandSchema');
const Product = require('./model/productSchema');
const Coupon = require('./model/couponSchema');
const Cart = require('./model/cartSchema');
const Wishlist = require('./model/wishlistSchema');
const Address = require('./model/addressSchema');
const Notification = require('./model/notificationSchema');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/minishop_db');
    console.log('[Seed] Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await Address.deleteMany({});
    await Notification.deleteMany({});
    console.log('[Seed] Existing collections cleared');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const customerPassword = await bcrypt.hash('customer123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@minishop.com',
      password: adminPassword,
      role: 'admin',
      phone_number: '+1 (555) 123-4567'
    });

    const customer = await User.create({
      name: 'Alex Johnson',
      email: 'customer@minishop.com',
      password: customerPassword,
      role: 'customer',
      phone_number: '+1 (555) 987-6543'
    });

    // Create Cart & Wishlist for customer
    await Cart.create({ user_id: customer._id, items: [] });
    await Wishlist.create({ user_id: customer._id, products: [] });

    // Create Default Address
    await Address.create({
      user_id: customer._id,
      city: 'San Francisco, CA',
      street: '100 California St, Suite 400',
      is_default: true
    });

    // Create Initial Notification
    await Notification.create({
      user_id: customer._id,
      message: 'Welcome to MiniShop! Enjoy 10% off your first order with coupon code WELCOME10.'
    });

    // 2. Create Categories
    const categories = await Category.insertMany([
      { name: 'Audio' },
      { name: 'Wearables' },
      { name: 'Workspace' },
      { name: 'Accessories' },
      { name: 'Smart Home' },
      { name: 'Laptops & PCs' }
    ]);

    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c._id; });

    // 3. Create Brands
    const brands = await Brand.insertMany([
      { name: 'Apple' },
      { name: 'Sony' },
      { name: 'Keychron' },
      { name: 'Anker' },
      { name: 'Minimal' },
      { name: 'Logitech' }
    ]);

    const brandMap = {};
    brands.forEach(b => { brandMap[b.name] = b._id; });

    // 4. Create Coupons
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        discount: 10,
        is_active: true,
        expires_at: new Date('2028-12-31')
      },
      {
        code: 'MINI20',
        discount: 20,
        is_active: true,
        expires_at: new Date('2028-12-31')
      },
      {
        code: 'VIP50',
        discount: 50,
        is_active: true,
        expires_at: new Date('2028-12-31')
      }
    ]);

    // 5. Create Featured Products with Generated Asset Paths
    const productsData = [
      {
        name: 'Studio Wireless Pro Headphones',
        price: 349.99,
        stock: 35,
        category_id: catMap['Audio'],
        brand_id: brandMap['Sony'],
        images: ['/images/product_wireless_headphones.png']
      },
      {
        name: 'Minimal OLED Smartwatch Series X',
        price: 399.00,
        stock: 20,
        category_id: catMap['Wearables'],
        brand_id: brandMap['Apple'],
        images: ['/images/product_smart_watch.png']
      },
      {
        name: 'Ultra-Slim Mechanical Keyboard',
        price: 159.50,
        stock: 50,
        category_id: catMap['Workspace'],
        brand_id: brandMap['Keychron'],
        images: ['/images/product_mechanical_keyboard.png']
      },
      {
        name: 'Noise-Cancelling Wireless Earbuds',
        price: 199.00,
        stock: 45,
        category_id: catMap['Audio'],
        brand_id: brandMap['Apple'],
        images: ['/images/product_wireless_earbuds.png']
      },
      {
        name: 'Urban Commuter Waterproof Backpack',
        price: 129.00,
        stock: 60,
        category_id: catMap['Accessories'],
        brand_id: brandMap['Minimal'],
        images: ['/images/product_minimalist_backpack.png']
      },
      {
        name: 'Smart Aluminum Ambient Desk Lamp',
        price: 89.99,
        stock: 40,
        category_id: catMap['Smart Home'],
        brand_id: brandMap['Minimal'],
        images: ['/images/product_smart_desk_lamp.png']
      },
      {
        name: 'MagSafe Minimalist Leather Wallet',
        price: 49.00,
        stock: 100,
        category_id: catMap['Accessories'],
        brand_id: brandMap['Apple'],
        images: ['/images/product_leather_wallet.png']
      },
      {
        name: 'Precision Wireless Ergo Mouse',
        price: 99.00,
        stock: 30,
        category_id: catMap['Workspace'],
        brand_id: brandMap['Logitech'],
        images: ['/images/product_placeholder.png']
      },
      {
        name: 'Compact 65W GaN Fast Charger',
        price: 39.99,
        stock: 80,
        category_id: catMap['Accessories'],
        brand_id: brandMap['Anker'],
        images: ['/images/product_placeholder.png']
      }
    ];

    await Product.insertMany(productsData);
    console.log('[Seed] Successfully seeded 9 products, 6 categories, 6 brands, 3 coupons, 2 users');

    await mongoose.connection.close();
    console.log('[Seed] Database connection closed. Done!');
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
