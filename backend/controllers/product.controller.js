const mongoose = require('mongoose');
const Product = require('../model/productSchema');
const Category = require('../model/categorySchema');
const Brand = require('../model/brandSchema');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Format product according to request language
 */
const formatProduct = (doc, lang = 'en') => {
  if (!doc) return null;
  const p = doc.toObject ? doc.toObject() : { ...doc };

  if (p.translations && p.translations[lang]) {
    if (p.translations[lang].name) p.name = p.translations[lang].name;
    if (p.translations[lang].description) p.description = p.translations[lang].description;
  }

  if (p.category_id && typeof p.category_id === 'object') {
    if (p.category_id.translations && p.category_id.translations[lang]?.name) {
      p.category_id.name = p.category_id.translations[lang].name;
    }
  }

  if (p.brand_id && typeof p.brand_id === 'object') {
    if (p.brand_id.translations && p.brand_id.translations[lang]?.name) {
      p.brand_id.name = p.brand_id.translations[lang].name;
    }
  }

  return p;
};

const create = async (req, res) => {
  try {
    const { name, price, stock, category_id, brand_id, images, description, translations } = req.body;
    const product = await Product.create({
      name,
      description: description || '',
      translations: translations || {},
      price,
      stock: stock !== undefined ? Number(stock) : 0,
      category_id,
      brand_id,
      images: images || []
    });

    const populated = await Product.findById(product._id).populate('category_id').populate('brand_id');

    return res.sendResponse(201, 'PRODUCT_CREATED', formatProduct(populated, req.lang));
  } catch (error) {
    console.error('[Product Create Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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
            { name: new RegExp('^' + escapeRegex(String(cat).trim()) + '$', 'i') }
          ]
        }).lean();
      }

      if (catDoc) {
        filter.category_id = catDoc._id;
      } else {
        return res.sendResponse(200, 'PRODUCTS_FETCHED', (page || limit) ? { products: [], total: 0, page: 1, totalPages: 0 } : [], null, {
          total: 0,
          totalPages: 0,
          page: 1
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
            { name: new RegExp('^' + escapeRegex(String(br).trim()) + '$', 'i') }
          ]
        }).lean();
      }

      if (brandDoc) {
        filter.brand_id = brandDoc._id;
      } else {
        return res.sendResponse(200, 'PRODUCTS_FETCHED', (page || limit) ? { products: [], total: 0, page: 1, totalPages: 0 } : [], null, {
          total: 0,
          totalPages: 0,
          page: 1
        });
      }
    }

    if (search && search.trim()) {
      const s = search.trim();
      const sRegex = new RegExp(escapeRegex(s), 'i');
      filter.$or = [
        { name: sRegex },
        { description: sRegex },
        { 'translations.uz.name': sRegex },
        { 'translations.ru.name': sRegex },
        { 'translations.en.name': sRegex },
        { 'translations.uz.description': sRegex },
        { 'translations.ru.description': sRegex },
        { 'translations.en.description': sRegex }
      ];
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
      .populate('category_id')
      .populate('brand_id')
      .sort(sortOption);

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    const products = await query;
    const formattedProducts = products.map((p) => formatProduct(p, req.lang));
    const limitNum = limit ? parseInt(limit, 10) : total;
    const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

    return res.sendResponse(200, 'PRODUCTS_FETCHED', formattedProducts, null, {
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
    });
  } catch (error) {
    console.error('[Product GetAll Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category_id')
      .populate('brand_id');

    if (!product) {
      return res.sendResponse(404, 'PRODUCT_NOT_FOUND');
    }

    return res.sendResponse(200, 'PRODUCT_FETCHED', formatProduct(product, req.lang));
  } catch (error) {
    console.error('[Product GetById Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('category_id')
      .populate('brand_id');

    if (!product) {
      return res.sendResponse(404, 'PRODUCT_NOT_FOUND');
    }

    return res.sendResponse(200, 'PRODUCT_UPDATED', formatProduct(product, req.lang));
  } catch (error) {
    console.error('[Product Update Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.sendResponse(404, 'PRODUCT_NOT_FOUND');
    }

    return res.sendResponse(200, 'PRODUCT_DELETED', null);
  } catch (error) {
    console.error('[Product Delete Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.sendResponse(200, 'SEARCH_QUERY_EMPTY', []);
    }

    const sRegex = new RegExp(escapeRegex(q.trim()), 'i');
    const products = await Product.find({
      $or: [
        { name: sRegex },
        { description: sRegex },
        { 'translations.uz.name': sRegex },
        { 'translations.ru.name': sRegex },
        { 'translations.en.name': sRegex },
        { 'translations.uz.description': sRegex },
        { 'translations.ru.description': sRegex },
        { 'translations.en.description': sRegex }
      ]
    })
      .populate('category_id')
      .populate('brand_id')
      .limit(20);

    const formattedProducts = products.map((p) => formatProduct(p, req.lang));

    return res.sendResponse(200, 'SEARCH_SUCCESS', formattedProducts);
  } catch (error) {
    console.error('[Product Search Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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
