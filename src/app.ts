import express, { Response, Request, NextFunction } from 'express';
import initializeDb from './config/mongodb';
import router from './routes';
import { Passport, initialize } from './config/passport';
import logger from 'morgan';
const { PORT = 3001 } = process.env;
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

    initializeDb(
      (): void => {
        this.app.use(initialize());
        Passport.jwtStrategy();
        this.app.use('/api/', router);
        this.app.listen(PORT);
      }
    );
  }

  private configCors(): void {
    this.app.use(
      (req: Request, res: Response, next: NextFunction): void => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST');
        res.append('Access-Control-Allow-Headers', 'Content-Type');
        next();
      }
    );
  }

  public getServer() {
    return this.app;
  }
}

export default new App();
