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
      return res.sendResponse(400, 'AUTH_USER_EXISTS');
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

    return res.sendResponse(201, 'AUTH_REGISTER_SUCCESS', {
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone_number: newUser.phone_number
      }
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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
      return res.sendResponse(400, 'AUTH_INVALID_CREDENTIALS');
    }

    if (user.isBlocked) {
      return res.sendResponse(403, 'FORBIDDEN_BLOCKED');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.sendResponse(400, 'AUTH_INVALID_CREDENTIALS');
    }

    const token = generateToken(user);

    return res.sendResponse(200, 'AUTH_LOGIN_SUCCESS', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone_number: user.phone_number
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

/**
 * Get current user profile
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.sendResponse(404, 'USER_NOT_FOUND');
    }

    return res.sendResponse(200, 'AUTH_PROFILE_SUCCESS', user);
  } catch (error) {
    console.error('[Auth GetMe Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

module.exports = {
  register,
  login,
  getMe
};

