import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRateLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import chatRoutes from './routes/chat';
import healthRoutes from './routes/health';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/health', healthRoutes);

const rateLimiter = createRateLimiter();
app.use('/api/chat', rateLimiter);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'SiliconFlow Chat API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      chat: '/api/chat/completions',
      models: '/api/chat/models',
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`API Key configured: ${!!process.env.SILICONFLOW_API_KEY}`);
});

export default app;
