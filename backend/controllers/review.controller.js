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

    return res.sendResponse(201, 'REVIEW_CREATED', populated);
  } catch (error) {
    console.error('[Review Create Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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

    return res.sendResponse(200, 'REVIEWS_FETCHED', reviews, null, {
      total,
      totalPages: totalPages || 1,
      page: page ? parseInt(page, 10) : 1
    });
  } catch (error) {
    console.error('[Review GetAll Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const getById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user_id', 'name email')
      .populate('product_id', 'name images');

    if (!review) {
      return res.sendResponse(404, 'REVIEW_NOT_FOUND');
    }

    return res.sendResponse(200, 'SUCCESS', review);
  } catch (error) {
    console.error('[Review GetById Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
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
      return res.sendResponse(404, 'REVIEW_NOT_FOUND');
    }

    return res.sendResponse(200, 'SUCCESS', review);
  } catch (error) {
    console.error('[Review Update Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

const deleteReview = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user_id: req.user.id };

    const review = await Review.findOneAndDelete(filter);
    if (!review) {
      return res.sendResponse(404, 'REVIEW_NOT_FOUND');
    }

    return res.sendResponse(200, 'REVIEW_DELETED', null);
  } catch (error) {
    console.error('[Review Delete Error]:', error);
    return res.sendResponse(500, 'INTERNAL_SERVER_ERROR', null, error.message);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteReview
};
