const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const validateSchema = require('../middleware/validateSchema');
const { notificationCreateValidation } = require('../validation/notificationValidation');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: User notifications management APIs
 */

/**
 * @swagger
 * /notification/create:
 *   post:
 *     summary: Create new notification (Admin only - user_id or all)
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: User ID or "all" to broadcast to everyone
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created
 */
router.post('/create', verifyToken, isAdmin, validateSchema(notificationCreateValidation), notificationController.create);

/**
 * @swagger
 * /notification/getAll:
 *   get:
 *     summary: Get all notifications of current user (or all if admin)
 *     tags: [Notification]
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
 *         name: all
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/getAll', verifyToken, notificationController.getAll);

/**
 * @swagger
 * /notification/update/{id}:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notification]
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
 *         description: Notification marked as read
 */
router.put('/update/:id', verifyToken, notificationController.markAsRead);
router.put('/markAsRead/:id', verifyToken, notificationController.markAsRead);

/**
 * @swagger
 * /notification/clear:
 *   delete:
 *     summary: Delete all notifications for current user
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications deleted
 */
router.delete('/clear', verifyToken, notificationController.deleteAll);

module.exports = router;
