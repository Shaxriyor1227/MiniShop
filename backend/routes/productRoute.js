const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const validateSchema = require('../middleware/validateSchema');
const { productCreateValidation, productUpdateValidation } = require('../validation/productValidation');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product catalog management APIs
 */

/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Create new product (Admin only)
 *     tags: [Product]
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
 *               - price
 *               - category_id
 *               - brand_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Studio Wireless Headphones
 *               price:
 *                 type: number
 *                 example: 299.99
 *               stock:
 *                 type: number
 *                 example: 25
 *               category_id:
 *                 type: string
 *                 example: 65a1234567890abcdef12345
 *               brand_id:
 *                 type: string
 *                 example: 65a9876543210fedcba54321
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["/images/product_wireless_headphones.png"]
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/create', verifyToken, isAdmin, validateSchema(productCreateValidation), productController.create);

/**
 * @swagger
 * /product/search:
 *   get:
 *     summary: Search products by name
 *     tags: [Product]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', productController.search);

/**
 * @swagger
 * /product/getAll:
 *   get:
 *     summary: Get all products with filtering and sorting
 *     tags: [Product]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, name_asc]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/getAll', productController.getAll);

/**
 * @swagger
 * /product/getById/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Product]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/getById/:id', productController.getById);

/**
 * @swagger
 * /product/update/{id}:
 *   put:
 *     summary: Update product by ID (Admin only)
 *     tags: [Product]
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
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category_id:
 *                 type: string
 *               brand_id:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put('/update/:id', verifyToken, isAdmin, validateSchema(productUpdateValidation), productController.update);

/**
 * @swagger
 * /product/delete/{id}:
 *   delete:
 *     summary: Delete product by ID (Admin only)
 *     tags: [Product]
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
 *         description: Product deleted
 */
router.delete('/delete/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
