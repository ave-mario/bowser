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
    const tokenId: string = uuid();
    return {
      accessToken: this.generateAccessToken(tokenId, role, id),
      refreshToken: this.generateRefreshToken(tokenId, role, id)
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

  private generateAccessToken(tokenId: string, role: string, _id: string): string {
    const token = this.generate(_id, config.jwt.accessExpiration, role);
    this._tokensToDB.saveAccess(tokenId, _id);
    return token;
  }

  private generateRefreshToken(_id: string, role: string, userId: string): string {
    this._tokensToDB.saveRefresh(_id, userId, role);

    return this.generate(_id, config.jwt.refreshExpiration, role);
  }

  private generate(id: string, expiresIn: string | number, role: string): string {
    let payload = { id, role };

    const token = jwt.sign(payload, config.jwt.secret, { expiresIn });

    return token;
  }
}

export const JsonTokens: Tokens = new Tokens(new SaveTokenToRedis());
