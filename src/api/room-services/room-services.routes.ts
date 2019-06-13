import { Router } from 'express';
import controller from './room-services.controller';
import { validation } from '../../middleware';
import { roomServiceCreate } from '../../validation';
import { permit } from '../../middleware';
import { Roles } from '../../enums';

const router = Router();

router.post(
  '/',
  permit([Roles.Employee]),
  validation(roomServiceCreate),
  controller.create
);
router.get('/', controller.get);

export const roomServicesRouter = router;
