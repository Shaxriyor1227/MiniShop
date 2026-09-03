const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const validateSchema = require('../middleware/validateSchema');
const { cartAddValidation, cartUpdateValidation } = require('../validation/cartValidation');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management APIs
 */

/**
 * @swagger
 * /cart/getAll:
 *   get:
 *     summary: Get current user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 */
router.get('/getAll', verifyToken, cartController.getCart);

/**
 * @swagger
 * /cart/create:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
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
 *               quantity:
 *                 type: number
 *                 default: 1
 *     responses:
 *       200:
 *         description: Product added to cart
 */
router.post('/create', verifyToken, validateSchema(cartAddValidation), cartController.addToCart);
router.post('/add', verifyToken, validateSchema(cartAddValidation), cartController.addToCart);

/**
 * @swagger
 * /cart/update/{id}:
 *   put:
 *     summary: Update quantity of a product in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.put('/update/:id', verifyToken, validateSchema(cartUpdateValidation), cartController.updateCartItem);
router.put('/update', verifyToken, validateSchema(cartUpdateValidation), cartController.updateCartItem);

/**
 * @swagger
 * /cart/delete/{id}:
 *   delete:
 *     summary: Remove item from cart by product ID
 *     tags: [Cart]
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
 *         description: Item removed from cart
 */
router.delete('/delete/:id', verifyToken, (req, res) => {
  req.params.productId = req.params.id;
  return cartController.removeFromCart(req, res);
});

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear all items in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/clear', verifyToken, cartController.clearCart);

module.exports = router;
