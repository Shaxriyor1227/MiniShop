const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const validateSchema = require('../middleware/validateSchema');
const { couponCreateValidation, couponUpdateValidation, couponApplyValidation } = require('../validation/couponValidation');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Coupon
 *   description: Discount coupons management APIs
 */

/**
 * @swagger
 * /coupon/apply:
 *   post:
 *     summary: Verify and apply coupon code
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: WELCOME10
 *     responses:
 *       200:
 *         description: Coupon valid
 *       400:
 *         description: Invalid or expired coupon
 */
router.post('/apply', verifyToken, validateSchema(couponApplyValidation), couponController.applyCoupon);

/**
 * @swagger
 * /coupon/create:
 *   post:
 *     summary: Create new coupon (Admin only)
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount
 *               - expires_at
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER2026
 *               discount:
 *                 type: number
 *                 example: 15
 *               is_active:
 *                 type: boolean
 *                 default: true
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-12-31T23:59:59Z"
 *     responses:
 *       201:
 *         description: Coupon created
 */
router.post('/create', verifyToken, isAdmin, validateSchema(couponCreateValidation), couponController.create);

/**
 * @swagger
 * /coupon/getAll:
 *   get:
 *     summary: Get all coupons (Admin only)
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of coupons
 */
router.get('/getAll', verifyToken, isAdmin, couponController.getAll);

/**
 * @swagger
 * /coupon/getById/{id}:
 *   get:
 *     summary: Get coupon by ID (Admin only)
 *     tags: [Coupon]
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
 *         description: Coupon details
 */
router.get('/getById/:id', verifyToken, isAdmin, couponController.getById);

/**
 * @swagger
 * /coupon/update/{id}:
 *   put:
 *     summary: Update coupon by ID (Admin only)
 *     tags: [Coupon]
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
 *               code:
 *                 type: string
 *               discount:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Coupon updated
 */
router.put('/update/:id', verifyToken, isAdmin, validateSchema(couponUpdateValidation), couponController.update);

/**
 * @swagger
 * /coupon/delete/{id}:
 *   delete:
 *     summary: Delete coupon by ID (Admin only)
 *     tags: [Coupon]
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
 *         description: Coupon deleted
 */
router.delete('/delete/:id', verifyToken, isAdmin, couponController.deleteCoupon);

module.exports = router;
