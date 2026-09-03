const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Kupon kodi kiritilishi shart'],
      unique: true,
      uppercase: true,
      trim: true
    },
    discount: {
      type: Number,
      required: [true, 'Chegirma foizi yoki miqdori shart'],
      min: 1
    },
    is_active: {
      type: Boolean,
      default: true
    },
    expires_at: {
      type: Date,
      required: [true, 'Amal qilish muddati kiritilishi shart']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
