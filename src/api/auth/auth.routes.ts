import { Router } from 'express';
import controller from './auth.controller';
import { permit, checkIdentified, authRefresh } from '../../middleware';

const router = Router();

router.post('/refresh-tokens', authRefresh(), controller.refreshToken);
router.get('/check-identified', checkIdentified(), controller.checkToken);
router.post('/logout', permit(), controller.logout);

export const authRouter = router;
