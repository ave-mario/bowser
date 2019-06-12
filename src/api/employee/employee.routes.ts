import { empoyeeController } from './empoyee.controller';
import { Router } from 'express';
import { validation } from '../../middleware';
import { validateRegisterEmplyoee, changePassword } from '../../validation';
import { permit, checkIdentified } from '../../middleware';
import { Roles } from '../../enums';

const router = Router();

router.post('/', validation(validateRegisterEmplyoee), empoyeeController.postRegister);
router.post('/login', empoyeeController.login);
router.get('/current', permit([Roles.Employee]), empoyeeController.getCurrent);
router.put(
  '/password',
  validation(changePassword),
  checkIdentified(),
  empoyeeController.changePassword
);

export const employeeRouter = router;
