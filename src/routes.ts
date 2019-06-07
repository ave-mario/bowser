import { Router, Request, Response } from 'express';
import { clientRouter } from './api/client';
import { version } from '../package.json';
import { employeeRouter } from './api/employee';
import { authRouter } from './api/auth';
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

export default router;
