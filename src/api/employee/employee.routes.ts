import { empoyeeController } from './empoyee.controller';
import { Router } from 'express';
import { validation } from '../../middleware';
import { loginEmployeeSchema, validateRegisterEmplyoee } from '../../validation';

const router = Router();

router.post('/', validation(validateRegisterEmplyoee), empoyeeController.postRegister);
router.post('/login', validation(loginEmployeeSchema), empoyeeController.login);

export const employeeRouter = router;
