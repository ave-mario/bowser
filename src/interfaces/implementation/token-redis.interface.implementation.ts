import { ISaveTokens } from '../models';
import { IEmployeeModel } from '../../models';
import { TokensNames } from '../../enums';
import { RedisService } from '.';
import { ISaver } from '../services';
import { config } from '../../config';

export class SaveTokenToRedis implements ISaveTokens {
  private redis: ISaver = new RedisService();
  private getFullKey = (key: string, name: string): string => [key, name].join(':');

  public saveRefresh(refreshId: string, userId: string, role: string): void {
    const key = this.getFullKey(TokensNames.Refresh, refreshId);
    const values = ['userId', userId, 'role', role];
    this.redis.setHmset(key, values, config.jwt.refreshExpiration);
  }

  public async saveAccess(access: string, userId: string): Promise<void> {
    const key = this.getFullKey(TokensNames.Access, access);
    await this.redis.setValue(key, userId, config.jwt.accessExpiration);
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

  public findAccessToken(accessToken: string): string {
    const key = this.getFullKey(TokensNames.Access, accessToken);
    return this.redis.getValue(key);
  }

  public findIdentified(userId: string): string {
    const key = this.getFullKey(TokensNames.Identified, userId);
    return this.redis.getValue(key);
  }

  public async findUser(
    tokenRefreshId: string
  ): Promise<{ userId: string; role: string }> {
    const key = this.getFullKey(TokensNames.Refresh, tokenRefreshId);
    const values = await this.redis.getHAllValue(key);
    await this.deleteAccessRefresh(tokenRefreshId);
    return values;
  }
}
