import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import * as alertaController from '../controller/alerta.controller';

const router = Router();

router.get('/publica/:tokenPublico', alertaController.obtenerUbicacionPublica);

router.post('/', authenticateJWT, authorizeRoles('USUARIO'), alertaController.crearAlerta);
router.post('/:id/gps', authenticateJWT, authorizeRoles('USUARIO'), alertaController.registrarGpsContinuo);

router.get('/activas', authenticateJWT, authorizeRoles('OPERADOR', 'ADMIN'), alertaController.listarAlertasActivas);
router.patch('/:id/estado', authenticateJWT, authorizeRoles('OPERADOR', 'ADMIN'), alertaController.actualizarEstadoAlerta);

export default router;