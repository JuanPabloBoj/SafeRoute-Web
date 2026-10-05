import db from '../config/db';
import { Prisma } from '@prisma/client';
import { CrearAlertaDto, RegistrarGpsDto, ActualizarEstadoAlertaDto } from '../dtos/alerta.dto';

export class AlertaService {
  async crearAlerta(usuarioId: number, data: CrearAlertaDto) {
    return await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const alerta = await tx.alertaSos.create({
        data: {
          usuarioId,
          latitudInicial: data.latitudInicial,
          longitudInicial: data.longitudInicial,
          paisCodigo: data.paisCodigo,
          metodoActivacion: data.metodoActivacion || 'BOTON',
        },
      });

      await tx.seguimientoGpsVivo.create({
        data: {
          alertaId: alerta.id,
          latitud: data.latitudInicial,
          longitud: data.longitudInicial,
        },
      });

      const contactos = await tx.contactoEmergencia.findMany({
        where: { usuarioId },
      });

      if (contactos.length > 0) {
        await tx.notificacionEnviada.createMany({
          data: contactos.map((c: { id: number }) => ({
            alertaId: alerta.id,
            contactoId: c.id,
            metodo: 'EMAIL',
            estadoEnvio: 'PENDIENTE',
          })),
        });
      }

      const autoridad = await tx.autoridad.findFirst({
        where: { paisCodigo: data.paisCodigo, activa: true },
      });

      if (autoridad) {
        await tx.notificacionEnviada.create({
          data: {
            alertaId: alerta.id,
            autoridadId: autoridad.id,
            metodo: 'EMAIL',
            estadoEnvio: 'PENDIENTE',
          },
        });
      }

      return alerta;
    });
  }

  async registrarGpsContinuo(alertaId: number, data: RegistrarGpsDto) {
    const alerta = await db.alertaSos.findUnique({ where: { id: alertaId } });
    if (!alerta || alerta.estado === 'RESUELTO' || alerta.estado === 'FALSA_ALARMA') {
      throw { statusCode: 400, message: 'La alerta no está activa para recibir seguimiento.' };
    }

    return await db.seguimientoGpsVivo.create({
      data: {
        alertaId,
        latitud: data.latitud,
        longitud: data.longitud,
        velocidadKmh: data.velocidadKmh || 0,
      },
    });
  }

  async obtenerUbicacionPublica(tokenPublico: string) {
    const alerta = await db.alertaSos.findUnique({
      where: { tokenPublico },
      include: {
        usuario: {
          select: { nombreCompleto: true, telefono: true },
        },
        seguimientosGps: {
          orderBy: { registradoEn: 'desc' },
          take: 1,
        },
      },
    });

    if (!alerta) {
      throw { statusCode: 404, message: 'Alerta no encontrada o enlace expirado.' };
    }

    return {
      alertaId: alerta.id,
      estado: alerta.estado,
      usuario: alerta.usuario.nombreCompleto,
      telefono: alerta.usuario.telefono,
      creadoEn: alerta.creadoEn,
      ultimaUbicacion: alerta.seguimientosGps[0] || {
        latitud: alerta.latitudInicial,
        longitud: alerta.longitudInicial,
      },
    };
  }

  async listarAlertasActivas() {
    return await db.alertaSos.findMany({
      where: { estado: { in: ['PENDIENTE', 'EN_PROCESO'] } },
      include: {
        usuario: { select: { nombreCompleto: true, telefono: true, email: true } },
        seguimientosGps: { orderBy: { registradoEn: 'desc' }, take: 1 },
      },
      orderBy: { creadoEn: 'desc' },
    });
  }

  async actualizarEstado(alertaId: number, operadorId: number, data: ActualizarEstadoAlertaDto) {
    return await db.alertaSos.update({
      where: { id: alertaId },
      data: {
        estado: data.estado,
        notasResolucion: data.notasResolucion,
        atendidaPor: operadorId,
        resueltaEn: data.estado === 'RESUELTO' || data.estado === 'FALSA_ALARMA' ? new Date() : null,
      },
    });
  }
}