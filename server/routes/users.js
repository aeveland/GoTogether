/**
 * User Routes
 * Handles user profile management and user-related operations
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { 
    validateUserUpdate, 
    validateSearchQuery, 
    validatePagination 
} = require('../middleware/validation');

/**
 * GET /api/users/profile
 * Get current user's profile
 */
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        // User is already attached to req by authenticateToken middleware
        res.json({
            success: true,
            message: 'Profile retrieved successfully',
            data: req.user.toJSON()
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile'
        });
    }
});

/**
 * PUT /api/users/profile
 * Update current user's profile
 */
router.put('/profile', authenticateToken, validateUserUpdate, async (req, res) => {
    try {
        const updateData = req.body;
        const updatedUser = await User.update(req.user.id, updateData);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser.toJSON()
        });
    } catch (error) {
        console.error('Update profile error:', error);
        
        if (error.message.includes('No valid fields')) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for update'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

/**
 * GET /api/users/search
 * Search for users by email or name
 */
router.get('/search', authenticateToken, validateSearchQuery, async (req, res) => {
    try {
        const { q: query, limit = 10 } = req.query;
        const users = await User.search(query, parseInt(limit));

        res.json({
            success: true,
            message: 'User search completed',
            data: users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                camper_type: user.camper_type,
                avatar_url: user.avatar_url
            }))
        });
    } catch (error) {
        console.error('User search error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search users'
        });
    }
});

/**
 * GET /api/users/trips
 * Get current user's trips (alternative endpoint)
 */
router.get('/trips', authenticateToken, validatePagination, async (req, res) => {
    try {
        const { page = 1, limit = 20, status = 'all' } = req.query;
        
        const trips = await User.getTrips(req.user.id);

        // Simple filtering by status
        let filteredTrips = trips;
        const now = new Date();
        
        if (status === 'upcoming') {
            filteredTrips = trips.filter(trip => new Date(trip.start_date) > now);
        } else if (status === 'live') {
            filteredTrips = trips.filter(trip => 
                new Date(trip.start_date) <= now && new Date(trip.end_date) >= now
            );
        } else if (status === 'past') {
            filteredTrips = trips.filter(trip => new Date(trip.end_date) < now);
        }

        // Simple pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedTrips = filteredTrips.slice(startIndex, endIndex);

        res.json({
            success: true,
            message: 'User trips retrieved successfully',
            data: paginatedTrips,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: filteredTrips.length,
                pages: Math.ceil(filteredTrips.length / limit)
            }
        });
    } catch (error) {
        console.error('Get user trips error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve trips'
        });
    }
});

/**
 * GET /api/users/friends
 * Get current user's friends
 */
router.get('/friends', authenticateToken, async (req, res) => {
    try {
        const friends = await User.getFriends(req.user.id);

        res.json({
            success: true,
            message: 'Friends retrieved successfully',
            data: friends.map(friend => ({
                id: friend.id,
                name: friend.name,
                email: friend.email,
                bio: friend.bio,
                camper_type: friend.camper_type,
                avatar_url: friend.avatar_url,
                friendship_date: friend.friendship_date
            }))
        });
    } catch (error) {
        console.error('Get friends error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve friends'
        });
    }
});

/**
 * POST /api/users/friends/:userId
 * Send friend request to another user
 */
router.post('/friends/:userId', authenticateToken, async (req, res) => {
    try {
        const friendId = parseInt(req.params.userId);
        const userId = req.user.id;

        if (!friendId || friendId === userId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        // Check if target user exists
        const targetUser = await User.findById(friendId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // TODO: Implement friend request system
        // For now, just return a placeholder response
        res.json({
            success: true,
            message: 'Friend request functionality coming soon',
            data: {
                userId,
                friendId,
                status: 'pending'
            }
        });
    } catch (error) {
        console.error('Send friend request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send friend request'
        });
    }
});

/**
 * PUT /api/users/friends/:userId
 * Accept or decline friend request
 */
router.put('/friends/:userId', authenticateToken, async (req, res) => {
    try {
        const friendId = parseInt(req.params.userId);
        const { action } = req.body; // 'accept' or 'decline'

        if (!friendId || !action || !['accept', 'decline'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request parameters'
            });
        }

        // TODO: Implement friend request acceptance/decline
        res.json({
            success: true,
            message: `Friend request ${action} functionality coming soon`,
            data: {
                friendId,
                action
            }
        });
    } catch (error) {
        console.error('Handle friend request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to handle friend request'
        });
    }
});

/**
 * DELETE /api/users/friends/:userId
 * Remove friend or cancel friend request
 */
router.delete('/friends/:userId', authenticateToken, async (req, res) => {
    try {
        const friendId = parseInt(req.params.userId);

        if (!friendId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        // TODO: Implement friend removal
        res.json({
            success: true,
            message: 'Friend removal functionality coming soon',
            data: {
                friendId
            }
        });
    } catch (error) {
        console.error('Remove friend error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove friend'
        });
    }
});

/**
 * GET /api/users/:id
 * Get public profile of another user
 */
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Return limited public profile information
        res.json({
            success: true,
            message: 'User profile retrieved successfully',
            data: {
                id: user.id,
                name: user.name,
                bio: user.bio,
                camper_type: user.camper_type,
                avatar_url: user.avatar_url,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve user profile'
        });
    }
});

/**
 * POST /api/users/upload-avatar
 * Upload user avatar image
 */
router.post('/upload-avatar', authenticateToken, async (req, res) => {
    try {
        // TODO: Implement file upload functionality with multer
        res.json({
            success: true,
            message: 'Avatar upload functionality coming soon'
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload avatar'
        });
    }
});

/**
 * GET /api/users/stats
 * Get user statistics (trips, friends, etc.)
 */
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const trips = await User.getTrips(req.user.id);
        const friends = await User.getFriends(req.user.id);

        const now = new Date();
        const upcomingTrips = trips.filter(trip => new Date(trip.start_date) > now);
        const pastTrips = trips.filter(trip => new Date(trip.end_date) < now);

        res.json({
            success: true,
            message: 'User statistics retrieved successfully',
            data: {
                totalTrips: trips.length,
                upcomingTrips: upcomingTrips.length,
                pastTrips: pastTrips.length,
                totalFriends: friends.length,
                memberSince: req.user.created_at
            }
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve user statistics'
        });
    }
});

module.exports = router;
