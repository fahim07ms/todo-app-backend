const express = require("express");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - username
 *         - pass
 *       properties:
 *         user_id:
 *           type: integer
 *           description: Auto-generated user ID
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         phone:
 *           type: string
 *           description: User's phone number
 *         username:
 *           type: string
 *           description: User's username
 *         pass:
 *           type: string
 *           format: password
 *           description: User's password
 *         role:
 *           type: string
 *           description: User's role
 *           default: user
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of user creation
 * 
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and management endpoints
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - username
 *               - pass
 *               - cpass
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               username:
 *                 type: string
 *                 example: johndoe
 *               pass:
 *                 type: string
 *                 format: password
 *                 example: secretpass123
 *               cpass:
 *                 type: string
 *                 format: password
 *                 example: secretpass123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully!
 *       400:
 *         description: Registration failed
 *       401:
 *         description: Passwords don't match
 *       500:
 *         description: erver error while registering user!
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user and get tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - pass
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               pass:
 *                 type: string
 *                 format: password
 *                 example: secretpass123
 *     responses:
 *       201:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token cookie
 *             schema:
 *               type: string
 *       401:
 *         description: User not found
 *       403:
 *         description: Invalid credentials
 *       500:
 *         description: Server error while loggin in!
 */

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully logged out.
 *       403:
 *         description: Access denied. Token missing!
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error!
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: User not found
 *       500:
 *         description: Internal server error!
 */

/**
 * @swagger
 * /api/users/delete:
 *   delete:
 *     summary: Delete user account
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully!
 *       404:
 *         description: No such user
 *       500:
 *         description: Internal server error!
 */

/**
 * @swagger
 * /api/users/refresh-token:
 *   post:
 *     summary: Get new access token using refresh token
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       403:
 *         description: Refresh token missing
 *       500:
 *         description: Invalid or expired refresh token!
 */


// Import Controllers
const { verifyToken, registerUser, loginUser, logoutUser, getAllUsers, getProfile, deleteUser, refreshToken } = require("../controllers/authController");

// Signup Route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Logout a user
router.post("/logout", verifyToken, logoutUser);

// Get all users
router.get("/", verifyToken, getAllUsers);

// Get the profile data of a user
router.get("/profile", verifyToken, getProfile);

// Delete a user
router.delete("/delete", verifyToken, deleteUser);

// Refresh token route
router.post('/refresh-token', verifyToken, refreshToken);


module.exports = {
    profileRoute: router, 
};