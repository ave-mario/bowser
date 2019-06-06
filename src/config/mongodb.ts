import mongoose from 'mongoose';
import logger from 'js-logger';
import { config } from './environment';

const { app, mongo } = config;
const options = {
  useNewUrlParser: true
};

export function initializeDb(callback: (mongo: any) => void): void {
  mongoose.Promise = global.Promise;

  if (app.environment === 'development') mongoose.set('debug', true);

  mongoose.set('useCreateIndex', true);

  mongoose.connection.on('connected', function(): void {
    logger.info('Mongoose default connection open to ' + mongo.host);
  });

  mongoose.connection.on('error', function(err: Error): void {
    logger.warn('Mongoose default connection error: ' + err);
  });

  mongoose.connection.on('disconnected', function(): void {
    logger.warn('Mongoose default connection disconnected');
  });

  mongoose
    .connect(mongo.host, options)
    .then(
      (): void => {
        callback(mongoose);
      }
    )
    .catch((err): void => logger.error(err.toString()));
}
