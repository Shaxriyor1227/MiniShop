const Brand = require('../model/brandSchema');

const create = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Brand.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ushbu brend allaqachon mavjud',
        innerData: null
      });
    }

    const brand = await Brand.create({ name });
    return res.status(201).json({
      success: true,
      message: 'Brend muvaffaqiyatli yaratildi',
      innerData: brand
    });
  } catch (error) {
    console.error('[Brand Create Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getAll = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    return res.status(200).json({
      success: true,
      message: 'Barcha brendlar olindi',
      innerData: brands
    });
  } catch (error) {
    console.error('[Brand GetAll Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brend topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Brend topildi',
      innerData: brand
    });
  } catch (error) {
    console.error('[Brand GetById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const update = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brend topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Brend yangilandi',
      innerData: brand
    });
  } catch (error) {
    console.error('[Brand Update Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brend topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Brend o\'chirildi',
      innerData: null
    });
  } catch (error) {
    console.error('[Brand Delete Error]:', error);
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
  deleteBrand
};
