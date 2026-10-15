const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const validateSchema = require('../middleware/validateSchema');
const { brandCreateValidation, brandUpdateValidation } = require('../validation/brandValidation');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { cacheMiddleware } = require('../middleware/cache.middleware');

/**
 * @swagger
 * tags:
 *   name: Brand
 *   description: Brand management APIs
 */

/**
 * @swagger
 * /brand/create:
 *   post:
 *     summary: Create new brand (Admin only)
 *     tags: [Brand]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apple
 *     responses:
 *       201:
 *         description: Brand created
 */
router.post('/create', verifyToken, isAdmin, validateSchema(brandCreateValidation), brandController.create);

/**
 * @swagger
 * /brand/getAll:
 *   get:
 *     summary: Get all brands
 *     tags: [Brand]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all brands
 */
router.get('/getAll', cacheMiddleware('brands'), brandController.getAll);

/**
 * @swagger
 * /brand/getById/{id}:
 *   get:
 *     summary: Get brand by ID
 *     tags: [Brand]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand details
 */
router.get('/getById/:id', brandController.getById);

/**
 * @swagger
 * /brand/update/{id}:
 *   put:
 *     summary: Update brand by ID (Admin only)
 *     tags: [Brand]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Brand updated
 */
router.put('/update/:id', verifyToken, isAdmin, validateSchema(brandUpdateValidation), brandController.update);

/**
 * @swagger
 * /brand/delete/{id}:
 *   delete:
 *     summary: Delete brand by ID (Admin only)
 *     tags: [Brand]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand deleted
 */
router.delete('/delete/:id', verifyToken, isAdmin, brandController.deleteBrand);

module.exports = router;
