import controller from './auth.controller';
import { Router } from 'express';
import { authRefresh } from '../../middleware';

const router = Router();

router.post('/refresh-tokens', authRefresh(), controller.refreshToken);

export const authRouter = router;
