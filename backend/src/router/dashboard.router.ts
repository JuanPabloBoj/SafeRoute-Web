import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import * as dashboardController from '../controller/dashboard.controller';

const router = Router();

router.get('/', authenticateJWT, dashboardController.obtenerMetricas);

export default router;