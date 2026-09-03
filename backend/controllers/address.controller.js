const Address = require('../model/addressSchema');

const create = async (req, res) => {
  try {
    const { city, street, is_default } = req.body;
    const userId = req.user.id;

    if (is_default) {
      await Address.updateMany({ user_id: userId }, { is_default: false });
    }

    const address = await Address.create({
      user_id: userId,
      city,
      street,
      is_default: !!is_default
    });

    return res.status(201).json({
      success: true,
      message: 'Manzil muvaffaqiyatli saqlandi',
      innerData: address
    });
  } catch (error) {
    console.error('[Address Create Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ user_id: userId }).sort({ is_default: -1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Manzillar olindi',
      innerData: addresses
    });
  } catch (error) {
    console.error('[Address GetAll Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getById = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Manzil topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Manzil topildi',
      innerData: address
    });
  } catch (error) {
    console.error('[Address GetById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const update = async (req, res) => {
  try {
    const { city, street, is_default } = req.body;
    if (is_default) {
      await Address.updateMany({ user_id: req.user.id }, { is_default: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      { city, street, is_default },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Manzil topilmadi',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Manzil muvaffaqiyatli yangilandi',
      innerData: address
    });
  } catch (error) {
    console.error('[Address Update Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Manzil topilmadi',
        innerData: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Manzil o\'chirildi',
      innerData: null
    });
  } catch (error) {
    console.error('[Address Delete Error]:', error);
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
  deleteAddress
};
