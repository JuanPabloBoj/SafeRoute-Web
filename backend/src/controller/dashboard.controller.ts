import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

export const obtenerMetricas = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const metricas = await dashboardService.obtenerMetricas();
    res.status(200).json({ success: true, data: metricas });
  } catch (error) {
    next(error);
  }
};