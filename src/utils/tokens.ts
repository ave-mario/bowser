import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';
import { config } from '../config';
import { ITokens, ISaveTokens, SaveTokenToRedis } from '../interfaces';
import { IEmployeeModel } from '../models';

class Tokens {
  private _tokensToDB: ISaveTokens;

  public constructor(refreshToDB: ISaveTokens) {
    this._tokensToDB = refreshToDB;
  }

  public generationTokens(id: string, role: string): ITokens {
    return {
      accessToken: this.generateAccessToken(id, role),
      refreshToken: this.generateRefreshToken(id, role)
    };
  }

  public generateIdentifiedToken(user: IEmployeeModel, role: string): string {
    const token = this.generate(user._id, config.jwt.identifiedExpiration, role);
    this._tokensToDB.saveIdentified(token, user._id);

    return token;
  }

  public deleteTokens(tokenId: string): void {
    this._tokensToDB.deleteAccessRefresh(tokenId);
  }

  public deleteIdentifiedToken(userId: string): void {
    this._tokensToDB.deleteIdentified(userId);
  }

  private generateAccessToken(userId: string, role: string): string {
    const tokenId = uuid();
    const token = this.generate(userId, config.jwt.accessExpiration, role, tokenId);
    this._tokensToDB.saveAccess(tokenId, userId);
    return token;
  }

  private generateRefreshToken(userId: string, role: string): string {
    const tokenId = uuid();
    this._tokensToDB.saveRefresh(tokenId, userId);
    return this.generate(userId, config.jwt.refreshExpiration, role, tokenId);
  }

  private generate(
    sub: string,
    expiresIn: string | number,
    role: string,
    id?: string
  ): string {
    let payload: { sub: string; role: string; id?: string } = { sub, role };
    if (id) {
      payload.id = id;
    }

    const token = jwt.sign(payload, config.jwt.secret, { expiresIn });

    return token;
  }
}

export const JsonTokens: Tokens = new Tokens(new SaveTokenToRedis());
