const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const Cart = require('../model/cartSchema');
const Wishlist = require('../model/wishlistSchema');

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET muhit o\'zgaruvchisi o\'rnatilmagan');
  }
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Register new user
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phone_number } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ushbu email bilan foydalanuvchi allaqachon ro\'yxatdan o\'tgan',
        innerData: null
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Register is exclusively for customers. Admins can only be created via admin user create endpoint.
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'customer',
      phone_number: phone_number || '',
      isBlocked: false
    });

    // Initialize user's Cart and Wishlist
    await Cart.create({ user_id: newUser._id, items: [] });
    await Wishlist.create({ user_id: newUser._id, products: [] });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Muvaffaqiyatli ro\'yxatdan o\'tildi',
      innerData: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone_number: newUser.phone_number
        }
      }
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Serverda xatolik yuz berdi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Login existing user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email yoki parol noto\'g\'ri',
        innerData: null
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Profilingiz administrator tomonidan bloklangan. Qo\'llab-quvvatlash bilan bog\'laning.',
        innerData: null
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Email yoki parol noto\'g\'ri',
        innerData: null
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Tizimga muvaffaqiyatli kirildi',
      innerData: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone_number: user.phone_number
        }
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Serverda xatolik yuz berdi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Get current user profile
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Foydalanuvchi ma\'lumotlari olindi',
      innerData: user
    });
  } catch (error) {
    console.error('[Auth GetMe Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Serverda xatolik yuz berdi: ' + error.message,
      innerData: null
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
