const Order = require('../model/orderSchema');
const Product = require('../model/productSchema');
const Cart = require('../model/cartSchema');
const Coupon = require('../model/couponSchema');
const Payment = require('../model/paymentSchema');
const Notification = require('../model/notificationSchema');
const { sendOrderTelegramNotification } = require('../utils/telegram');
const { sendOrderConfirmationEmail } = require('../utils/mailer');

/**
 * Helper to restore stock for order items
 */
const restoreOrderStock = async (items) => {
  if (!items || !items.length) return;
  for (const item of items) {
    const productId = item.product_id?._id || item.product_id;
    if (productId && item.quantity > 0) {
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: item.quantity }
      });
    }
  }
};

/**
 * Create order
 */
const create = async (req, res) => {
  try {
    const { address_id, coupon_code, items, payment_method = 'Credit Card' } = req.body;
    const userId = req.user.id;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Buyurtmada mahsulotlar mavjud emas',
        innerData: null
      });
    }

    // Verify stock availability for each item
    for (const item of items) {
      const prod = await Product.findById(item.product_id);
      if (!prod) {
        return res.status(404).json({
          success: false,
          message: `Mahsulot topilmadi (ID: ${item.product_id})`,
          innerData: null
        });
      }
      if (prod.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `"${prod.name}" mahsulotidan yetarli zaxira yo'q (Mavjud: ${prod.stock}, so'ralgan: ${item.quantity})`,
          innerData: null
        });
      }
    }

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    let discount = 0;
    let couponDoc = null;
    if (coupon_code) {
      couponDoc = await Coupon.findOne({
        code: coupon_code.toUpperCase(),
        is_active: true,
        expires_at: { $gt: new Date() }
      });
      if (couponDoc) {
        discount = (subtotal * couponDoc.discount) / 100;
      }
    }

    const total = Math.max(0, subtotal - discount);

    // Deduct stock for each purchased item
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = await Order.create({
      user_id: userId,
      address_id,
      coupon_id: couponDoc ? couponDoc._id : null,
      items,
      total,
      status: 'pending'
    });

    // Create payment record
    await Payment.create({
      order_id: order._id,
      amount: total,
      method: payment_method,
      status: 'completed'
    });

    // Automatically mark order as paid if payment succeeds
    order.status = 'paid';
    await order.save();

    // Clear user's cart
    await Cart.findOneAndUpdate({ user_id: userId }, { items: [] });

    // Create notification
    await Notification.create({
      user_id: userId,
      message: `Sizning #${order._id.toString().slice(-6)} raqamli buyurtmangiz muvaffaqiyatli qabul qilindi!`
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('user_id', 'name email phone_number')
      .populate('address_id')
      .populate('coupon_id')
      .populate('items.product_id', 'name images price');

    // Asynchronously dispatch notifications (non-blocking)
    sendOrderTelegramNotification(populatedOrder).catch((err) =>
      console.error('[Telegram notification error]:', err.message)
    );
    sendOrderConfirmationEmail(populatedOrder, populatedOrder.user_id).catch((err) =>
      console.error('[Email notification error]:', err.message)
    );

    return res.status(201).json({
      success: true,
      message: 'Buyurtma muvaffaqiyatli rasmiylashtirildi',
      innerData: populatedOrder
    });
  } catch (error) {
    console.error('[Order Create Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Get all orders (with pagination, search, status and date filter)
 */
const getAll = async (req, res) => {
  try {
    const { page, limit, search, status, startDate, endDate } = req.query;

    let filter = req.user.role === 'admin' ? {} : { user_id: req.user.id };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // If search is given and user is admin, search by order ID or user
    if (search && search.trim()) {
      const s = search.trim();
      // If it looks like an ObjectId or suffix
      if (/^[0-9a-fA-F]{24}$/.test(s)) {
        filter._id = s;
      }
    }

    const total = await Order.countDocuments(filter);

    let query = Order.find(filter)
      .populate('user_id', 'name email phone_number')
      .populate('address_id')
      .populate('coupon_id')
      .populate('items.product_id', 'name images price')
      .sort({ createdAt: -1 });

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    let orders = await query;

    // In-memory search if searching by user name/email and not ObjectId
    if (search && search.trim() && !/^[0-9a-fA-F]{24}$/.test(search.trim())) {
      const term = search.trim().toLowerCase();
      orders = orders.filter(
        (o) =>
          o._id.toString().toLowerCase().includes(term) ||
          (o.user_id?.name && o.user_id.name.toLowerCase().includes(term)) ||
          (o.user_id?.email && o.user_id.email.toLowerCase().includes(term))
      );
    }

    const limitNum = limit ? parseInt(limit, 10) : total;
    const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

    return res.status(200).json({
      success: true,
      message: 'Buyurtmalar olindi',
      innerData: orders,
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
    });
  } catch (error) {
    console.error('[Order GetAll Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Get order by ID
 */
const getById = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user_id: req.user.id };

    const order = await Order.findOne(filter)
      .populate('user_id', 'name email phone_number')
      .populate('address_id')
      .populate('coupon_id')
      .populate('items.product_id', 'name images price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Buyurtma ma\'lumotlari olindi',
      innerData: order
    });
  } catch (error) {
    console.error('[Order GetById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Update order status (Admin only)
 */
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi',
        innerData: null
      });
    }

    const prevStatus = existingOrder.status;

    // If order is changing to 'cancelled' and was not previously cancelled, restore stock!
    if (status === 'cancelled' && prevStatus !== 'cancelled') {
      await restoreOrderStock(existingOrder.items);
    }

    // If order was cancelled and now changed back to active (paid, shipped, delivered), deduct stock again
    if (prevStatus === 'cancelled' && status !== 'cancelled') {
      for (const item of existingOrder.items) {
        const productId = item.product_id?._id || item.product_id;
        if (productId && item.quantity > 0) {
          await Product.findByIdAndUpdate(productId, {
            $inc: { stock: -item.quantity }
          });
        }
      }
    }

    existingOrder.status = status;
    await existingOrder.save();

    const order = await Order.findById(req.params.id)
      .populate('user_id', 'name email phone_number')
      .populate('address_id')
      .populate('items.product_id', 'name images price');

    // Send notification to user about status change
    const statusLabels = {
      pending: 'kutilmoqda',
      paid: 'to\'landi',
      shipped: 'yo\'lda (yuborildi)',
      delivered: 'yetkazib berildi',
      cancelled: 'bekor qilindi'
    };
    const humanStatus = statusLabels[status] || status;

    await Notification.create({
      user_id: order.user_id?._id || order.user_id,
      message: `Sizning #${order._id.toString().slice(-6)} raqamli buyurtmangiz holati yangilandi: ${humanStatus}.`
    });

    return res.status(200).json({
      success: true,
      message: 'Buyurtma holati yangilandi',
      innerData: order
    });
  } catch (error) {
    console.error('[Order UpdateStatus Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Cancel order by customer
 */
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi',
        innerData: null
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Yuborilgan yoki yetkazilgan buyurtmani bekor qilib bo\'lmaydi',
        innerData: null
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Buyurtma allaqachon bekor qilingan',
        innerData: order
      });
    }

    // Restore stock
    await restoreOrderStock(order.items);

    order.status = 'cancelled';
    await order.save();

    await Notification.create({
      user_id: req.user.id,
      message: `Sizning #${order._id.toString().slice(-6)} raqamli buyurtmangiz muvaffaqiyatli bekor qilindi va tovar zaxirasi tiklandi.`
    });

    return res.status(200).json({
      success: true,
      message: 'Buyurtma bekor qilindi',
      innerData: order
    });
  } catch (error) {
    console.error('[Order Cancel Error]:', error);
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
  updateStatus,
  cancelOrder
};
