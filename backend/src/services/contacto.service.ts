import db from '../config/db';

export class ContactoService {
  async obtenerPorUsuario(usuarioId: number) {
    return await db.contactoEmergencia.findMany({
      where: { usuarioId },
      orderBy: { creadoEn: 'desc' },
    });
  }

  async crearContacto(usuarioId: number, data: { nombre: string; parentesco: string; telefono: string; emailNotificacion?: string }) {
    return await db.contactoEmergencia.create({
      data: {
        usuarioId,
        nombre: data.nombre,
        parentesco: data.parentesco,
        telefono: data.telefono,
        emailNotificacion: data.emailNotificacion,
      },
    });
  }

  async eliminarContacto(contactoId: number, usuarioId: number) {
    const contacto = await db.contactoEmergencia.findFirst({
      where: { id: contactoId, usuarioId },
    });

    if (!contacto) {
      throw { statusCode: 404, message: 'Contacto no encontrado o no pertenece al usuario.' };
    }

    return await db.contactoEmergencia.delete({
      where: { id: contactoId },
    });
  }
}