import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'GoTogether Railway Server is running!' 
  });
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$connect();
    
    // Simple test query
    const result = await prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp`;
    
    // Test if new tables exist
    let tablesStatus = {};
    try {
      const tripCount = await prisma.trip.count();
      const userCount = await prisma.user.count();
      const listCount = await prisma.tripList.count();
      const itemCount = await prisma.listItem.count();
      
      tablesStatus = {
        users: userCount,
        trips: tripCount,
        tripLists: listCount,
        listItems: itemCount,
        newTablesExist: true
      };
    } catch (tableError) {
      tablesStatus = {
        newTablesExist: false,
        error: tableError.message
      };
    }
    
    res.json({
      success: true,
      message: 'Database connection successful!',
      data: result,
      tables: tablesStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected route example
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === TRIP MANAGEMENT ENDPOINTS ===

// Get all trips for the authenticated user
app.get('/api/trips', authenticateToken, async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          { createdById: req.user.id },
          { participants: { some: { userId: req.user.id } } }
        ]
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { startDate: 'asc' }
    });

    res.json({
      success: true,
      trips
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new trip
app.post('/api/trips', authenticateToken, async (req, res) => {
  try {
    const { title, description, location, startDate, endDate } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: 'Title, start date, and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const trip = await prisma.trip.create({
      data: {
        title,
        description,
        location,
        startDate: start,
        endDate: end,
        createdById: req.user.id
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    // Add creator as a participant with "creator" role
    await prisma.tripParticipant.create({
      data: {
        userId: req.user.id,
        tripId: trip.id,
        role: 'creator'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific trip
app.get('/api/trips/:id', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { createdById: req.user.id },
          { participants: { some: { userId: req.user.id } } }
        ]
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or access denied' });
    }

    res.json({
      success: true,
      trip
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a trip (only creator can update)
app.put('/api/trips/:id', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const { title, description, location, startDate, endDate } = req.body;

    // Check if user is the creator
    const existingTrip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        createdById: req.user.id
      }
    });

    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found or you do not have permission to edit' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);

    if (updateData.startDate && updateData.endDate && updateData.startDate >= updateData.endDate) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Trip updated successfully',
      trip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a trip (only creator can delete)
app.delete('/api/trips/:id', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);

    // Check if user is the creator
    const existingTrip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        createdById: req.user.id
      }
    });

    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found or you do not have permission to delete' });
    }

    // Delete participants first (due to foreign key constraints)
    await prisma.tripParticipant.deleteMany({
      where: { tripId }
    });

    // Delete the trip
    await prisma.trip.delete({
      where: { id: tripId }
    });

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === LIST MANAGEMENT ENDPOINTS ===

// Get all lists for a trip
app.get('/api/trips/:tripId/lists', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);

    // Check if user has access to this trip
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { createdById: req.user.id },
          { participants: { some: { userId: req.user.id } } }
        ]
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or access denied' });
    }

    const lists = await prisma.tripList.findMany({
      where: { tripId },
      include: {
        items: {
          include: {
            assignedTo: {
              select: { id: true, name: true, email: true }
            },
            createdBy: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: [
            { status: 'asc' },
            { priority: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      success: true,
      lists
    });
  } catch (error) {
    console.error('Get lists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new list for a trip
app.post('/api/trips/:tripId/lists', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const { title, type, description } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    if (!['SHOPPING', 'TODO', 'INFO'].includes(type)) {
      return res.status(400).json({ error: 'Type must be SHOPPING, TODO, or INFO' });
    }

    // Check if user has access to this trip
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { createdById: req.user.id },
          { participants: { some: { userId: req.user.id } } }
        ]
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or access denied' });
    }

    const list = await prisma.tripList.create({
      data: {
        tripId,
        title,
        type,
        description
      },
      include: {
        items: {
          include: {
            assignedTo: {
              select: { id: true, name: true, email: true }
            },
            createdBy: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'List created successfully',
      list
    });
  } catch (error) {
    console.error('Create list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to a list
app.post('/api/trips/:tripId/lists/:listId/items', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const listId = parseInt(req.params.listId);
    const { title, description, priority, dueDate, assignedToId } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Check if user has access to this trip
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { createdById: req.user.id },
          { participants: { some: { userId: req.user.id } } }
        ]
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or access denied' });
    }

    // Check if list belongs to this trip
    const list = await prisma.tripList.findFirst({
      where: { id: listId, tripId }
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const item = await prisma.listItem.create({
      data: {
        listId,
        title,
        description,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId: assignedToId || null,
        createdById: req.user.id
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      item
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a list item
app.patch('/api/trips/:tripId/lists/:listId/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const listId = parseInt(req.params.listId);
    const itemId = parseInt(req.params.itemId);
    const { title, description, priority, status, dueDate, assignedToId } = req.body;

    // Check if user has access to this trip
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { createdById: req.user.id },
          { participants: { some: { userId: req.user.id } } }
        ]
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or access denied' });
    }

    // Check if item exists and belongs to the list
    const existingItem = await prisma.listItem.findFirst({
      where: { id: itemId, listId }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId;

    const item = await prisma.listItem.update({
      where: { id: itemId },
      data: updateData,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's assigned tasks across all trips
app.get('/api/my-tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await prisma.listItem.findMany({
      where: {
        assignedToId: req.user.id,
        status: { not: 'COMPLETED' }
      },
      include: {
        list: {
          include: {
            trip: {
              select: { id: true, title: true, startDate: true, endDate: true }
            }
          }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React app (production) or fallback to old HTML (development)
if (process.env.NODE_ENV === 'production') {
  // Serve React build files
  app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
  
  // Handle React routing - send all non-API requests to React
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  });
} else {
  // Development: serve the old HTML for testing
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GoTogether server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/api/test-db`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
