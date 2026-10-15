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

    return res.sendResponse(201, 'ADDRESS_CREATED', address);
  } catch (error) {
    console.error('[Address Create Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ user_id: userId }).sort({ is_default: -1, createdAt: -1 });
    return res.sendResponse(200, 'ADDRESSES_FETCHED', addresses);
  } catch (error) {
    console.error('[Address GetAll Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const getById = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!address) {
      return res.sendResponse(404, 'ADDRESS_NOT_FOUND');
    }
    return res.sendResponse(200, 'SUCCESS', address);
  } catch (error) {
    console.error('[Address GetById Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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
      return res.sendResponse(404, 'ADDRESS_NOT_FOUND');
    }

    return res.sendResponse(200, 'ADDRESS_UPDATED', address);
  } catch (error) {
    console.error('[Address Update Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    if (!address) {
      return res.sendResponse(404, 'ADDRESS_NOT_FOUND');
    }
    return res.sendResponse(200, 'ADDRESS_DELETED', null);
  } catch (error) {
    console.error('[Address Delete Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteAddress
};
