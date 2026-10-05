import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import * as dashboardController from '../controller/dashboard.controller';

const router = Router();

router.get('/metricas', authenticateJWT, authorizeRoles('ADMIN', 'OPERADOR'), dashboardController.obtenerMetricas);

export default router;