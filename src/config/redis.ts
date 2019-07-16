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
      logger.info(time + ': ' + inspect(args));
    });
  }

  public static getAsync = promisify(ConfigRedis._client.get).bind(ConfigRedis._client);
  public static setAsync = promisify(ConfigRedis._client.set).bind(ConfigRedis._client);

  public static hgetAllAsync = promisify(ConfigRedis._client.hgetall).bind(
    ConfigRedis._client
  );
  public static delAsync = promisify(ConfigRedis._client.del).bind(ConfigRedis._client);

  public static hgetAsync = promisify(ConfigRedis._client.hget).bind(ConfigRedis._client);
  public static hsetAsync = promisify(ConfigRedis._client.hset).bind(ConfigRedis._client);
  public static hdetAsync = promisify(ConfigRedis._client.hdel).bind(ConfigRedis._client);

  public static hmgetAsync = promisify(ConfigRedis._client.hmget).bind(
    ConfigRedis._client
  );
  public static hmsetAsync = promisify(ConfigRedis._client.hmset).bind(
    ConfigRedis._client
  );
  public static hkeysAsync = promisify(ConfigRedis._client.hkeys).bind(
    ConfigRedis._client
  );
  public static hvalsAsync = promisify(ConfigRedis._client.hvals).bind(
    ConfigRedis._client
  );

  public static exireAsync = promisify(ConfigRedis._client.expire).bind(
    ConfigRedis._client
  );
}
