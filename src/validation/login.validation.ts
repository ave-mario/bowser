import { object, string, number } from 'joi';
import { Validate } from '../enums';

export const loginClientSchema = object().keys({
  phoneNumber: string()
    .length(13)
    .required()
    .regex(Validate.phoneNumber),
  loginCode: number()
    .required()
    .min(100000)
    .max(1000000)
});

export const changePassword = object().keys({
  newPassword: string()
    .regex(Validate.password)
    .required()
});
