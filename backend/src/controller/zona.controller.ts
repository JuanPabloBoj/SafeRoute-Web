import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ZonaService } from '../services/zona.service';

const zonaService = new ZonaService();

export const listarZonas = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const zonas = await zonaService.listarTodas();
    res.status(200).json({ success: true, data: zonas });
  } catch (error) {
    next(error);
  }
};

export const crearZona = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const registradoPor = req.user!.id;
    const nuevaZona = await zonaService.crearZona(registradoPor, req.body);
    res.status(201).json({ success: true, data: nuevaZona });
  } catch (error) {
    next(error);
  }
};

export const actualizarZona = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const actualizada = await zonaService.actualizarZona(id, req.body);
    res.status(200).json({ success: true, data: actualizada });
  } catch (error) {
    next(error);
  }
};

export const eliminarZona = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    await zonaService.eliminarZona(id);
    res.status(200).json({ success: true, message: 'Zona eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
};