/**
 * User Model
 * Handles user-related database operations
 */
const bcrypt = require('bcryptjs');
const database = require('./database');

class User {
    constructor(data = {}) {
        this.id = data.id;
        this.email = data.email;
        this.name = data.name;
        this.bio = data.bio;
        this.camper_type = data.camper_type;
        this.dietary_preferences = data.dietary_preferences;
        this.group_size = data.group_size || 1;
        this.avatar_url = data.avatar_url;
        this.is_active = data.is_active !== undefined ? data.is_active : true;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    /**
     * Create a new user
     * @param {object} userData - User data
     * @returns {Promise<User>} - Created user instance
     */
    static async create(userData) {
        try {
            const { email, password, name, bio, camper_type, dietary_preferences, group_size } = userData;

            // Hash password
            const saltRounds = 12;
            const password_hash = await bcrypt.hash(password, saltRounds);

            // Insert user into database
            const result = await database.run(
                `INSERT INTO users (email, password_hash, name, bio, camper_type, dietary_preferences, group_size)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [email.toLowerCase(), password_hash, name, bio, camper_type, dietary_preferences, group_size || 1]
            );

            // Return user instance without password
            const user = await User.findById(result.lastID);
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    /**
     * Find user by ID
     * @param {number} id - User ID
     * @returns {Promise<User|null>} - User instance or null
     */
    static async findById(id) {
        try {
            const row = await database.get(
                'SELECT id, email, name, bio, camper_type, dietary_preferences, group_size, avatar_url, is_active, created_at, updated_at FROM users WHERE id = ? AND is_active = 1',
                [id]
            );

            return row ? new User(row) : null;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    /**
     * Find user by email
     * @param {string} email - User email
     * @returns {Promise<User|null>} - User instance or null
     */
    static async findByEmail(email) {
        try {
            const row = await database.get(
                'SELECT id, email, name, bio, camper_type, dietary_preferences, group_size, avatar_url, is_active, created_at, updated_at FROM users WHERE email = ? AND is_active = 1',
                [email.toLowerCase()]
            );

            return row ? new User(row) : null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    /**
     * Find user by email with password hash (for authentication)
     * @param {string} email - User email
     * @returns {Promise<object|null>} - User data with password hash or null
     */
    static async findByEmailWithPassword(email) {
        try {
            const row = await database.get(
                'SELECT * FROM users WHERE email = ? AND is_active = 1',
                [email.toLowerCase()]
            );

            return row || null;
        } catch (error) {
            console.error('Error finding user by email with password:', error);
            throw error;
        }
    }

    /**
     * Verify user password
     * @param {string} email - User email
     * @param {string} password - Plain text password
     * @returns {Promise<User|null>} - User instance if password is correct, null otherwise
     */
    static async verifyPassword(email, password) {
        try {
            const userData = await User.findByEmailWithPassword(email);
            if (!userData) {
                return null;
            }

            const isValid = await bcrypt.compare(password, userData.password_hash);
            if (!isValid) {
                return null;
            }

            // Return user instance without password
            return new User(userData);
        } catch (error) {
            console.error('Error verifying password:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     * @param {number} id - User ID
     * @param {object} updateData - Data to update
     * @returns {Promise<User|null>} - Updated user instance
     */
    static async update(id, updateData) {
        try {
            const allowedFields = ['name', 'bio', 'camper_type', 'dietary_preferences', 'group_size', 'avatar_url'];
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
                `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            return await User.findById(id);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    /**
     * Update user password
     * @param {number} id - User ID
     * @param {string} newPassword - New password
     * @returns {Promise<boolean>} - Success status
     */
    static async updatePassword(id, newPassword) {
        try {
            const saltRounds = 12;
            const password_hash = await bcrypt.hash(newPassword, saltRounds);

            await database.run(
                'UPDATE users SET password_hash = ? WHERE id = ?',
                [password_hash, id]
            );

            return true;
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }

    /**
     * Search users by email or name
     * @param {string} query - Search query
     * @param {number} limit - Maximum results to return
     * @returns {Promise<Array>} - Array of user instances
     */
    static async search(query, limit = 10) {
        try {
            const searchTerm = `%${query}%`;
            const rows = await database.all(
                `SELECT id, email, name, bio, camper_type, avatar_url, created_at 
                 FROM users 
                 WHERE (email LIKE ? OR name LIKE ?) AND is_active = 1 
                 ORDER BY name 
                 LIMIT ?`,
                [searchTerm, searchTerm, limit]
            );

            return rows.map(row => new User(row));
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }

    /**
     * Deactivate user account (soft delete)
     * @param {number} id - User ID
     * @returns {Promise<boolean>} - Success status
     */
    static async deactivate(id) {
        try {
            await database.run(
                'UPDATE users SET is_active = 0 WHERE id = ?',
                [id]
            );

            return true;
        } catch (error) {
            console.error('Error deactivating user:', error);
            throw error;
        }
    }

    /**
     * Get user's trips
     * @param {number} userId - User ID
     * @returns {Promise<Array>} - Array of trips
     */
    static async getTrips(userId) {
        try {
            const rows = await database.all(
                `SELECT t.*, tm.role, 
                        COUNT(tm2.user_id) as member_count
                 FROM trips t
                 JOIN trip_members tm ON t.id = tm.trip_id
                 LEFT JOIN trip_members tm2 ON t.id = tm2.trip_id
                 WHERE tm.user_id = ? AND t.is_active = 1
                 GROUP BY t.id, tm.role
                 ORDER BY t.start_date DESC`,
                [userId]
            );

            return rows;
        } catch (error) {
            console.error('Error getting user trips:', error);
            throw error;
        }
    }

    /**
     * Check if email exists
     * @param {string} email - Email to check
     * @returns {Promise<boolean>} - True if email exists
     */
    static async emailExists(email) {
        try {
            const row = await database.get(
                'SELECT id FROM users WHERE email = ?',
                [email.toLowerCase()]
            );

            return !!row;
        } catch (error) {
            console.error('Error checking email existence:', error);
            throw error;
        }
    }

    /**
     * Get user's friends
     * @param {number} userId - User ID
     * @returns {Promise<Array>} - Array of friends
     */
    static async getFriends(userId) {
        try {
            const rows = await database.all(
                `SELECT u.id, u.email, u.name, u.bio, u.camper_type, u.avatar_url, uf.status, uf.created_at as friendship_date
                 FROM user_friends uf
                 JOIN users u ON (uf.friend_id = u.id)
                 WHERE uf.user_id = ? AND uf.status = 'accepted' AND u.is_active = 1
                 ORDER BY u.name`,
                [userId]
            );

            return rows.map(row => new User(row));
        } catch (error) {
            console.error('Error getting user friends:', error);
            throw error;
        }
    }

    /**
     * Convert to JSON (exclude sensitive data)
     * @returns {object} - User data for API responses
     */
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            bio: this.bio,
            camper_type: this.camper_type,
            dietary_preferences: this.dietary_preferences,
            group_size: this.group_size,
            avatar_url: this.avatar_url,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = User;
