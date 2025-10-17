/**
 * Database connection and initialization
 * Handles SQLite database setup and provides connection methods
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.db = null;
        this.dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/gotogether.db');
        this.schemaPath = path.join(__dirname, '../../database/schema.sql');
    }

    /**
     * Initialize database connection and create tables if needed
     */
    async initialize() {
        try {
            // Ensure database directory exists
            const dbDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            // Connect to database
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err.message);
                    throw err;
                }
                console.log('Connected to SQLite database at:', this.dbPath);
            });

            // Enable foreign keys
            await this.run('PRAGMA foreign_keys = ON');

            // Create tables if they don't exist
            await this.createTables();

            return this.db;
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    /**
     * Create database tables from schema file
     */
    async createTables() {
        try {
            const schema = fs.readFileSync(this.schemaPath, 'utf8');
            
            // Split schema into individual statements and execute them
            // Handle multi-line statements properly (especially triggers)
            const statements = [];
            let currentStatement = '';
            let inTrigger = false;
            
            const lines = schema.split('\n');
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                
                // Skip empty lines and comments
                if (!trimmedLine || trimmedLine.startsWith('--')) {
                    continue;
                }
                
                currentStatement += line + '\n';
                
                // Check if we're entering a trigger
                if (trimmedLine.toUpperCase().includes('CREATE TRIGGER')) {
                    inTrigger = true;
                }
                
                // Check if we're ending a trigger or regular statement
                if (inTrigger && trimmedLine === 'END') {
                    statements.push(currentStatement.trim());
                    currentStatement = '';
                    inTrigger = false;
                } else if (!inTrigger && trimmedLine.endsWith(';')) {
                    statements.push(currentStatement.trim());
                    currentStatement = '';
                }
            }
            
            // Add any remaining statement
            if (currentStatement.trim()) {
                statements.push(currentStatement.trim());
            }
            
            // Execute each statement
            for (const statement of statements) {
                if (statement.trim()) {
                    console.log('Executing SQL:', statement.substring(0, 50) + '...');
                    await this.run(statement);
                }
            }
            
            console.log('Database tables created/verified successfully');
        } catch (error) {
            console.error('Error creating database tables:', error);
            throw error;
        }
    }

    /**
     * Execute a SQL query that doesn't return rows (INSERT, UPDATE, DELETE)
     * @param {string} sql - SQL query
     * @param {Array} params - Query parameters
     * @returns {Promise<object>} - Result with lastID and changes
     */
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    console.error('Database run error:', err.message);
                    console.error('SQL:', sql);
                    console.error('Params:', params);
                    reject(err);
                } else {
                    resolve({
                        lastID: this.lastID,
                        changes: this.changes
                    });
                }
            });
        });
    }

    /**
     * Execute a SQL query that returns a single row
     * @param {string} sql - SQL query
     * @param {Array} params - Query parameters
     * @returns {Promise<object|null>} - Single row or null
     */
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error('Database get error:', err.message);
                    console.error('SQL:', sql);
                    console.error('Params:', params);
                    reject(err);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    /**
     * Execute a SQL query that returns multiple rows
     * @param {string} sql - SQL query
     * @param {Array} params - Query parameters
     * @returns {Promise<Array>} - Array of rows
     */
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('Database all error:', err.message);
                    console.error('SQL:', sql);
                    console.error('Params:', params);
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }

    /**
     * Execute multiple SQL statements in a transaction
     * @param {Array} statements - Array of {sql, params} objects
     * @returns {Promise<Array>} - Array of results
     */
    async transaction(statements) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run('BEGIN TRANSACTION');
                
                const results = [];
                let completed = 0;
                let hasError = false;

                const executeStatement = (stmt, index) => {
                    this.db.run(stmt.sql, stmt.params || [], function(err) {
                        if (err && !hasError) {
                            hasError = true;
                            this.db.run('ROLLBACK');
                            reject(err);
                            return;
                        }

                        results[index] = {
                            lastID: this.lastID,
                            changes: this.changes
                        };

                        completed++;
                        if (completed === statements.length && !hasError) {
                            this.db.run('COMMIT', (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(results);
                                }
                            });
                        }
                    });
                };

                statements.forEach((stmt, index) => {
                    executeStatement(stmt, index);
                });
            });
        });
    }

    /**
     * Close database connection
     */
    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                        reject(err);
                    } else {
                        console.log('Database connection closed');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Get database connection (for direct access if needed)
     * @returns {sqlite3.Database} - Database connection
     */
    getConnection() {
        return this.db;
    }

    /**
     * Check if database is connected
     * @returns {boolean} - True if connected
     */
    isConnected() {
        return this.db !== null;
    }
}

// Export singleton instance
const database = new Database();
module.exports = database;
