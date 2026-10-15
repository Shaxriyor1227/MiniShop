const Notification = require('../model/notificationSchema');
const User = require('../model/userSchema');

/**
 * Create notification (Admin only: specific user or broadcast to all users)
 */
const create = async (req, res) => {
  try {
    const { user_id, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Xabar matni kiritilishi shart',
        innerData: null
      });
    }

    // Broadcast to all users
    if (!user_id || user_id === 'all') {
      const users = await User.find({ isBlocked: false }).select('_id');
      const notificationsToCreate = users.map((u) => ({
        user_id: u._id,
        message: message.trim(),
        isRead: false
      }));

      if (notificationsToCreate.length > 0) {
        await Notification.insertMany(notificationsToCreate);
      }

      return res.status(201).json({
        success: true,
        message: `Xabar barcha foydalanuvchilarga (${notificationsToCreate.length} ta) yuborildi`,
        innerData: { count: notificationsToCreate.length }
      });
    }

    // Specific user notification
    const notification = await Notification.create({
      user_id,
      message: message.trim(),
      isRead: false
    });

    return res.status(201).json({
      success: true,
      message: 'Bildirishnoma muvaffaqiyatli yuborildi',
      innerData: notification
    });
  } catch (error) {
    console.error('[Notification Create Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Get all notifications for current user (or all if admin requested with ?all=true)
 */
const getAll = async (req, res) => {
  try {
    const { page, limit, all } = req.query;

    const filter = (req.user.role === 'admin' && all === 'true')
      ? {}
      : { user_id: req.user.id };

    const total = await Notification.countDocuments(filter);

    let query = Notification.find(filter)
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 });

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 20);
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    const notifications = await query;
    const limitNum = limit ? parseInt(limit, 10) : total;
    const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

    return res.status(200).json({
      success: true,
      message: 'Bildirishnomalar olindi',
      innerData: notifications,
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
    });
  } catch (error) {
    console.error('[Notification GetAll Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user_id: req.user.id };

    const notification = await Notification.findOneAndUpdate(
      filter,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Bildirishnoma topilmadi',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Bildirishnoma o\'qilgan deb belgilandi',
      innerData: notification
    });
  } catch (error) {
    console.error('[Notification MarkAsRead Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    await Notification.deleteMany({ user_id: req.user.id });
    return res.status(200).json({
      success: true,
      message: 'Barcha bildirishnomalar o\'chirildi',
      innerData: null
    });
  } catch (error) {
    console.error('[Notification DeleteAll Error]:', error);
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
  markAsRead,
  deleteAll
};
