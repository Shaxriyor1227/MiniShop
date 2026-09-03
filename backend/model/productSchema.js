const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mahsulot nomi kiritilishi shart'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Mahsulot narxi kiritilishi shart'],
      min: 0
    },
    stock: {
      type: Number,
      required: [true, 'Mahsulot soni kiritilishi shart'],
      min: 0,
      default: 0
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Kategoriya ID si shart']
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brend ID si shart']
    },
    images: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
