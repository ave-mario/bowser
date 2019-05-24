import express from 'express';
import initializeDb from './config/mongodb';
import router from './routes';
import logger from 'morgan';
const { PORT = 3001 } = process.env;
class App {
  public app: express.Application;

  public constructor() {
    this.app = express();
    this.app.use(logger('dev'));
    this.config();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    initializeDb(
      (): void => {
        this.app.use('/api/', router);
        this.app.listen(PORT);
      }
    );
  }
}

export default new App().app;
