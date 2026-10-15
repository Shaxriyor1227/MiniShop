const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validateSchema = require('../middleware/validateSchema');
const {
  userCreateValidation,
  userUpdateValidation,
  userRoleValidation,
  userBlockValidation
} = require('../validation/userValidation');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management APIs
 */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a user (Admin only)
 *     tags: [User]
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
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [customer, admin]
 *               phone_number:
 *                 type: string
 *               isBlocked:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/create', verifyToken, isAdmin, validateSchema(userCreateValidation), userController.create);

/**
 * @swagger
 * /user/getAll:
 *   get:
 *     summary: Get all users with search, pagination and filter (Admin only)
 *     tags: [User]
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [customer, admin]
 *       - in: query
 *         name: isBlocked
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of users with pagination info
 */
router.get('/getAll', verifyToken, isAdmin, userController.getAll);

/**
 * @swagger
 * /user/getById/{id}:
 *   get:
 *     summary: Get user by ID (Self or Admin)
 *     tags: [User]
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
 *         description: User details
 *       403:
 *         description: Forbidden
 */
router.get('/getById/:id', verifyToken, userController.getById);

/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     summary: Update user by ID (Self or Admin)
 *     tags: [User]
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [customer, admin]
 *               isBlocked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/update/:id', verifyToken, validateSchema(userUpdateValidation), userController.update);

/**
 * @swagger
 * /user/block/{id}:
 *   put:
 *     summary: Toggle or set user blocked status (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isBlocked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User block status updated
 */
router.put('/block/:id', verifyToken, isAdmin, validateSchema(userBlockValidation), userController.toggleBlock);

/**
 * @swagger
 * /user/role/{id}:
 *   put:
 *     summary: Update user role (Admin only)
 *     tags: [User]
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [customer, admin]
 *     responses:
 *       200:
 *         description: User role updated
 */
router.put('/role/:id', verifyToken, isAdmin, validateSchema(userRoleValidation), userController.updateRole);

/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     summary: Delete user by ID (Admin only)
 *     tags: [User]
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
 *         description: User deleted
 */
router.delete('/delete/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
