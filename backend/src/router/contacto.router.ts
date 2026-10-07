import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { validate, idParamSchema } from '../middlewares/validate.middleware';
import { contactoSchema } from '../dtos/contacto.dto';
import {
  obtenerContactos,
  obtenerContacto,
  crearContacto,
  actualizarContacto,
  eliminarContacto,
} from '../controller/contacto.controller';

const router = Router();

router.use(authenticateJWT, authorizeRoles('USUARIO'));

router.get('/', obtenerContactos);
router.get('/:id', validate(idParamSchema, 'params'), obtenerContacto);
router.post('/', validate(contactoSchema), crearContacto);

router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(contactoSchema, 'body', { parcial: true }),
  actualizarContacto
);

router.delete('/:id', validate(idParamSchema, 'params'), eliminarContacto);

export default router;
