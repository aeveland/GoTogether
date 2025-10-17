/**
 * Trip Routes
 * Handles trip-related CRUD operations and member management
 */
const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { authenticateToken, requireTripAdmin, requireTripMember } = require('../middleware/auth');
const { 
    validateTripCreation, 
    validateTripUpdate, 
    validateId, 
    validateTripId,
    validateEmail,
    validatePagination 
} = require('../middleware/validation');

/**
 * GET /api/trips
 * Get all trips for the authenticated user
 */
router.get('/', authenticateToken, validatePagination, async (req, res) => {
    try {
        const { page = 1, limit = 20, status = 'all' } = req.query;
        
        const result = await Trip.getUserTrips(req.user.id, {
            page: parseInt(page),
            limit: parseInt(limit),
            status
        });

        res.json({
            success: true,
            message: 'Trips retrieved successfully',
            data: result.trips.map(trip => trip.toJSON()),
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Get trips error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve trips'
        });
    }
});

/**
 * POST /api/trips
 * Create a new trip
 */
router.post('/', authenticateToken, validateTripCreation, async (req, res) => {
    try {
        const tripData = req.body;
        const trip = await Trip.create(tripData, req.user.id);

        res.status(201).json({
            success: true,
            message: 'Trip created successfully',
            data: trip.toJSON()
        });
    } catch (error) {
        console.error('Create trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create trip'
        });
    }
});

/**
 * GET /api/trips/:id
 * Get a specific trip by ID
 */
router.get('/:id', authenticateToken, validateId, requireTripMember, async (req, res) => {
    try {
        const tripId = req.params.id;
        const trip = await Trip.findById(tripId, req.user.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        res.json({
            success: true,
            message: 'Trip retrieved successfully',
            data: trip.toJSON()
        });
    } catch (error) {
        console.error('Get trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve trip'
        });
    }
});

/**
 * PUT /api/trips/:id
 * Update a trip
 */
router.put('/:id', authenticateToken, validateId, validateTripUpdate, requireTripAdmin, async (req, res) => {
    try {
        const tripId = req.params.id;
        const updateData = req.body;

        const trip = await Trip.update(tripId, updateData, req.user.id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        res.json({
            success: true,
            message: 'Trip updated successfully',
            data: trip.toJSON()
        });
    } catch (error) {
        console.error('Update trip error:', error);
        
        if (error.message.includes('Insufficient permissions')) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update trip'
        });
    }
});

/**
 * DELETE /api/trips/:id
 * Delete a trip (soft delete)
 */
router.delete('/:id', authenticateToken, validateId, requireTripAdmin, async (req, res) => {
    try {
        const tripId = req.params.id;
        await Trip.delete(tripId, req.user.id);

        res.json({
            success: true,
            message: 'Trip deleted successfully'
        });
    } catch (error) {
        console.error('Delete trip error:', error);
        
        if (error.message.includes('Insufficient permissions')) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to delete trip'
        });
    }
});

/**
 * GET /api/trips/:id/members
 * Get all members of a trip
 */
router.get('/:id/members', authenticateToken, validateId, requireTripMember, async (req, res) => {
    try {
        const tripId = req.params.id;
        const members = await Trip.getMembers(tripId);

        res.json({
            success: true,
            message: 'Trip members retrieved successfully',
            data: members
        });
    } catch (error) {
        console.error('Get trip members error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve trip members'
        });
    }
});

/**
 * POST /api/trips/:id/members
 * Add a member to a trip
 */
router.post('/:id/members', authenticateToken, validateId, requireTripAdmin, async (req, res) => {
    try {
        const tripId = req.params.id;
        const { userId, role = 'member' } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        await Trip.addMember(tripId, userId, role);

        res.status(201).json({
            success: true,
            message: 'Member added to trip successfully'
        });
    } catch (error) {
        console.error('Add trip member error:', error);
        
        if (error.message.includes('already a member')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to add member to trip'
        });
    }
});

/**
 * DELETE /api/trips/:id/members/:userId
 * Remove a member from a trip
 */
router.delete('/:id/members/:userId', authenticateToken, validateId, async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = parseInt(req.params.userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        await Trip.removeMember(tripId, userId, req.user.id);

        res.json({
            success: true,
            message: 'Member removed from trip successfully'
        });
    } catch (error) {
        console.error('Remove trip member error:', error);
        
        if (error.message.includes('Insufficient permissions') || error.message.includes('last admin')) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to remove member from trip'
        });
    }
});

/**
 * PUT /api/trips/:id/members/:userId/role
 * Update a member's role in a trip
 */
router.put('/:id/members/:userId/role', authenticateToken, validateId, requireTripAdmin, async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = parseInt(req.params.userId);
        const { role } = req.body;

        if (!userId || !role) {
            return res.status(400).json({
                success: false,
                message: 'User ID and role are required'
            });
        }

        if (!['admin', 'member'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be "admin" or "member"'
            });
        }

        await Trip.updateMemberRole(tripId, userId, role, req.user.id);

        res.json({
            success: true,
            message: 'Member role updated successfully'
        });
    } catch (error) {
        console.error('Update member role error:', error);
        
        if (error.message.includes('Insufficient permissions')) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update member role'
        });
    }
});

/**
 * POST /api/trips/:id/invite
 * Invite someone to a trip by email
 */
router.post('/:id/invite', authenticateToken, validateId, validateEmail, requireTripMember, async (req, res) => {
    try {
        const tripId = req.params.id;
        const { email } = req.body;

        // TODO: Implement invitation system
        // For now, just return a placeholder response
        res.json({
            success: true,
            message: 'Invitation functionality coming soon',
            data: {
                tripId,
                email,
                invitedBy: req.user.id
            }
        });
    } catch (error) {
        console.error('Invite to trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send invitation'
        });
    }
});

/**
 * POST /api/trips/join/:inviteCode
 * Join a trip using invite code
 */
router.post('/join/:inviteCode', authenticateToken, async (req, res) => {
    try {
        const { inviteCode } = req.params;

        if (!inviteCode) {
            return res.status(400).json({
                success: false,
                message: 'Invite code is required'
            });
        }

        // Find trip by invite code
        const trip = await Trip.findByInviteCode(inviteCode);
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Invalid invite code'
            });
        }

        // Check if user is already a member
        const hasPermission = await Trip.userHasPermission(trip.id, req.user.id);
        if (hasPermission) {
            return res.status(409).json({
                success: false,
                message: 'You are already a member of this trip'
            });
        }

        // Add user as member
        await Trip.addMember(trip.id, req.user.id, 'member');

        res.json({
            success: true,
            message: 'Successfully joined the trip',
            data: trip.toJSON()
        });
    } catch (error) {
        console.error('Join trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to join trip'
        });
    }
});

/**
 * POST /api/trips/:id/regenerate-invite
 * Regenerate invite code for a trip
 */
router.post('/:id/regenerate-invite', authenticateToken, validateId, requireTripAdmin, async (req, res) => {
    try {
        const tripId = req.params.id;
        const newInviteCode = await Trip.regenerateInviteCode(tripId, req.user.id);

        res.json({
            success: true,
            message: 'Invite code regenerated successfully',
            data: {
                inviteCode: newInviteCode
            }
        });
    } catch (error) {
        console.error('Regenerate invite code error:', error);
        
        if (error.message.includes('Insufficient permissions')) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to regenerate invite code'
        });
    }
});

module.exports = router;
