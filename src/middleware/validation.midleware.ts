import { Response, Request, NextFunction } from 'express';
import joi, { ObjectSchema } from 'joi';

export const validation = (schema: ObjectSchema): any => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = joi.validate(req.body, schema);
  const valid = error == null;

  if (valid) {
    next();
  } else {
    const { details } = error;
    const message = details.map(i => i.message).join(',');
    res.status(400).json({ message, success: false });
  }
};
