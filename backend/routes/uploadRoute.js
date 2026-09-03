const express = require('express');
const router = express.Router();
const { upload, uploadSingleImage } = require('../controllers/upload.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File and image uploading APIs
 */

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload single image file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post('/image', verifyToken, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Rasm yuklashda xatolik yuz berdi',
        innerData: null
      });
    }
    next();
  });
}, uploadSingleImage);

module.exports = router;
