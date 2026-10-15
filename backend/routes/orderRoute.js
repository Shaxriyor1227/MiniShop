const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const validateSchema = require('../middleware/validateSchema');
const { orderCreateValidation, orderStatusUpdateValidation } = require('../validation/orderValidation');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order checkout and management APIs
 */

/**
 * @swagger
 * /order/create:
 *   post:
 *     summary: Place a new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_id
 *               - items
 *             properties:
 *               address_id:
 *                 type: string
 *               coupon_code:
 *                 type: string
 *               payment_method:
 *                 type: string
 *                 default: "Credit Card"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                     - price
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order placed successfully
 */
router.post('/create', verifyToken, validateSchema(orderCreateValidation), orderController.create);

/**
 * @swagger
 * /order/getAll:
 *   get:
 *     summary: Get all orders (Customer gets own, Admin gets all) with pagination & filters
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, paid, shipped, delivered, cancelled]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of orders with pagination details
 */
router.get('/getAll', verifyToken, orderController.getAll);

/**
 * @swagger
 * /order/getById/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Order]
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
 *         description: Order details
 */
router.get('/getById/:id', verifyToken, orderController.getById);

/**
 * @swagger
 * /order/update/{id}:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Order]
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
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put('/update/:id', verifyToken, isAdmin, validateSchema(orderStatusUpdateValidation), orderController.updateStatus);

/**
 * @swagger
 * /order/cancel/{id}:
 *   put:
 *     summary: Cancel pending order
 *     tags: [Order]
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
 *         description: Order cancelled
 */
router.put('/cancel/:id', verifyToken, orderController.cancelOrder);

module.exports = router;
