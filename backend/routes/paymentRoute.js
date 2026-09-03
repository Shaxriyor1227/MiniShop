const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const validateSchema = require('../middleware/validateSchema');
const { paymentCreateValidation, paymentUpdateValidation } = require('../validation/paymentValidation');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment transactions management APIs
 */

/**
 * @swagger
 * /payment/create:
 *   post:
 *     summary: Create payment record
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - amount
 *               - method
 *             properties:
 *               order_id:
 *                 type: string
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed, refunded]
 *     responses:
 *       201:
 *         description: Payment created
 */
router.post('/create', verifyToken, validateSchema(paymentCreateValidation), paymentController.create);

/**
 * @swagger
 * /payment/getAll:
 *   get:
 *     summary: Get all payments (Admin only)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get('/getAll', verifyToken, isAdmin, paymentController.getAll);

/**
 * @swagger
 * /payment/getById/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payment]
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
 *         description: Payment details
 */
router.get('/getById/:id', verifyToken, paymentController.getById);

/**
 * @swagger
 * /payment/update/{id}:
 *   put:
 *     summary: Update payment status (Admin only)
 *     tags: [Payment]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed, refunded]
 *     responses:
 *       200:
 *         description: Payment updated
 */
router.put('/update/:id', verifyToken, isAdmin, validateSchema(paymentUpdateValidation), paymentController.updateStatus);

module.exports = router;
