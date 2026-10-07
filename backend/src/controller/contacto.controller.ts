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

export const obtenerContacto = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const usuarioId = req.user!.id;
    const contactoId = Number(req.params.id);
    const contacto = await contactoService.obtenerContacto(contactoId, usuarioId);
    res.status(200).json({ success: true, data: contacto });
  } catch (error) {
    next(error);
  }
};

export const crearContacto = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const usuarioId = req.user!.id;
    const nuevoContacto = await contactoService.crearContacto(usuarioId, req.body);
    res.status(201).json({ success: true, message: 'Contacto creado correctamente.', data: nuevoContacto });
  } catch (error) {
    next(error);
  }
};

export const actualizarContacto = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const usuarioId = req.user!.id;
    const contactoId = Number(req.params.id);
    const actualizado = await contactoService.actualizarContacto(contactoId, usuarioId, req.body);
    res.status(200).json({ success: true, message: 'Contacto actualizado correctamente.', data: actualizado });
  } catch (error) {
    next(error);
  }
};

export const eliminarContacto = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const usuarioId = req.user!.id;
    const contactoId = Number(req.params.id);
    await contactoService.eliminarContacto(contactoId, usuarioId);
    res.status(200).json({ success: true, message: 'Contacto eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
};
