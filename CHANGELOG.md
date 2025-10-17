# Changelog

All notable changes to the Go Together project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-17

### Added
- Initial release of Go Together web application
- User authentication system with JWT tokens
- Trip creation and management with invite codes
- Role-based permissions (admin/member)
- Material Design Web UI with responsive layout
- SQLite database with comprehensive schema
- RESTful API with input validation and security middleware
- Single-page application with client-side routing
- User profile management
- Trip dashboard with status indicators
- Development environment with hot reloading
- Comprehensive documentation and setup guides

### Features
- **Authentication**: Secure user registration and login
- **Trip Management**: Create, edit, and manage group trips
- **Member Management**: Invite users with unique codes
- **User Profiles**: Customizable profiles with camper preferences
- **Responsive Design**: Works on desktop and mobile devices
- **Security**: Password hashing, JWT tokens, input validation
- **Developer Experience**: Hot reloading, clear project structure

### Technical
- Node.js backend with Express.js framework
- SQLite database with migration system
- Webpack build system with development and production configs
- Material Design Web components and styling
- Comprehensive error handling and logging
- Rate limiting and security headers

### Database Schema
- Users table with profile information
- Trips table with location and date management
- Trip members with role-based access
- Shopping items, todo items, and notes (schema ready)
- Friend relationships and invitations system
- Password reset tokens

### API Endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management endpoints  
- `/api/trips/*` - Trip management endpoints
- `/api/health` - Health check endpoint

### Known Issues
- Shopping lists, todos, and notes features are planned for future releases
- Friend system implementation is pending
- Email notifications not yet implemented
- File upload for avatars not yet implemented

### Next Release Plans
- Shopping list functionality with Amazon integration
- Todo list with task assignments
- Rich text notes with Markdown support
- Friend system implementation
- Email notifications for invitations
- Progressive Web App (PWA) features
