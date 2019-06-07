import dotenv from 'dotenv';
import { validate } from 'joi';
import { schemaDev, schemaTest } from '../validation';

var DOT_ENV_FILE = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
let schema;
if (process.env.NODE_ENV !== 'test') {
  schema = schemaDev;
} else schema = schemaTest;

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
    access: {
      expiration: envVars.JWT_ACCESS_EXPIRATION
    },
    refresh: {
      expiration: envVars.JWT_REFRESH_EXPIRATION
    },
    identified: {
      expiration: envVars.JWT_IDENTIFIED_EXPIRATION
    }
  },
  email: {
    host: envVars.EMAIL_SERVER_HOST,
    user: envVars.GMAIL_AUTH_USER,
    pass: envVars.GMAIL_AUTH_PASS
  },
  clients: {
    stuffLink: envVars.CLIENT_STUFF_LINK
  }
};
