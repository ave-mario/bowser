import mongoose from 'mongoose';
import { config } from './environment';
import seedingMongo from './seeds';
const { app, mongo } = config;
const options = {
  useNewUrlParser: true
};

export function initializeDb(callback: (mongo: any) => void): void {
  mongoose.Promise = global.Promise;

  if (app.environment === 'development') mongoose.set('debug', true);

  mongoose.set('useCreateIndex', true);

  mongoose.connection.on('connected', function(): void {
    console.log('Mongoose default connection open to ' + mongo.host);
  });

  mongoose.connection.on('error', function(err: Error): void {
    console.log('Mongoose default connection error: ' + err);
  });

  mongoose.connection.on('disconnected', function(): void {
    console.log('Mongoose default connection disconnected');
  });

  mongoose
    .connect(mongo.host, options)
    .then(
      (): void => {
        callback(mongoose);
      }
    )
    .then(
      (): void => {
        seedingMongo();
      }
    )
    .catch((err): void => console.error(err.toString()));
}
