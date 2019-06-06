import dotenv from 'dotenv';
import { object, string, number, validate } from 'joi';

var DOT_ENV_FILE = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

const schema = object({
  NODE_ENV: string()
    .valid('development', 'test', 'production')
    .required(),
  APP_PORT: number().required(),
  JWT_ENCRYPTION: string().required(),
  JWT_EXPIRATION: number().required(),
  MONGODB_HOST: string().required(),
  EMAIL_SERVER_HOST: string().required(),
  CLIENT_STUFF_LINK: string().required()
})
  .unknown()
  .required();

dotenv.config({ path: DOT_ENV_FILE });

const { error, value: envVars } = validate(process.env, schema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  app: {
    environment: envVars.NODE_ENV,
    port: envVars.APP_PORT
  },
  mongo: {
    host: envVars.MONGODB_HOST
  },
  jwt: {
    secret: envVars.JWT_ENCRYPTION,
    expiration: envVars.JWT_EXPIRATION
  },
  email: {
    host: envVars.EMAIL_SERVER_HOST
  },
  clients: {
    stuffLink: envVars.CLIENT_STUFF_LINK
  }
};
