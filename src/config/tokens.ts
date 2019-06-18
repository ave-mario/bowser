import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';
import { config } from './environment';
import { ITokens, ISaveRefreshTokens, SaveTokenToMongoDB } from '../interfaces';
import { IEmployeeModel } from '../models';

class Tokens {
  private _refreshToDB: ISaveRefreshTokens;

  public constructor(refreshToDB: ISaveRefreshTokens) {
    this._refreshToDB = refreshToDB;
  }

  public generationTokens(id: string, role: string): ITokens {
    const refreshId: string = uuid();
    this._refreshToDB.save(refreshId, id, role);
    return {
      accessToken: this.generateAccessToken(id, role),
      refreshToken: this.generateRefreshToken(refreshId, role)
    };
  }

  public generateIdentifiedToken(user: IEmployeeModel, role: string): any {
    const token = this.generate(user._id, config.jwt.identifiedExpiration, role);
    this._refreshToDB.saveIdentified(token, user);

    return token;
  }

  private generateAccessToken(_id: string, role: string): any {
    return this.generate(_id, config.jwt.accessExpiration, role);
  }

  private generateRefreshToken(_id: string, role: string): string {
    return this.generate(_id, config.jwt.refreshExpiration, role);
  }

  private generate(id: string, expiresIn: string | number, role: string): string {
    let payload = { id, role };

    const token = jwt.sign(payload, config.jwt.secret, { expiresIn });

    return token;
  }
}

export const JsonTokens: Tokens = new Tokens(new SaveTokenToMongoDB());
