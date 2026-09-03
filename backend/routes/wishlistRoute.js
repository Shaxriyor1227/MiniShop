const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const validateSchema = require('../middleware/validateSchema');
const { wishlistToggleValidation } = require('../validation/wishlistValidation');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: User wishlist management APIs
 */

/**
 * @swagger
 * /wishlist/getAll:
 *   get:
 *     summary: Get current user wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist details
 */
router.get('/getAll', verifyToken, wishlistController.getWishlist);

/**
 * @swagger
 * /wishlist/create:
 *   post:
 *     summary: Toggle product in wishlist (add or remove)
 *     tags: [Wishlist]
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
 *             properties:
 *               product_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Wishlist toggled
 */
router.post('/create', verifyToken, validateSchema(wishlistToggleValidation), wishlistController.toggleWishlist);
router.post('/toggle', verifyToken, validateSchema(wishlistToggleValidation), wishlistController.toggleWishlist);

/**
 * @swagger
 * /wishlist/delete/{id}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
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
 *         description: Product removed from wishlist
 */
router.delete('/delete/:id', verifyToken, (req, res) => {
  req.body.product_id = req.params.id;
  return wishlistController.toggleWishlist(req, res);
});

/**
 * @swagger
 * /wishlist/clear:
 *   delete:
 *     summary: Clear wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist cleared
 */
router.delete('/clear', verifyToken, wishlistController.clearWishlist);

module.exports = router;
