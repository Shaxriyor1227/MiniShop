const Product = require('../model/productSchema');

const create = async (req, res) => {
  try {
    const { name, price, stock, category_id, brand_id, images } = req.body;
    const product = await Product.create({
      name,
      price,
      stock: stock || 0,
      category_id,
      brand_id,
      images: images || []
    });

    const populated = await Product.findById(product._id).populate('category_id').populate('brand_id');

    return res.status(201).json({
      success: true,
      message: 'Mahsulot muvaffaqiyatli yaratildi',
      innerData: populated
    });
  } catch (error) {
    console.error('[Product Create Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { category, brand, search, minPrice, maxPrice, sort } = req.query;
    const filter = {};

    if (category) filter.category_id = category;
    if (brand) filter.brand_id = brand;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };

    const products = await Product.find(filter)
      .populate('category_id', 'name')
      .populate('brand_id', 'name')
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      message: 'Mahsulotlar olindi',
      innerData: products
    });
  } catch (error) {
    console.error('[Product GetAll Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category_id', 'name')
      .populate('brand_id', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mahsulot topildi',
      innerData: product
    });
  } catch (error) {
    console.error('[Product GetById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('category_id', 'name')
      .populate('brand_id', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mahsulot yangilandi',
      innerData: product
    });
  } catch (error) {
    console.error('[Product Update Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mahsulot o\'chirildi',
      innerData: null
    });
  } catch (error) {
    console.error('[Product Delete Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({
        success: true,
        message: 'Qidiruv so\'rovi bo\'sh',
        innerData: []
      });
    }

    const products = await Product.find({
      name: { $regex: q, $options: 'i' }
    })
      .populate('category_id', 'name')
      .populate('brand_id', 'name')
      .limit(20);

    return res.status(200).json({
      success: true,
      message: 'Qidiruv natijalari',
      innerData: products
    });
  } catch (error) {
    console.error('[Product Search Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteProduct,
  search
};
