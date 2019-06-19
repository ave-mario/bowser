import { IEmployee, IClient } from './index';

export interface IUserResponseLogin {
  user: IEmployee | IClient;
  tokenData: {
    tokens: { accessToken: string; refreshToken: string };
    access_expires_in: number;
  };
}

export interface IUserResponseRefreshTokens {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  access_expires_in: number;
}

export interface IUser {
  user: IEmployee | IClient;
}
