import { Document } from 'mongoose';

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

export interface ISaveTokens {
  saveRefresh(refreshId: string, userId: string, role?: string): void;
  saveIdentified(token: string, userId: string): void;

  saveAccess(access: string, userId: string): void;

  deleteAccessRefresh(tokenId: string): void;
  deleteIdentified(userId: string): void;

  findAccessToken(key: string, value?: string): string;
  findRefreshToken(key: string, value?: string): string;
  findIdentifiedToken(key: string): string;
}
