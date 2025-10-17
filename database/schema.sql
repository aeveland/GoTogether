-- Go Together Database Schema
-- SQLite database schema for the Go Together application

-- Users table - stores user account information
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    camper_type VARCHAR(50), -- tent, trailer, rv, cabin, other
    dietary_preferences TEXT,
    group_size INTEGER DEFAULT 1,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trips table - stores trip information
CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by INTEGER NOT NULL,
    invite_code VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Trip members table - many-to-many relationship between users and trips
CREATE TABLE IF NOT EXISTS trip_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(50) DEFAULT 'member', -- admin, member
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(trip_id, user_id)
);

-- Shopping lists table - stores shopping list items for trips
CREATE TABLE IF NOT EXISTS shopping_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 1,
    unit VARCHAR(50), -- pieces, lbs, oz, etc.
    category VARCHAR(100), -- food, gear, supplies, etc.
    amazon_url VARCHAR(500),
    estimated_cost DECIMAL(10,2),
    assigned_to INTEGER, -- user who will bring this item
    is_purchased BOOLEAN DEFAULT 0,
    purchased_by INTEGER,
    purchased_at DATETIME,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (purchased_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Todo items table - stores todo/task items for trips
CREATE TABLE IF NOT EXISTS todo_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- prep, on-site, post-trip
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    assigned_to INTEGER, -- user assigned to this task
    is_completed BOOLEAN DEFAULT 0,
    completed_by INTEGER,
    completed_at DATETIME,
    due_date DATETIME,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (completed_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Notes table - stores rich text notes for trips
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL, -- Markdown content
    category VARCHAR(100), -- general, directions, contacts, etc.
    is_pinned BOOLEAN DEFAULT 0,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Friends/Contacts table - stores user relationships
CREATE TABLE IF NOT EXISTS user_friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, friend_id)
);

-- Invitations table - stores trip invitations
CREATE TABLE IF NOT EXISTS invitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    invited_by INTEGER NOT NULL,
    invite_token VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined, expired
    expires_at DATETIME NOT NULL,
    accepted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token VARCHAR(100) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_trips_created_by ON trips(created_by);
CREATE INDEX IF NOT EXISTS idx_trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_user_id ON trip_members(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_trip_id ON shopping_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_todo_items_trip_id ON todo_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_notes_trip_id ON notes(trip_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(invite_token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Create triggers to update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_trips_updated_at 
    AFTER UPDATE ON trips
    FOR EACH ROW
    BEGIN
        UPDATE trips SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_shopping_items_updated_at 
    AFTER UPDATE ON shopping_items
    FOR EACH ROW
    BEGIN
        UPDATE shopping_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_todo_items_updated_at 
    AFTER UPDATE ON todo_items
    FOR EACH ROW
    BEGIN
        UPDATE todo_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_notes_updated_at 
    AFTER UPDATE ON notes
    FOR EACH ROW
    BEGIN
        UPDATE notes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
