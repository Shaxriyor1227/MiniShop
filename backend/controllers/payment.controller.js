const Payment = require('../model/paymentSchema');
const Order = require('../model/orderSchema');

const create = async (req, res) => {
  try {
    const { order_id, amount, method, status } = req.body;
    const existing = await Payment.findOne({ order_id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ushbu buyurtma uchun to\'lov allaqachon mavjud',
        innerData: null
      });
    }

    const payment = await Payment.create({
      order_id,
      amount,
      method,
      status: status || 'pending'
    });

    return res.status(201).json({
      success: true,
      message: 'To\'lov yozuvi yaratildi',
      innerData: payment
    });
  } catch (error) {
    console.error('[Payment Create Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { page, limit, status, method } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (method && method !== 'all') filter.method = method;

    const total = await Payment.countDocuments(filter);

    let query = Payment.find(filter)
      .populate({
        path: 'order_id',
        populate: { path: 'user_id', select: 'name email phone_number' }
      })
      .sort({ createdAt: -1 });

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    const payments = await query;
    const limitNum = limit ? parseInt(limit, 10) : total;
    const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

    return res.status(200).json({
      success: true,
      message: 'Barcha to\'lovlar olindi',
      innerData: payments,
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
    });
  } catch (error) {
    console.error('[Payment GetAll Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate({
      path: 'order_id',
      populate: { path: 'user_id', select: 'name email phone_number' }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'To\'lov topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'To\'lov topildi',
      innerData: payment
    });
  } catch (error) {
    console.error('[Payment GetById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'To\'lov topilmadi',
        innerData: null
      });
    }

    if (status === 'completed') {
      await Order.findByIdAndUpdate(payment.order_id, { status: 'paid' });
    }

    return res.status(200).json({
      success: true,
      message: 'To\'lov holati yangilandi',
      innerData: payment
    });
  } catch (error) {
    console.error('[Payment UpdateStatus Error]:', error);
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
  updateStatus
};
