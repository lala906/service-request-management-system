import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Authorization header missing',
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Invalid Authorization format',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret_key'
    ) as {
      id: string;
      email: string;
      role: 'USER' | 'ADMIN';
    };

    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid Token',
      details: (err as Error).message,
    });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Admin access required',
    });
  }

  return next();
};