/**
 * Trip Model
 * Handles trip-related database operations
 */
const database = require('./database');
const crypto = require('crypto');

class Trip {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.location = data.location;
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.created_by = data.created_by;
        this.invite_code = data.invite_code;
        this.is_active = data.is_active !== undefined ? data.is_active : true;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.member_count = data.member_count;
        this.role = data.role; // User's role in this trip
    }

    /**
     * Create a new trip
     * @param {object} tripData - Trip data
     * @param {number} createdBy - User ID of trip creator
     * @returns {Promise<Trip>} - Created trip instance
     */
    static async create(tripData, createdBy) {
        try {
            const { name, description, location, start_date, end_date } = tripData;
            
            // Generate unique invite code
            const invite_code = Trip.generateInviteCode();

            // Insert trip into database
            const result = await database.run(
                `INSERT INTO trips (name, description, location, start_date, end_date, created_by, invite_code)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, description, location, start_date, end_date, createdBy, invite_code]
            );

            // Add creator as admin member
            await database.run(
                `INSERT INTO trip_members (trip_id, user_id, role)
                 VALUES (?, ?, 'admin')`,
                [result.lastID, createdBy]
            );

            // Return trip instance
            const trip = await Trip.findById(result.lastID, createdBy);
            return trip;
        } catch (error) {
            console.error('Error creating trip:', error);
            throw error;
        }
    }

    /**
     * Find trip by ID
     * @param {number} id - Trip ID
     * @param {number} userId - User ID (to get user's role)
     * @returns {Promise<Trip|null>} - Trip instance or null
     */
    static async findById(id, userId = null) {
        try {
            let query, params;
            
            if (userId) {
                query = `
                    SELECT t.*, tm.role, COUNT(tm2.user_id) as member_count
                    FROM trips t
                    LEFT JOIN trip_members tm ON t.id = tm.trip_id AND tm.user_id = ?
                    LEFT JOIN trip_members tm2 ON t.id = tm2.trip_id
                    WHERE t.id = ? AND t.is_active = 1
                    GROUP BY t.id, tm.role
                `;
                params = [userId, id];
            } else {
                query = `
                    SELECT t.*, COUNT(tm.user_id) as member_count
                    FROM trips t
                    LEFT JOIN trip_members tm ON t.id = tm.trip_id
                    WHERE t.id = ? AND t.is_active = 1
                    GROUP BY t.id
                `;
                params = [id];
            }

            const row = await database.get(query, params);
            return row ? new Trip(row) : null;
        } catch (error) {
            console.error('Error finding trip by ID:', error);
            throw error;
        }
    }

    /**
     * Find trip by invite code
     * @param {string} inviteCode - Invite code
     * @returns {Promise<Trip|null>} - Trip instance or null
     */
    static async findByInviteCode(inviteCode) {
        try {
            const row = await database.get(
                `SELECT t.*, COUNT(tm.user_id) as member_count
                 FROM trips t
                 LEFT JOIN trip_members tm ON t.id = tm.trip_id
                 WHERE t.invite_code = ? AND t.is_active = 1
                 GROUP BY t.id`,
                [inviteCode]
            );

            return row ? new Trip(row) : null;
        } catch (error) {
            console.error('Error finding trip by invite code:', error);
            throw error;
        }
    }

    /**
     * Update trip
     * @param {number} id - Trip ID
     * @param {object} updateData - Data to update
     * @param {number} userId - User ID (for permission check)
     * @returns {Promise<Trip|null>} - Updated trip instance
     */
    static async update(id, updateData, userId) {
        try {
            // Check if user has permission to update
            const hasPermission = await Trip.userHasPermission(id, userId, ['admin']);
            if (!hasPermission) {
                throw new Error('Insufficient permissions to update trip');
            }

            const allowedFields = ['name', 'description', 'location', 'start_date', 'end_date'];
            const updates = [];
            const values = [];

            // Build dynamic update query
            for (const [key, value] of Object.entries(updateData)) {
                if (allowedFields.includes(key) && value !== undefined) {
                    updates.push(`${key} = ?`);
                    values.push(value);
                }
            }

            if (updates.length === 0) {
                throw new Error('No valid fields to update');
            }

            values.push(id);

            await database.run(
                `UPDATE trips SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            return await Trip.findById(id, userId);
        } catch (error) {
            console.error('Error updating trip:', error);
            throw error;
        }
    }

    /**
     * Delete trip (soft delete)
     * @param {number} id - Trip ID
     * @param {number} userId - User ID (for permission check)
     * @returns {Promise<boolean>} - Success status
     */
    static async delete(id, userId) {
        try {
            // Check if user has permission to delete
            const hasPermission = await Trip.userHasPermission(id, userId, ['admin']);
            if (!hasPermission) {
                throw new Error('Insufficient permissions to delete trip');
            }

            await database.run(
                'UPDATE trips SET is_active = 0 WHERE id = ?',
                [id]
            );

            return true;
        } catch (error) {
            console.error('Error deleting trip:', error);
            throw error;
        }
    }

    /**
     * Get trip members
     * @param {number} tripId - Trip ID
     * @returns {Promise<Array>} - Array of trip members
     */
    static async getMembers(tripId) {
        try {
            const rows = await database.all(
                `SELECT u.id, u.email, u.name, u.bio, u.camper_type, u.dietary_preferences, 
                        u.group_size, u.avatar_url, tm.role, tm.joined_at
                 FROM trip_members tm
                 JOIN users u ON tm.user_id = u.id
                 WHERE tm.trip_id = ? AND u.is_active = 1
                 ORDER BY tm.role DESC, u.name`,
                [tripId]
            );

            return rows;
        } catch (error) {
            console.error('Error getting trip members:', error);
            throw error;
        }
    }

    /**
     * Add member to trip
     * @param {number} tripId - Trip ID
     * @param {number} userId - User ID to add
     * @param {string} role - Member role (default: 'member')
     * @returns {Promise<boolean>} - Success status
     */
    static async addMember(tripId, userId, role = 'member') {
        try {
            await database.run(
                `INSERT INTO trip_members (trip_id, user_id, role)
                 VALUES (?, ?, ?)`,
                [tripId, userId, role]
            );

            return true;
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                throw new Error('User is already a member of this trip');
            }
            console.error('Error adding trip member:', error);
            throw error;
        }
    }

    /**
     * Remove member from trip
     * @param {number} tripId - Trip ID
     * @param {number} userId - User ID to remove
     * @param {number} requesterId - User ID making the request
     * @returns {Promise<boolean>} - Success status
     */
    static async removeMember(tripId, userId, requesterId) {
        try {
            // Check permissions - admin can remove anyone, users can remove themselves
            const hasPermission = await Trip.userHasPermission(tripId, requesterId, ['admin']);
            if (!hasPermission && userId !== requesterId) {
                throw new Error('Insufficient permissions to remove member');
            }

            // Don't allow removing the last admin
            if (hasPermission) {
                const adminCount = await database.get(
                    'SELECT COUNT(*) as count FROM trip_members WHERE trip_id = ? AND role = "admin"',
                    [tripId]
                );
                
                const userRole = await database.get(
                    'SELECT role FROM trip_members WHERE trip_id = ? AND user_id = ?',
                    [tripId, userId]
                );

                if (adminCount.count <= 1 && userRole?.role === 'admin') {
                    throw new Error('Cannot remove the last admin from the trip');
                }
            }

            await database.run(
                'DELETE FROM trip_members WHERE trip_id = ? AND user_id = ?',
                [tripId, userId]
            );

            return true;
        } catch (error) {
            console.error('Error removing trip member:', error);
            throw error;
        }
    }

    /**
     * Update member role
     * @param {number} tripId - Trip ID
     * @param {number} userId - User ID to update
     * @param {string} newRole - New role
     * @param {number} requesterId - User ID making the request
     * @returns {Promise<boolean>} - Success status
     */
    static async updateMemberRole(tripId, userId, newRole, requesterId) {
        try {
            // Check if requester has admin permission
            const hasPermission = await Trip.userHasPermission(tripId, requesterId, ['admin']);
            if (!hasPermission) {
                throw new Error('Insufficient permissions to update member role');
            }

            await database.run(
                'UPDATE trip_members SET role = ? WHERE trip_id = ? AND user_id = ?',
                [newRole, tripId, userId]
            );

            return true;
        } catch (error) {
            console.error('Error updating member role:', error);
            throw error;
        }
    }

    /**
     * Check if user has permission for trip
     * @param {number} tripId - Trip ID
     * @param {number} userId - User ID
     * @param {Array} allowedRoles - Array of allowed roles
     * @returns {Promise<boolean>} - True if user has permission
     */
    static async userHasPermission(tripId, userId, allowedRoles = ['admin', 'member']) {
        try {
            const row = await database.get(
                'SELECT role FROM trip_members WHERE trip_id = ? AND user_id = ?',
                [tripId, userId]
            );

            return row && allowedRoles.includes(row.role);
        } catch (error) {
            console.error('Error checking user permission:', error);
            return false;
        }
    }

    /**
     * Generate unique invite code
     * @returns {string} - Invite code
     */
    static generateInviteCode() {
        return crypto.randomBytes(4).toString('hex').toUpperCase();
    }

    /**
     * Regenerate invite code for trip
     * @param {number} tripId - Trip ID
     * @param {number} userId - User ID (for permission check)
     * @returns {Promise<string>} - New invite code
     */
    static async regenerateInviteCode(tripId, userId) {
        try {
            // Check if user has permission
            const hasPermission = await Trip.userHasPermission(tripId, userId, ['admin']);
            if (!hasPermission) {
                throw new Error('Insufficient permissions to regenerate invite code');
            }

            const newInviteCode = Trip.generateInviteCode();
            
            await database.run(
                'UPDATE trips SET invite_code = ? WHERE id = ?',
                [newInviteCode, tripId]
            );

            return newInviteCode;
        } catch (error) {
            console.error('Error regenerating invite code:', error);
            throw error;
        }
    }

    /**
     * Get trips for user with pagination
     * @param {number} userId - User ID
     * @param {object} options - Query options
     * @returns {Promise<object>} - Trips with pagination info
     */
    static async getUserTrips(userId, options = {}) {
        try {
            const { page = 1, limit = 20, status = 'all' } = options;
            const offset = (page - 1) * limit;

            let statusCondition = '';
            const params = [userId];

            if (status === 'upcoming') {
                statusCondition = 'AND t.start_date > date("now")';
            } else if (status === 'live') {
                statusCondition = 'AND t.start_date <= date("now") AND t.end_date >= date("now")';
            } else if (status === 'past') {
                statusCondition = 'AND t.end_date < date("now")';
            }

            const query = `
                SELECT t.*, tm.role, COUNT(tm2.user_id) as member_count
                FROM trips t
                JOIN trip_members tm ON t.id = tm.trip_id
                LEFT JOIN trip_members tm2 ON t.id = tm2.trip_id
                WHERE tm.user_id = ? AND t.is_active = 1 ${statusCondition}
                GROUP BY t.id, tm.role
                ORDER BY t.start_date DESC
                LIMIT ? OFFSET ?
            `;

            params.push(limit, offset);

            const rows = await database.all(query, params);
            const trips = rows.map(row => new Trip(row));

            // Get total count
            const countQuery = `
                SELECT COUNT(DISTINCT t.id) as total
                FROM trips t
                JOIN trip_members tm ON t.id = tm.trip_id
                WHERE tm.user_id = ? AND t.is_active = 1 ${statusCondition}
            `;

            const countResult = await database.get(countQuery, [userId]);
            const total = countResult.total;

            return {
                trips,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Error getting user trips:', error);
            throw error;
        }
    }

    /**
     * Convert to JSON
     * @returns {object} - Trip data for API responses
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            location: this.location,
            start_date: this.start_date,
            end_date: this.end_date,
            created_by: this.created_by,
            invite_code: this.invite_code,
            member_count: this.member_count,
            role: this.role,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = Trip;
