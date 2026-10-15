const Category = require('../model/categorySchema');
const { invalidateCategoriesCache } = require('../middleware/cache.middleware');

const formatCategory = (doc, lang = 'en') => {
  if (!doc) return null;
  const c = doc.toObject ? doc.toObject() : { ...doc };
  if (c.translations && c.translations[lang]?.name) {
    c.name = c.translations[lang].name;
  }
  return c;
};

const create = async (req, res) => {
  try {
    const { name, translations } = req.body;
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.sendResponse(400, 'CATEGORY_EXISTS');
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await Category.create({ name, slug, translations: translations || {} });

    // Invalidate categories and products caches
    invalidateCategoriesCache();

    return res.sendResponse(201, 'CATEGORY_CREATED', formatCategory(category, req.lang));
  } catch (error) {
    console.error('[Category Create Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    const formatted = categories.map((c) => formatCategory(c, req.lang));
    return res.sendResponse(200, 'CATEGORIES_FETCHED', formatted);
  } catch (error) {
    console.error('[Category GetAll Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) {
      return res.sendResponse(404, 'CATEGORY_NOT_FOUND');
    }
    return res.sendResponse(200, 'SUCCESS', formatCategory(category, req.lang));
  } catch (error) {
    console.error('[Category GetById Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const update = async (req, res) => {
  try {
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.translations !== undefined) updateData.translations = req.body.translations;

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true }).lean();
    if (!category) {
      return res.sendResponse(404, 'CATEGORY_NOT_FOUND');
    }

    // Invalidate categories and products caches
    invalidateCategoriesCache();

    return res.sendResponse(200, 'CATEGORY_UPDATED', formatCategory(category, req.lang));
  } catch (error) {
    console.error('[Category Update Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.sendResponse(404, 'CATEGORY_NOT_FOUND');
    }

    // Invalidate categories and products caches
    invalidateCategoriesCache();

    return res.sendResponse(200, 'CATEGORY_DELETED', null);
  } catch (error) {
    console.error('[Category Delete Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteCategory
};
