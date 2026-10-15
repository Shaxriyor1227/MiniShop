const Payment = require('../model/paymentSchema');
const Order = require('../model/orderSchema');

const create = async (req, res) => {
  try {
    const { order_id, amount, method, status } = req.body;
    const existing = await Payment.findOne({ order_id });
    if (existing) {
      return res.sendResponse(400, 'VALIDATION_ERROR', null, 'Payment for this order already exists');
    }

    const payment = await Payment.create({
      order_id,
      amount,
      method,
      status: status || 'pending'
    });

    return res.sendResponse(201, 'PAYMENT_SUCCESS', payment);
  } catch (error) {
    console.error('[Payment Create Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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

    return res.sendResponse(200, 'PAYMENTS_FETCHED', payments, null, {
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
    });
  } catch (error) {
    console.error('[Payment GetAll Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const getById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate({
      path: 'order_id',
      populate: { path: 'user_id', select: 'name email phone_number' }
    });

    if (!payment) {
      return res.sendResponse(404, 'PAYMENT_NOT_FOUND');
    }
    return res.sendResponse(200, 'SUCCESS', payment);
  } catch (error) {
    console.error('[Payment GetById Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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
      return res.sendResponse(404, 'PAYMENT_NOT_FOUND');
    }

    if (status === 'completed') {
      await Order.findByIdAndUpdate(payment.order_id, { status: 'paid' });
    }

    return res.sendResponse(200, 'SUCCESS', payment);
  } catch (error) {
    console.error('[Payment UpdateStatus Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  updateStatus
};
