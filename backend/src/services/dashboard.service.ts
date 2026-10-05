import db from '../config/db';

export class DashboardService {
  async obtenerMetricas() {
    const totalAlertas = await db.alertaSos.count();
    const alertasPendientes = await db.alertaSos.count({ where: { estado: 'PENDIENTE' } });
    const alertasEnProceso = await db.alertaSos.count({ where: { estado: 'EN_PROCESO' } });
    const alertasResueltas = await db.alertaSos.count({ where: { estado: 'RESUELTO' } });
    const totalUsuarios = await db.usuario.count({ where: { activo: true } });
    const totalZonasRiesgo = await db.zonaRiesgo.count();

    return {
      metricasAlertas: {
        total: totalAlertas,
        pendientes: alertasPendientes,
        enProceso: alertasEnProceso,
        resueltas: alertasResueltas,
      },
      metricasSistema: {
        usuariosActivos: totalUsuarios,
        zonasMapeadas: totalZonasRiesgo,
      },
    };
  }
}