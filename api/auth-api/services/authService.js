import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

/**
 * Register a new user
 */
export const register = async ({ name, email, password, role }) => {
  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error('User already exists with this email');
    error.statusCode = 400;
    throw error;
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'employee',
  });

  const token = generateToken(user._id, user.role, user.email);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Authenticate user and issue token
 */
export const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Please provide both email and password');
    error.statusCode = 400;
    throw error;
  }

  // Find user
  const user = await User.findOne({ email });

  // Validate credentials
  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id, user.role, user.email);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Fetch user profile by ID (excluding password)
 */
export const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};


/**
 * Verify if an email exists and belongs to an employee
 */
export const verifyEmployee = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    const error = new Error(`No user found with email: ${email}`);
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'employee') {
    const error = new Error(`User with email '${email}' is a '${user.role}', not an employee`);
    error.statusCode = 400;
    throw error;
  }

  return {
    exists: true,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};

