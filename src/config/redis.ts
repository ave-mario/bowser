import redis from 'redis';
import { promisify, inspect } from 'util';
import { logger, config } from './';
const { redis: redisConf } = config;

const client = redis.createClient({
  port: Number(redisConf.port),
  host: redisConf.host
});

function listenConnect() {
  client.on('error', function(err) {
    logger.warn('Error: ' + err);
  });

  client.on('connect', function() {
    logger.info(
      'Redis: connected to the server, open to ' + redisConf.host + redisConf.port
    );
  });

  client.on('monitor', function(time, args) {
    console.log(time + ': ' + inspect(args));
  });
}

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const hgetAllAsync = promisify(client.hgetall).bind(client);
const hmsetAsync = promisify(client.hmset).bind(client);

export default { getAsync, hgetAllAsync, setAsync, hmsetAsync, listenConnect, client };
