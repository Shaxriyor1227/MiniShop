const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const validateSchema = require('../middleware/validateSchema');
const { addressCreateValidation, addressUpdateValidation } = require('../validation/addressValidation');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: User addresses management APIs
 */

/**
 * @swagger
 * /address/create:
 *   post:
 *     summary: Add new address
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - street
 *             properties:
 *               city:
 *                 type: string
 *                 example: Tashkent
 *               street:
 *                 type: string
 *                 example: Amir Temur street 12
 *               is_default:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Address created
 */
router.post('/create', verifyToken, validateSchema(addressCreateValidation), addressController.create);

/**
 * @swagger
 * /address/getAll:
 *   get:
 *     summary: Get all addresses of authenticated user
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user addresses
 */
router.get('/getAll', verifyToken, addressController.getAll);

/**
 * @swagger
 * /address/getById/{id}:
 *   get:
 *     summary: Get address by ID
 *     tags: [Address]
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
 *         description: Address details
 */
router.get('/getById/:id', verifyToken, addressController.getById);

/**
 * @swagger
 * /address/update/{id}:
 *   put:
 *     summary: Update address by ID
 *     tags: [Address]
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
 *               city:
 *                 type: string
 *               street:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated
 */
router.put('/update/:id', verifyToken, validateSchema(addressUpdateValidation), addressController.update);

/**
 * @swagger
 * /address/delete/{id}:
 *   delete:
 *     summary: Delete address by ID
 *     tags: [Address]
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
 *         description: Address deleted
 */
router.delete('/delete/:id', verifyToken, addressController.deleteAddress);

module.exports = router;
