const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Foydalanuvchi ID si shart']
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Mahsulot ID si shart']
    },
    rating: {
      type: Number,
      required: [true, 'Baho (rating) 1 dan 5 gacha bo\'lishi shart'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

// Performance Indexes
reviewSchema.index({ product_id: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
