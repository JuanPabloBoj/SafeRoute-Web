import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado.' });
    }

    if (allowedRoles.length > 0 && req.user.nombreRol && !allowedRoles.includes(req.user.nombreRol)) {
      return res.status(403).json({ message: 'No tienes permisos suficientes para realizar esta acción.' });
    }

    next();
  };
};