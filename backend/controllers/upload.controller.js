const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

// File filter (Only images: jpg, jpeg, png, webp, svg)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|svg|gif/;
  const isExtValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const isMimeValid = file.mimetype.startsWith('image/');

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Faqat rasm fayllari (JPG, PNG, WEBP, SVG) qabul qilinadi!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

const uploadSingleImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Fayl yuklanmadi. Iltimos, rasm tanlang.',
      innerData: null
    });
  }

  // Generate accessible URL
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

  return res.status(200).json({
    success: true,
    message: 'Rasm muvaffaqiyatli yuklandi',
    innerData: {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    }
  });
};

module.exports = {
  upload,
  uploadSingleImage
};
