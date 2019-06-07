import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';
import { config } from './environment';
import { ITokens, SaveRefreshTokens, SaveTokenToMongoDB } from '../interfaces';

class Tokens {
  private _refreshToDB: SaveRefreshTokens;

  public constructor(refreshToDB: SaveRefreshTokens) {
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

  public generateIdentifiedToken(_id: string, role: string): any {
    return this.generate(_id, config.jwt.identified.expiration, role);
  }

  private generateAccessToken(_id: string, role: string): any {
    return this.generate(_id, config.jwt.access.expiration, role);
  }

  private generateRefreshToken(_id: string, role: string): string {
    return this.generate(_id, config.jwt.refresh.expiration, role);
  }

  private generate(id: string, expiresIn: string | number, role: string): string {
    let payload = { id, role };

    const token = jwt.sign(payload, config.jwt.secret, { expiresIn });

    return token;
  }
}

export const JsonTokens: Tokens = new Tokens(new SaveTokenToMongoDB());
