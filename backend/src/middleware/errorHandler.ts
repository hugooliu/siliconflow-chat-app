import logger from '../utils/logger';

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(err.status || 500).json({
    success: false,
    error: err.message || '服务器内部错误',
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (req: any, res: any) => {
  res.status(404).json({
    success: false,
    error: '接口不存在',
    timestamp: new Date().toISOString(),
  });
};
