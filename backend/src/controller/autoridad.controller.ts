import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { AutoridadService } from '../services/autoridad.service';

const autoridadService = new AutoridadService();

export const listarAutoridades = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const autoridades = await autoridadService.listar();
    res.status(200).json({ success: true, data: autoridades });
  } catch (error) {
    next(error);
  }
};

export const listarAutoridadesPorPais = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const autoridades = await autoridadService.listarPorPais(req.params.codigo);
    res.status(200).json({ success: true, data: autoridades });
  } catch (error) {
    next(error);
  }
};

export const obtenerAutoridad = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const autoridad = await autoridadService.obtenerPorId(id);
    res.status(200).json({ success: true, data: autoridad });
  } catch (error) {
    next(error);
  }
};

export const crearAutoridad = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const nueva = await autoridadService.crear(req.body);
    res.status(201).json({ success: true, message: 'Autoridad creada correctamente.', data: nueva });
  } catch (error) {
    next(error);
  }
};

export const actualizarAutoridad = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const actualizada = await autoridadService.actualizar(id, req.body);
    res.status(200).json({ success: true, message: 'Autoridad actualizada correctamente.', data: actualizada });
  } catch (error) {
    next(error);
  }
};

export const eliminarAutoridad = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await autoridadService.eliminar(id);
    res.status(200).json({ success: true, message: 'Autoridad eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
};
