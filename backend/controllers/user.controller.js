const User = require('../model/userSchema');
const bcrypt = require('bcryptjs');

/**
 * Create a user (Admin only)
 */
const create = async (req, res) => {
  try {
    const { name, email, password, role, phone_number, isBlocked } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ushbu email allaqachon mavjud',
        innerData: null
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'customer',
      phone_number: phone_number || '',
      isBlocked: !!isBlocked
    });

    const data = user.toObject();
    delete data.password;

    return res.status(201).json({
      success: true,
      message: 'Foydalanuvchi muvaffaqiyatli yaratildi',
      innerData: data
    });
  } catch (error) {
    console.error('[User Create Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Get all users with search, filter, and pagination
 */
const getAll = async (req, res) => {
  try {
    const { page, limit, search, role, isBlocked } = req.query;

    const query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone_number: regex }];
    }

    if (role && ['customer', 'admin'].includes(role)) {
      query.role = role;
    }

    if (isBlocked !== undefined && isBlocked !== '') {
      query.isBlocked = isBlocked === 'true' || isBlocked === true;
    }

    const total = await User.countDocuments(query);

    let usersQuery = User.find(query).select('-password').sort({ createdAt: -1 });

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const skip = (pageNum - 1) * limitNum;
      usersQuery = usersQuery.skip(skip).limit(limitNum);
    }

    const users = await usersQuery;

    const limitNum = limit ? parseInt(limit, 10) : total;
    const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

    return res.status(200).json({
      success: true,
      message: 'Barcha foydalanuvchilar olindi',
      innerData: users,
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
    });
  } catch (error) {
    console.error('[User GetAll Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Get user by ID (Self or Admin)
 */
const getById = async (req, res) => {
  try {
    const requestedId = req.params.id;
    if (req.user.role !== 'admin' && req.user.id !== requestedId) {
      return res.status(403).json({
        success: false,
        message: 'Ruxsat etilmagan: Faqat o\'z hisobingiz ma\'lumotlarini ko\'rishingiz mumkin',
        innerData: null
      });
    }

    const user = await User.findById(requestedId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Foydalanuvchi topildi',
      innerData: user
    });
  } catch (error) {
    console.error('[User GetById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Update user by ID (Self or Admin)
 */
const update = async (req, res) => {
  try {
    const requestedId = req.params.id;
    const isSelf = req.user.id === requestedId;
    const isAdminUser = req.user.role === 'admin';

    if (!isSelf && !isAdminUser) {
      return res.status(403).json({
        success: false,
        message: 'Ruxsat etilmagan: Faqat o\'z hisobingizni tahrirlashingiz mumkin',
        innerData: null
      });
    }

    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.email !== undefined) updates.email = req.body.email.toLowerCase();
    if (req.body.phone_number !== undefined) updates.phone_number = req.body.phone_number;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    // Role and isBlocked can ONLY be changed by an Admin
    if (isAdminUser) {
      if (req.body.role) {
        // Prevent admin demoting themselves via generic update
        if (isSelf && req.body.role !== 'admin') {
          return res.status(400).json({
            success: false,
            message: 'Admin o\'zining administratorlik huquqini pasaytira olmaydi',
            innerData: null
          });
        }
        updates.role = req.body.role;
      }
      if (req.body.isBlocked !== undefined) {
        if (isSelf && req.body.isBlocked) {
          return res.status(400).json({
            success: false,
            message: 'Admin o\'zini o\'zi bloklay olmaydi',
            innerData: null
          });
        }
        updates.isBlocked = req.body.isBlocked;
      }
    }

    const user = await User.findByIdAndUpdate(requestedId, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Foydalanuvchi yangilandi',
      innerData: user
    });
  } catch (error) {
    console.error('[User Update Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Toggle block status for user (Admin only)
 */
const toggleBlock = async (req, res) => {
  try {
    const targetId = req.params.id;

    if (req.user.id === targetId) {
      return res.status(400).json({
        success: false,
        message: 'Admin o\'zini o\'zi bloklay olmaydi',
        innerData: null
      });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
        innerData: null
      });
    }

    // Explicit boolean or toggle
    const newStatus = typeof req.body.isBlocked === 'boolean' ? req.body.isBlocked : !user.isBlocked;
    user.isBlocked = newStatus;
    await user.save();

    const data = user.toObject();
    delete data.password;

    return res.status(200).json({
      success: true,
      message: newStatus ? 'Foydalanuvchi muvaffaqiyatli bloklandi' : 'Foydalanuvchi blokdan chiqarildi',
      innerData: data
    });
  } catch (error) {
    console.error('[User ToggleBlock Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Update user role (Admin only)
 */
const updateRole = async (req, res) => {
  try {
    const targetId = req.params.id;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri role: faqat "customer" yoki "admin" bo\'lishi mumkin',
        innerData: null
      });
    }

    if (req.user.id === targetId && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin o\'z rolini pasaytira olmaydi',
        innerData: null
      });
    }

    const user = await User.findByIdAndUpdate(targetId, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: `Foydalanuvchi roli "${role}" ga o'zgartirildi`,
      innerData: user
    });
  } catch (error) {
    console.error('[User UpdateRole Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

/**
 * Delete user (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const targetId = req.params.id;

    if (req.user.id === targetId) {
      return res.status(400).json({
        success: false,
        message: 'Admin o\'z akkauntini o\'chira olmaydi',
        innerData: null
      });
    }

    const user = await User.findByIdAndDelete(targetId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Foydalanuvchi o\'chirildi',
      innerData: null
    });
  } catch (error) {
    console.error('[User Delete Error]:', error);
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
  toggleBlock,
  updateRole,
  deleteUser
};
