import { Router } from 'express';
import * as authController from '../controller/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../dtos/auth.dto';

const router = Router();

router.post('/register', validate(registerSchema, 'body'), authController.registrar);
router.post('/login', validate(loginSchema, 'body'), authController.login);

export default router;