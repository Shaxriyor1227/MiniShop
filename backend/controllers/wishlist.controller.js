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

    return res.status(200).json({
      success: true,
      message: 'Sevimlilar ro\'yxati olindi',
      innerData: wishlist
    });
  } catch (error) {
    console.error('[Wishlist GetWishlist Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi',
        innerData: null
      });
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

    return res.status(200).json({
      success: true,
      message: isAdded ? 'Mahsulot sevimlilarga qo\'shildi' : 'Mahsulot sevimlilardan olib tashlandi',
      innerData: {
        isAdded,
        wishlist: populatedWishlist
      }
    });
  } catch (error) {
    console.error('[Wishlist ToggleWishlist Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user_id: req.user.id },
      { products: [] },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Sevimlilar ro\'yxati tozalandi',
      innerData: wishlist
    });
  } catch (error) {
    console.error('[Wishlist ClearWishlist Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  clearWishlist
};
