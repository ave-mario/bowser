import dotenv from 'dotenv';
import { object, string, number, validate } from 'joi';

const schema = object({
  NODE_ENV: string()
    .valid('development', 'test', 'production')
    .default('development'),
  APP_PORT: number().default(3001),
  JWT_ENCRYPTION: string().default('e5a3388c-9731-my-secret-8b11-be602d8c54845'),
  JWT_EXPIRATION: number().default(3600),
  MONGODB_HOST: string().default('mongodb://127.0.0.1:27017/hotel')
})
  .unknown()
  .required();

dotenv.config();

const { error, value: envVars } = validate(process.env, schema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  app: {
    environment: envVars.NODE_ENV,
    port: envVars.APP_PORT,
    mongoHost: envVars.MONGODB_HOST
  },
  jwt: {
    secret: envVars.JWT_ENCRYPTION,
    expiration: envVars.JWT_EXPIRATION
  }
};
