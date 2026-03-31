import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database';

import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import faqRoutes from './routes/faqRoutes';
import blogRoutes from './routes/blogRoutes';
import heroRoutes from './routes/heroRoutes';
import catalogRoutes from './routes/catalogRoutes';

dotenv.config();

connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  console.log('Server will continue without database connection');
});

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/catalog', catalogRoutes);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: err.message || 'Something went wrong!' 
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`MongoDB connection status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected'}`);
});
