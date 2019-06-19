import { Router, Request, Response } from 'express';
import { version } from '../package.json';
import {
  clientRouter,
  employeeRouter,
  authRouter,
  roomRouter,
  roomServicesRouter
} from './api';
const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'pass',
    description: 'Parcel Pending API',
    version
  });
});

router.use('/clients', clientRouter);
router.use('/employees', employeeRouter);
router.use('/auth', authRouter);
router.use('/rooms', roomRouter);
router.use('/rooms-services', roomServicesRouter);

export default router;
