import { Router } from 'express';
import controller from './room-services.controller';
import { validation } from '../../middleware';
import { roomService } from '../../validation';
import { permit } from '../../middleware';
import { Roles } from '../../enums';

const router = Router();

router.post('/', permit([Roles.Employee]), validation(roomService), controller.create);
router.get('/', permit([Roles.Employee]), controller.get);
router.get('/:id', permit([Roles.Employee]), controller.getById);
router.put('/:id', permit([Roles.Employee]), validation(roomService), controller.update);
router.delete('/:id', permit([Roles.Employee]), controller.remove);

export const roomServicesRouter = router;
