import { User } from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';
import { config } from '../config/index.js';
import { sendOTPEmail } from '../utils/emailService.js';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register new user with OTP
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('Invalid email format');
      error.status = 400;
      throw error;
    }

    // Check for duplicate @gmail.com
    if (email.includes('@gmail.com@gmail.com')) {
      const error = new Error('Invalid email: duplicate @gmail.com');
      error.status = 400;
      throw error;
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error('User already exists with this email');
      error.status = 400;
      throw error;
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Create user with OTP (not verified yet)
    const user = await User.create({
      name,
      email,
      password,
      emailVerified: false,
      otp,
      otpExpiry,
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp);
    
    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.message);
      // Don't fail registration, user can resend OTP
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for OTP.',
      data: {
        email: user.email,
        requiresVerification: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`[Login Failed] User not found: ${email}`);
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Check if user is blocked
    if (user.isBlocked) {
      const error = new Error('Your account has been blocked');
      error.status = 403;
      throw error;
    }

    // Check if email is verified
    if (!user.emailVerified) {
      const error = new Error('Please verify your email first');
      error.status = 403;
      throw error;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[Login Failed] Password mismatch for user: ${email}`);
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    if (user.emailVerified) {
      const error = new Error('Email already verified');
      error.status = 400;
      throw error;
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: 'New OTP sent to your email',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTPCode = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    // Check if already verified
    if (user.emailVerified) {
      const error = new Error('Email already verified');
      error.status = 400;
      throw error;
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpiry) {
      const error = new Error('No OTP found. Please register again.');
      error.status = 400;
      throw error;
    }

    // Check if OTP expired
    if (Date.now() > user.otpExpiry) {
      const error = new Error('OTP has expired. Please request a new one.');
      error.status = 400;
      throw error;
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      const error = new Error('Invalid OTP');
      error.status = 400;
      throw error;
    }

    // Verify user and clear OTP
    user.emailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Email verified successfully. You are now logged in.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
