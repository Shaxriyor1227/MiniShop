const User = require('../model/userSchema');
const bcrypt = require('bcryptjs');

const create = async (req, res) => {
  try {
    const { name, email, password, role, phone_number } = req.body;
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
      phone_number: phone_number || ''
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

const getAll = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Barcha foydalanuvchilar olindi',
      innerData: users
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

const getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
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

const update = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
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

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
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
  deleteUser
};
