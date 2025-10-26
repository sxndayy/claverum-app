import express from 'express';
import { authenticateUser, generateToken, requireAuth } from '../middleware/auth.js';
import { validateUsers } from '../config/users.js';

const router = express.Router();

// Validate users on startup
validateUsers();

/**
 * POST /api/auth/login
 * Login endpoint for admin users
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    const user = await authenticateUser(username, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

/**
 * GET /api/auth/verify
 * Verify token and return user info
 */
router.get('/verify', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      username: req.user.userId,
      role: req.user.role
    }
  });
});

/**
 * POST /api/auth/logout
 * Logout endpoint (client-side token removal)
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;
