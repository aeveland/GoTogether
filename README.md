# Go Together 🏕️

**Group Trip Planner and Shared Task Manager**

Go Together is a web application for planning group trips, camping weekends, and off-road adventures with friends. It keeps everything organized in one shared space so everyone knows what to bring, what to do, and when to show up.

## Features

### Core Functionality
- **Trips** – Create trips with a name, location, and date range. Invite friends (campers) to join and collaborate.
- **Shopping Lists** – Shared lists for food, gear, or supplies. Each item can include quantity, notes, and optionally link to Amazon products.
- **To-Dos** – Group task lists for prep and on-site activities. Assign items to specific campers.
- **Notes** – Rich text notes with Markdown support for things like directions, Starlink details, or shared photo album links.
- **Profiles** – Each camper has a profile with name, bio, camper type (tent, trailer, RV, etc.), dietary preferences, and number of people in their group.
- **Friends** – Add or invite friends. If someone doesn't have an account, the app generates an invite code so they can sign up and automatically join your group.

### Additional Features
- **Trip Management** – View upcoming, live, and past trips. Edit trip details, members, and notes anytime.
- **Quick Actions** – Helpful shortcuts for new users, like one-tap add options for common shopping or to-do items.
- **Amazon Integration** – Suggests affiliate-linked items from Amazon on the shopping page and when creating new items.
- **User Account Tools** – Update username and name, recover forgotten passwords or usernames, and manage account settings.

## Technology Stack

### Frontend
- **Framework**: Vanilla JavaScript with Material Design Web (MDW) components
- **Build Tool**: Webpack 5
- **Styling**: Material Design Web CSS + Custom CSS
- **Icons**: Material Icons
- **Fonts**: Roboto

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **Authentication**: JWT-based authentication
- **Validation**: express-validator
- **Security**: Helmet.js, CORS, bcrypt

### Development Tools
- **Package Manager**: npm
- **Development Server**: Webpack Dev Server + Nodemon
- **Testing**: Jest (configured)
- **Code Quality**: ESLint (ready to configure)

## Project Structure

```
goTogether/
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   │   ├── index.html     # Main HTML template
│   │   └── manifest.json  # PWA manifest
│   └── src/               # Source code
│       ├── components/    # Reusable components (future)
│       ├── pages/         # Page components
│       │   ├── login.js   # Login/signup page
│       │   ├── dashboard.js # Main dashboard
│       │   ├── trip.js    # Trip details page
│       │   └── profile.js # User profile page
│       ├── styles/        # CSS files
│       │   └── main.css   # Main stylesheet
│       └── utils/         # Utility modules
│           ├── api.js     # API service
│           ├── auth.js    # Authentication service
│           ├── router.js  # Client-side router
│           └── component-registry.js
├── server/                # Backend application
│   ├── middleware/        # Express middleware
│   │   ├── auth.js       # Authentication middleware
│   │   └── validation.js # Request validation
│   ├── models/           # Database models
│   │   ├── database.js   # Database connection
│   │   ├── User.js       # User model
│   │   └── Trip.js       # Trip model
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── users.js      # User management routes
│   │   └── trips.js      # Trip management routes
│   └── index.js          # Server entry point
├── database/             # Database files
│   └── schema.sql        # Database schema
├── tests/                # Test files
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
├── webpack.*.js          # Webpack configurations
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goTogether
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your settings:
   - `JWT_SECRET`: Generate a secure random string
   - `PORT`: Server port (default: 3000)
   - `DB_PATH`: Database file path
   - `AMAZON_AFFILIATE_TAG`: Your Amazon affiliate tag (optional)

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   This starts both the backend server (port 3000) and frontend dev server (port 8080).

### Development Commands

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server:dev` - Start only the backend server with nodemon
- `npm run client:dev` - Start only the frontend dev server
- `npm run build` - Build the frontend for production
- `npm test` - Run tests
- `npm start` - Start the production server

### Building for Production

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set environment to production**
   ```bash
   export NODE_ENV=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Endpoints
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users
- `GET /api/users/trips` - Get user's trips
- `GET /api/users/friends` - Get user's friends

### Trip Endpoints
- `GET /api/trips` - Get user's trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `GET /api/trips/:id/members` - Get trip members
- `POST /api/trips/:id/members` - Add member to trip
- `POST /api/trips/join/:inviteCode` - Join trip with invite code

### Health Check
- `GET /api/health` - Server health status

## Database Schema

The application uses SQLite for development with the following main tables:
- `users` - User accounts and profiles
- `trips` - Trip information
- `trip_members` - Trip membership (many-to-many)
- `shopping_items` - Shopping list items
- `todo_items` - Todo/task items
- `notes` - Rich text notes
- `user_friends` - Friend relationships
- `invitations` - Trip invitations

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Comprehensive request validation
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Cross-origin request security
- **Helmet.js** - Security headers

## Design Philosophy

Go Together is designed to be simple, fast, and social. It replaces scattered group chats, shared notes, and spreadsheets with one intuitive interface built around collaboration and real-world trip planning.

The application follows Material Design principles for a consistent, accessible user experience across devices.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [your-email] or create an issue in the repository.

---

**Happy camping! 🏕️⛰️🚐**
