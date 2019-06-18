import { object, string } from 'joi';
import { Validate } from '../enums';

export const validateRegisterClient = object().keys({
  phoneNumber: string()
    .length(13)
    .required()
    .regex(Validate.phoneNumber),
  name: string()
    .required()
    .min(2)
    .max(15),
  surname: string()
    .required()
    .min(2)
    .max(15),
  email: string()
    .email()
    .required()
});

export const validateRegisterEmployee = object().keys({
  phoneNumber: string()
    .length(13)
    .required()
    .regex(Validate.phoneNumber),
  name: string()
    .required()
    .min(2)
    .max(15),
  surname: string()
    .required()
    .min(2)
    .max(15),
  patronymic: string()
    .required()
    .min(2)
    .max(15),
  email: string()
    .email()
    .required(),
  address: string()
    .required()
    .min(10)
});
