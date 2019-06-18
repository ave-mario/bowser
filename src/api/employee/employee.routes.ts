import { employeeController } from './employee.controller';
import { Router } from 'express';
import { validation } from '../../middleware';
import { validateRegisterEmployee, changePassword } from '../../validation';
import { permit, checkIdentified } from '../../middleware';
import { Roles } from '../../enums';

const router = Router();

router.post('/', validation(validateRegisterEmployee), employeeController.postRegister);
router.post('/login', employeeController.login);
router.get('/current', permit([Roles.Employee]), employeeController.getCurrent);
router.put(
  '/password',
  validation(changePassword),
  checkIdentified(),
  employeeController.changePassword
);

export const employeeRouter = router;
