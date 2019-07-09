import mongoose from 'mongoose';
import { config } from './environment';
import seedingMongo from './seeds';
import logger from './winston';
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
    logger.info('Mongoose default connection error: ' + err);
  });

  mongoose.connection.on('disconnected', function(): void {
    logger.warn('Mongoose default connection disconnected');
  });

  mongoose
    .connect(mongo.host, options)
    .then(
      (): void => {
        seedingMongo();
      }
    )
    .then(
      (): void => {
        callback(mongoose);
      }
    )
    .catch(
      (err): any => {
        logger.error(err.toString());
        process.exit(1);
      }
    );
}
