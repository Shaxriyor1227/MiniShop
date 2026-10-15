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
    const { page, limit, search, is_active } = req.query;

    const filter = {};
    if (search && search.trim()) {
      filter.code = { $regex: search.trim().toUpperCase(), $options: 'i' };
    }
    if (is_active !== undefined && is_active !== '') {
      filter.is_active = is_active === 'true' || is_active === true;
    }

    const total = await Coupon.countDocuments(filter);

    let query = Coupon.find(filter).sort({ createdAt: -1 });

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    const coupons = await query;
    const limitNum = limit ? parseInt(limit, 10) : total;
    const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

    return res.status(200).json({
      success: true,
      message: 'Barcha kuponlar olindi',
      innerData: coupons,
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
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
