import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import schoolRoutes from './routes/schoolRoutes';

// Load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
export const prisma = new PrismaClient();


// Connecting to PostgreSQL database
async function connectPostgres() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }
}

//Connecting to Redis client
export const redis = new Redis(process.env.REDIS_URL!);

redis.on('connect', () => console.log('✅ Connected to Redis'));
redis.on('error', (error) => console.error('❌ Redis connection error:', error));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', schoolRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'School Management API is running' });
});


app.listen(port, async () => {
  await connectPostgres();
  console.log(`🚀 Server is running on port ${port}`);
});


process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await redis.quit();
  console.log('🛑 Server shutting down');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  await redis.quit();
  console.log('🛑 Server shutting down');
  process.exit(0);
});
