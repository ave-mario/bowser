import app from './app';
import { config } from './config';
const { port } = config.app;

const server = app.listen(port, () => {
  console.log(`API PORT ${port}`);
});
export default server;
