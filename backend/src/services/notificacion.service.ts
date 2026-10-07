import { Prisma } from '@prisma/client';
import db from '../config/db';
import { env } from '../config/env';
import { logger } from '../middlewares/logger.middleware';

export interface DatosAlertaNotificacion {
  alertaId: number;
  usuarioId: number;
  paisCodigo: string;
  latitud: number;
  longitud: number;
  tokenPublico?: string | null;
}

export interface NotificacionPendiente {
  id: number;
  tipo: 'AUTORIDAD' | 'CONTACTO';
  nombre: string;
  email: string | null;
}

export interface MensajeCorreo {
  para: string;
  asunto: string;
  texto: string;
}

export interface ProveedorCorreo {
  enviar(mensaje: MensajeCorreo): Promise<void>;
}

const proveedorSimulado: ProveedorCorreo = {
  async enviar(mensaje: MensajeCorreo): Promise<void> {
    logger.info(`[CORREO SIMULADO] Para: ${mensaje.para} | Asunto: ${mensaje.asunto}`);
  },
};

export class NotificacionService {
  constructor(private readonly proveedor: ProveedorCorreo = proveedorSimulado) {}

  async registrarParaAlerta(
    tx: Prisma.TransactionClient,
    datos: DatosAlertaNotificacion
  ): Promise<NotificacionPendiente[]> {
    const pendientes: NotificacionPendiente[] = [];

    const contactos = await tx.contactoEmergencia.findMany({
      where: { usuarioId: datos.usuarioId },
    });

    for (const contacto of contactos) {
      const fila = await tx.notificacionEnviada.create({
        data: {
          alertaId: datos.alertaId,
          contactoId: contacto.id,
          metodo: 'EMAIL',
          estadoEnvio: 'PENDIENTE',
        },
      });
      pendientes.push({
        id: fila.id,
        tipo: 'CONTACTO',
        nombre: contacto.nombre,
        email: contacto.emailNotificacion,
      });
    }

    const autoridades = await tx.autoridad.findMany({
      where: { paisCodigo: datos.paisCodigo, activa: true },
    });

    for (const autoridad of autoridades) {
      const fila = await tx.notificacionEnviada.create({
        data: {
          alertaId: datos.alertaId,
          autoridadId: autoridad.id,
          metodo: 'EMAIL',
          estadoEnvio: 'PENDIENTE',
        },
      });
      pendientes.push({
        id: fila.id,
        tipo: 'AUTORIDAD',
        nombre: autoridad.nombre,
        email: autoridad.email,
      });
    }

    if (autoridades.length === 0) {
      logger.warn(
        `Alerta ${datos.alertaId}: no hay autoridades activas para el país ${datos.paisCodigo}.`
      );
    }

    return pendientes;
  }

 async despachar(
    pendientes: NotificacionPendiente[],
    datos: DatosAlertaNotificacion
  ): Promise<void> {
    if (pendientes.length === 0) return;

    try {
      const usuario = await db.usuario.findUnique({
        where: { id: datos.usuarioId },
        select: { nombreCompleto: true, telefono: true },
      });

      const nombreUsuario = usuario?.nombreCompleto ?? 'Un usuario de SafeRoute';
      const telefonoUsuario = usuario?.telefono ?? 'no disponible';

      await Promise.all(
        pendientes.map((pendiente) => {
          const mensaje = this.construirMensaje(
            pendiente,
            datos,
            nombreUsuario,
            telefonoUsuario
          );
          return this.enviarUna(pendiente, mensaje);
        })
      );
    } catch (error) {
      logger.error(
        `Alerta ${datos.alertaId}: error al despachar notificaciones: ${this.textoError(error)}`
      );
    }
  }

 async listarPorAlerta(alertaId: number) {
    return await db.notificacionEnviada.findMany({
      where: { alertaId },
      orderBy: { fechaEnvio: 'asc' },
    });
  }

  private async enviarUna(
    pendiente: NotificacionPendiente,
    mensaje: Omit<MensajeCorreo, 'para'>
  ): Promise<void> {
    let estado: 'ENVIADO' | 'FALLIDO' = 'FALLIDO';

    try {
      if (!pendiente.email) {
        throw new Error('El destinatario no tiene correo registrado.');
      }
      await this.proveedor.enviar({ para: pendiente.email, ...mensaje });
      estado = 'ENVIADO';
    } catch (error) {
      logger.error(
        `Notificación ${pendiente.id} (${pendiente.tipo}) falló: ${this.textoError(error)}`
      );
    }

    try {
      await db.notificacionEnviada.update({
        where: { id: pendiente.id },
        data: { estadoEnvio: estado, fechaEnvio: new Date() },
      });
    } catch (error) {
      logger.error(
        `No se pudo actualizar la notificación ${pendiente.id}: ${this.textoError(error)}`
      );
    }
  }

  private construirMensaje(
    pendiente: NotificacionPendiente,
    datos: DatosAlertaNotificacion,
    nombreUsuario: string,
    telefonoUsuario: string
  ): Omit<MensajeCorreo, 'para'> {
    const { latitud, longitud, tokenPublico } = datos;
    const mapa = `https://www.openstreetmap.org/?mlat=${latitud}&mlon=${longitud}#map=17/${latitud}/${longitud}`;
    const seguimiento = tokenPublico
      ? `${env.FRONTEND_URL}/alerta-publica/${tokenPublico}`
      : null;

    const lineasUbicacion = [
      `Ubicación inicial: ${latitud}, ${longitud}`,
      `Ver en el mapa: ${mapa}`,
      ...(seguimiento ? [`Seguimiento en vivo: ${seguimiento}`] : []),
    ];

    if (pendiente.tipo === 'AUTORIDAD') {
      return {
        asunto: `ALERTA SOS - ${nombreUsuario} (${datos.paisCodigo})`,
        texto: [
          `Se ha activado una alerta SOS en SafeRoute.`,
          ``,
          `Persona: ${nombreUsuario}`,
          `Teléfono: ${telefonoUsuario}`,
          ...lineasUbicacion,
          ``,
          `Se requiere atención inmediata.`,
        ].join('\n'),
      };
    }

    return {
      asunto: `Alerta SOS de ${nombreUsuario}`,
      texto: [
        `Hola ${pendiente.nombre},`,
        ``,
        `${nombreUsuario} activó una alerta SOS en SafeRoute y las autoridades fueron notificadas.`,
        ``,
        ...lineasUbicacion,
        ``,
        `Intenta comunicarte con ${nombreUsuario} al ${telefonoUsuario}.`,
      ].join('\n'),
    };
  }

  private textoError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
