import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AlertaService } from '../services/alerta.service';

const alertaService = new AlertaService();

export const crearAlerta = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const usuarioId = req.user!.id;
    const alerta = await alertaService.crearAlerta(usuarioId, req.body);
    res.status(201).json({ success: true, data: alerta });
  } catch (error) {
    next(error);
  }
};

export const registrarGpsContinuo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const alertaId = parseInt(req.params.id, 10);
    const seguimiento = await alertaService.registrarGpsContinuo(alertaId, req.body);
    res.status(200).json({ success: true, data: seguimiento });
  } catch (error) {
    next(error);
  }
};

export const obtenerUbicacionPublica = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tokenPublico = req.params.tokenPublico;
    const data = await alertaService.obtenerUbicacionPublica(tokenPublico);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const listarAlertasActivas = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const alertas = await alertaService.listarAlertasActivas();
    res.status(200).json({ success: true, data: alertas });
  } catch (error) {
    next(error);
  }
};

export const actualizarEstadoAlerta = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const alertaId = parseInt(req.params.id, 10);
    const operadorId = req.user!.id;
    const actualizada = await alertaService.actualizarEstado(alertaId, operadorId, req.body);
    res.status(200).json({ success: true, data: actualizada });
  } catch (error) {
    next(error);
  }
};