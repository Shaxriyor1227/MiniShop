const Brand = require('../model/brandSchema');
const { invalidateBrandsCache } = require('../middleware/cache.middleware');

const formatBrand = (doc, lang = 'en') => {
  if (!doc) return null;
  const b = doc.toObject ? doc.toObject() : { ...doc };
  if (b.translations && b.translations[lang]?.name) {
    b.name = b.translations[lang].name;
  }
  return b;
};

const create = async (req, res) => {
  try {
    const { name, translations } = req.body;
    const existing = await Brand.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.sendResponse(400, 'BRAND_EXISTS');
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const brand = await Brand.create({ name, slug, translations: translations || {} });

    // Invalidate brands and products caches
    invalidateBrandsCache();

    return res.sendResponse(201, 'BRAND_CREATED', formatBrand(brand, req.lang));
  } catch (error) {
    console.error('[Brand Create Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 }).lean();
    const formatted = brands.map((b) => formatBrand(b, req.lang));
    return res.sendResponse(200, 'BRANDS_FETCHED', formatted);
  } catch (error) {
    console.error('[Brand GetAll Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const getById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).lean();
    if (!brand) {
      return res.sendResponse(404, 'BRAND_NOT_FOUND');
    }
    return res.sendResponse(200, 'SUCCESS', formatBrand(brand, req.lang));
  } catch (error) {
    console.error('[Brand GetById Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const update = async (req, res) => {
  try {
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.translations !== undefined) updateData.translations = req.body.translations;

    const brand = await Brand.findByIdAndUpdate(req.params.id, updateData, { new: true }).lean();
    if (!brand) {
      return res.sendResponse(404, 'BRAND_NOT_FOUND');
    }

    // Invalidate brands and products caches
    invalidateBrandsCache();

    return res.sendResponse(200, 'BRAND_UPDATED', formatBrand(brand, req.lang));
  } catch (error) {
    console.error('[Brand Update Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.sendResponse(404, 'BRAND_NOT_FOUND');
    }

    // Invalidate brands and products caches
    invalidateBrandsCache();

    return res.sendResponse(200, 'BRAND_DELETED', null);
  } catch (error) {
    console.error('[Brand Delete Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteBrand
};
