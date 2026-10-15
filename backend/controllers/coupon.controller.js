const Coupon = require('../model/couponSchema');

const create = async (req, res) => {
  try {
    const { code, discount, is_active, expires_at } = req.body;
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.sendResponse(400, 'COUPON_NOT_FOUND', null, 'Coupon code already exists');
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      is_active: is_active !== undefined ? is_active : true,
      expires_at
    });

    return res.sendResponse(201, 'COUPON_CREATED', coupon);
  } catch (error) {
    console.error('[Coupon Create Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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

    return res.sendResponse(200, 'COUPONS_FETCHED', coupons, null, {
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
    });
  } catch (error) {
    console.error('[Coupon GetAll Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const getById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.sendResponse(404, 'COUPON_NOT_FOUND');
    }
    return res.sendResponse(200, 'SUCCESS', coupon);
  } catch (error) {
    console.error('[Coupon GetById Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const update = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.code) updates.code = updates.code.toUpperCase();

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!coupon) {
      return res.sendResponse(404, 'COUPON_NOT_FOUND');
    }

    return res.sendResponse(200, 'COUPON_UPDATED', coupon);
  } catch (error) {
    console.error('[Coupon Update Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.sendResponse(404, 'COUPON_NOT_FOUND');
    }

    return res.sendResponse(200, 'COUPON_DELETED', null);
  } catch (error) {
    console.error('[Coupon Delete Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: (code || '').toUpperCase(),
      is_active: true,
      expires_at: { $gt: new Date() }
    });

    if (!coupon) {
      return res.sendResponse(400, 'COUPON_NOT_FOUND');
    }

    return res.sendResponse(200, 'COUPON_APPLIED', coupon);
  } catch (error) {
    console.error('[Coupon Apply Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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
