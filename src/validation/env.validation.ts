import { object, number, string } from 'joi';

export const schemaDev = object({
  NODE_ENV: string()
    .valid('development', 'test', 'production')
    .required(),
  APP_PORT: number().required(),
  JWT_ENCRYPTION: string().required(),
  JWT_ACCESS_EXPIRATION: number().required(),
  JWT_REFRESH_EXPIRATION: number().required(),
  JWT_IDENTIFIED_EXPIRATION: number().required(),
  MONGODB_HOST: string().required(),
  EMAIL_SERVER_HOST: string().required(),
  GMAIL_AUTH_USER: string().required(),
  GMAIL_AUTH_PASS: string().required()
})
  .unknown()
  .required();

export const schemaTest = object({
  NODE_ENV: string()
    .valid('development', 'test', 'production')
    .required(),
  JWT_ENCRYPTION: string().required(),
  JWT_ACCESS_EXPIRATION: number().required(),
  JWT_REFRESH_EXPIRATION: number().required(),
  JWT_IDENTIFIED_EXPIRATION: number().required(),
  MONGODB_HOST: string().required()
})
  .unknown()
  .required();
