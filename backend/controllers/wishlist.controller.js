const Wishlist = require('../model/wishlistSchema');
const Product = require('../model/productSchema');

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user_id: req.user.id }).populate({
      path: 'products',
      populate: [{ path: 'category_id', select: 'name' }, { path: 'brand_id', select: 'name' }]
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user_id: req.user.id, products: [] });
    }

    return res.sendResponse(200, 'WISHLIST_FETCHED', wishlist);
  } catch (error) {
    console.error('[Wishlist GetWishlist Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const product = await Product.findById(product_id);
    if (!product) {
      return res.sendResponse(404, 'PRODUCT_NOT_FOUND');
    }

    let wishlist = await Wishlist.findOne({ user_id: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user_id: req.user.id, products: [] });
    }

    const index = wishlist.products.findIndex(
      (id) => (id?._id || id).toString() === product_id.toString()
    );

    let isAdded = false;
    if (index > -1) {
      wishlist.products.splice(index, 1);
      isAdded = false;
    } else {
      wishlist.products.push(product_id);
      isAdded = true;
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      populate: [{ path: 'category_id', select: 'name' }, { path: 'brand_id', select: 'name' }]
    });

    return res.sendResponse(200, 'WISHLIST_TOGGLED', {
      isAdded,
      wishlist: populatedWishlist
    });
  } catch (error) {
    console.error('[Wishlist ToggleWishlist Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user_id: req.user.id },
      { products: [] },
      { new: true }
    );

    return res.sendResponse(200, 'WISHLIST_FETCHED', wishlist);
  } catch (error) {
    console.error('[Wishlist ClearWishlist Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  clearWishlist
};
