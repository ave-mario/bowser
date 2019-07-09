import app from './app';
import { config } from './config';
import logger from './config/winston';
const { port } = config.app;

const server = app.listen(port, () => {
  logger.info(`API PORT ${port}`);
});
export default server;
