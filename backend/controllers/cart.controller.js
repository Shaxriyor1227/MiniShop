const Cart = require('../model/cartSchema');
const Product = require('../model/productSchema');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user.id }).populate({
      path: 'items.product_id',
      populate: [{ path: 'category_id', select: 'name' }, { path: 'brand_id', select: 'name' }]
    });

    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id, items: [] });
    }

    return res.status(200).json({
      success: true,
      message: 'Savatcha ma\'lumotlari olindi',
      innerData: cart
    });
  } catch (error) {
    console.error('[Cart GetCart Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi',
        innerData: null
      });
    }

    let cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product_id.toString() === product_id.toString()
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ product_id, quantity: Number(quantity) });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product_id',
      populate: [{ path: 'category_id', select: 'name' }, { path: 'brand_id', select: 'name' }]
    });

    return res.status(200).json({
      success: true,
      message: 'Mahsulot savatchaga qo\'shildi',
      innerData: populatedCart
    });
  } catch (error) {
    console.error('[Cart AddToCart Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    let cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Savatcha topilmadi',
        innerData: null
      });
    }

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product_id.toString() !== product_id.toString()
      );
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product_id.toString() === product_id.toString()
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = Number(quantity);
      } else {
        cart.items.push({ product_id, quantity: Number(quantity) });
      }
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product_id',
      populate: [{ path: 'category_id', select: 'name' }, { path: 'brand_id', select: 'name' }]
    });

    return res.status(200).json({
      success: true,
      message: 'Savatcha yangilandi',
      innerData: populatedCart
    });
  } catch (error) {
    console.error('[Cart UpdateCartItem Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Savatcha topilmadi',
        innerData: null
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product_id.toString() !== productId.toString()
    );
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product_id',
      populate: [{ path: 'category_id', select: 'name' }, { path: 'brand_id', select: 'name' }]
    });

    return res.status(200).json({
      success: true,
      message: 'Mahsulot savatchadan olib tashlandi',
      innerData: populatedCart
    });
  } catch (error) {
    console.error('[Cart RemoveFromCart Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOneAndUpdate(
      { user_id: req.user.id },
      { items: [] },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Savatcha tozalandi',
      innerData: cart
    });
  } catch (error) {
    console.error('[Cart ClearCart Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
