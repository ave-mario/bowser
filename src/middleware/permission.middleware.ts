import { authenticateJwt } from '../config';
import { Response, Request } from 'express';

export function permit(roles: string[] = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    authenticateJwt(),
    (req: Request, res: Response, next: () => void) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(401).send({ message: 'Forbidden', success: false });
      }
      next();
    }
  ];
}
