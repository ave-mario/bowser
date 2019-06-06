import logger from 'js-logger';
import app from './app';
import { config } from './config';

const { port } = config.app;

const server = app.listen(port, () => {
  logger.info(`API PORT ${port}`);
});
export default server;
