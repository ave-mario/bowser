import { ISaveTokens } from '../models';
import { TokensNames } from '../../enums';
import { RedisService } from '.';
import { ISaver } from '../services';
import { config } from '../../config';

export class SaveTokenToRedis implements ISaveTokens {
  private redis: ISaver = new RedisService();
  private getFullKey = (key: string, name: string): string => [key, name].join(':');

  public saveRefresh(refreshId: string, userId: string): void {
    const key = this.getFullKey(TokensNames.Refresh, userId);
    this.redis.setValue(key, refreshId, config.jwt.refreshExpiration);
  }

  public saveAccess(access: string, userId: string): void {
    const key = this.getFullKey(TokensNames.Access, userId);
    this.redis.setValue(key, access, config.jwt.accessExpiration);
  }

  public saveIdentified(token: string, userId: string): void {
    const key = this.getFullKey(TokensNames.Identified, userId);
    this.redis.setValue(key, token, config.jwt.identifiedExpiration);
  }

  private deleteToken(specific: string, token: string): void {
    const key = this.getFullKey(specific, token);
    this.redis.deleteValue(key);
  }

  public deleteAccessRefresh(tokenId: string): void {
    this.deleteToken(TokensNames.Refresh, tokenId);
    this.deleteToken(TokensNames.Access, tokenId);
  }

  public deleteIdentified(userId: string) {
    this.deleteToken(TokensNames.Identified, userId);
  }

  public findAccessToken(accessToken: string, tokenId: string): string {
    const key = this.getFullKey(TokensNames.Access, accessToken);
    return this.redis.getValue(key);
  }

  public findIdentifiedToken(userId: string): string {
    const key = this.getFullKey(TokensNames.Identified, userId);
    return this.redis.getValue(key);
  }

  public findRefreshToken(userId: string, tokenId: string): string {
    const key = this.getFullKey(TokensNames.Refresh, userId);
    return this.redis.getValue(key);
  }
}
