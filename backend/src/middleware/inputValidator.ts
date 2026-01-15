import { body, validationResult } from 'express-validator';
import logger from '../utils/logger';

export const validateChatRequest = [
  body('messages')
    .isArray({ min: 1 })
    .withMessage('messages必须是非空数组'),
  body('messages.*.role')
    .isIn(['user', 'assistant'])
    .withMessage('role必须是user或assistant'),
  body('messages.*.content')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('content不能为空')
    .isLength({ max: 2000 })
    .withMessage('content长度不能超过2000字符'),
  body('model')
    .isString()
    .notEmpty()
    .withMessage('model不能为空'),
];

export const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', {
      errors: errors.array(),
      body: req.body,
    });
    return res.status(400).json({
      success: false,
      error: '输入验证失败',
      details: errors.array(),
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

export const sanitizeInput = (req: any, res: any, next: any) => {
  try {
    if (req.body.messages && Array.isArray(req.body.messages)) {
      req.body.messages = req.body.messages.map((msg: any) => ({
        ...msg,
        content: msg.content
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/<[^>]+>/g, '')
          .trim(),
      }));
    }
    next();
  } catch (error) {
    logger.error('Input sanitization failed', error);
    return res.status(400).json({
      success: false,
      error: '输入处理失败',
      timestamp: new Date().toISOString(),
    });
  }
};
