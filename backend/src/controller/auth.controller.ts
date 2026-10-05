import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const registrar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resultado = await authService.registrar(req.body);
    res.status(201).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resultado = await authService.login(req.body);
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    next(error);
  }
};