const Coupon = require('../model/couponSchema');

const create = async (req, res) => {
  try {
    const { code, discount, is_active, expires_at } = req.body;
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ushbu kupon kodi allaqachon mavjud',
        innerData: null
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      is_active: is_active !== undefined ? is_active : true,
      expires_at
    });

    return res.status(201).json({
      success: true,
      message: 'Kupon muvaffaqiyatli yaratildi',
      innerData: coupon
    });
  } catch (error) {
    console.error('[Coupon Create Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getAll = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Barcha kuponlar olindi',
      innerData: coupons
    });
  } catch (error) {
    console.error('[Coupon GetAll Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Kupon topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Kupon topildi',
      innerData: coupon
    });
  } catch (error) {
    console.error('[Coupon GetById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const update = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.code) updates.code = updates.code.toUpperCase();

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Kupon topilmadi',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Kupon yangilandi',
      innerData: coupon
    });
  } catch (error) {
    console.error('[Coupon Update Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Kupon topilmadi',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Kupon o\'chirildi',
      innerData: null
    });
  } catch (error) {
    console.error('[Coupon Delete Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      is_active: true,
      expires_at: { $gt: new Date() }
    });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'Kupon topilmadi, nofaol yoki muddati o\'tgan',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: `Kupon muvaffaqiyatli qo'llanildi: ${coupon.discount}% chegirma`,
      innerData: coupon
    });
  } catch (error) {
    console.error('[Coupon Apply Error]:', error);
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
  deleteCoupon,
  applyCoupon
};
