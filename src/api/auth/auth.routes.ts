import { Router } from 'express';
import controller from './auth.controller';
import { authRefresh } from '../../middleware';
import { permit, checkIdentified } from '../../middleware';

const router = Router();

router.post('/refresh-tokens', authRefresh(), controller.refreshToken);
router.get('/check-identified', checkIdentified(), controller.checkToken);
router.get('/check-token', permit(), controller.checkToken);

export const authRouter = router;
