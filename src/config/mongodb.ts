import mongoose from 'mongoose';
import { config } from './environment';

const { environment, mongoHost } = config.app;
const options = {
  useNewUrlParser: true
};

export function initializeDb(callback: (mongo: any) => void): void {
  mongoose.Promise = global.Promise;

  if (environment === 'development') mongoose.set('debug', true);

  mongoose.set('useCreateIndex', true);

  mongoose.connection.on('connected', function(): void {
    console.log('Mongoose default connection open to ' + mongoHost);
  });

  mongoose.connection.on('error', function(err: Error): void {
    console.log('Mongoose default connection error: ' + err);
  });

  mongoose.connection.on('disconnected', function(): void {
    console.log('Mongoose default connection disconnected');
  });

  mongoose
    .connect(mongoHost, options)
    .then(
      (): void => {
        callback(mongoose);
      }
    )
    .catch((err): void => console.error(err.toString()));
}
