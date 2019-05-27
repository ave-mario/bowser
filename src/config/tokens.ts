import jwt from 'jsonwebtoken';
import { Enviroinment } from './environment';

export class JsonTokens {
  public static generateAccessToken(_id: string, role: string): any {
    const token = jwt.sign({ id: _id, role }, Enviroinment.jwtSecret, { expiresIn: Enviroinment.expiresIn });

    return token;
  }
}
