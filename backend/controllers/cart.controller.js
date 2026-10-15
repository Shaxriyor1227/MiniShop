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

    return res.sendResponse(200, 'CART_FETCHED', cart);
  } catch (error) {
    console.error('[Cart GetCart Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const product = await Product.findById(product_id);
    if (!product) {
      return res.sendResponse(404, 'PRODUCT_NOT_FOUND');
    }

    let cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id, items: [] });
    }

    const getPid = (it) => (it.product_id?._id || it.product_id || '').toString();

    const itemIndex = cart.items.findIndex(
      (item) => getPid(item) === product_id.toString()
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

    return res.sendResponse(200, 'CART_ITEM_ADDED', populatedCart);
  } catch (error) {
    console.error('[Cart AddToCart Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    let cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      return res.sendResponse(404, 'CART_EMPTY');
    }

    const getPid = (it) => (it.product_id?._id || it.product_id || '').toString();

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter(
        (item) => getPid(item) !== product_id.toString()
      );
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => getPid(item) === product_id.toString()
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

    return res.sendResponse(200, 'CART_ITEM_UPDATED', populatedCart);
  } catch (error) {
    console.error('[Cart UpdateCartItem Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user_id: req.user.id });
    if (!cart) {
      return res.sendResponse(404, 'CART_EMPTY');
    }

    const getPid = (it) => (it.product_id?._id || it.product_id || '').toString();

    cart.items = cart.items.filter(
      (item) => getPid(item) !== productId.toString()
    );
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product_id',
      populate: [{ path: 'category_id', select: 'name' }, { path: 'brand_id', select: 'name' }]
    });

    return res.sendResponse(200, 'CART_ITEM_REMOVED', populatedCart);
  } catch (error) {
    console.error('[Cart RemoveFromCart Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOneAndUpdate(
      { user_id: req.user.id },
      { items: [] },
      { new: true }
    );

    return res.sendResponse(200, 'CART_CLEARED', cart);
  } catch (error) {
    console.error('[Cart ClearCart Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
