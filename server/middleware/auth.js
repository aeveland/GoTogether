/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and authenticate user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 */
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token - user not found'
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

/**
 * Middleware to optionally authenticate user (doesn't fail if no token)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};

/**
 * Generate JWT token for user
 * @param {object} user - User object
 * @param {string} expiresIn - Token expiration time (default: 7 days)
 * @returns {string} - JWT token
 */
const generateToken = (user, expiresIn = '7d') => {
    return jwt.sign(
        { 
            userId: user.id,
            email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn }
    );
};

/**
 * Verify JWT token without middleware
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token or null if invalid
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Middleware to check if user has admin role for a trip
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 */
const requireTripAdmin = async (req, res, next) => {
    try {
        const tripId = req.params.tripId || req.params.id;
        const userId = req.user.id;

        const Trip = require('../models/Trip');
        const hasPermission = await Trip.userHasPermission(tripId, userId, ['admin']);

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required for this trip'
            });
        }

        next();
    } catch (error) {
        console.error('Trip admin check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Permission check failed'
        });
    }
};

/**
 * Middleware to check if user is a member of a trip
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 */
const requireTripMember = async (req, res, next) => {
    try {
        const tripId = req.params.tripId || req.params.id;
        const userId = req.user.id;

        const Trip = require('../models/Trip');
        const hasPermission = await Trip.userHasPermission(tripId, userId, ['admin', 'member']);

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'Trip membership required'
            });
        }

        next();
    } catch (error) {
        console.error('Trip member check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Permission check failed'
        });
    }
};

/**
 * Rate limiting middleware for authentication endpoints
 * Simple in-memory rate limiter (use Redis in production)
 */
const authRateLimit = (() => {
    const attempts = new Map();
    const maxAttempts = 5;
    const windowMs = 15 * 60 * 1000; // 15 minutes

    return (req, res, next) => {
        const key = req.ip + req.path;
        const now = Date.now();
        
        if (!attempts.has(key)) {
            attempts.set(key, { count: 1, resetTime: now + windowMs });
            return next();
        }

        const attempt = attempts.get(key);
        
        if (now > attempt.resetTime) {
            attempts.set(key, { count: 1, resetTime: now + windowMs });
            return next();
        }

        if (attempt.count >= maxAttempts) {
            return res.status(429).json({
                success: false,
                message: 'Too many authentication attempts. Please try again later.',
                retryAfter: Math.ceil((attempt.resetTime - now) / 1000)
            });
        }

        attempt.count++;
        next();
    };
})();

module.exports = {
    authenticateToken,
    optionalAuth,
    generateToken,
    verifyToken,
    requireTripAdmin,
    requireTripMember,
    authRateLimit
};
