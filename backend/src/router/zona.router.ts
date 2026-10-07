import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import * as zonaController from '../controller/zona.controller';

const router = Router();

router.get('/', zonaController.listarZonas);

router.post('/', authenticateJWT, authorizeRoles('OPERADOR', 'ADMIN'), zonaController.crearZona);
router.put('/:id', authenticateJWT, authorizeRoles('OPERADOR', 'ADMIN'), zonaController.actualizarZona);
router.delete('/:id', authenticateJWT, authorizeRoles('OPERADOR', 'ADMIN'), zonaController.eliminarZona);

export default router;