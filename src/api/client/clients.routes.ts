import { clientController } from './clients.controller';
import { Router } from 'express';
import { validation } from '../../middleware';
import { validateRegisterClient, loginClientSchema } from '../../validation';
const router = Router();

router.post('/', validation(validateRegisterClient), clientController.postRegister);
router.post('/login', validation(loginClientSchema), clientController.login);

export const clientRouter = router;
