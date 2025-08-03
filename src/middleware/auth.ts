import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { verifyToken } from '../utils/auth';
import { AuthUser } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }

    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};