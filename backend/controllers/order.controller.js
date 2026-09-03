const Order = require('../model/orderSchema');
const Cart = require('../model/cartSchema');
const Coupon = require('../model/couponSchema');
const Payment = require('../model/paymentSchema');
const Notification = require('../model/notificationSchema');
const { sendOrderTelegramNotification } = require('../utils/telegram');
const { sendOrderConfirmationEmail } = require('../utils/mailer');

const create = async (req, res) => {
  try {
    const { address_id, coupon_code, items, payment_method = 'Credit Card' } = req.body;
    const userId = req.user.id;

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

const getAll = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user_id: req.user.id };

    const orders = await Order.find(filter)
      .populate('user_id', 'name email')
      .populate('address_id')
      .populate('coupon_id')
      .populate('items.product_id', 'name images price')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Buyurtmalar olindi',
      innerData: orders
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

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('address_id')
      .populate('items.product_id', 'name images price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi',
        innerData: null
      });
    }

    // Send notification to user about status change
    await Notification.create({
      user_id: order.user_id,
      message: `Buyurtmangiz (#${order._id.toString().slice(-6)}) holati o'zgardi: ${status}`
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

    order.status = 'cancelled';
    await order.save();

    await Notification.create({
      user_id: req.user.id,
      message: `Sizning #${order._id.toString().slice(-6)} raqamli buyurtmangiz bekor qilindi.`
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
