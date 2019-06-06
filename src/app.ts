import express, { Response, Request, NextFunction } from 'express';
import { initializeDb, Passport, initialize } from './config';
import router from './routes';
import logger from 'morgan';
class App {
  public app: express.Application;

  public constructor() {
    this.app = express();
    this.app.use(logger('dev'));
    this.configCors();
    this.config();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(initialize());
    Passport.jwtStrategy();
    this.app.use('/api/', router);
    initializeDb((): void => {});
  }

  private configCors(): void {
    this.app.use(
      (req: Request, res: Response, next: NextFunction): void => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
        res.append(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization, Origin,Accepts'
        );
        next();
      }
    );
  }
}

export default new App().app;
