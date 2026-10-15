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
    description: {
      type: String,
      default: ''
    },
    translations: {
      uz: {
        name: { type: String, default: '' },
        description: { type: String, default: '' }
      },
      ru: {
        name: { type: String, default: '' },
        description: { type: String, default: '' }
      },
      en: {
        name: { type: String, default: '' },
        description: { type: String, default: '' }
      }
    },
    images: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

// Performance Indexes
productSchema.index({ category_id: 1, price: 1 });
productSchema.index({ brand_id: 1 });
productSchema.index({ price: 1 });
productSchema.index(
  {
    name: 'text',
    'translations.uz.name': 'text',
    'translations.ru.name': 'text',
    'translations.en.name': 'text',
    description: 'text',
    'translations.uz.description': 'text',
    'translations.ru.description': 'text',
    'translations.en.description': 'text'
  },
  {
    weights: {
      name: 10,
      'translations.uz.name': 10,
      'translations.ru.name': 10,
      'translations.en.name': 10,
      description: 2,
      'translations.uz.description': 2,
      'translations.ru.description': 2,
      'translations.en.description': 2
    },
    name: 'ProductMultilingualTextIndex'
  }
);

module.exports = mongoose.model('Product', productSchema);

