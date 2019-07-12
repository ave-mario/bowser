import express, { Response, Request, NextFunction } from 'express';
import morgan from 'morgan';
import {
  initializeDb,
  Passport,
  initialize,
  logger,
  redisClient,
  config
} from './config';
import router from './routes';
class App {
  public app: express.Application;

  public constructor() {
    this.app = express();
    if (config.app.environment !== 'test') {
      this.app.use(
        morgan('tiny', {
          stream: {
            write: function(message: string, encoding?: string): void {
              logger.info(message, encoding);
            }
          }
        })
      );
    }
    this.configCors();
    this.config();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(initialize());
    Passport.jwtStrategy();
    this.app.use('/api/', router);
    initializeDb(
      async (): Promise<void> => {
        await redisClient.listenConnect();
      }
    );
  }

  private configCors(): void {
    this.app.use(
      (req: Request, res: Response, next: NextFunction): void => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
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
