const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Foydalanuvchi ID si shart']
    },
    city: {
      type: String,
      required: [true, 'Shahar kiritilishi shart'],
      trim: true
    },
    street: {
      type: String,
      required: [true, 'Kocha/Manzil kiritilishi shart'],
      trim: true
    },
    is_default: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);
