import { object, number, string } from 'joi';

export const schemaDev = object({
  NODE_ENV: string()
    .valid('development', 'test', 'production')
    .required(),
  APP_PORT: number().required(),
  JWT_ENCRYPTION: string().required(),
  JWT_ACCESS_EXPIRATION: string().required(),
  JWT_REFRESH_EXPIRATION: string().required(),
  JWT_IDENTIFIED_EXPIRATION: string().required(),
  MONGODB_HOST: string().required(),
  EMAIL_SERVER_HOST: string().required(),
  GMAIL_AUTH_USER: string().required(),
  GMAIL_AUTH_PASS: string().required(),
  CLIENT_STUFF_LINK: string().required()
})
  .unknown()
  .required();

export const schemaTest = object({
  NODE_ENV: string()
    .valid('development', 'test', 'production')
    .required(),
  APP_PORT: number().required(),
  JWT_ENCRYPTION: string().required(),
  JWT_ACCESS_EXPIRATION: string().required(),
  JWT_REFRESH_EXPIRATION: string().required(),
  JWT_IDENTIFIED_EXPIRATION: string().required(),
  MONGODB_HOST: string().required(),
  CLIENT_STUFF_LINK: string().required()
})
  .unknown()
  .required();
