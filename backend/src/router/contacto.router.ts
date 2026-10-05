import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import * as contactoController from '../controller/contacto.controller';

const router = Router();

router.use(authenticateJWT, authorizeRoles('USUARIO'));

router.get('/', contactoController.obtenerContactos);
router.post('/', contactoController.crearContacto);
router.delete('/:id', contactoController.eliminarContacto);

export default router;