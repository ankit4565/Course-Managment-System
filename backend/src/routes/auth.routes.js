const express = require("express");

const {
  register,
  login,
  verifyRegisterOtp,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", register);


/**
 * @swagger
 * /api/v1/auth/verify-register-otp:
 *   post:
 *     summary: Verify registration OTP
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.post("/verify-register-otp", verifyRegisterOtp);


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", login);


/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Reset link sent to email
 */
router.post("/forgot-password", forgotPassword);


/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post("/reset-password", resetPassword);


/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change password (authenticated)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;