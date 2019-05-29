import { authenticateJwt } from '../config';
import { logicErr } from '../errors';
import { Response, Request, NextFunction } from 'express';

export function permit(roles: string[] = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    authenticateJwt(),
    (req: Request, res: Response, next: NextFunction) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(401).send({ message: logicErr.forbidden.msg, success: false });
      }
      next();
    }
  ];
}
