const Review = require('../model/reviewSchema');

const create = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.create({
      user_id: userId,
      product_id,
      rating,
      comment: comment || ''
    });

    const populated = await Review.findById(review._id)
      .populate('user_id', 'name email')
      .populate('product_id', 'name');

    return res.status(201).json({
      success: true,
      message: 'Sharh muvaffaqiyatli qoldirildi',
      innerData: populated
    });
  } catch (error) {
    console.error('[Review Create Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { product_id, rating, page, limit } = req.query;
    const filter = {};
    if (product_id) filter.product_id = product_id;
    if (rating) filter.rating = Number(rating);

    const total = await Review.countDocuments(filter);

    let query = Review.find(filter)
      .populate('user_id', 'name email')
      .populate('product_id', 'name images')
      .sort({ createdAt: -1 });

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);
    }

    const reviews = await query;
    const limitNum = limit ? parseInt(limit, 10) : total;
    const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

    return res.status(200).json({
      success: true,
      message: 'Sharhlar olindi',
      innerData: reviews,
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
    });
  } catch (error) {
    console.error('[Review GetAll Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const getById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user_id', 'name email')
      .populate('product_id', 'name images');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Sharh topilmadi',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sharh topildi',
      innerData: review
    });
  } catch (error) {
    console.error('[Review GetById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const update = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user_id: req.user.id };

    const updateFields = {};
    if (req.body.rating !== undefined) updateFields.rating = req.body.rating;
    if (req.body.comment !== undefined) updateFields.comment = req.body.comment;

    const review = await Review.findOneAndUpdate(
      filter,
      updateFields,
      { new: true }
    )
      .populate('user_id', 'name email')
      .populate('product_id', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Sharh topilmadi yoki uni tahrirlash huquqingiz yo\'q',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sharh yangilandi',
      innerData: review
    });
  } catch (error) {
    console.error('[Review Update Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user_id: req.user.id };

    const review = await Review.findOneAndDelete(filter);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Sharh topilmadi yoki uni o\'chirish huquqingiz yo\'q',
        innerData: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sharh o\'chirildi',
      innerData: null
    });
  } catch (error) {
    console.error('[Review Delete Error]:', error);
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
  deleteReview
};
