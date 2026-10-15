const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brend nomi kiritilishi shart'],
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

module.exports = mongoose.model('Brand', brandSchema);
