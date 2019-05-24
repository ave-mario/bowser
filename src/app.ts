import express from 'express';
import initializeDb from './config/mongodb';

const { PORT = 3000 } = process.env;
class App {
  public app: express.Application;

  public constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    initializeDb(
      (): void => {
        this.app.listen(
          PORT,
          (): void => {
            console.log(`Example app listening on port ${PORT}!`);
          }
        );
      }
    );
  }
}

export default new App().app;
