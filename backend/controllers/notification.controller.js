const Notification = require('../model/notificationSchema');

const create = async (req, res) => {
  try {
    const { user_id, message } = req.body;
    const targetUserId = user_id || req.user.id;

    const notification = await Notification.create({
      user_id: targetUserId,
      message,
      isRead: false
    });

    return res.status(201).json({
      success: true,
      message: 'Bildirishnoma yaratildi',
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

const getAll = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Bildirishnomalar olindi',
      innerData: notifications
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
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
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
