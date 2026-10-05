import db from '../config/db';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

export class AuthService {
  async registrar(data: RegisterDto) {
    const usuarioExiste = await db.usuario.findUnique({
      where: { email: data.email },
    });

    if (usuarioExiste) {
      throw { statusCode: 400, message: 'El correo electrónico ya está registrado.' };
    }

    let rolId = data.rolId;
    if (!rolId) {
      const rolUsuario = await db.rol.findUnique({ where: { nombreRol: 'USUARIO' } });
      rolId = rolUsuario ? rolUsuario.id : 2;
    }

    const hashedPassword = await hashPassword(data.password);

    const nuevoUsuario = await db.usuario.create({
      data: {
        nombreCompleto: data.nombreCompleto,
        email: data.email,
        passwordHash: hashedPassword,
        telefono: data.telefono,
        paisCodigo: data.paisCodigo || 'GT',
        rolId: rolId,
      },
      include: { rol: true },
    });

    const token = generateToken({
      id: nuevoUsuario.id,
      email: nuevoUsuario.email,
      rolId: nuevoUsuario.rolId,
      nombreRol: nuevoUsuario.rol.nombreRol,
    });

    return {
      usuario: {
        id: nuevoUsuario.id,
        nombreCompleto: nuevoUsuario.nombreCompleto,
        email: nuevoUsuario.email,
        telefono: nuevoUsuario.telefono,
        rol: nuevoUsuario.rol.nombreRol,
      },
      token,
    };
  }

  async login(data: LoginDto) {
    const usuario = await db.usuario.findUnique({
      where: { email: data.email },
      include: { rol: true },
    });

    if (!usuario || !usuario.activo) {
      throw { statusCode: 401, message: 'Credenciales inválidas o usuario inactivo.' };
    }

    const passwordValido = await comparePassword(data.password, usuario.passwordHash);
    if (!passwordValido) {
      throw { statusCode: 401, message: 'Credenciales inválidas.' };
    }

    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      rolId: usuario.rolId,
      nombreRol: usuario.rol.nombreRol,
    });

    return {
      usuario: {
        id: usuario.id,
        nombreCompleto: usuario.nombreCompleto,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol.nombreRol,
      },
      token,
    };
  }
}