import db from '../config/db';
import { CrearZonaRiesgoDto, ActualizarZonaRiesgoDto } from '../dtos/zona.dto';

export class ZonaService {
  async listarTodas() {
    return await db.zonaRiesgo.findMany({
      include: {
        usuarioRegistra: { select: { nombreCompleto: true, email: true } },
      },
      orderBy: { creadoEn: 'desc' },
    });
  }

  async crearZona(registradoPor: number, data: CrearZonaRiesgoDto) {
    return await db.zonaRiesgo.create({
      data: {
        nombreZona: data.nombreZona,
        nivelRiesgo: data.nivelRiesgo,
        geometriaPolygon: data.geometriaPolygon,
        descripcionIncidencia: data.descripcionIncidencia,
        registradoPor,
      },
    });
  }

  async actualizarZona(id: number, data: ActualizarZonaRiesgoDto) {
    return await db.zonaRiesgo.update({
      where: { id },
      data,
    });
  }

  async eliminarZona(id: number) {
    return await db.zonaRiesgo.delete({
      where: { id },
    });
  }
}