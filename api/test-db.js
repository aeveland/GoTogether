import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Simple database test - just try to connect
    await prisma.$connect();
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful!',
      timestamp: new Date().toISOString(),
      testQuery: result
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  } finally {
    await prisma.$disconnect();
  }
}
