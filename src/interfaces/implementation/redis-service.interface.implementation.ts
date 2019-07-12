import { ISaver } from '../services';
import { redisClient } from '../../config';

export class RedisService implements ISaver {
  public setHmset(
    category: string,
    speciesName: string,
    speciesSound: string,
    timestamp?: number
  ) {
    redisClient.hsetAsync(category, speciesName, speciesSound);
  }

  public getValue(name: string): string {
    const value = redisClient.getAsync(name);
    return value;
  }

  public setValue(name: string, value: string): void {
    redisClient.setAsync(name, value);
  }

  public setValueWithExpire(name: string, value: string, timestamp: number): void {
    redisClient.setAsync(name, value, 'EX', timestamp);
  }

  public getHmsetValue(category: string, speciesName: string): string {
    const value = redisClient.hgetAsync(category, speciesName);
    return value;
  }

  public deleteHsetValue(category: string, speciesName: string): void {
    redisClient.hdelAsync(category, speciesName);
  }
}
