const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const validateSchema = require('../middleware/validateSchema');
const { categoryCreateValidation, categoryUpdateValidation } = require('../validation/categoryValidation');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { cacheMiddleware } = require('../middleware/cache.middleware');

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Product Category management APIs
 */

/**
 * @swagger
 * /category/create:
 *   post:
 *     summary: Create new category (Admin only)
 *     tags: [Category]
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
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/create', verifyToken, isAdmin, validateSchema(categoryCreateValidation), categoryController.create);

/**
 * @swagger
 * /category/getAll:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all categories
 */
router.get('/getAll', cacheMiddleware('categories'), categoryController.getAll);

/**
 * @swagger
 * /category/getById/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Category]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 */
router.get('/getById/:id', categoryController.getById);

/**
 * @swagger
 * /category/update/{id}:
 *   put:
 *     summary: Update category by ID (Admin only)
 *     tags: [Category]
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
 *         description: Category updated
 */
router.put('/update/:id', verifyToken, isAdmin, validateSchema(categoryUpdateValidation), categoryController.update);

/**
 * @swagger
 * /category/delete/{id}:
 *   delete:
 *     summary: Delete category by ID (Admin only)
 *     tags: [Category]
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
 *         description: Category deleted
 */
router.delete('/delete/:id', verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
