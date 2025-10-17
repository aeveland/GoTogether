/**
 * Authentication Routes
 * Handles user registration, login, and authentication-related endpoints
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, authenticateToken, authRateLimit } = require('../middleware/auth');
const { 
    validateUserRegistration, 
    validateUserLogin, 
    validatePasswordReset, 
    validateNewPassword 
} = require('../middleware/validation');

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', authRateLimit, validateUserRegistration, async (req, res) => {
    try {
        const { email, password, name, bio, camper_type, dietary_preferences, group_size } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = await User.create({
            email,
            password,
            name,
            bio,
            camper_type,
            dietary_preferences,
            group_size
        });

        // Generate JWT token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', authRateLimit, validateUserLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verify user credentials
        const user = await User.verifyPassword(email, password);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
});

/**
 * GET /api/auth/verify
 * Verify JWT token and return user data
 */
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Token is valid',
            data: {
                user: req.user.toJSON()
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Token verification failed'
        });
    }
});

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // This endpoint exists for consistency and potential future token blacklisting
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
});

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', authRateLimit, validatePasswordReset, async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        // TODO: Implement password reset token generation and email sending
        // For now, just return success message
        res.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.'
        });
    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({
            success: false,
            message: 'Password reset request failed. Please try again.'
        });
    }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', authRateLimit, validateNewPassword, async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // TODO: Implement password reset token verification and password update
        // For now, just return error message
        res.status(400).json({
            success: false,
            message: 'Password reset functionality is not yet implemented'
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            message: 'Password reset failed. Please try again.'
        });
    }
});

/**
 * POST /api/auth/change-password
 * Change password for authenticated user
 */
router.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        // Verify current password
        const user = await User.verifyPassword(req.user.email, currentPassword);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        await User.updatePassword(req.user.id, newPassword);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Password change failed. Please try again.'
        });
    }
});

/**
 * DELETE /api/auth/account
 * Delete user account
 */
router.delete('/account', authenticateToken, async (req, res) => {
    try {
        const { password } = req.body;

        // Verify password before deletion
        const user = await User.verifyPassword(req.user.email, password);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Password verification failed'
            });
        }

        // Deactivate user account
        await User.deactivate(req.user.id);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Account deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Account deletion failed. Please try again.'
        });
    }
});

module.exports = router;
