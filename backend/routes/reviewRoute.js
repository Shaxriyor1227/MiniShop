const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const validateSchema = require('../middleware/validateSchema');
const { reviewCreateValidation, reviewUpdateValidation } = require('../validation/reviewValidation');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Product reviews and ratings APIs
 */

/**
 * @swagger
 * /review/create:
 *   post:
 *     summary: Add review for product
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - rating
 *             properties:
 *               product_id:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 */
router.post('/create', verifyToken, validateSchema(reviewCreateValidation), reviewController.create);

/**
 * @swagger
 * /review/getAll:
 *   get:
 *     summary: Get all reviews (or by product_id)
 *     tags: [Review]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/getAll', reviewController.getAll);

/**
 * @swagger
 * /review/getById/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Review]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 */
router.get('/getById/:id', reviewController.getById);

/**
 * @swagger
 * /review/update/{id}:
 *   put:
 *     summary: Update review by ID
 *     tags: [Review]
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
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 */
router.put('/update/:id', verifyToken, validateSchema(reviewUpdateValidation), reviewController.update);

/**
 * @swagger
 * /review/delete/{id}:
 *   delete:
 *     summary: Delete review by ID
 *     tags: [Review]
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
 *         description: Review deleted
 */
router.delete('/delete/:id', verifyToken, reviewController.deleteReview);

module.exports = router;
