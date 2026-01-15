import rateLimit from 'express-rate-limit';
import logger from '../utils/logger';

export const createRateLimiter = () => {
  return rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: {
      success: false,
      error: '请求过于频繁,请稍后再试',
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
      });
      res.status(429).json({
        success: false,
        error: '请求过于频繁,请稍后再试',
        timestamp: new Date().toISOString(),
      });
    },
  });
};
