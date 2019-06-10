import { empoyeeController } from './empoyee.controller';
import { Router } from 'express';
import { validation } from '../../middleware';
import {
  loginEmployeeSchema,
  validateRegisterEmplyoee,
  changePassword
} from '../../validation';
import { permit } from '../../middleware';

const router = Router();

router.post('/', validation(validateRegisterEmplyoee), empoyeeController.postRegister);
router.post('/login', validation(loginEmployeeSchema), empoyeeController.login);
router.get('/current', permit(), empoyeeController.getCurrent);
router.put(
  '/password',
  permit(),
  validation(changePassword),
  empoyeeController.changePassword
);

export const employeeRouter = router;
