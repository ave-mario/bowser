import { Document } from 'mongoose';
import { IEmployeeModel } from '../../models';

export interface ITokenModel extends Document {
  _id: string;
  tokenId: string;
  userId: string;
  role: string;
  isValid: boolean;
}

export interface ITokenIdentified extends Document {
  _id: string;
  token: string;
  userId: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ISaveRefreshTokens {
  save(refreshId: string, userId: string, role: string): void;
  saveIdentified(token: string, user: IEmployeeModel): void;
}
