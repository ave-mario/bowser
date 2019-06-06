import jwt from 'jsonwebtoken';
import { config } from './environment';

export class JsonTokens {
  public static generateAccessToken(_id: string, role: string): any {
    const token = jwt.sign({ id: _id, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiration
    });

    return token;
  }

  public static generateIdentifiedToken(_id: string): any {
    const token = jwt.sign({ id: _id }, config.jwt.secret, {
      expiresIn: config.jwt.expiration
    });

    return token;
  }
}
