import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { validate, idParamSchema } from '../middlewares/validate.middleware';
import { autoridadSchema, codigoPaisParamSchema } from '../dtos/autoridad.dto';
import {
  listarAutoridades,
  listarAutoridadesPorPais,
  obtenerAutoridad,
  crearAutoridad,
  actualizarAutoridad,
  eliminarAutoridad,
} from '../controller/autoridad.controller';

const router = Router();

router.use(authenticateJWT);

router.get('/', authorizeRoles('ADMIN', 'OPERADOR'), listarAutoridades);

router.get(
  '/pais/:codigo',
  authorizeRoles('ADMIN', 'OPERADOR'),
  validate(codigoPaisParamSchema, 'params'),
  listarAutoridadesPorPais
);

router.get(
  '/:id',
  authorizeRoles('ADMIN', 'OPERADOR'),
  validate(idParamSchema, 'params'),
  obtenerAutoridad
);

// Escritura: solo ADMIN
router.post('/', authorizeRoles('ADMIN'), validate(autoridadSchema), crearAutoridad);

router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validate(idParamSchema, 'params'),
  validate(autoridadSchema, 'body', { parcial: true }),
  actualizarAutoridad
);

router.delete(
  '/:id',
  authorizeRoles('ADMIN'),
  validate(idParamSchema, 'params'),
  eliminarAutoridad
);

export default router;
