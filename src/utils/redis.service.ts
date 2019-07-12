/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { redisClient, logger } from '../config';

class ServiceRedis {
  getValue(name: string): string {
    const value = redisClient.getAsync(name);
    logger.info(value);
    return value;
  }

  setValue(name: string, value: string): void {
    redisClient.setAsync(name, value);
  }

  setValueWithExpire(name: string, value: string, timestamp: number): void {
    redisClient.setAsync(name, value, 'EX', timestamp);
  }
}

export default new ServiceRedis();
