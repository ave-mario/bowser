import { object, string } from 'joi';
import { Validate } from '../config/emuns';

export const loginClientSchema = object().keys({
  phoneNumber: string()
    .length(13)
    .required()
    .regex(Validate.phoneNumber),
  loginCode: string()
    .required()
    .length(6)
});

export const loginEmployeeSchema = object().keys({
  email: string()
    .email()
    .required(),
  password: string()
    .regex(Validate.password)
    .required()
});
