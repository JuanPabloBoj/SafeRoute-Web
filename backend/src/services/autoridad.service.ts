import db from '../config/db';
import { AppError } from '../utils/app-error';
import { CrearAutoridadDto, ActualizarAutoridadDto } from '../dtos/autoridad.dto';

export class AutoridadService {
  async listar() {
    return await db.autoridad.findMany({
      orderBy: [{ paisCodigo: 'asc' }, { nombre: 'asc' }],
    });
  }

  async listarPorPais(paisCodigo: string) {
    return await db.autoridad.findMany({
      where: { paisCodigo: paisCodigo.toUpperCase(), activa: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async obtenerPorId(id: number) {
    const autoridad = await db.autoridad.findUnique({ where: { id } });
    if (!autoridad) {
      throw AppError.notFound('Autoridad no encontrada.');
    }
    return autoridad;
  }

  async crear(data: CrearAutoridadDto) {
    await this.verificarDuplicado(data.nombre, data.paisCodigo);

    return await db.autoridad.create({
      data: {
        nombre: data.nombre,
        paisCodigo: data.paisCodigo,
        email: data.email,
        telefono: data.telefono ?? null,
        activa: data.activa ?? true,
      },
    });
  }

  async actualizar(id: number, data: ActualizarAutoridadDto) {
    const actual = await this.obtenerPorId(id);

    await this.verificarDuplicado(
      data.nombre ?? actual.nombre,
      data.paisCodigo ?? actual.paisCodigo,
      id
    );

    return await db.autoridad.update({ where: { id }, data });
  }

  async eliminar(id: number) {
    await this.obtenerPorId(id);
    return await db.autoridad.delete({ where: { id } });
  }

  private async verificarDuplicado(nombre: string, paisCodigo: string, excluirId?: number) {
    const existente = await db.autoridad.findFirst({
      where: {
        nombre: { equals: nombre, mode: 'insensitive' },
        paisCodigo,
        ...(excluirId ? { id: { not: excluirId } } : {}),
      },
    });

    if (existente) {
      throw AppError.conflict(`Ya existe una autoridad llamada "${nombre}" en ${paisCodigo}.`);
    }
  }
}
