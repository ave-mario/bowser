import { ISaver } from '../services';
import { redisClient } from '../../config';

export class RedisService implements ISaver {
  public setHmset(category: string, values: string[], timestamp?: number) {
    redisClient.hmsetAsync(category, ...values);
    if (timestamp) {
      redisClient.exireAsync(category, timestamp);
    }
  }

  public getValue(name: string): string {
    const value = redisClient.getAsync(name);
    return value;
  }

  public setValue(name: string, value: string, timestamp?: number): void {
    redisClient.setAsync(name, value);
    if (timestamp) {
      redisClient.exireAsync(name, timestamp);
    }
  }

  public getHsetValue(category: string, speciesName: string): string {
    return redisClient.hgetAsync(category, speciesName);
  }

  public getHAllValue(category: string): any {
    return redisClient.hgetAllAsync(category);
  }

  public deleteHsetValue(category: string, speciesName: string): void {
    redisClient.hdetAsync(category, speciesName);
  }

  public deleteValue(speciesName: string): void {
    redisClient.delAsync(speciesName);
  }
}
