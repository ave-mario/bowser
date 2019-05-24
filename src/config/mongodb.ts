import mongoose from 'mongoose';
const env = process.env.NODE_ENV || 'development';
const mongoHost = 'mongodb://127.0.0.1:27017/hotel';
const options = {
  useNewUrlParser: true
};

export default function connect(callback: (mongo: any) => void): void {
  mongoose.Promise = global.Promise;

  if (env === 'development') mongoose.set('debug', true);

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
