import { Document } from 'mongoose';

export interface ITokenModel extends Document {
  _id: string;
  tokenId: string;
  userId: string;
  role: string;
  isValid: boolean;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface SaveRefreshTokens {
  save(refreshId: string, userId: string, role: string): void;
}
