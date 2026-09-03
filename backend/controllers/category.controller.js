const Category = require('../model/categorySchema');

const create = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ushbu kategoriya allaqachon mavjud',
        innerData: null
      });
    }

    const category = await Category.create({ name });
    return res.status(201).json({
      success: true,
      message: 'Kategoriya muvaffaqiyatli yaratildi',
      innerData: category
    });
  } catch (error) {
    console.error('[Category Create Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getAll = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json({
      success: true,
      message: 'Barcha kategoriyalar olindi',
      innerData: categories
    });
  } catch (error) {
    console.error('[Category GetAll Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategoriya topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Kategoriya topildi',
      innerData: category
    });
  } catch (error) {
    console.error('[Category GetById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const update = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategoriya topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Kategoriya yangilandi',
      innerData: category
    });
  } catch (error) {
    console.error('[Category Update Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategoriya topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Kategoriya o\'chirildi',
      innerData: null
    });
  } catch (error) {
    console.error('[Category Delete Error]:', error);
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
  deleteCategory
};
