import redis from 'redis';
import { logger, config } from './';
const { redis: redisConf, app } = config;

const client = redis.createClient(redisConf.port);
connectToRedis();
export function connectToRedis(): void {
  if (app.environment === 'development') client.debug();
  client.on('error', function(err) {
    logger.warn('Error: ' + err);
  });

  client.on('connect', function() {
    logger.info('Redis: connected to the server');
  });

  client.set('app:port', app.port);
}

export default client;
