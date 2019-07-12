import redis from 'redis';
import { promisify, inspect } from 'util';
import { logger, config } from './';
const { redis: redisConf } = config;

export default class ConfigRedis {
  private static _client: redis.RedisClient = redis.createClient({
    port: Number(redisConf.port),
    host: redisConf.host
  });

  public static listenConnect() {
    this._client.on('error', function(err) {
      logger.warn(err);
    });

    this._client.on('connect', function() {
      logger.info(
        'Redis: connected to the server, open to ' + redisConf.host + redisConf.port
      );
    });

    this._client.on('monitor', function(time, args) {
      console.log(time + ': ' + inspect(args));
    });
  }

  public static getAsync = promisify(ConfigRedis._client.get).bind(ConfigRedis._client);
  public static setAsync = promisify(ConfigRedis._client.set).bind(ConfigRedis._client);

  public static hgetAllAsync = promisify(ConfigRedis._client.hgetall).bind(
    ConfigRedis._client
  );
  public static hgetAsync = promisify(ConfigRedis._client.hget).bind(ConfigRedis._client);
  public static hsetAsync = promisify(ConfigRedis._client.hset).bind(ConfigRedis._client);
  public static hdelAsync = promisify(ConfigRedis._client.hdel).bind(ConfigRedis._client);

  public static exireAsync = promisify(ConfigRedis._client.expire).bind(
    ConfigRedis._client
  );
}
