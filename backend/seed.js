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
const Review = require('./model/reviewSchema');

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
    await Review.deleteMany({});
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

    const { productTranslationsMap, categoryTranslationsMap, brandTranslationsMap } = require('./scripts/migrateTranslations');

    // 2. Create Categories
    const categoriesData = [
      { name: 'Audio', slug: 'audio' },
      { name: 'Wearables', slug: 'wearables' },
      { name: 'Workspace', slug: 'workspace' },
      { name: 'Accessories', slug: 'accessories' },
      { name: 'Smart Home', slug: 'smart-home' },
      { name: 'Laptops & PCs', slug: 'laptops-pcs' }
    ].map((c) => ({ ...c, translations: categoryTranslationsMap[c.name] || {} }));

    const categories = await Category.insertMany(categoriesData);

    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c._id; });

    // 3. Create Brands
    const brandsData = [
      { name: 'Apple', slug: 'apple' },
      { name: 'Sony', slug: 'sony' },
      { name: 'Keychron', slug: 'keychron' },
      { name: 'Anker', slug: 'anker' },
      { name: 'Minimal', slug: 'minimal' },
      { name: 'Logitech', slug: 'logitech' },
      { name: 'Dell', slug: 'dell' },
      { name: 'Samsung', slug: 'samsung' },
      { name: 'Bose', slug: 'bose' }
    ].map((b) => ({ ...b, translations: brandTranslationsMap[b.name] || {} }));

    const brands = await Brand.insertMany(brandsData);

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

    // 5. Create Featured Products with Generated Studio Asset Paths
    const productsData = [
      // --- AUDIO ---
      {
        name: 'Studio Wireless Pro Headphones',
        price: 349.99,
        stock: 35,
        category_id: catMap['Audio'],
        brand_id: brandMap['Sony'],
        images: ['/images/product_wireless_headphones.png']
      },
      {
        name: 'QuietComfort Ultra ANC Headphones',
        price: 379.00,
        stock: 25,
        category_id: catMap['Audio'],
        brand_id: brandMap['Bose'],
        images: ['/images/product_silver_headphones.jpg']
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
        name: 'Studio Acoustic Hi-Fi Smart Speaker',
        price: 299.00,
        stock: 30,
        category_id: catMap['Audio'],
        brand_id: brandMap['Apple'],
        images: ['/images/product_smart_speaker.jpg']
      },

      // --- WEARABLES ---
      {
        name: 'Minimal OLED Smartwatch Series X',
        price: 399.00,
        stock: 20,
        category_id: catMap['Wearables'],
        brand_id: brandMap['Apple'],
        images: ['/images/product_smart_watch.png']
      },
      {
        name: 'Galaxy Watch Ultra Titanium Edition',
        price: 449.00,
        stock: 15,
        category_id: catMap['Wearables'],
        brand_id: brandMap['Samsung'],
        images: ['/images/product_titanium_watch.jpg']
      },
      {
        name: 'Chronos Stealth Carbon Smartwatch',
        price: 420.00,
        stock: 18,
        category_id: catMap['Wearables'],
        brand_id: brandMap['Minimal'],
        images: ['/images/stitch/smart_watch.png']
      },

      // --- WORKSPACE ---
      {
        name: 'Ultra-Slim Mechanical Keyboard',
        price: 159.50,
        stock: 50,
        category_id: catMap['Workspace'],
        brand_id: brandMap['Keychron'],
        images: ['/images/product_mechanical_keyboard.png']
      },
      {
        name: 'Custom Linear Aer 75 Keyboard',
        price: 179.00,
        stock: 32,
        category_id: catMap['Workspace'],
        brand_id: brandMap['Keychron'],
        images: ['/images/stitch/mechanical_kb.png']
      },
      {
        name: 'Precision Wireless Ergo Mouse',
        price: 99.00,
        stock: 40,
        category_id: catMap['Workspace'],
        brand_id: brandMap['Logitech'],
        images: ['/images/stitch/tangent_mouse.png']
      },
      {
        name: 'Form Studio Solid Walnut Tray',
        price: 85.00,
        stock: 55,
        category_id: catMap['Workspace'],
        brand_id: brandMap['Minimal'],
        images: ['/images/stitch/walnut_tray.png']
      },
      {
        name: 'Aluminum 9-in-1 Dual Display Dock',
        price: 119.00,
        stock: 45,
        category_id: catMap['Workspace'],
        brand_id: brandMap['Minimal'],
        images: ['/images/product_usb_dock.jpg']
      },

      // --- LAPTOPS & PCS ---
      {
        name: 'MacBook Pro M3 Max Studio Laptop',
        price: 1999.00,
        stock: 12,
        category_id: catMap['Laptops & PCs'],
        brand_id: brandMap['Apple'],
        images: ['/images/product_macbook_pro.jpg']
      },
      {
        name: 'Dell XPS 16 OLED Developer Edition',
        price: 1749.00,
        stock: 14,
        category_id: catMap['Laptops & PCs'],
        brand_id: brandMap['Dell'],
        images: ['/images/product_dell_xps.jpg']
      },

      // --- ACCESSORIES ---
      {
        name: 'Urban Commuter Waterproof Backpack',
        price: 129.00,
        stock: 60,
        category_id: catMap['Accessories'],
        brand_id: brandMap['Minimal'],
        images: ['/images/product_minimalist_backpack.png']
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
        name: 'Compact 65W GaN Fast Wall Charger',
        price: 39.99,
        stock: 80,
        category_id: catMap['Accessories'],
        brand_id: brandMap['Anker'],
        images: ['/images/product_gan_charger.jpg']
      },
      {
        name: 'Linear Stand 3 MagSafe Wireless Charger',
        price: 129.00,
        stock: 42,
        category_id: catMap['Accessories'],
        brand_id: brandMap['Anker'],
        images: ['/images/stitch/mag_stand.png']
      },

      // --- SMART HOME ---
      {
        name: 'Smart Aluminum Ambient Desk Lamp',
        price: 89.99,
        stock: 40,
        category_id: catMap['Smart Home'],
        brand_id: brandMap['Minimal'],
        images: ['/images/product_smart_desk_lamp.png']
      },
      {
        name: 'Ultra-Slim ScreenBar Ambient Monitor Light',
        price: 109.00,
        stock: 35,
        category_id: catMap['Smart Home'],
        brand_id: brandMap['Minimal'],
        images: ['/images/product_smart_screenbar.jpg']
      }
    ];

    const enrichedProducts = productsData.map((p) => ({
      ...p,
      images: (p.images || []).map((img) => img.replace(/\.(png|jpg|jpeg)$/i, '.webp')),
      description: productTranslationsMap[p.name]?.en?.description || '',
      translations: productTranslationsMap[p.name] || {}
    }));

    const createdProducts = await Product.insertMany(enrichedProducts);
    console.log(`[Seed] Successfully seeded ${createdProducts.length} products, ${categories.length} categories, ${brands.length} brands, 3 coupons, 2 users`);

    // 6. Seed Sample Reviews
    if (createdProducts.length > 0) {
      const sampleReviews = [
        {
          user_id: customer._id,
          product_id: createdProducts[0]._id, // Studio Wireless Pro
          rating: 5,
          comment: 'Best acoustic performance and noise isolation I have ever tested. Premium studio feel!'
        },
        {
          user_id: customer._id,
          product_id: createdProducts[4]._id, // Minimal OLED Smartwatch
          rating: 5,
          comment: 'Incredible OLED display contrast and battery life easily lasts through demanding days.'
        },
        {
          user_id: customer._id,
          product_id: createdProducts[7]._id, // Ultra-Slim Mechanical Keyboard
          rating: 5,
          comment: 'Tactile switch feedback is exceptional and the aluminum unibody build quality is immaculate.'
        },
        {
          user_id: customer._id,
          product_id: createdProducts[12]._id, // MacBook Pro M3
          rating: 5,
          comment: 'Pure engineering marvel. The display is mind-blowing and thermal performance is whisper-quiet.'
        }
      ];
      await Review.insertMany(sampleReviews);
      console.log(`[Seed] Successfully seeded ${sampleReviews.length} sample reviews`);
    }

    await mongoose.connection.close();
    console.log('[Seed] Database connection closed. Done!');
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
