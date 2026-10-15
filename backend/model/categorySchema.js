const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Kategoriya nomi kiritilishi shart'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    translations: {
      uz: { name: { type: String, default: '' } },
      ru: { name: { type: String, default: '' } },
      en: { name: { type: String, default: '' } }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
