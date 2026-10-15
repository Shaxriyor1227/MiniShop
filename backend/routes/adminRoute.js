const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative analytics and management APIs
 */

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get comprehensive administrative statistics and charts
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics including total revenue, order counts, charts, and low stock items
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/stats', verifyToken, isAdmin, adminController.getStats);

module.exports = router;
