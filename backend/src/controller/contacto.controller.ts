import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ContactoService } from '../services/contacto.service';

const contactoService = new ContactoService();

export const obtenerContactos = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const usuarioId = req.user!.id;
    const contactos = await contactoService.obtenerPorUsuario(usuarioId);
    res.status(200).json({ success: true, data: contactos });
  } catch (error) {
    next(error);
  }
};

export const crearContacto = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const usuarioId = req.user!.id;
    const nuevoContacto = await contactoService.crearContacto(usuarioId, req.body);
    res.status(201).json({ success: true, data: nuevoContacto });
  } catch (error) {
    next(error);
  }
};

export const eliminarContacto = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const usuarioId = req.user!.id;
    const contactoId = parseInt(req.params.id, 10);
    await contactoService.eliminarContacto(contactoId, usuarioId);
    res.status(200).json({ success: true, message: 'Contacto eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
};