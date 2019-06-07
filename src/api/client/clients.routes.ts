import { clientController } from './clients.controller';
import { Router } from 'express';
import { validation } from '../../middleware';
import { validateRegisterClient, loginClientSchema } from '../../validation';
import { permit } from '../../middleware';
import { Roles } from '../../enums';

const router = Router();

router.post('/', validation(validateRegisterClient), clientController.postRegister);
router.post('/login', validation(loginClientSchema), clientController.login);
router.post('/code', clientController.sendCode);
router.get('/current', permit([Roles.Client]), clientController.getCurrent);

export const clientRouter = router;
