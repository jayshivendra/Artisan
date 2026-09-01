import express from 'express';
import cors from 'cors';
import { initializeSeedData } from './db/seedData.js';
import { productRouter } from './routes/productRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { aiRouter } from './routes/aiRoutes.js';
import { buyerRouter } from './routes/buyerRoutes.js';
import { authRouter } from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize sample data
initializeSeedData();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'KarigarAI / ShilpMitra Artisan Business Manager API',
    version: '1.0.0'
  });
});

// Mount routes
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/ai', aiRouter);
app.use('/api/buyers', buyerRouter);
app.use('/api/auth', authRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 KarigarAI Backend Server running on http://localhost:${PORT}`);
});
