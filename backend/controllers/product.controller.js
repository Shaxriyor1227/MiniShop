const mongoose = require('mongoose');
const Product = require('../model/productSchema');
const Category = require('../model/categorySchema');
const Brand = require('../model/brandSchema');

const create = async (req, res) => {
  try {
    const { name, price, stock, category_id, brand_id, images } = req.body;
    const product = await Product.create({
      name,
      price,
      stock: stock !== undefined ? Number(stock) : 0,
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
    const {
      category,
      category_id,
      brand,
      brand_id,
      search,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
      inStockOnly
    } = req.query;

    const filter = {};

    const cat = category_id || category;
    if (cat) {
      let catDoc = null;
      if (mongoose.Types.ObjectId.isValid(cat)) {
        catDoc = await Category.findById(cat).lean();
      }
      if (!catDoc) {
        catDoc = await Category.findOne({
          $or: [
            { slug: String(cat).toLowerCase().trim() },
            { name: new RegExp('^' + String(cat).trim() + '$', 'i') }
          ]
        }).lean();
      }

      if (catDoc) {
        filter.category_id = catDoc._id;
      } else {
        // Noto'g'ri yoki topilmagan kategoriya kelganda bo'sh natija qaytarish
        return res.status(200).json({
          success: true,
          message: 'Kategoriya topilmadi',
          innerData: (page || limit) ? { products: [], total: 0, page: 1, totalPages: 0 } : []
        });
      }
    }

    const br = brand_id || brand;
    if (br) {
      let brandDoc = null;
      if (mongoose.Types.ObjectId.isValid(br)) {
        brandDoc = await Brand.findById(br).lean();
      }
      if (!brandDoc) {
        brandDoc = await Brand.findOne({
          $or: [
            { slug: String(br).toLowerCase().trim() },
            { name: new RegExp('^' + String(br).trim() + '$', 'i') }
          ]
        }).lean();
      }

      if (brandDoc) {
        filter.brand_id = brandDoc._id;
      } else {
        // Noto'g'ri yoki topilmagan brend kelganda bo'sh natija qaytarish
        return res.status(200).json({
          success: true,
          message: 'Brend topilmadi',
          innerData: (page || limit) ? { products: [], total: 0, page: 1, totalPages: 0 } : []
        });
      }
    }

    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStockOnly === 'true' || inStockOnly === true) {
      filter.stock = { $gt: 0 };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };
    if (sort === 'name_desc') sortOption = { name: -1 };

    const total = await Product.countDocuments(filter);

    let query = Product.find(filter)
      .populate('category_id', 'name')
      .populate('brand_id', 'name')
      .sort(sortOption);

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    const products = await query;
    const limitNum = limit ? parseInt(limit, 10) : total;
    const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

    return res.status(200).json({
      success: true,
      message: 'Mahsulotlar olindi',
      innerData: products,
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
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
    const updateData = { ...req.body };
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
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
