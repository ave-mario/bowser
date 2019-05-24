import { Router, Request, Response } from 'express';
import { clientRouter } from './api/client';
import { employeeRouter } from './api/employee';
const router = Router();

router.get('/test', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Parcel Pending API'
  });
});

router.use('/clients', clientRouter);
router.use('/employees', employeeRouter);

export default router;
