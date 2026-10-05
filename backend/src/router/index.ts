import { Router } from 'express';
import authRouter from './auth.router';
import alertaRouter from './alerta.router';
import zonaRouter from './zona.router';
import contactoRouter from './contacto.router';
import dashboardRouter from './dashboard.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/alertas', alertaRouter);
router.use('/zonas', zonaRouter);
router.use('/contactos', contactoRouter);
router.use('/dashboard', dashboardRouter);

export default router;