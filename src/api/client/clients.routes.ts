import { clientController } from './clients.controller';
import { Router } from 'express';
import { validation } from '../../middleware';
import { validateRegisterClient, loginClientSchema } from '../../validation';
import { permit } from '../../middleware';

const router = Router();

router.post('/', validation(validateRegisterClient), clientController.postRegister);
router.post('/login', validation(loginClientSchema), clientController.login);
router.post('/code', clientController.sendCode);
router.get('/current', permit(), clientController.getCurrent);

export const clientRouter = router;
