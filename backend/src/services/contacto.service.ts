import db from '../config/db';
import { AppError } from '../utils/app-error';
import { CrearContactoDto, ActualizarContactoDto } from '../dtos/contacto.dto';

const MAX_CONTACTOS_POR_USUARIO = 8;

export class ContactoService {
  async obtenerPorUsuario(usuarioId: number) {
    return await db.contactoEmergencia.findMany({
      where: { usuarioId },
      orderBy: { creadoEn: 'desc' },
    });
  }

  async obtenerContacto(contactoId: number, usuarioId: number) {
    const contacto = await db.contactoEmergencia.findFirst({
      where: { id: contactoId, usuarioId },
    });

    if (!contacto) {
      throw AppError.notFound('Contacto no encontrado.');
    }
    return contacto;
  }

  async crearContacto(usuarioId: number, data: CrearContactoDto) {
    const total = await db.contactoEmergencia.count({ where: { usuarioId } });
    if (total >= MAX_CONTACTOS_POR_USUARIO) {
      throw AppError.conflict(
        `Solo puedes registrar hasta ${MAX_CONTACTOS_POR_USUARIO} contactos de emergencia.`
      );
    }

    return await db.contactoEmergencia.create({
      data: {
        usuarioId,
        nombre: data.nombre,
        parentesco: data.parentesco,
        telefono: data.telefono,
        emailNotificacion: data.emailNotificacion ?? null,
      },
    });
  }

  async actualizarContacto(contactoId: number, usuarioId: number, data: ActualizarContactoDto) {
    await this.obtenerContacto(contactoId, usuarioId);

    return await db.contactoEmergencia.update({
      where: { id: contactoId },
      data,
    });
  }

  async eliminarContacto(contactoId: number, usuarioId: number) {
    await this.obtenerContacto(contactoId, usuarioId);

    return await db.contactoEmergencia.delete({
      where: { id: contactoId },
    });
  }
}
