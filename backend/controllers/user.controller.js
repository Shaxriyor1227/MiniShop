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
      return res.sendResponse(400, 'AUTH_USER_EXISTS');
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

    return res.sendResponse(201, 'SUCCESS', data);
  } catch (error) {
    console.error('[User Create Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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

    return res.sendResponse(200, 'USERS_FETCHED', users, null, {
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
    });
  } catch (error) {
    console.error('[User GetAll Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

/**
 * Get user by ID (Self or Admin)
 */
const getById = async (req, res) => {
  try {
    const requestedId = req.params.id;
    if (req.user.role !== 'admin' && req.user.id !== requestedId) {
      return res.sendResponse(403, 'FORBIDDEN_ADMIN_ONLY');
    }

    const user = await User.findById(requestedId).select('-password');
    if (!user) {
      return res.sendResponse(404, 'USER_NOT_FOUND');
    }
    return res.sendResponse(200, 'SUCCESS', user);
  } catch (error) {
    console.error('[User GetById Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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
      return res.sendResponse(403, 'FORBIDDEN_ADMIN_ONLY');
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
        if (isSelf && req.body.role !== 'admin') {
          return res.sendResponse(400, 'VALIDATION_ERROR', null, 'Admin cannot demote own role');
        }
        updates.role = req.body.role;
      }
      if (req.body.isBlocked !== undefined) {
        if (isSelf && req.body.isBlocked) {
          return res.sendResponse(400, 'VALIDATION_ERROR', null, 'Admin cannot block own account');
        }
        updates.isBlocked = req.body.isBlocked;
      }
    }

    const user = await User.findByIdAndUpdate(requestedId, updates, { new: true }).select('-password');
    if (!user) {
      return res.sendResponse(404, 'USER_NOT_FOUND');
    }
    return res.sendResponse(200, 'USER_UPDATED', user);
  } catch (error) {
    console.error('[User Update Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

/**
 * Toggle block status for user (Admin only)
 */
const toggleBlock = async (req, res) => {
  try {
    const targetId = req.params.id;

    if (req.user.id === targetId) {
      return res.sendResponse(400, 'VALIDATION_ERROR', null, 'Admin cannot block own account');
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.sendResponse(404, 'USER_NOT_FOUND');
    }

    const newStatus = typeof req.body.isBlocked === 'boolean' ? req.body.isBlocked : !user.isBlocked;
    user.isBlocked = newStatus;
    await user.save();

    const data = user.toObject();
    delete data.password;

    return res.sendResponse(200, 'USER_UPDATED', data);
  } catch (error) {
    console.error('[User ToggleBlock Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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
      return res.sendResponse(400, 'VALIDATION_ERROR', null, 'Invalid role');
    }

    if (req.user.id === targetId && role !== 'admin') {
      return res.sendResponse(400, 'VALIDATION_ERROR', null, 'Admin cannot demote own role');
    }

    const user = await User.findByIdAndUpdate(targetId, { role }, { new: true }).select('-password');
    if (!user) {
      return res.sendResponse(404, 'USER_NOT_FOUND');
    }

    return res.sendResponse(200, 'USER_UPDATED', user);
  } catch (error) {
    console.error('[User UpdateRole Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

/**
 * Delete user (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const targetId = req.params.id;

    if (req.user.id === targetId) {
      return res.sendResponse(400, 'VALIDATION_ERROR', null, 'Admin cannot delete own account');
    }

    const user = await User.findByIdAndDelete(targetId);
    if (!user) {
      return res.sendResponse(404, 'USER_NOT_FOUND');
    }
    return res.sendResponse(200, 'USER_DELETED', null);
  } catch (error) {
    console.error('[User Delete Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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
