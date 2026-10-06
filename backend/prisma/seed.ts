import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('[SEED] Iniciando el poblado de la base de datos...');

  const rolAdmin = await prisma.rol.upsert({
    where: { nombreRol: 'ADMIN' },
    update: {},
    create: {
      nombreRol: 'ADMIN',
      descripcion: 'Administrador total del sistema, usuarios y autoridades',
    },
  });

  await prisma.rol.upsert({
    where: { nombreRol: 'USUARIO' },
    update: {},
    create: {
      nombreRol: 'USUARIO',
      descripcion: 'Usuario final que emite alertas SOS y gestiona contactos',
    },
  });

  await prisma.rol.upsert({
    where: { nombreRol: 'OPERADOR' },
    update: {},
    create: {
      nombreRol: 'OPERADOR',
      descripcion: 'Operador/Autoridad de monitoreo que atiende alertas en tiempo real',
    },
  });

 const passwordHash = await bcrypt.hash('Admin123!', 10);

  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@saferoute.org' },
    update: {},
    create: {
      nombreCompleto: 'Administrador SafeRoute',
      email: 'admin@saferoute.org',
      passwordHash: passwordHash,
      telefono: '+50212345678',
      paisCodigo: 'GT',
      rolId: rolAdmin.id,
      activo: true,
    },
  });

  await prisma.autoridad.createMany({
    skipDuplicates: true,
    data: [
      {
        nombre: 'Policía Nacional Civil (PNC GT)',
        paisCodigo: 'GT',
        email: 'emergencias@pnc.gob.gt',
        telefono: '110',
        activa: true,
      },
    ],
  });

  console.log('[SEED] Base de datos poblada con éxito.');
  console.log(` - Admin creado: ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error('[SEED] Error durante la ejecución del seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });