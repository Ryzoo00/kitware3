import express from 'express';
import { body } from 'express-validator';
import { register, login, logout, getMe, resendOTP, verifyOTPCode } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { sendOTPEmail, testEmailConfig } from '../utils/emailService.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const emailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
];

const otpValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Please provide a valid 6-digit OTP'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// OTP verification routes
router.post('/resend-otp', emailValidation, resendOTP);
router.post('/verify-otp', otpValidation, verifyOTPCode);

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Testing email to:', email);
    
    // Test transporter config
    const configTest = await testEmailConfig();
    console.log('Config test:', configTest);
    
    // Try to send test email
    const result = await sendOTPEmail(email, '123456');
    console.log('Send result:', result);
    
    res.json({
      success: result.success,
      message: result.message,
      configTest,
      details: result
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.toString()
    });
  }
});

export default router;
