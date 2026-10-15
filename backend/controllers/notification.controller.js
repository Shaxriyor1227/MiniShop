const Notification = require('../model/notificationSchema');
const User = require('../model/userSchema');

const create = async (req, res) => {
  try {
    const { user_id, message } = req.body;

    if (!message || !message.trim()) {
      return res.sendResponse(400, 'VALIDATION_ERROR', null, 'Message text is required');
    }

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

      return res.sendResponse(201, 'NOTIFICATION_CREATED', { count: notificationsToCreate.length });
    }

    const notification = await Notification.create({
      user_id,
      message: message.trim(),
      isRead: false
    });

    return res.sendResponse(201, 'NOTIFICATION_CREATED', notification);
  } catch (error) {
    console.error('[Notification Create Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

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

    return res.sendResponse(200, 'NOTIFICATIONS_FETCHED', notifications, null, {
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
    });
  } catch (error) {
    console.error('[Notification GetAll Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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
      return res.sendResponse(404, 'NOTIFICATION_NOT_FOUND');
    }

    return res.sendResponse(200, 'NOTIFICATION_READ', notification);
  } catch (error) {
    console.error('[Notification MarkAsRead Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const deleteAll = async (req, res) => {
  try {
    await Notification.deleteMany({ user_id: req.user.id });
    return res.sendResponse(200, 'SUCCESS', null);
  } catch (error) {
    console.error('[Notification DeleteAll Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

module.exports = {
  create,
  getAll,
  markAsRead,
  deleteAll
};
