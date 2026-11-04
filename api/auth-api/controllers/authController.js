import * as authService from '../services/authService.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.register({ name, email, password, role });

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Get current user profile / verify token
// @route   GET /api/auth/me
// @access  Private (Requires valid JWT)
export const getMe = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


// @desc    Verify if employee email exists and has employee role
// @route   GET /api/auth/verify-employee/:email
// @access  Private
export const verifyEmployee = async (req, res) => {
  try {
    const result = await authService.verifyEmployee(req.params.email);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};